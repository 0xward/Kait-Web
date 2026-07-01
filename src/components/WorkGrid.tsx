import { API_SIMS } from "./apiSimulations";
import LiveApiCard from "./LiveApiCard";

export default function WorkGrid() {
  return (
    <section id="work" className="relative b-line-t bg-bg">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 md:py-16">
        <div className="flex items-baseline justify-between mb-6 md:mb-10">
          <p className="font-mono text-xs tracking-widest2 text-muted">
            /03&nbsp;&nbsp;LIVE ON KAIT
          </p>
          <p className="hidden sm:block font-mono text-[10px] tracking-widest2 uppercase text-muted">
            Tap any card to simulate a paid call
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {API_SIMS.map((spec) => (
            <LiveApiCard key={spec.key} spec={spec} />
          ))}
        </div>
      </div>
    </section>
  );
}
