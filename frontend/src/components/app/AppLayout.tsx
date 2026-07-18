import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  Bug,
  CloudSun,
  Gauge,
  Leaf,
  Lightbulb,
  MapPinned,
  Settings,
  Sprout,
  Tractor,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import { useAppFlowContext } from "../../context/AppFlowContext";

interface NavigationItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const sectionClass = "mb-5";
const sectionTitleClass = "mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-[var(--ypf-text-secondary)]";

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `group flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-[rgba(82,183,136,0.14)] text-[var(--ypf-primary)]"
      : "text-[var(--ypf-text-primary)] hover:bg-[var(--ypf-surface)]"
  }`;

const badgeClass = "ml-auto rounded-full bg-[var(--ypf-alert)] px-2 py-0.5 text-xs font-semibold text-white";

const tabNavClass = ({ isActive }: { isActive: boolean }): string =>
  `flex min-h-[44px] flex-col items-center justify-center rounded-lg px-1 py-2 text-[11px] font-medium transition ${
    isActive
      ? "bg-[rgba(45,106,79,0.12)] text-[var(--ypf-primary)]"
      : "text-[var(--ypf-text-secondary)] hover:bg-[var(--ypf-surface)]"
  }`;

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const {
    farms,
    activeFarmId,
    setActiveFarmId,
    unreadPestAlerts,
    unreadRecommendations,
  } = useAppFlowContext();

  const groupedNav: Array<{ title: string; items: NavigationItem[] }> = [
    {
      title: "Overview",
      items: [{ to: "/dashboard", label: "Dashboard", icon: Gauge }],
    },
    {
      title: "Farm Data",
      items: [
        { to: "/farms", label: "Farms", icon: MapPinned },
        { to: "/fields", label: "Fields", icon: Tractor },
        { to: "/plantings", label: "Plantings", icon: Sprout },
        { to: "/yields", label: "Yields", icon: TrendingUp },
      ],
    },
    {
      title: "Monitoring",
      items: [
        { to: "/weather", label: "Weather", icon: CloudSun },
        {
          to: "/pests",
          label: "Pest & Disease Alerts",
          icon: Bug,
          badge: unreadPestAlerts,
        },
      ],
    },
    {
      title: "Resources",
      items: [
        { to: "/inputs", label: "Inputs & Tracking", icon: Leaf },
        { to: "/inputs/analytics", label: "Input Analytics", icon: Bell },
      ],
    },
    {
      title: "Insights",
      items: [
        {
          to: "/recommendations",
          label: "Recommendations",
          icon: Lightbulb,
          badge: unreadRecommendations,
        },
      ],
    },
    {
      title: "Account",
      items: [{ to: "/settings", label: "Settings", icon: Settings }],
    },
  ];

  return (
    <div className="ypf-page ypf-surface">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-[var(--ypf-border)] bg-[var(--ypf-surface)] p-4 md:block">
          <Link to="/dashboard" className="mb-5 flex items-center gap-3 rounded-lg border border-[var(--ypf-border)] bg-white px-3 py-3 shadow-sm">
            <div className="rounded-lg bg-[var(--ypf-primary)] p-2 text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--ypf-text-primary)]">YieldPF</p>
              <p className="text-xs text-[var(--ypf-text-secondary)]">Yield Prediction & Farming</p>
            </div>
          </Link>

          {groupedNav.map((group) => (
            <section key={group.title} className={sectionClass}>
              <p className={sectionTitleClass}>{group.title}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.to} to={item.to} className={navLinkClass}>
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 ? <span className={badgeClass}>{item.badge}</span> : null}
                    </NavLink>
                  );
                })}
              </div>
            </section>
          ))}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
          <header className="sticky top-0 z-20 border-b border-[var(--ypf-border)] bg-white/95 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--ypf-text-secondary)]">Active farm context</p>
                <select
                  value={activeFarmId || ""}
                  onChange={(event) => setActiveFarmId(event.target.value)}
                  className="mt-1 rounded-lg border border-[var(--ypf-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--ypf-text-primary)]"
                  disabled={farms.length === 0}
                >
                  {farms.length === 0 ? <option value="">No farms yet</option> : null}
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden rounded-lg bg-[var(--ypf-surface)] px-3 py-2 text-sm text-[var(--ypf-text-primary)] md:block">
                  {user?.name || user?.email}
                </div>
                {user?.role === "admin" ? (
                  <button
                    type="button"
                    onClick={() => navigate("/admin/users")}
                    className="hidden min-h-[44px] items-center gap-2 rounded-lg border border-[var(--ypf-border)] px-3 py-2 text-sm text-[var(--ypf-text-primary)] hover:bg-[var(--ypf-surface)] md:flex"
                  >
                    <Users className="h-4 w-4" />
                    Admin
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="min-h-[44px] rounded-lg border border-[var(--ypf-border)] px-3 py-2 text-sm text-[var(--ypf-text-primary)] hover:bg-[var(--ypf-surface)]"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--ypf-border)] bg-white px-2 py-2 md:hidden">
        <div className="grid grid-cols-5 gap-1">
          <NavLink to="/dashboard" className={tabNavClass}>
            <Gauge className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/plantings" className={tabNavClass}>
            <Sprout className="h-4 w-4" />
            <span>Plantings</span>
          </NavLink>
          <NavLink to="/weather" className={tabNavClass}>
            <CloudSun className="h-4 w-4" />
            <span>Weather</span>
          </NavLink>
          <NavLink to="/pests" className={tabNavClass}>
            <Bug className="h-4 w-4" />
            <span>Pests</span>
          </NavLink>
          <NavLink to="/settings" className={tabNavClass}>
            <Settings className="h-4 w-4" />
            <span>More</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};
