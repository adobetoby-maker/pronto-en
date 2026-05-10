interface Platform {
  name: string;
  icon: string;
  isNew?: boolean;
  color?: string;
}

const PLATFORMS: Platform[] = [
  { name: "React", icon: "⚛", color: "#61DAFB" },
  { name: "Next.js", icon: "N", color: "#ffffff" },
  { name: "Vue", icon: "V", color: "#42B883" },
  { name: "Flutter", icon: "◆", color: "#54C5F8" },
  { name: "iOS", icon: "", color: "#A2AAAD" },
  { name: "Android", icon: "◎", color: "#3DDC84" },
  { name: "Phoenix", icon: "🔥", color: "#FD4F00" },
  { name: "go-i18n", icon: "Go", color: "#00ADD8" },
  { name: "WordPress", icon: "W", color: "#21759B", isNew: true },
  { name: "Webflow", icon: "◀", color: "#4353FF", isNew: true },
  { name: "Shopify", icon: "S", color: "#96BF48", isNew: true },
  { name: "Squarespace", icon: "□", color: "#000000", isNew: true },
  { name: "Framer", icon: "◈", color: "#05F", isNew: true },
  { name: "Wix", icon: "W", color: "#FAAD00", isNew: true },
];

export function PlatformGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {PLATFORMS.map((p) => (
        <div
          key={p.name}
          className={`relative flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-colors group ${
            p.isNew
              ? "border-emerald-800/60 bg-emerald-950/20 hover:border-emerald-700/80"
              : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
          }`}
        >
          {p.isNew && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-emerald-500 text-black px-2 py-0.5 rounded-full whitespace-nowrap">
              now supported
            </span>
          )}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold bg-zinc-800 mt-1"
            style={{ color: p.color }}
          >
            {p.icon}
          </div>
          <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors text-center leading-tight">
            {p.name}
          </span>
        </div>
      ))}
    </div>
  );
}
