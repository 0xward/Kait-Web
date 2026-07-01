// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/*
  KaitGateway
  -----------
  Decentralized pay-per-call escrow for API monetization on Base.

  How it works:
    1. A developer calls registerAPI() once per API they want to monetize.
       This returns an apiId. They keep that apiId in their own backend or
       in the KAIT off-chain index, paired with the actual API endpoint.
    2. A consumer calls payForCall(apiId) (paying with ETH) or
       payForCallERC20(apiId) (paying with an ERC20 token, e.g. USDC) BEFORE
       calling the actual API. The KAIT gateway / API server checks on-chain
       (or via an event listener) that payment was made for that apiId by
       msg.sender, then serves the request off-chain.
    3. Funds are NOT pushed automatically to the developer. They accumulate
       in this contract under the developer's address ("pull payment"
       pattern). The developer calls withdraw(token) whenever they want to
       collect. This is the standard, safest pattern for handling external
       transfers in Solidity — it avoids reentrancy and avoids one failed
       transfer blocking other users' payments.

  Design choices made on purpose to keep this contract simple and safe to
  compile/deploy with nothing more than the solc compiler:
    - Zero external imports. No OpenZeppelin, no remappings to configure.
      Everything needed (a minimal ERC20 interface, a reentrancy lock) is
      written directly in this file.
    - No proxy / upgradeability. This is a plain, immutable contract.
      Simpler mental model, smaller attack surface, cheaper to deploy.
    - No platform fee in v1. 100% of payment accrues to the API owner.
      A fee mechanism can be added in a v2 contract later without touching
      this one (existing integrations keep working).
*/

/// @dev Minimal ERC20 interface — only the 3 functions this contract needs.
interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract KaitGateway {
    /// @dev address(0) is used as the sentinel value meaning "pay with native ETH".
    address public constant NATIVE_TOKEN = address(0);

    struct APIListing {
        address owner;          // wallet that receives payment for this API
        address paymentToken;   // NATIVE_TOKEN (ETH) or an ERC20 address (e.g. USDC)
        uint256 pricePerCall;   // amount in the token's smallest unit (wei for ETH, 6dp for USDC)
        string  metadataURI;    // off-chain pointer (IPFS hash, URL, etc.) describing the API
        bool    active;         // owner can pause/unpause without deleting the listing
        uint256 totalCalls;     // running counter, useful for the dashboard
        uint256 totalVolume;    // running sum of payments received, in paymentToken units
    }

    uint256 private _nextApiId = 1;
    mapping(uint256 => APIListing) private _apis;

    /// @dev earnings[token][user] = amount that `user` can withdraw, in `token` units.
    mapping(address => mapping(address => uint256)) private _earnings;

    /// @dev minimal reentrancy guard, written by hand to avoid an external import.
    uint256 private _locked = 1;
    modifier nonReentrant() {
        require(_locked == 1, "REENTRANCY");
        _locked = 2;
        _;
        _locked = 1;
    }

    modifier onlyAPIOwner(uint256 apiId) {
        require(_apis[apiId].owner == msg.sender, "NOT_API_OWNER");
        _;
    }

    event APIRegistered(uint256 indexed apiId, address indexed owner, address paymentToken, uint256 pricePerCall, string metadataURI);
    event APIPriceUpdated(uint256 indexed apiId, uint256 newPrice);
    event APIStatusChanged(uint256 indexed apiId, bool active);
    event APICalled(uint256 indexed apiId, address indexed payer, address paymentToken, uint256 amount);
    event Withdrawn(address indexed token, address indexed user, uint256 amount);

    // ---------------------------------------------------------------------
    // Developer-facing functions
    // ---------------------------------------------------------------------

    /// @notice Register a new API for monetization. Anyone can call this.
    /// @param paymentToken NATIVE_TOKEN (address(0)) for ETH, or an ERC20 token address (e.g. USDC).
    /// @param pricePerCall Price per call, in the token's smallest unit.
    /// @param metadataURI Off-chain pointer describing the API (name, docs, endpoint hash, etc.)
    function registerAPI(address paymentToken, uint256 pricePerCall, string calldata metadataURI)
        external
        returns (uint256 apiId)
    {
        require(pricePerCall > 0, "PRICE_ZERO");

        apiId = _nextApiId++;
        _apis[apiId] = APIListing({
            owner: msg.sender,
            paymentToken: paymentToken,
            pricePerCall: pricePerCall,
            metadataURI: metadataURI,
            active: true,
            totalCalls: 0,
            totalVolume: 0
        });

        emit APIRegistered(apiId, msg.sender, paymentToken, pricePerCall, metadataURI);
    }

    function updatePrice(uint256 apiId, uint256 newPrice) external onlyAPIOwner(apiId) {
        require(newPrice > 0, "PRICE_ZERO");
        _apis[apiId].pricePerCall = newPrice;
        emit APIPriceUpdated(apiId, newPrice);
    }

    function setActive(uint256 apiId, bool active) external onlyAPIOwner(apiId) {
        _apis[apiId].active = active;
        emit APIStatusChanged(apiId, active);
    }

    /// @notice Withdraw your accumulated earnings for a given payment token.
    function withdraw(address token) external nonReentrant {
        uint256 amount = _earnings[token][msg.sender];
        require(amount > 0, "NOTHING_TO_WITHDRAW");

        // Effects before interactions: zero the balance before sending funds out.
        _earnings[token][msg.sender] = 0;

        if (token == NATIVE_TOKEN) {
            (bool ok, ) = payable(msg.sender).call{value: amount}("");
            require(ok, "ETH_TRANSFER_FAILED");
        } else {
            require(IERC20(token).transfer(msg.sender, amount), "ERC20_TRANSFER_FAILED");
        }

        emit Withdrawn(token, msg.sender, amount);
    }

    // ---------------------------------------------------------------------
    // Consumer-facing functions
    // ---------------------------------------------------------------------

    /// @notice Pay for one call to an API priced in native ETH.
    function payForCall(uint256 apiId) external payable nonReentrant {
        APIListing storage listing = _apis[apiId];
        require(listing.owner != address(0), "API_NOT_FOUND");
        require(listing.active, "API_INACTIVE");
        require(listing.paymentToken == NATIVE_TOKEN, "API_NOT_ETH_PRICED");
        require(msg.value >= listing.pricePerCall, "INSUFFICIENT_PAYMENT");

        uint256 price = listing.pricePerCall;
        _earnings[NATIVE_TOKEN][listing.owner] += price;
        listing.totalCalls += 1;
        listing.totalVolume += price;

        emit APICalled(apiId, msg.sender, NATIVE_TOKEN, price);

        // refund any overpayment
        uint256 refund = msg.value - price;
        if (refund > 0) {
            (bool ok, ) = payable(msg.sender).call{value: refund}("");
            require(ok, "REFUND_FAILED");
        }
    }

    /// @notice Pay for one call to an API priced in an ERC20 token (e.g. USDC).
    /// @dev Caller must have called token.approve(gatewayAddress, amount) beforehand.
    function payForCallERC20(uint256 apiId) external nonReentrant {
        APIListing storage listing = _apis[apiId];
        require(listing.owner != address(0), "API_NOT_FOUND");
        require(listing.active, "API_INACTIVE");
        require(listing.paymentToken != NATIVE_TOKEN, "API_NOT_ERC20_PRICED");

        uint256 price = listing.pricePerCall;
        require(
            IERC20(listing.paymentToken).transferFrom(msg.sender, address(this), price),
            "ERC20_TRANSFER_FAILED"
        );

        _earnings[listing.paymentToken][listing.owner] += price;
        listing.totalCalls += 1;
        listing.totalVolume += price;

        emit APICalled(apiId, msg.sender, listing.paymentToken, price);
    }

    // ---------------------------------------------------------------------
    // Read-only / dashboard helpers
    // ---------------------------------------------------------------------

    function totalAPIs() external view returns (uint256) {
        return _nextApiId - 1;
    }

    function getAPI(uint256 apiId) external view returns (APIListing memory) {
        return _apis[apiId];
    }

    function earningsOf(address token, address user) external view returns (uint256) {
        return _earnings[token][user];
    }
}
