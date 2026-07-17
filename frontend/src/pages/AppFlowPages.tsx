import React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Leaf,
  MapPinned,
  ShieldAlert,
  Sprout,
  ThermometerSun,
  TrendingUp,
  Clock3,
  Search,
  TriangleAlert,
} from "lucide-react";
import { useAppFlowContext } from "../context/AppFlowContext";
import type { NotificationPreferences } from "../lib/appFlow";

const cardClass = "rounded-lg border border-[var(--ypf-border)] bg-white p-5 shadow-sm";
const pageTitleClass = "ypf-section-title";
const sectionTextClass = "text-sm text-[var(--ypf-text-secondary)]";
const metricNumberClass = "ypf-metric-value text-[var(--ypf-text-primary)]";

const badgeClasses: Record<string, string> = {
  active: "ypf-badge-success",
  harvested: "ypf-badge-neutral",
  atRisk: "ypf-badge-warning",
  failed: "ypf-badge-alert",
  high: "ypf-badge-alert",
  medium: "ypf-badge-warning",
  low: "ypf-badge-success",
};

const EmptyState: React.FC<{ title: string; description: string; ctaLabel?: string; ctaTo?: string }> = ({
  title,
  description,
  ctaLabel,
  ctaTo,
}) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {ctaLabel && ctaTo ? (
        <Link
          to={ctaTo}
          className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
};

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useAppFlowContext();
  const [farmName, setFarmName] = React.useState("");
  const [locationName, setLocationName] = React.useState("");
  const [gps, setGps] = React.useState("");
  const [area, setArea] = React.useState("1");
  const [preferences, setPreferences] = React.useState<NotificationPreferences>({
    email: true,
    sms: true,
    whatsapp: false,
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    completeOnboarding({
      farm: {
        name: farmName || "My First Farm",
        location: locationName || "Unknown",
        gps: gps || "0.0000, 0.0000",
        area: Number.parseFloat(area) || 1,
      },
      preferences,
    });

    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-0">
      <div className={cardClass}>
        <h1 className={pageTitleClass}>Onboarding</h1>
        <p className={`mt-2 ${sectionTextClass}`}>
          First-login setup: add your first farm and set notification preferences.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="ypf-label">Farm name</label>
              <input
                value={farmName}
                onChange={(event) => setFarmName(event.target.value)}
                className="ypf-input"
                required
              />
            </div>
            <div>
              <label className="ypf-label">Location</label>
              <input
                value={locationName}
                onChange={(event) => setLocationName(event.target.value)}
                className="ypf-input"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="ypf-label">GPS coordinates</label>
              <input value={gps} onChange={(event) => setGps(event.target.value)} className="ypf-input" required />
            </div>
            <div>
              <label className="ypf-label">Area (ha)</label>
              <input
                value={area}
                onChange={(event) => setArea(event.target.value)}
                type="number"
                min="0"
                step="0.1"
                className="ypf-input"
                required
              />
            </div>
          </div>

          <div className="rounded-lg border border-[var(--ypf-border)] bg-[var(--ypf-surface)] p-4">
            <p className="mb-2 text-sm font-medium text-[var(--ypf-text-primary)]">Notification preferences</p>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--ypf-text-primary)]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.email}
                  onChange={(event) =>
                    setPreferences((prev) => ({ ...prev, email: event.target.checked }))
                  }
                />
                Email
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.sms}
                  onChange={(event) =>
                    setPreferences((prev) => ({ ...prev, sms: event.target.checked }))
                  }
                />
                SMS
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.whatsapp}
                  onChange={(event) =>
                    setPreferences((prev) => ({ ...prev, whatsapp: event.target.checked }))
                  }
                />
                WhatsApp
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="ypf-button-primary w-full md:ml-auto md:w-auto"
          >
            Complete Onboarding
          </button>
        </form>
      </div>
    </div>
  );
};

export const DashboardHomePage: React.FC = () => {
  const { farms, activeFarm, activePlantings, unreadPestAlerts, unreadRecommendations } = useAppFlowContext();

  if (farms.length === 0) {
    return (
      <EmptyState
        title="Welcome to YieldPF - add your first farm to get started"
        description="No farm data is available yet."
        ctaLabel="Add Farm"
        ctaTo="/farms/new"
      />
    );
  }

  return (
    <div className="space-y-4">
      {unreadPestAlerts > 0 ? (
        <div className="ypf-alert-card ypf-alert-high flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 text-[var(--ypf-alert)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--ypf-text-primary)]">High urgency pest alerts are active</p>
            <p className="text-sm text-[var(--ypf-text-secondary)]">Open pest alerts to review affected plantings and recommended action.</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="ypf-kpi">
          <div className="flex items-start justify-between">
            <Sprout className="h-5 w-5 text-[var(--ypf-primary)]" />
            <span className="ypf-badge-success rounded-full px-2 py-1 text-xs font-medium">On track</span>
          </div>
          <div>
            <p className={metricNumberClass}>{activePlantings}</p>
            <p className="mt-1 text-sm text-[var(--ypf-text-secondary)]">Active plantings</p>
          </div>
          <div className="flex items-center justify-end gap-1 text-xs text-[var(--ypf-primary)]">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+2 vs last week</span>
          </div>
        </div>
        <div className="ypf-kpi">
          <div className="flex items-start justify-between">
            <BarChart3 className="h-5 w-5 text-[var(--ypf-input)]" />
            <span className="ypf-badge-neutral rounded-full px-2 py-1 text-xs font-medium">Season</span>
          </div>
          <div>
            <p className={metricNumberClass}>2.8 t</p>
            <p className="mt-1 text-sm text-[var(--ypf-text-secondary)]">Next predicted harvest</p>
          </div>
          <div className="flex items-center justify-end gap-1 text-xs text-[var(--ypf-primary)]">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12%</span>
          </div>
        </div>
        <div className="ypf-kpi">
          <div className="flex items-start justify-between">
            <ShieldAlert className="h-5 w-5 text-[var(--ypf-alert)]" />
            <span className="ypf-badge-alert rounded-full px-2 py-1 text-xs font-medium">Urgent</span>
          </div>
          <div>
            <p className={metricNumberClass}>{unreadPestAlerts}</p>
            <p className="mt-1 text-sm text-[var(--ypf-text-secondary)]">Unread alerts</p>
          </div>
          <div className="flex items-center justify-end gap-1 text-xs text-[var(--ypf-alert)]">
            <TriangleAlert className="h-3.5 w-3.5" />
            <span>Review now</span>
          </div>
        </div>
        <div className="ypf-kpi">
          <div className="flex items-start justify-between">
            <Leaf className="h-5 w-5 text-[var(--ypf-secondary)]" />
            <span className="ypf-badge-neutral rounded-full px-2 py-1 text-xs font-medium">Read</span>
          </div>
          <div>
            <p className={metricNumberClass}>{unreadRecommendations}</p>
            <p className="mt-1 text-sm text-[var(--ypf-text-secondary)]">Recommendations</p>
          </div>
          <div className="flex items-center justify-end gap-1 text-xs text-[var(--ypf-primary)]">
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Act today</span>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className={pageTitleClass}>Active Farm</h2>
          <Link to="/farms" className="text-sm font-medium text-[var(--ypf-primary)] hover:underline">
            View all farms
          </Link>
        </div>
        <p className={`mt-2 ${sectionTextClass}`}>
          {activeFarm?.name} - {activeFarm?.location}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/plantings/new" className="ypf-button-primary">
            New Planting
          </Link>
          <Link to="/weather" className="ypf-button-secondary">
            Open Weather
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
        <div className={cardClass}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-medium text-[var(--ypf-text-primary)]">Latest Prediction</h3>
            <span className="ypf-badge-success rounded-full px-2 py-1 text-xs font-medium">Confidence 81%</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-[var(--ypf-text-secondary)]">Predicted yield</p>
              <p className="mt-1 text-[2rem] font-bold leading-none text-[var(--ypf-text-primary)]">2,450 kg</p>
              <p className="mt-2 text-sm text-[var(--ypf-text-secondary)]">Estimated harvest date: 2026-10-08</p>
            </div>
            <div className="rounded-lg bg-[var(--ypf-surface)] p-4">
              <div className="mb-2 flex items-center justify-between text-xs text-[var(--ypf-text-secondary)]">
                <span>Confidence</span>
                <span>81%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full w-[81%] rounded-full bg-[var(--ypf-secondary)]" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Rainfall",
                  "Soil moisture",
                  "Temperature",
                ].map((feature) => (
                  <span key={feature} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--ypf-text-secondary)]">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="mb-3 text-base font-medium text-[var(--ypf-text-primary)]">Quick Weather</h3>
          <div className="ypf-weather-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--ypf-text-primary)]">{activeFarm?.name || "Selected farm"}</p>
                <p className="mt-1 text-sm text-[var(--ypf-text-secondary)]">Partly cloudy</p>
              </div>
              <ThermometerSun className="h-6 w-6 text-[var(--ypf-weather)]" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-[var(--ypf-text-secondary)]">Temp</p>
                <p className="mt-1 text-lg font-bold text-[var(--ypf-text-primary)]">26°C</p>
              </div>
              <div>
                <p className="text-xs text-[var(--ypf-text-secondary)]">Humidity</p>
                <p className="mt-1 text-lg font-bold text-[var(--ypf-text-primary)]">69%</p>
              </div>
              <div>
                <p className="text-xs text-[var(--ypf-text-secondary)]">Rain</p>
                <p className="mt-1 text-lg font-bold text-[var(--ypf-text-primary)]">4 mm</p>
              </div>
              <div>
                <p className="text-xs text-[var(--ypf-text-secondary)]">Wind</p>
                <p className="mt-1 text-lg font-bold text-[var(--ypf-text-primary)]">12 km/h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FarmsPage: React.FC = () => {
  const { farms } = useAppFlowContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className={pageTitleClass}>Farms</h1>
        <Link to="/farms/new" className="ypf-button-primary">
          Add Farm
        </Link>
      </div>

      {farms.length === 0 ? (
        <EmptyState title="No farms yet" description="Create your first farm to start tracking." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {farms.map((farm) => (
            <Link key={farm.id} to={`/farms/${farm.id}`} className={cardClass}>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold text-[var(--ypf-text-primary)]">{farm.name}</p>
                  <p className="mt-1 text-sm text-[var(--ypf-text-secondary)]">{farm.location}</p>
                </div>
                <MapPinned className="h-5 w-5 text-[var(--ypf-secondary)]" />
              </div>
              <p className="mt-1 text-sm text-[var(--ypf-text-secondary)]">Area: <span className="font-semibold text-[var(--ypf-text-primary)]">{farm.area} ha</span></p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const NewFarmPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addFarm } = useAppFlowContext();
  const [form, setForm] = React.useState({ name: "", location: "", gps: "", area: "1" });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newFarm = addFarm({
      name: form.name,
      location: form.location,
      gps: form.gps,
      area: Number.parseFloat(form.area) || 1,
    });

    if (location.pathname === "/onboarding") {
      navigate("/dashboard");
      return;
    }

    navigate(`/farms/${newFarm.id}`);
  };

  return (
    <div className={cardClass}>
      <h1 className={pageTitleClass}>Add Farm</h1>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="ypf-label">Farm name</label>
          <input className="ypf-input" required value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
        </div>
        <div>
          <label className="ypf-label">Location</label>
          <input className="ypf-input" required value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} />
        </div>
        <div>
          <label className="ypf-label">GPS coordinates</label>
          <input className="ypf-input" required value={form.gps} onChange={(event) => setForm((prev) => ({ ...prev, gps: event.target.value }))} />
        </div>
        <div>
          <label className="ypf-label">Area (ha)</label>
          <input className="ypf-input" type="number" min="0" step="0.1" required value={form.area} onChange={(event) => setForm((prev) => ({ ...prev, area: event.target.value }))} />
        </div>
        <button type="submit" className="ypf-button-primary w-full md:col-span-2 md:ml-auto md:w-auto">Create Farm</button>
      </form>
    </div>
  );
};

export const FarmDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const { farms } = useAppFlowContext();
  const farm = farms.find((item) => item.id === params.id);

  return (
    <div className="space-y-4">
      <div className={cardClass}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className={pageTitleClass}>Farm Detail</h1>
          <Link to={`/farms/${params.id}/dashboard`} className="text-sm font-medium text-[var(--ypf-primary)] hover:underline">
            Open dashboard
          </Link>
        </div>
        <p className={`mt-2 ${sectionTextClass}`}>{farm?.name || "Unknown Farm"}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="ypf-weather-card">
            <p className="text-sm font-medium text-[var(--ypf-text-primary)]">Weather widget</p>
            <p className="mt-2 text-3xl font-bold text-[var(--ypf-text-primary)]">25°C</p>
            <p className="mt-1 text-sm text-[var(--ypf-text-secondary)]">Partly cloudy, 10% rain risk today</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-[var(--ypf-text-secondary)]">Humidity</p>
                <p className="font-semibold text-[var(--ypf-text-primary)]">61%</p>
              </div>
              <div>
                <p className="text-xs text-[var(--ypf-text-secondary)]">Rain</p>
                <p className="font-semibold text-[var(--ypf-text-primary)]">2 mm</p>
              </div>
              <div>
                <p className="text-xs text-[var(--ypf-text-secondary)]">Wind</p>
                <p className="font-semibold text-[var(--ypf-text-primary)]">12 km/h</p>
              </div>
            </div>
          </div>
          <div className="ypf-card rounded-lg bg-[var(--ypf-surface)] p-4 shadow-none">
            <p className="text-sm font-medium text-[var(--ypf-text-primary)]">Active plantings</p>
            <p className="mt-2 text-3xl font-bold text-[var(--ypf-text-primary)]">2</p>
            <p className="mt-3 text-sm text-[var(--ypf-text-secondary)]">Fields: 5 · Pest alerts: 1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FarmDashboardPage: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass}><h2 className="font-semibold text-slate-900">Yield Trends</h2><p className="mt-2 text-sm text-slate-600">Season-over-season yield trend chart placeholder.</p></div>
      <div className={cardClass}><h2 className="font-semibold text-slate-900">Input Cost Chart</h2><p className="mt-2 text-sm text-slate-600">Cost by category over time.</p></div>
      <div className={cardClass}><h2 className="font-semibold text-slate-900">Pest Alert History</h2><p className="mt-2 text-sm text-slate-600">Alert timeline for this farm.</p></div>
      <div className={cardClass}><h2 className="font-semibold text-slate-900">Predictions</h2><p className="mt-2 text-sm text-slate-600">Model outputs and confidence history.</p></div>
    </div>
  );
};

export const FieldsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className={pageTitleClass}>Fields</h1>
        <Link to="/fields/new" className="ypf-button-primary">Create Field</Link>
      </div>
      <div className={cardClass}>
        <p className={sectionTextClass}>All fields list across all farms.</p>
      </div>
    </div>
  );
};

export const NewFieldPage: React.FC = () => {
  return (
    <div className={cardClass}>
      <h1 className={pageTitleClass}>Create Field</h1>
      <p className={`mt-2 ${sectionTextClass}`}>Form fields: name, area, farm, soil pH, soil moisture, notes.</p>
    </div>
  );
};

export const FieldDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  return (
    <div className={cardClass}>
      <h1 className={pageTitleClass}>Field {params.id}</h1>
      <p className={`mt-2 ${sectionTextClass}`}>Planting history, yield history, soil notes, input summary.</p>
    </div>
  );
};

export const PlantingsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className={pageTitleClass}>Plantings</h1>
        <Link to="/plantings/new" className="ypf-button-primary">New Planting</Link>
      </div>
      <div className={cardClass}>
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-[var(--ypf-border)] bg-[var(--ypf-surface)] px-3 py-2 text-sm text-[var(--ypf-text-secondary)]">
          <Search className="h-4 w-4" />
          <span>Filter by farm, crop, status, and season</span>
        </div>
        <div className="overflow-x-auto">
          <table className="ypf-table min-w-[760px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 bg-white">Planting</th>
                <th>Farm</th>
                <th>Crop</th>
                <th>Status</th>
                <th className="right">Area</th>
                <th>Season</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Maize - Field 2", "Kijani", "Maize", "active", "12.4 ha", "Long rains"],
                ["Beans - Field 1", "Maua", "Beans", "harvested", "7.1 ha", "Short rains"],
                ["Veg mix - Field 5", "Kijani", "Vegetables", "atRisk", "3.8 ha", "Dry season"],
              ].map(([name, farm, crop, status, area, season]) => (
                <tr key={name}>
                  <td className="sticky left-0 z-10 bg-white font-medium text-[var(--ypf-text-primary)]">{name}</td>
                  <td className="text-[var(--ypf-text-secondary)]">{farm}</td>
                  <td className="text-[var(--ypf-text-secondary)]">{crop}</td>
                  <td>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${badgeClasses[status] || badgeClasses.active}`}>
                      {status === "atRisk" ? "At Risk" : status === "harvested" ? "Harvested" : "Active"}
                    </span>
                  </td>
                  <td className="right font-medium text-[var(--ypf-text-primary)]">{area}</td>
                  <td className="text-[var(--ypf-text-secondary)]">{season}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const NewPlantingPage: React.FC = () => {
  const navigate = useNavigate();
  const { markPlantingCreated } = useAppFlowContext();

  const handleCreate = () => {
    markPlantingCreated();
    navigate("/plantings/pl_123");
  };

  return (
    <div className={cardClass}>
      <div className="mb-4 flex items-center gap-2 text-xs text-[var(--ypf-text-secondary)]">
        <span className="rounded-full bg-[rgba(82,183,136,0.14)] px-2 py-1 font-medium text-[var(--ypf-primary)]">1</span>
        <span>Select farm</span>
        <span className="h-px flex-1 bg-[var(--ypf-border)]" />
        <span className="rounded-full bg-[var(--ypf-surface)] px-2 py-1 font-medium">2</span>
        <span>Fill details</span>
        <span className="h-px flex-1 bg-[var(--ypf-border)]" />
        <span className="rounded-full bg-[var(--ypf-surface)] px-2 py-1 font-medium">3</span>
        <span>Confirm</span>
      </div>
      <h1 className={pageTitleClass}>Log New Planting</h1>
      <p className={`mt-2 ${sectionTextClass}`}>Farm to field (filtered), crop, planting date, expected harvest auto-computed.</p>
      <button type="button" onClick={handleCreate} className="ypf-button-primary mt-4 w-full md:w-auto">
        Create Planting
      </button>
    </div>
  );
};

export const PlantingDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [predictionState, setPredictionState] = React.useState<"pending" | "insufficient" | "ready">("pending");

  return (
    <div className="space-y-4">
      <div className={cardClass}>
        <h1 className={pageTitleClass}>Planting {params.id}</h1>
        {predictionState === "pending" ? (
          <div className="mt-4 rounded-lg border border-[var(--ypf-border)] bg-[var(--ypf-surface)] p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--ypf-text-primary)]">
              <Clock3 className="h-4 w-4 text-[var(--ypf-secondary)]" />
              <span className="text-sm font-medium">Prediction pending</span>
            </div>
            <p className="text-sm text-[var(--ypf-text-secondary)]">Check back after the next scheduled prediction run (tonight at 10pm).</p>
          </div>
        ) : null}
        {predictionState === "insufficient" ? (
          <div className="mt-4 rounded-lg border border-[var(--ypf-warning)] bg-[var(--ypf-warning-soft)] p-4">
            <div className="mb-2 flex items-center gap-2 text-[var(--ypf-text-primary)]">
              <TriangleAlert className="h-4 w-4 text-[var(--ypf-warning)]" />
              <span className="text-sm font-medium">Not enough historical data</span>
            </div>
            <p className="text-sm text-[var(--ypf-text-secondary)]">Log at least 20 yield records for Maize to enable predictions.</p>
          </div>
        ) : null}
        {predictionState === "ready" ? (
          <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm text-[var(--ypf-text-secondary)]">Predicted yield</p>
              <p className="mt-1 text-[2rem] font-bold leading-none text-[var(--ypf-text-primary)]">2,450 kg</p>
              <p className="mt-2 text-sm text-[var(--ypf-text-secondary)]">Estimated harvest date: 2026-10-08</p>
            </div>
            <div className="rounded-lg bg-[var(--ypf-surface)] p-4">
              <div className="mb-2 flex items-center justify-between text-xs text-[var(--ypf-text-secondary)]">
                <span>Confidence</span>
                <span>81%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full w-[81%] rounded-full bg-[var(--ypf-secondary)]" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Rainfall", "Humidity", "Temperature"].map((feature) => (
                  <span key={feature} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[var(--ypf-text-secondary)]">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => setPredictionState("pending")} className="ypf-button-secondary min-h-0 px-3 py-1 text-xs">Pending</button>
          <button type="button" onClick={() => setPredictionState("insufficient")} className="ypf-button-secondary min-h-0 px-3 py-1 text-xs">Insufficient Data</button>
          <button type="button" onClick={() => setPredictionState("ready")} className="ypf-button-primary min-h-0 px-3 py-1 text-xs">Ready</button>
        </div>
      </div>
      <Link to={`/plantings/${params.id}/harvest`} className="ypf-button-primary">
        Mark as Harvested
      </Link>
    </div>
  );
};

export const HarvestPlantingPage: React.FC = () => {
  const navigate = useNavigate();
  const { markHarvestSubmitted } = useAppFlowContext();

  const handleSubmit = () => {
    markHarvestSubmitted();
    navigate("/yields");
  };

  return (
    <div className={cardClass}>
      <h1 className={pageTitleClass}>Mark as Harvested</h1>
      <p className={`mt-2 ${sectionTextClass}`}>Enter actual yield kg, harvest date, quality notes.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <label className="ypf-label">Actual yield (kg)</label>
          <input className="ypf-input" defaultValue="2450" />
        </div>
        <div>
          <label className="ypf-label">Harvest date</label>
          <input className="ypf-input" type="date" />
        </div>
        <div>
          <label className="ypf-label">Quality notes</label>
          <input className="ypf-input" defaultValue="Grade A" />
        </div>
      </div>
      <button type="button" onClick={handleSubmit} className="ypf-button-primary mt-4 w-full md:w-auto md:ml-auto">
        Submit Harvest
      </button>
    </div>
  );
};

export const YieldsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className={pageTitleClass}>Yield Records</h1>
        <Link to="/yields/analytics" className="text-sm font-medium text-[var(--ypf-primary)] hover:underline">Open analytics</Link>
      </div>
      <div className={cardClass}>
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-[var(--ypf-border)] bg-[var(--ypf-surface)] px-3 py-2 text-sm text-[var(--ypf-text-secondary)]">
          <Search className="h-4 w-4" />
          <span>Filterable yield log</span>
        </div>
        <div className="overflow-x-auto">
          <table className="ypf-table min-w-[760px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 bg-white">Planting</th>
                <th>Field</th>
                <th>Status</th>
                <th className="right">Yield kg</th>
                <th className="right">Area</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Maize - P-12", "Field 2", "harvested", "2450", "12.4", "2026-07-08"],
                ["Beans - P-08", "Field 1", "harvested", "1320", "7.1", "2026-06-19"],
                ["Veg mix - P-15", "Field 5", "active", "—", "3.8", "2026-07-12"],
              ].map(([planting, field, status, yieldKg, area, date]) => (
                <tr key={planting}>
                  <td className="sticky left-0 z-10 bg-white font-medium text-[var(--ypf-text-primary)]">{planting}</td>
                  <td className="text-[var(--ypf-text-secondary)]">{field}</td>
                  <td>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${badgeClasses[status] || badgeClasses.active}`}>{status === "harvested" ? "Harvested" : "Active"}</span>
                  </td>
                  <td className="right font-medium text-[var(--ypf-text-primary)]">{yieldKg}</td>
                  <td className="right text-[var(--ypf-text-primary)]">{area} ha</td>
                  <td className="text-[var(--ypf-text-secondary)]">{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const YieldsAnalyticsPage: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={cardClass}><h2 className="text-base font-medium text-[var(--ypf-text-primary)]">Trends</h2><div className="mt-4 h-56 rounded-lg bg-white p-4 shadow-inner"><div className="flex h-full items-end gap-2"><div className="h-[45%] flex-1 rounded-t bg-[var(--ypf-secondary)]" /><div className="h-[60%] flex-1 rounded-t bg-[var(--ypf-primary)]" /><div className="h-[52%] flex-1 rounded-t bg-[var(--ypf-accent)]" /><div className="h-[68%] flex-1 rounded-t bg-[var(--ypf-secondary)]" /></div></div></div>
      <div className={cardClass}><h2 className="text-base font-medium text-[var(--ypf-text-primary)]">Field Comparison</h2><div className="mt-4 h-56 rounded-lg bg-white p-4 shadow-inner"><div className="flex h-full items-end gap-4"><div className="h-[62%] flex-1 rounded-t bg-[var(--ypf-secondary)]" /><div className="h-[48%] flex-1 rounded-t bg-[var(--ypf-accent)]" /><div className="h-[74%] flex-1 rounded-t bg-[var(--ypf-primary)]" /></div></div></div>
      <div className={cardClass}><h2 className="text-base font-medium text-[var(--ypf-text-primary)]">Crop Comparison</h2><p className={`mt-2 ${sectionTextClass}`}>Yield by crop type and season.</p></div>
      <div className={cardClass}><h2 className="text-base font-medium text-[var(--ypf-text-primary)]">Season-over-Season</h2><p className={`mt-2 ${sectionTextClass}`}>Yearly performance deltas.</p></div>
    </div>
  );
};

export const WeatherPage: React.FC = () => {
  const { weatherUnavailable, setWeatherUnavailable } = useAppFlowContext();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className={pageTitleClass}>Weather Dashboard</h1>
        <span className="rounded-full bg-[rgba(63,122,99,0.12)] px-3 py-1 text-xs font-semibold text-[var(--ypf-primary)]">
          Live forecast view
        </span>
      </div>
      {weatherUnavailable ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Weather data last updated 08:15 AM - live data temporarily unavailable
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {[
          { farm: "Kijani", temp: 26, desc: "Partly cloudy", humid: 69, rain: 4, wind: 12 },
          { farm: "Maua", temp: 24, desc: "Light rain", humid: 78, rain: 12, wind: 9 },
        ].map((item) => (
          <div key={item.farm} className="ypf-weather-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--ypf-text-primary)]">{item.farm}</p>
                <p className="text-sm text-[var(--ypf-text-secondary)]">{item.desc}</p>
              </div>
              <ThermometerSun className="h-6 w-6 text-[var(--ypf-weather)]" />
            </div>
            <div className="mt-4 flex items-end gap-4">
              <p className="text-[2.5rem] font-bold leading-none text-[var(--ypf-text-primary)]">{item.temp}°</p>
              <div className="grid flex-1 grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[var(--ypf-text-secondary)]">Humidity</p>
                  <p className="font-semibold">{item.humid}%</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--ypf-text-secondary)]">Rain</p>
                  <p className="font-semibold">{item.rain} mm</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--ypf-text-secondary)]">Wind</p>
                  <p className="font-semibold">{item.wind} km/h</p>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2 text-xs text-[var(--ypf-text-secondary)]">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                <div key={day} className="rounded-lg bg-white p-2 text-center shadow-sm">
                  <p className="font-medium text-[var(--ypf-text-primary)]">{day}</p>
                  <p className="mt-1 text-[var(--ypf-weather)]">{index % 2 === 0 ? '☀' : '☁'}</p>
                  <p className="mt-1">{25 - index}°/{17 + index}°</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setWeatherUnavailable(!weatherUnavailable)}
        className="ypf-button-secondary"
      >
        Toggle OpenWeatherMap outage state
      </button>
    </div>
  );
};

export const PestsPage: React.FC = () => {
  const { unreadPestAlerts } = useAppFlowContext();

  const handleAlertAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  if (unreadPestAlerts === 0) {
    return (
      <EmptyState
        title="No active pest or disease alerts - all monitored plantings are currently within safe risk thresholds"
        description="Alert history remains available for auditing."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className={pageTitleClass}>Pest & Disease Alerts</h1>
        <span className="rounded-full bg-[rgba(231,111,81,0.14)] px-3 py-1 text-xs font-semibold text-[var(--ypf-alert)]">
          {unreadPestAlerts} unread high-urgency
        </span>
      </div>
      <div className="grid gap-4">
        {[
          {
            severity: "high",
            title: "Armyworm risk on Maize",
            planting: "Maize planting · Field 2",
            farm: "Kijani Farm",
            action: "Scout field and apply approved insecticide",
            timestamp: "Today, 08:30",
          },
          {
            severity: "medium",
            title: "Fungal pressure rising",
            planting: "Beans planting · Field 1",
            farm: "Maua Farm",
            action: "Improve airflow and monitor leaf spots",
            timestamp: "Yesterday, 18:20",
          },
        ].map((alert) => (
          <Link key={alert.title} to="/pests/alert_001" className={`ypf-alert-card ${alert.severity === "high" ? "ypf-alert-high" : "ypf-alert-medium"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-[var(--ypf-text-primary)]">{alert.title}</p>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeClasses[alert.severity]}`}>{alert.severity === "high" ? "High" : "Medium"}</span>
                </div>
                <p className="mt-1 text-sm text-[var(--ypf-text-secondary)]">{alert.planting} · {alert.farm}</p>
                <p className="mt-3 text-sm text-[var(--ypf-text-primary)]"><span className="font-semibold">Recommended:</span> {alert.action}</p>
              </div>
              <Clock3 className="h-5 w-5 text-[var(--ypf-text-secondary)]" />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={handleAlertAction} className="ypf-button-primary min-h-0 px-3 py-1 text-xs">Mark read</button>
              <button type="button" onClick={handleAlertAction} className="ypf-button-secondary min-h-0 px-3 py-1 text-xs">Dismiss</button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const PestDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  return (
    <div className={cardClass}>
      <h1 className="text-xl font-semibold text-slate-900">Pest Alert {params.id}</h1>
      <p className="mt-2 text-sm text-slate-600">Pest type, affected planting, risk level, recommended action, weather trigger.</p>
      <p className="mt-3 text-xs text-slate-500">If Twilio delivery fails, status remains delivery_failed and still appears in-app.</p>
    </div>
  );
};

export const InputsPage: React.FC = () => {
  const { inputLogs } = useAppFlowContext();

  if (inputLogs === 0) {
    return (
      <EmptyState
        title="No input records yet - log your first fertilizer, pesticide, or irrigation application to start tracking costs"
        description="Input and resource tracking hub across all farms."
        ctaLabel="Log Input"
        ctaTo="/inputs/new"
      />
    );
  }

  return (
    <div className={cardClass}>
      <h1 className="text-xl font-semibold text-slate-900">Inputs & Tracking</h1>
      <p className="mt-2 text-sm text-slate-600">All input logs across all farms with cost summary.</p>
    </div>
  );
};

export const NewInputPage: React.FC = () => {
  const navigate = useNavigate();
  const { markInputLogged } = useAppFlowContext();

  return (
    <div className={cardClass}>
      <h1 className="text-xl font-semibold text-slate-900">Log New Input</h1>
      <p className="mt-2 text-sm text-slate-600">Type selector: fertilizer / pesticide / irrigation.</p>
      <button
        type="button"
        onClick={() => {
          markInputLogged();
          navigate("/inputs");
        }}
        className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
      >
        Save Input Entry
      </button>
    </div>
  );
};

export const InputAnalyticsPage: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className={cardClass}><p className="text-xs text-slate-500">Fertilizer</p><p className="mt-2 text-lg font-semibold text-slate-900">KES 12,400</p></div>
      <div className={cardClass}><p className="text-xs text-slate-500">Pesticide</p><p className="mt-2 text-lg font-semibold text-slate-900">KES 4,200</p></div>
      <div className={cardClass}><p className="text-xs text-slate-500">Irrigation</p><p className="mt-2 text-lg font-semibold text-slate-900">KES 1,800</p></div>
      <div className={`${cardClass} md:col-span-3`}><p className="text-sm text-slate-600">Cost per hectare and cost-vs-yield chart placeholder.</p></div>
    </div>
  );
};

export const RecommendationsPage: React.FC = () => {
  const { unreadRecommendations, decrementRecommendationBadge } = useAppFlowContext();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Recommendations</h1>
      <div className={cardClass}>
        <p className="text-sm text-slate-700">Rainfall sufficient - skip irrigation this week.</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={decrementRecommendationBadge}
            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white"
          >
            Mark Read
          </button>
          <button
            type="button"
            onClick={decrementRecommendationBadge}
            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700"
          >
            Dismiss
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-500">Unread recommendations: {unreadRecommendations}</p>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  return (
    <div className={cardClass}>
      <h1 className="text-xl font-semibold text-slate-900">Account Settings</h1>
      <p className="mt-2 text-sm text-slate-600">Profile, phone number, and notification channel preferences (email/SMS/WhatsApp).</p>
    </div>
  );
};

export const AdminUsersPage: React.FC = () => {
  return (
    <div className={cardClass}>
      <h1 className="text-xl font-semibold text-slate-900">Admin Users</h1>
      <p className="mt-2 text-sm text-slate-600">User list, role management, and farm assignments.</p>
    </div>
  );
};

export const SessionExpiredPage: React.FC = () => {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      Session expired. Please login again.
    </div>
  );
};
