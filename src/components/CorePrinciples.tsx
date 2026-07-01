import {
  IconHexagon,
  IconNestedSquares,
  IconAsterisk,
  IconTarget,
  IconDotGrid,
  IconPlus,
} from "./icons";

const principles = [
  {
    icon: IconHexagon,
    title: "Pay Per Call",
    body: "Price your endpoint from $0.001. No subscriptions, no minimums.",
  },
  {
    icon: IconNestedSquares,
    title: "Smart Escrow",
    body: "Smart contracts hold funds and release payment automatically.",
  },
  {
    icon: IconAsterisk,
    title: "Zero Backend",
    body: "Deploy with one command. KAIT handles auth and rate limits.",
  },
  {
    icon: IconTarget,
    title: "Global Edge",
    body: "Distributed network. 99.9% uptime SLA, worldwide.",
  },
  {
    icon: IconDotGrid,
    title: "Developer First",
    body: "CLI workflow, open-source core, comprehensive docs.",
  },
];

export default function CorePrinciples() {
  return (
    <section id="network" className="relative b-line-t bg-bg">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 md:py-16">
        <p className="font-mono text-xs tracking-widest2 text-muted mb-6 md:mb-10">
          /02&nbsp;&nbsp;CORE PRINCIPLES
        </p>

        <div className="flex flex-col md:flex-row md:items-start gap-7 md:gap-0">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="flex items-start md:items-center gap-4 md:gap-0 flex-1">
                <div className="flex-1">
                  <Icon className="w-7 h-7 text-ink mb-4" />
                  <p className="font-display font-bold uppercase text-sm tracking-tight leading-tight mb-2">
                    {p.title}
                  </p>
                  <p className="text-muted text-xs leading-relaxed max-w-[10rem]">{p.body}</p>
                </div>
                {i < principles.length - 1 && (
                  <IconPlus className="hidden md:block w-3 h-3 text-line mx-4 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
