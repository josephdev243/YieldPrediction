import React from "react";
import {
  Bell,
  ChevronDown,
  CloudSun,
  CloudSunRain,
  FileText,
  Home,
  Leaf,
  Settings,
  Sprout,
  BarChart3,
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Sprout, label: "My Crops" },
  { icon: CloudSun, label: "Weather" },
  { icon: BarChart3, label: "Yield Records" },
  { icon: FileText, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

export const DashboardPreview: React.FC = () => {
  return (
    <div className="relative mx-auto w-full max-w-[575px] lg:max-w-none">
      <div className="rounded-[18px] border border-[#111827] bg-[linear-gradient(180deg,rgba(17,24,39,0.96)_0%,rgba(2,6,23,0.96)_100%)] p-3 shadow-[0_20px_55px_rgba(0,0,0,0.34)] ring-1 ring-white/5 backdrop-blur-xl">
        <div className="grid min-h-[330px] grid-cols-[118px_minmax(0,1fr)] overflow-hidden rounded-[14px] border border-white/5 bg-[linear-gradient(180deg,rgba(17,24,39,0.98)_0%,rgba(2,6,23,0.98)_100%)] lg:min-h-[338px]">
          <aside className="border-r border-white/5 bg-[linear-gradient(180deg,rgba(17,24,39,0.98)_0%,rgba(2,6,23,0.98)_100%)] px-3 py-4">
            <div className="mb-5 flex items-center gap-2 text-[#4ade80]">
              <Leaf size={18} />
              <span className="text-[0.92rem] font-medium tracking-[-0.02em]">YPF</span>
            </div>

            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[0.68rem] font-medium transition ${
                      item.active
                        ? "bg-[#22c55e] text-white shadow-[0_10px_20px_rgba(34,197,94,0.25)]"
                        : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon size={13} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="px-4 py-4 sm:px-5 sm:py-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[1.1rem] font-medium tracking-[-0.02em] text-white">
                  Dashboard
                </h3>
                <p className="mt-1 text-[0.72rem] text-[#d1d5db]">
                  Welcome back, John Farmer 👋
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 items-center gap-2 rounded-full bg-white/5 px-3 text-[0.72rem] text-white/80 ring-1 ring-white/8">
                  <span>This Season</span>
                  <ChevronDown size={13} />
                </div>
                <button className="relative grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/8">
                  <Bell size={13} />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#facc15]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                ["Total Yield", "2.45", "tons", "↑ 12.5% vs last season"],
                ["Active Crops", "6", "crops", "Healthy growth"],
                ["Total Fields", "4", "fields", "2.3 ha total area"],
                ["Rainfall", "85", "mm", "This week"],
              ].map(([title, value, unit, note]) => (
                <div
                  key={title}
                  className="rounded-xl border border-white/5 bg-[#111827] px-3 py-3 shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
                >
                  <p className="text-[0.66rem] font-medium text-[#9ca3af]">{title}</p>
                  <div className="mt-2 flex items-end gap-1.5 text-white">
                    <span className="text-[1.5rem] font-medium leading-none tracking-[-0.02em]">
                      {value}
                    </span>
                    <span className="pb-0.5 text-[0.7rem] text-[#d1d5db]">
                      {unit}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.63rem] text-[#4ade80]">{note}</p>
                </div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-[1.42fr_0.88fr] gap-2.5">
              <div className="rounded-xl border border-white/5 bg-[#111827] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-[0.72rem] font-medium text-white">
                    Yield Trend
                  </h4>
                  <span className="text-[0.62rem] text-[#9ca3af]">tons</span>
                </div>

                <div className="relative h-[112px] rounded-lg bg-[linear-gradient(180deg,rgba(20,83,45,0.45)_0%,rgba(2,6,23,0.15)_100%)] p-2">
                  <div className="absolute inset-2 rounded-md border border-white/4" />
                  <div className="absolute inset-x-2 top-5 border-t border-white/5" />
                  <div className="absolute inset-x-2 top-10 border-t border-white/5" />
                  <div className="absolute inset-x-2 top-15 border-t border-white/5" />

                  <svg viewBox="0 0 400 120" className="relative h-full w-full">
                    <defs>
                      <linearGradient
                        id="yieldLine"
                        x1="0"
                        x2="1"
                        y1="0"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#185fa5" />
                        <stop offset="100%" stopColor="#185fa5" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 12 90 C 40 82, 54 78, 78 76 S 120 58, 145 54 S 192 66, 216 51 S 260 34, 286 30 S 340 40, 388 24"
                      fill="none"
                      stroke="url(#yieldLine)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 12 90 C 40 82, 54 78, 78 76 S 120 58, 145 54 S 192 66, 216 51 S 260 34, 286 30 S 340 40, 388 24 L 388 120 L 12 120 Z"
                      fill="url(#yieldLine)"
                      opacity="0.09"
                    />
                    {[12, 78, 145, 216, 286, 388].map((x, i) => (
                      <circle
                        key={i}
                        cx={x}
                        cy={[90, 76, 54, 51, 30, 24][i]}
                        r="3.5"
                        fill="#185fa5"
                      />
                    ))}
                    <text x="338" y="31" fill="#f7f7f0" fontSize="11">
                      2.45 tons
                    </text>
                  </svg>

                  <div className="mt-[-2px] flex justify-between px-1 text-[0.6rem] text-[#9ca3af]">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#111827] p-3">
                <h4 className="text-[0.72rem] font-medium text-white">
                  Weather Overview
                </h4>
                <div className="mt-2 flex items-center gap-2">
                  <CloudSunRain size={48} className="text-[#facc15]" />
                  <div>
                    <div className="text-[2rem] font-medium leading-none tracking-[-0.02em] text-white">
                      24°C
                    </div>
                    <div className="mt-1 text-[0.72rem] text-[#d1d5db]">
                      Partly Cloudy
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-[0.68rem] text-[#d1d5db]">
                  <div className="flex items-center justify-between border-b border-white/6 pb-1.5">
                    <span>Humidity</span>
                    <span className="text-white">65%</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/6 pb-1.5">
                    <span>Wind Speed</span>
                    <span className="text-white">12 km/h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rainfall</span>
                    <span className="text-white">85 mm</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
