interface Platform {
  name: string;
  icon: string;
  color?: string;
  badge?: "new" | "soon";
}

const PLATFORMS: Platform[] = [
  // Dev frameworks — all working
  { name: "React", icon: "⚛", color: "#61DAFB" },
  { name: "Next.js", icon: "N", color: "#ffffff" },
  { name: "Vue / Nuxt", icon: "V", color: "#42B883", badge: "new" },
  { name: "Flutter", icon: "◆", color: "#54C5F8" },
  { name: "iOS", icon: "", color: "#A2AAAD" },
  { name: "Android", icon: "◎", color: "#3DDC84" },
  { name: "Phoenix", icon: "🔥", color: "#FD4F00" },
  { name: "go-i18n", icon: "Go", color: "#00ADD8" },
  // Site builders — working
  { name: "WordPress", icon: "W", color: "#21759B", badge: "new" },
  { name: "Webflow", icon: "◀", color: "#4353FF", badge: "new" },
  { name: "Shopify", icon: "S", color: "#96BF48", badge: "new" },
  { name: "Framer", icon: "◈", color: "#05F", badge: "new" },
  // Coming soon
  { name: "Squarespace", icon: "□", color: "#000000", badge: "soon" },
  { name: "Wix", icon: "W", color: "#FAAD00", badge: "soon" },
];

const BADGE: Record<string, { label: string; classes: string }> = {
  new:  { label: "now supported", classes: "bg-emerald-500 text-black" },
  soon: { label: "coming soon",   classes: "bg-zinc-700 text-zinc-300" },
};

export function PlatformGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {PLATFORMS.map((p) => {
        const badge = p.badge ? BADGE[p.badge] : null;
        const isSoon = p.badge === "soon";
        return (
          <div
            key={p.name}
            className={`relative flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-colors group ${
              p.badge === "new"
                ? "border-emerald-800/60 bg-emerald-950/20 hover:border-emerald-700/80"
                : isSoon
                ? "border-zinc-800/60 bg-zinc-900/30 opacity-60"
                : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
            }`}
          >
            {badge && (
              <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${badge.classes}`}>
                {badge.label}
              </span>
            )}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold bg-zinc-800 mt-1"
              style={{ color: isSoon ? "#52525b" : p.color }}
            >
              {p.icon}
            </div>
            <span className={`text-xs transition-colors text-center leading-tight ${isSoon ? "text-zinc-600" : "text-zinc-400 group-hover:text-zinc-300"}`}>
              {p.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
