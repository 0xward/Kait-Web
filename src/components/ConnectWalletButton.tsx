"use client";
import { useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { IconArrowUpRight } from "./icons";

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function ConnectWalletButton({ compact = false }: { compact?: boolean }) {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const wrongNetwork = isConnected && chainId !== base.id && chainId !== baseSepolia.id;

  if (!isConnected) {
    return (
      <div className="relative" ref={ref}>
        <button onClick={() => setOpen((v) => !v)} className="btn-solid !px-4 !py-2.5 md:!px-6 md:!py-3.5">
          {compact ? "CONNECT" : "CONNECT WALLET"} <IconArrowUpRight className="w-3 h-3" />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-52 bg-ink text-white z-30 font-mono text-xs">
            {connectors.length === 0 && (
              <p className="px-4 py-3 text-white/50">No wallet found.</p>
            )}
            {connectors.map((c) => (
              <button
                key={c.uid}
                disabled={isPending}
                onClick={() => {
                  connect({ connector: c });
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-purple transition-colors uppercase tracking-wide disabled:opacity-40"
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (wrongNetwork) {
    return (
      <button
        onClick={() => switchChain({ chainId: base.id })}
        disabled={isSwitching}
        className="btn-purple !px-4 !py-2.5 md:!px-6 md:!py-3.5"
      >
        {isSwitching ? "SWITCHING…" : "SWITCH TO BASE"}
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 font-mono text-xs tracking-wide bg-bg b-line-b px-4 py-2.5 md:py-3.5 hover:bg-ink hover:text-white transition-colors"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-lime" />
        {truncate(address!)}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-ink text-white z-30 font-mono text-xs">
          <a href="/dashboard" className="block px-4 py-3 hover:bg-purple transition-colors uppercase tracking-wide">
            Dashboard
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(address!);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-3 hover:bg-purple transition-colors uppercase tracking-wide"
          >
            Copy Address
          </button>
          <button
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-3 hover:bg-purple transition-colors uppercase tracking-wide text-white/70"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
