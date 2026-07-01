export default function StatusBar() {
  return (
    <div className="b-line-t bg-bg">
      <div className="max-w-[1400px] mx-auto flex items-center gap-3 md:gap-4 px-5 md:px-10 py-3 font-mono text-[9px] md:text-[10px] tracking-widest2 uppercase">
        <span className="flex items-center gap-2 text-muted shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-lime" />
          <span className="hidden sm:inline">CONNECTION SECURE</span>
          <span className="sm:hidden">SECURE</span>
        </span>

        <span className="flex-1 bg-purple text-white text-center py-1.5 px-3 overflow-hidden whitespace-nowrap">
          &gt; GATEWAY ONLINE_
        </span>

        <span className="hidden sm:block text-muted shrink-0">
          NETWORK: BASE&nbsp;&nbsp;NODE: KAIT_01
        </span>
      </div>
    </div>
  );
}
