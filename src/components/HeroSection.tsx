import EarningsEstimator from "./EarningsEstimator";
import TerminalChip from "./TerminalChip";
import { IconArrowUpRight, IconBracket } from "./icons";

export default function HeroSection() {
  return (
    <section id="top" className="relative">
      <div className="max-w-[1400px] mx-auto flex">
        {/* vertical sidebar label, desktop only — no border, just a floating label */}
        <div className="hidden md:flex flex-col items-center justify-between w-12 py-8 shrink-0">
          <span />
          <span className="vertical-label font-mono text-[10px] tracking-widest2 uppercase text-muted">
            DECENTRALIZED API GATEWAY · 2026
          </span>
          <span />
        </div>

        <div className="flex-1 px-5 md:px-10 py-8 md:py-20">
          <p className="font-mono text-xs tracking-widest2 text-muted mb-4 md:mb-6">/01</p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              <h1 className="font-display font-black uppercase leading-[0.92] text-5xl sm:text-6xl lg:text-7xl">
                The Gateway
                <br />
                That Pays
                <br />
                You
              </h1>

              <p className="font-mono text-sm md:text-base text-purple tracking-widest uppercase mt-5 md:mt-6">
                Decentralized. Trustless. Instant.
              </p>

              <p className="text-muted text-base leading-relaxed max-w-md mt-5 md:mt-6">
                KAIT turns any API into a revenue stream with one command. Users pay
                per call in crypto, smart contracts handle escrow and payout. No
                backend, no subscriptions, no bullshit.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <a href="#install" className="btn-solid">
                  INSTALL CLI <IconArrowUpRight className="w-3 h-3" />
                </a>
                <a href="#docs" className="btn-text">
                  VIEW DOCS <IconBracket className="w-3 h-3" />
                </a>
              </div>

              <div id="install" className="mt-6">
                <TerminalChip command="npm install -g @kait/cli && kait init" />
              </div>
            </div>

            <EarningsEstimator />
          </div>
        </div>
      </div>
    </section>
  );
}
