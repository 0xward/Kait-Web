"use client";
import { useState } from "react";
import { IconArrowUpRight } from "./icons";

function CtaCard() {
  return (
    <div className="bg-ink text-white p-6 md:p-8 flex flex-col h-full">
      <p className="font-mono text-xs tracking-widest2 text-white/40 mb-5 md:mb-6">
        /04&nbsp;&nbsp;DEPLOY
      </p>
      <h3 className="font-display font-extrabold uppercase text-2xl leading-tight mb-4">
        Deploy Your
        <br />
        API
      </h3>
      <p className="text-white/60 text-sm leading-relaxed mb-7">
        Turning your code into a revenue stream takes one command and a wallet
        address. No invoices, no approval queues. Just deploy.
      </p>
      <a
        href="#install"
        className="inline-flex items-center gap-2 bg-lime text-ink font-mono font-semibold text-xs tracking-widest2 uppercase px-5 py-3 mt-auto self-start hover:bg-white transition-colors"
      >
        DEPLOY NOW <IconArrowUpRight className="w-3 h-3" />
      </a>
    </div>
  );
}

function StatusBarItem({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[10px] tracking-widest2 uppercase text-muted mb-1.5">
        <span>{label}</span>
        <span className="text-ink">{value}</span>
      </div>
      <div className="h-1 bg-bg">
        <div className="h-full bg-purple" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function StatusCard() {
  return (
    <div className="bg-surface p-6 md:p-8 flex flex-col h-full">
      <p className="font-mono text-xs tracking-widest2 text-muted mb-5 md:mb-6">
        /05&nbsp;&nbsp;GATEWAY STATUS
      </p>

      <div className="space-y-5 flex-1">
        <StatusBarItem label="Active APIs" value="3,402" percent={68} />
        <StatusBarItem label="Total Paid Out" value="$182.4K" percent={54} />
        <div className="flex justify-between font-mono text-[10px] tracking-widest2 uppercase text-muted">
          <span>Avg Payout Time</span>
          <span className="text-ink">1.8s</span>
        </div>
        <div className="flex justify-between font-mono text-[10px] tracking-widest2 uppercase text-muted">
          <span>Network</span>
          <span className="text-ink">Base Mainnet</span>
        </div>
      </div>

      <div className="pill-live mt-6 w-fit">
        <span className="pill-dot" />
        ALL SYSTEMS OPERATIONAL
      </div>
    </div>
  );
}

function SubscribeCard() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-purple text-white p-6 md:p-8 flex flex-col h-full">
      <p className="font-mono text-xs tracking-widest2 text-white/50 mb-5 md:mb-6">
        /06&nbsp;&nbsp;SUBSCRIBE
      </p>
      <h3 className="font-display font-extrabold uppercase text-xl leading-tight mb-4">
        Get Gateway Updates
      </h3>
      <p className="text-white/70 text-sm leading-relaxed mb-6">
        New networks, SDK releases, and gateway upgrades, straight to your inbox.
      </p>

      <form
        className="flex flex-col sm:flex-row gap-2 mt-auto"
        onSubmit={(e) => {
          e.preventDefault();
          if (email) setSent(true);
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ENTER EMAIL"
          className="flex-1 min-w-0 bg-white text-ink px-3 py-3 font-mono text-xs placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 inline-flex items-center justify-center gap-2 bg-ink text-white font-mono font-semibold text-xs tracking-widest2 uppercase px-5 py-3 hover:bg-white hover:text-ink transition-colors"
        >
          {sent ? "SENT" : "SUBSCRIBE"} <IconArrowUpRight className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}

export default function CtaStatusRow() {
  return (
    <section className="relative b-line-t bg-bg">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 md:py-16">
        <div className="grid md:grid-cols-3 gap-px md:gap-4">
          <CtaCard />
          <StatusCard />
          <SubscribeCard />
        </div>
      </div>
    </section>
  );
}
