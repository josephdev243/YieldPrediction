import React from "react";
import { useDashboard } from "../hooks/useDashboard";
import {
  Bell,
  ChevronDown,
  CloudSunRain,
  Leaf,
  Sprout,
  BarChart3,
  FileText,
  Settings,
  Home,
} from "lucide-react";

/**
 * Dashboard Page Component
 * Main dashboard for farmers to view their metrics, crops, and recommendations
 */
export const Dashboard: React.FC = () => {
  const {
    metrics,
    recommendations,
    healthScore,
    healthStatus,
    isLoading,
    error,
    loadMockData,
  } = useDashboard();

  React.useEffect(() => {
    // Load mock data for now (will be replaced with real API)
    loadMockData();
  }, [loadMockData]);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Sprout, label: "My Crops" },
    { icon: CloudSunRain, label: "Weather" },
    { icon: BarChart3, label: "Yield Records" },
    { icon: FileText, label: "Analytics" },
    { icon: Settings, label: "Settings" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#020617]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="rounded-[18px] border border-[#111827] bg-[linear-gradient(180deg,rgba(17,24,39,0.96)_0%,rgba(2,6,23,0.96)_100%)] shadow-[0_20px_55px_rgba(0,0,0,0.34)] ring-1 ring-white/5 backdrop-blur-xl">
          <div className="grid min-h-[600px] grid-cols-[118px_minmax(0,1fr)] overflow-hidden rounded-[14px] border border-white/5 bg-[linear-gradient(180deg,rgba(17,24,39,0.98)_0%,rgba(2,6,23,0.98)_100%)]">
            {/* Sidebar */}
            <aside className="border-r border-white/5 bg-[linear-gradient(180deg,rgba(17,24,39,0.98)_0%,rgba(2,6,23,0.98)_100%)] px-3 py-4">
              <div className="mb-5 flex items-center gap-2 text-[#4ade80]">
                <Leaf size={18} />
                <span className="text-[0.92rem] font-bold">YPF</span>
              </div>

              <div className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[0.68rem] transition ${
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

            {/* Main Content */}
            <main className="px-4 py-4 sm:px-5 sm:py-4">
              {/* Header */}
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[1.1rem] font-semibold text-white">
                    Dashboard
                  </h3>
                  <p className="mt-1 text-[0.72rem] text-[#d1d5db]">
                    Welcome back, Farmer! 👋
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

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Health Score Card */}
              {metrics && (
                <div className="mb-6 rounded-xl border border-white/5 bg-[#111827] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        Farm Health Score
                      </h2>
                      <p className="text-[0.7rem] text-[#9ca3af]">
                        Overall farm performance indicator
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#4ade80]">
                        {Math.round(healthScore)}
                      </div>
                      <p className="text-[0.7rem] text-[#d1d5db] capitalize">
                        {healthStatus}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-[#4ade80] h-1.5 rounded-full transition-all"
                      style={{ width: `${healthScore}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Metrics Grid */}
              {metrics && (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 mb-6">
                  <div className="rounded-xl border border-white/5 bg-[#111827] px-3 py-3 shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
                    <p className="text-[0.66rem] text-[#9ca3af]">Total Yield</p>
                    <div className="mt-2 flex items-end gap-1.5 text-white">
                      <span className="text-[1.5rem] font-semibold leading-none">
                        {metrics.totalYield}
                      </span>
                      <span className="pb-0.5 text-[0.7rem] text-[#d1d5db]">
                        tons
                      </span>
                    </div>
                    <p className="mt-2 text-[0.63rem] text-[#4ade80]">
                      ↑ 12.5% vs last season
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#111827] px-3 py-3 shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
                    <p className="text-[0.66rem] text-[#9ca3af]">
                      Active Crops
                    </p>
                    <div className="mt-2 flex items-end gap-1.5 text-white">
                      <span className="text-[1.5rem] font-semibold leading-none">
                        {metrics.activeCrops}
                      </span>
                      <span className="pb-0.5 text-[0.7rem] text-[#d1d5db]">
                        crops
                      </span>
                    </div>
                    <p className="mt-2 text-[0.63rem] text-[#4ade80]">
                      Healthy growth
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#111827] px-3 py-3 shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
                    <p className="text-[0.66rem] text-[#9ca3af]">
                      Total Fields
                    </p>
                    <div className="mt-2 flex items-end gap-1.5 text-white">
                      <span className="text-[1.5rem] font-semibold leading-none">
                        {metrics.totalFields}
                      </span>
                      <span className="pb-0.5 text-[0.7rem] text-[#d1d5db]">
                        fields
                      </span>
                    </div>
                    <p className="mt-2 text-[0.63rem] text-[#4ade80]">
                      {metrics.totalFields * 0.575} ha total area
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#111827] px-3 py-3 shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
                    <p className="text-[0.66rem] text-[#9ca3af]">Rainfall</p>
                    <div className="mt-2 flex items-end gap-1.5 text-white">
                      <span className="text-[1.5rem] font-semibold leading-none">
                        {metrics.rainfall}
                      </span>
                      <span className="pb-0.5 text-[0.7rem] text-[#d1d5db]">
                        mm
                      </span>
                    </div>
                    <p className="mt-2 text-[0.63rem] text-[#4ade80]">
                      This week
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Section: Yield Trend & Weather */}
              {metrics && (
                <div className="grid grid-cols-[1.42fr_0.88fr] gap-2.5">
                  {/* Yield Trend Chart */}
                  <div className="rounded-xl border border-white/5 bg-[#111827] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-[0.72rem] font-semibold text-white">
                        Yield Trend
                      </h4>
                      <span className="text-[0.62rem] text-[#9ca3af]">
                        tons
                      </span>
                    </div>

                    <div className="relative h-[112px] rounded-lg bg-[linear-gradient(180deg,rgba(20,83,45,0.45)_0%,rgba(2,6,23,0.15)_100%)] p-2">
                      <div className="absolute inset-2 rounded-md border border-white/4" />
                      <div className="absolute inset-x-2 top-5 border-t border-white/5" />
                      <div className="absolute inset-x-2 top-10 border-t border-white/5" />
                      <div className="absolute inset-x-2 top-15 border-t border-white/5" />

                      <svg
                        viewBox="0 0 400 120"
                        className="relative h-full w-full"
                      >
                        <defs>
                          <linearGradient
                            id="yieldLine"
                            x1="0"
                            x2="1"
                            y1="0"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#4ade80" />
                            <stop offset="100%" stopColor="#86efac" />
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
                            fill="#4ade80"
                          />
                        ))}
                        <text x="338" y="31" fill="#f7f7f0" fontSize="11">
                          {metrics.totalYield} tons
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

                  {/* Weather Overview */}
                  <div className="rounded-xl border border-white/5 bg-[#111827] p-3">
                    <h4 className="text-[0.72rem] font-semibold text-white">
                      Weather Overview
                    </h4>
                    <div className="mt-2 flex items-center gap-2">
                      <CloudSunRain size={48} className="text-[#facc15]" />
                      <div>
                        <div className="text-[2rem] font-semibold leading-none text-white">
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
                        <span className="text-white">
                          {metrics.rainfall} mm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations Section */}
              {recommendations.length > 0 && (
                <div className="mt-6 rounded-xl border border-white/5 bg-[#111827] p-4">
                  <h2 className="text-sm font-semibold text-white mb-3">
                    Recommendations
                  </h2>
                  <div className="space-y-3">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          rec.priority === "high"
                            ? "border-red-500 bg-red-500/10"
                            : rec.priority === "medium"
                              ? "border-yellow-500 bg-yellow-500/10"
                              : "border-blue-500 bg-blue-500/10"
                        }`}
                      >
                        <h3 className="font-semibold text-white text-sm mb-1">
                          {rec.title}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {rec.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
