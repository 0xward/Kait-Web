"use client";
import { useMemo, useState } from "react";

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function EarningsEstimator() {
  const [price, setPrice] = useState(0.003);
  const [calls, setCalls] = useState(50000);

  const monthly = useMemo(() => price * calls, [price, calls]);

  return (
    <div className="bg-ink text-white p-6 md:p-8 w-full">
      <p className="font-mono text-[10px] tracking-widest2 uppercase text-white/50 mb-6">
        TRY IT — EARNINGS ESTIMATOR
      </p>

      <div className="mb-7">
        <div className="flex justify-between font-mono text-[11px] tracking-wider uppercase text-white/60 mb-2">
          <span>Price per call</span>
          <span className="text-lime">${price.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min={0.001}
          max={0.02}
          step={0.001}
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          className="w-full accent-[#ccff33]"
          aria-label="Price per call"
        />
      </div>

      <div className="mb-8">
        <div className="flex justify-between font-mono text-[11px] tracking-wider uppercase text-white/60 mb-2">
          <span>Calls per month</span>
          <span className="text-lime">{formatUSD(calls)}</span>
        </div>
        <input
          type="range"
          min={1000}
          max={500000}
          step={1000}
          value={calls}
          onChange={(e) => setCalls(parseInt(e.target.value, 10))}
          className="w-full accent-[#ccff33]"
          aria-label="Calls per month"
        />
      </div>

      <div className="border-t border-white/10 pt-6">
        <p className="font-mono text-[10px] tracking-widest2 uppercase text-white/50 mb-1">
          Estimated monthly earnings
        </p>
        <p className="font-display font-black text-4xl md:text-5xl">
          ${formatUSD(monthly)}
        </p>
        <p className="text-white/40 text-xs mt-3 leading-relaxed">
          Paid directly to your wallet by the escrow contract — illustrative
          estimate, gas not included.
        </p>
      </div>
    </div>
  );
}
