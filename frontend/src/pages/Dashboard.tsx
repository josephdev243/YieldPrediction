import React from "react";
import Analytics from "./Analytics";
import Profile from "./Profile";
import { useDashboard } from "../hooks/useDashboard";
import { useFarmer } from "../hooks/useFarmer";
import { useAuthContext } from "../context/AuthContext";
import { useThemeContext } from "../context/ThemeContext";
import { getInputUsages } from "../services/inputUsageService";
import { getPestDiseaseAlerts } from "../services/pestAlertService";
import {
  buildIrrigationSchedule,
  createMockIrrigationForecast,
} from "../services/irrigationService";
import {
  calculateFinancialSummary,
  getEstimatedInputCost,
} from "../services/financialService";
import type {
  Field,
  InputResourceType,
  InputUsage,
  InputUsageUnit,
  IrrigationSchedule,
  WeatherForecast,
} from "../lib/types";
import {
  BarChart3,
  Bell,
  CalendarDays,
  FlaskConical,
  Bug,
  ChevronDown,
  CloudSunRain,
  Droplets,
  Clock3,
  Home,
  Leaf,
  LogOut,
  MapPinned,
  MoonStar,
  Sprout,
  SunMedium,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";

/**
 * Dashboard Page Component
 * Main dashboard for farmers to view their metrics, crops, and recommendations
 */
export const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState<
    | "overview"
    | "crops"
    | "weather"
    | "irrigation"
    | "inputs"
    | "alerts"
    | "records"
    | "financial"
    | "analytics"
    | "profile"
  >("overview");
  const { user, logout } = useAuthContext();
  const { isDark, toggleTheme } = useThemeContext();
  const { farmer, fields, fetchFields } = useFarmer();
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
    loadMockData();
  }, [loadMockData]);

  React.useEffect(() => {
    if (farmer?.id) {
      void fetchFields(farmer.id);
    }
  }, [farmer?.id, fetchFields]);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", section: "overview" as const },
    { icon: Sprout, label: "My Crops", section: "crops" as const },
    { icon: CloudSunRain, label: "Weather", section: "weather" as const },
    { icon: CalendarDays, label: "Irrigation", section: "irrigation" as const },
    { icon: FlaskConical, label: "Inputs & Resources", section: "inputs" as const },
    { icon: Bug, label: "Pest Alerts", section: "alerts" as const },
    { icon: BarChart3, label: "Yield Records", section: "records" as const },
    { icon: TrendingUp, label: "Financial Summary", section: "financial" as const },
    { icon: Target, label: "Analytics", section: "analytics" as const },
    { icon: UserRound, label: "Profile", section: "profile" as const },
  ];

  const sectionTitle =
    activeSection === "crops"
      ? "My Crops"
      : activeSection === "weather"
        ? "Weather"
        : activeSection === "irrigation"
          ? "Irrigation Schedule"
        : activeSection === "inputs"
          ? "Input & Resource Tracking"
        : activeSection === "alerts"
          ? "Pest & Disease Alerts"
        : activeSection === "records"
          ? "Yield Records"
        : activeSection === "financial"
          ? "Financial Summary"
          : activeSection === "analytics"
      ? "Analytics & Predictions"
      : activeSection === "profile"
        ? "My Profile"
        : "Dashboard Overview";

  const sectionDescription =
    activeSection === "crops"
      ? "View crop status, field coverage, and quick crop-level summaries."
      : activeSection === "weather"
        ? "Monitor weather conditions, rainfall, and short-term risk signals."
        : activeSection === "irrigation"
          ? "View a calendar-style watering plan built from soil moisture and the next seven days of forecast data."
        : activeSection === "inputs"
          ? "Track fertilizer, pesticide, water, and seed usage per field and season."
        : activeSection === "alerts"
          ? "Watch for fungal and pest pressure using weather, season, and crop context."
        : activeSection === "records"
          ? "Review yield history and recent harvest performance in one place."
        : activeSection === "financial"
          ? "Compare cost per hectare, expected revenue, and season profitability before deciding what to invest in next."
          : activeSection === "analytics"
      ? "Analytics and forecasts displayed inside the dashboard shell."
      : activeSection === "profile"
        ? "Profile details shown without leaving the dashboard layout."
        : "Real-time system activity and quick access to key farm functions.";

  const cropCards = [
    {
      name: "Maize",
      status: "Growing",
      area: "12.5 ha",
      note: "Needs light irrigation this week",
    },
    {
      name: "Beans",
      status: "Healthy",
      area: "8.2 ha",
      note: "Good soil moisture and strong leaf cover",
    },
    {
      name: "Vegetables",
      status: "Monitoring",
      area: "4.1 ha",
      note: "Check pest pressure after rainfall",
    },
  ];

  const financialFallbackFields: Field[] = React.useMemo(
    () =>
      cropCards.map((crop, index) => ({
        id: `fallback-field-${index + 1}`,
        farmerId: farmer?.id || "fallback",
        name: crop.name,
        size: Number.parseFloat(crop.area),
        cropType: crop.name,
        soilType: index === 0 ? "Loamy" : index === 1 ? "Sandy Loam" : "Clay Loam",
        irrigationType: index === 0 ? "rain-fed" : index === 1 ? "mixed" : "irrigated",
        moisture_level: index === 0 ? 52 : index === 1 ? 67 : 44,
        soil_ph: index === 0 ? 6.6 : index === 1 ? 6.9 : 6.3,
        nutrient_content: index === 0 ? 71 : index === 1 ? 68 : 63,
        location: {
          latitude: 0,
          longitude: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    [cropCards, farmer?.id],
  );

  const activeFields = fields.length > 0 ? fields : financialFallbackFields;

  const weatherItems = [
    { label: "Temperature", value: "24°C", detail: "Partly cloudy" },
    { label: "Humidity", value: "65%", detail: "Comfortable range" },
    { label: "Wind Speed", value: "12 km/h", detail: "Light breeze" },
    { label: "Rainfall", value: `${metrics?.rainfall ?? 0} mm`, detail: "This week" },
  ];

  const soilHealth = {
    ph: 6.7,
    moisture: 58,
    nutrientContent: 72,
    status: "Balanced",
    field: "North Field",
    sampledAt: "Today, 07:15",
  };

  const irrigationForecast = React.useMemo<WeatherForecast[]>(
    () => createMockIrrigationForecast(7),
    [],
  );

  const irrigationSchedule: IrrigationSchedule = React.useMemo(
    () => buildIrrigationSchedule(activeFields, irrigationForecast, soilHealth.moisture),
    [activeFields, irrigationForecast, soilHealth.moisture],
  );

  const soilSignals = [
    {
      label: "Soil pH",
      value: soilHealth.ph.toFixed(1),
      detail: "Best range: 6.0 - 7.0",
      color: isDark ? "text-slate-50" : "text-slate-900",
    },
    {
      label: "Moisture Level",
      value: `${soilHealth.moisture}%`,
      detail: "Moderate water retention",
      color: isDark ? "text-slate-50" : "text-slate-900",
    },
    {
      label: "Nutrient Content",
      value: `${soilHealth.nutrientContent}%`,
      detail: "Derived from recent soil sample",
      color: isDark ? "text-slate-50" : "text-slate-900",
    },
  ];

  const yieldRows = [
    { period: "This month", value: `${metrics?.totalYield.toFixed(2) ?? "0.00"} tons` },
    { period: "Last month", value: "2.10 tons" },
    { period: "Season average", value: "2.45 tons" },
    { period: "Forecast", value: `${metrics?.predictedYield.toFixed(2) ?? "0.00"} tons` },
  ];

  const [inputForm, setInputForm] = React.useState({
    fieldName: "North Field",
    season: "Long Rains",
    seasonYear: new Date().getFullYear(),
    resourceType: "fertilizer",
    quantity: "",
    cost: "",
    unit: "kg",
  });

  const [inputUsageEntries, setInputUsageEntries] = React.useState([
    {
      id: "inp-1",
      fieldName: "North Field",
      season: "Long Rains",
      seasonYear: 2026,
      resourceType: "fertilizer",
      quantity: 380,
      cost: 32300,
      unit: "kg",
      dateLabel: "May 16, 2026",
    },
    {
      id: "inp-2",
      fieldName: "East Field",
      season: "Long Rains",
      seasonYear: 2026,
      resourceType: "pesticide",
      quantity: 42,
      cost: 17640,
      unit: "liters",
      dateLabel: "May 11, 2026",
    },
    {
      id: "inp-3",
      fieldName: "North Field",
      season: "Long Rains",
      seasonYear: 2026,
      resourceType: "water",
      quantity: 520,
      cost: 15600,
      unit: "m3",
      dateLabel: "May 20, 2026",
    },
    {
      id: "inp-4",
      fieldName: "West Field",
      season: "Long Rains",
      seasonYear: 2026,
      resourceType: "seed",
      quantity: 52,
      cost: 93600,
      unit: "bags",
      dateLabel: "May 3, 2026",
    },
  ]);

  const [pestAlerts, setPestAlerts] = React.useState([
    {
      id: "alert-1",
      fieldName: "North Field",
      cropName: "Maize",
      alertType: "fungal",
      riskLevel: "high",
      title: "Fungal pressure rising in North Field",
      description:
        "Wet weather and high humidity are creating fungal risk for maize. Increase scouting and consider protective action before spread accelerates.",
      season: "Long Rains",
      rainfallMm: 18,
      humidityPercent: 88,
      temperatureC: 26,
      riskScore: 84,
      createdLabel: "Today, 06:40",
    },
    {
      id: "alert-2",
      fieldName: "East Field",
      cropName: "Beans",
      alertType: "disease",
      riskLevel: "medium",
      title: "Disease watch for beans",
      description:
        "Seasonal moisture and humidity indicate elevated disease pressure on East Field. Check leaf spots, blight symptoms, and canopy airflow.",
      season: "Long Rains",
      rainfallMm: 11,
      humidityPercent: 79,
      temperatureC: 24,
      riskScore: 66,
      createdLabel: "Today, 05:55",
    },
    {
      id: "alert-3",
      fieldName: "West Field",
      cropName: "Vegetables",
      alertType: "pest",
      riskLevel: "high",
      title: "Pest pressure risk on West Field",
      description:
        "Hot, dry conditions can increase pest activity for vegetables. Inspect stems and undersides of leaves and plan targeted control if needed.",
      season: "Dry Season",
      rainfallMm: 0,
      humidityPercent: 49,
      temperatureC: 31,
      riskScore: 78,
      createdLabel: "Yesterday, 18:20",
    },
  ]);

  React.useEffect(() => {
    const loadInputUsages = async () => {
      const response = await getInputUsages();

      if (!response.success || !response.data || response.data.length === 0) {
        return;
      }

      setInputUsageEntries(
        response.data.map((item) => ({
          id: item.id,
          fieldName: item.fieldName || "Unknown Field",
          season: item.season,
          seasonYear: item.seasonYear,
          resourceType: item.resourceType,
          quantity: item.quantity,
          cost: item.cost ?? getEstimatedInputCost(item as InputUsage),
          unit: item.unit,
          dateLabel: item.applicationDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        })),
      );
    };

    void loadInputUsages();
  }, []);

  React.useEffect(() => {
    const loadAlerts = async () => {
      const response = await getPestDiseaseAlerts();

      if (!response.success || !response.data || response.data.length === 0) {
        return;
      }

      setPestAlerts(
        response.data.map((item) => ({
          id: item.id,
          fieldName: item.fieldName || "Unknown Field",
          cropName: item.cropName || "Crop",
          alertType: item.alertType,
          riskLevel: item.riskLevel,
          title: item.title,
          description: item.description,
          season: item.season || "",
          rainfallMm: item.rainfallMm,
          humidityPercent: item.humidityPercent,
          temperatureC: item.temperatureC,
          riskScore: item.riskScore,
          createdLabel: item.createdAt.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
        })),
      );
    };

    void loadAlerts();
  }, []);

  const resourceMeta: Record<string, { label: string; icon: React.ReactNode }> = {
    fertilizer: { label: "Fertilizer", icon: <FlaskConical size={16} className="text-[#1d9e75]" /> },
    pesticide: { label: "Pesticide", icon: <Bug size={16} className="text-[#dc2626]" /> },
    water: { label: "Water", icon: <Droplets size={16} className="text-[#0ea5e9]" /> },
    seed: { label: "Seed", icon: <Sprout size={16} className="text-[#16a34a]" /> },
  };

  const alertMeta: Record<string, { label: string; className: string }> = {
    fungal: { label: "Fungal", className: "bg-amber-100 text-amber-900" },
    disease: { label: "Disease", className: "bg-rose-100 text-rose-900" },
    pest: { label: "Pest", className: "bg-orange-100 text-orange-900" },
  };

  const riskMeta: Record<string, { label: string; className: string }> = {
    low: { label: "Low", className: "bg-emerald-100 text-emerald-900" },
    medium: { label: "Medium", className: "bg-sky-100 text-sky-900" },
    high: { label: "High", className: "bg-amber-100 text-amber-900" },
    critical: { label: "Critical", className: "bg-red-100 text-red-900" },
  };

  const inputTotals = inputUsageEntries.reduce(
    (acc, entry) => {
      if (!acc[entry.resourceType]) {
        acc[entry.resourceType] = 0;
      }
      acc[entry.resourceType] += entry.quantity;
      return acc;
    },
    {} as Record<string, number>,
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setInputForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const quantity = Number(inputForm.quantity);

    if (!quantity || quantity <= 0) {
      return;
    }

    setInputUsageEntries((prev) => [
      {
        id: `inp-${Date.now()}`,
        fieldName: inputForm.fieldName,
        season: inputForm.season,
        seasonYear: Number(inputForm.seasonYear),
        resourceType: inputForm.resourceType,
        quantity,
        cost: Number(inputForm.cost || quantity * 100),
        unit: inputForm.unit,
        dateLabel: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      },
      ...prev,
    ]);

    setInputForm((prev) => ({ ...prev, quantity: "", cost: "" }));
  };

  const financialSummary = React.useMemo(
    () =>
      calculateFinancialSummary({
        fields: activeFields,
        inputUsages: inputUsageEntries.map((entry) => ({
          id: entry.id,
          fieldId: activeFields[0]?.id || "fallback-field",
          fieldName: entry.fieldName,
          season: entry.season,
          seasonYear: entry.seasonYear,
          resourceType: entry.resourceType as InputResourceType,
          quantity: entry.quantity,
          cost: entry.cost,
          unit: entry.unit as InputUsageUnit,
          applicationDate: new Date(),
          notes: "",
          createdAt: new Date(),
        })),
        predictedYieldTons: metrics?.predictedYield ?? 0,
      }),
    [activeFields, inputUsageEntries, metrics?.predictedYield],
  );

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  const metricCards = metrics
    ? [
        {
          label: "Total Yield",
          value: metrics.totalYield.toFixed(2),
          unit: "tons",
          note: "Up 12.5% vs last season",
          icon: TrendingUp,
        },
        {
          label: "Active Crops",
          value: metrics.activeCrops,
          unit: "crops",
          note: "Healthy growth across fields",
          icon: Sprout,
        },
        {
          label: "Total Fields",
          value: metrics.totalFields,
          unit: "fields",
          note: `${(metrics.totalFields * 0.575).toFixed(1)} ha total area`,
          icon: MapPinned,
        },
        {
          label: "Rainfall",
          value: metrics.rainfall,
          unit: "mm",
          note: "Tracked this week",
          icon: Droplets,
        },
        {
          label: "Predicted Yield",
          value: metrics.predictedYield.toFixed(2),
          unit: "tons",
          note: "Model-based forecast",
          icon: CloudSunRain,
        },
        {
          label: "Health Score",
          value: Math.round(healthScore),
          unit: "/ 100",
          note: healthStatus,
          icon: SunMedium,
        },
      ]
    : [];

    const shellCardClass = isDark
      ? "border-[color:var(--surface-2)] bg-[var(--surface-2)] text-slate-100"
      : "border-slate-200 bg-white text-slate-900";
    const mutedTextClass = isDark ? "text-slate-300" : "text-slate-600";
    const softTextClass = isDark ? "text-slate-400" : "text-slate-500";
    const sectionSurfaceClass = isDark
      ? "border-[color:var(--surface-2)] bg-[var(--surface-2)]"
      : "border-slate-200 bg-white";
    const panelSurfaceClass = isDark
      ? "border-[color:var(--surface-2)] bg-[var(--surface-2)] text-slate-100"
      : "border-slate-200 bg-white text-slate-900";
    const inputSurfaceClass = isDark
      ? "border-[color:var(--surface-2)] bg-[var(--surface-2)] text-slate-100 placeholder:text-slate-400"
      : "border-slate-200 bg-[#e6f1fb] text-slate-700 placeholder:text-slate-400";

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#eef4fb]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#185fa5]" />
          <p className={mutedTextClass}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen lg:overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[var(--surface-0)] text-slate-100" : "bg-[#eef4fb] text-slate-900"
      }`}
    >
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside
          className={`flex flex-col px-5 py-6 text-white shadow-[0_20px_45px_rgba(8,20,46,0.28)] lg:sticky lg:top-0 lg:h-screen lg:min-h-0 lg:overflow-y-auto lg:self-start transition-colors duration-300 ${
            "bg-[var(--surface-1)]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(234,243,222,0.14)] ring-1 ring-white/10">
              <Leaf size={22} className="text-[#97c459]" />
            </div>
            <div>
              <p className="text-[1.2rem] font-medium tracking-[-0.02em] text-white">
                YPF
              </p>
              <p className="text-[0.65rem] font-medium text-blue-100/80">
                Yield Platform
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-2">
            <p className="px-3 text-xs font-medium text-blue-100/70">
              Overview
            </p>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.section;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveSection(item.section)}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                    active
                        ? "bg-[rgba(99,153,34,0.15)] text-[#97C459]"
                        : "text-white/45 hover:text-white/80"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                    {active ? <span className="ml-auto h-1 w-1 rounded-full bg-[#97C459]" /> : null}
                </button>
              );
            })}
          </div>

          <div className="mt-auto rounded-[28px] bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-sm font-semibold uppercase text-white ring-1 ring-white/10">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.name || "System Admin"}
                </p>
                <p className="truncate text-xs text-blue-100/85">
                  {user?.email || "admin@yieldprediction.com"}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveSection("profile")}
                className="rounded-xl border border-white/15 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-white/10"
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.replace("/");
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#185fa5] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#2f76b6]"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className={`px-4 py-4 sm:px-6 lg:h-screen lg:overflow-y-auto lg:px-8 lg:py-6 transition-colors duration-300 ${isDark ? "bg-[var(--surface-0)]" : "bg-transparent"}`}>
          <div className={`rounded-[28px] border shadow-[0_18px_50px_rgba(15,23,42,0.08)] ${panelSurfaceClass}`}>
            <div className={`border-b px-5 py-5 sm:px-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-2xl">
                  <h1 className={`text-2xl font-medium tracking-[-0.03em] sm:text-3xl ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                    {sectionTitle}
                  </h1>
                  <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    {sectionDescription}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className={`relative flex h-12 w-full items-center rounded-xl border px-4 sm:w-[340px] ${inputSurfaceClass}`}>
                    <input
                      type="search"
                      placeholder="Search…"
                      className={`w-full bg-transparent pr-16 text-sm outline-none ${isDark ? "text-slate-100 placeholder:text-slate-400" : "text-slate-800 placeholder:text-slate-400"}`}
                    />
                    <kbd className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border px-2 py-0.5 text-[0.65rem] font-medium ${isDark ? "border-slate-700 bg-slate-800 text-slate-300" : "border-slate-200 bg-white text-slate-500"}`}>
                      ⌘K
                    </kbd>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className={`grid h-12 w-12 place-items-center rounded-full border shadow-sm transition ${
                        isDark
                          ? "border-[color:var(--surface-2)] bg-[var(--surface-2)] text-slate-100 hover:bg-[color:var(--surface-0)]"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-[#e6f1fb]"
                      }`}
                      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                    >
                      {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
                    </button>
                    <button className={`grid h-12 w-12 place-items-center rounded-full border shadow-sm transition ${shellCardClass} ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
                      <Bell size={18} />
                    </button>
                    <div className={`hidden items-center gap-2 rounded-full border px-3 py-2 shadow-sm sm:flex ${sectionSurfaceClass}`}>
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-[#eaf3de] text-sm font-semibold text-[#1d9e75]">
                        {initials}
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                          {user?.name || "Farmer"}
                        </p>
                        <p className={`text-[0.7rem] ${mutedTextClass}`}>
                          {healthStatus} farm status
                        </p>
                      </div>
                      <ChevronDown size={16} className={softTextClass} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-6">
              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {activeSection === "crops" ? (
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <section className={`rounded-[24px] border p-5 ${sectionSurfaceClass}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className={`text-base font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Crop Summary
                        </h2>
                        <p className={`text-sm ${mutedTextClass}`}>
                          Quick view of active crop groups and field status.
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium shadow-sm ${isDark ? "bg-slate-800 text-slate-100" : "bg-[#eaf3de] text-slate-600"}`}>
                        Active crops: {metrics?.activeCrops ?? 0}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {cropCards.map((crop) => (
                        <article
                          key={crop.name}
                          className={`rounded-2xl border px-4 py-4 shadow-sm ${shellCardClass}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className={`text-base font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                                {crop.name}
                              </p>
                              <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{crop.note}</p>
                            </div>
                            <span className="rounded-full bg-[#eaf3de] px-2.5 py-1 text-[0.7rem] font-medium text-slate-600">
                              {crop.status}
                            </span>
                          </div>

                          <div className={`mt-3 flex items-center justify-between text-sm ${mutedTextClass}`}>
                            <span>Area</span>
                            <span className={`font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>{crop.area}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${panelSurfaceClass}`}>
                    <h2 className={`text-base font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                      Crop Actions
                    </h2>
                    <div className="mt-4 space-y-3">
                      {recommendations.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className={`rounded-2xl border px-4 py-3 ${sectionSurfaceClass}`}
                        >
                          <p className={`text-sm font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>{item.title}</p>
                          <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              ) : activeSection === "weather" ? (
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <section className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${panelSurfaceClass}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className={`text-base font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Weather Overview
                        </h2>
                        <p className={`text-sm ${mutedTextClass}`}>
                          Current field conditions and climate signals.
                        </p>
                      </div>
                      <CloudSunRain size={42} className="text-[#1d9e75]" />
                    </div>

                    <div className={`mt-4 rounded-[22px] p-4 ${isDark ? "bg-[var(--surface-2)]" : "bg-[#eff6ff]"}`}>
                      <div className={`text-3xl font-medium tracking-[-0.02em] ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                        24°C
                      </div>
                      <p className={`mt-1 text-sm ${mutedTextClass}`}>Partly cloudy</p>
                    </div>

                    <div className="mt-4 space-y-3">
                      {weatherItems.map((item) => (
                        <div
                          key={item.label}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${sectionSurfaceClass}`}
                        >
                          <div>
                            <p className={`text-sm font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>{item.label}</p>
                            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{item.detail}</p>
                          </div>
                          <span className={`text-sm font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className={`rounded-[24px] border p-5 ${sectionSurfaceClass}`}>
                    <h2 className={`text-base font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                      Weather Actions
                    </h2>
                    <div className="mt-4 space-y-3">
                      <div className={`rounded-2xl border px-4 py-3 shadow-sm ${shellCardClass}`}>
                        <p className={`text-sm font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>Irrigation</p>
                        <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>Plan light watering for the maize block.</p>
                      </div>
                      <div className={`rounded-2xl border px-4 py-3 shadow-sm ${shellCardClass}`}>
                        <p className={`text-sm font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>Rainfall Watch</p>
                        <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>Monitor rainfall before fertilizer application.</p>
                      </div>
                    </div>
                  </section>
                </div>
              ) : activeSection === "irrigation" ? (
                <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                  <section className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${panelSurfaceClass}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className={`text-base font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Irrigation Summary
                        </h2>
                        <p className={`text-sm ${mutedTextClass}`}>
                          A seven-day watering plan built from soil moisture and forecast conditions.
                        </p>
                      </div>
                      <CalendarDays size={42} className="text-[#1d9e75]" />
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className={`rounded-2xl border px-4 py-4 ${sectionSurfaceClass}`}>
                        <p className={`text-xs font-medium ${softTextClass}`}>
                          Next watering window
                        </p>
                        <p className={`mt-2 text-2xl font-medium tracking-[-0.02em] ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          {irrigationSchedule.summary.nextActionLabel}
                        </p>
                        <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          Focus field: {irrigationSchedule.summary.focusFieldName}
                        </p>
                      </div>
                      <div className={`rounded-2xl border px-4 py-4 ${sectionSurfaceClass}`}>
                        <p className={`text-xs font-medium ${softTextClass}`}>
                          Water budget
                        </p>
                        <p className={`mt-2 text-2xl font-medium tracking-[-0.02em] ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          {irrigationSchedule.summary.totalWaterMm.toFixed(1)} mm
                        </p>
                        <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          Average soil moisture: {irrigationSchedule.summary.averageMoisturePercent.toFixed(1)}%
                        </p>
                      </div>
                      <div className={`rounded-2xl border px-4 py-4 ${sectionSurfaceClass}`}>
                        <p className={`text-xs font-medium ${softTextClass}`}>
                          Watering days
                        </p>
                        <p className={`mt-2 text-2xl font-medium tracking-[-0.02em] ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          {irrigationSchedule.summary.wateringDays}
                        </p>
                        <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          Days with active irrigation needed.
                        </p>
                      </div>
                      <div className={`rounded-2xl border px-4 py-4 ${sectionSurfaceClass}`}>
                        <p className={`text-xs font-medium ${softTextClass}`}>
                          Monitor / hold
                        </p>
                        <p className={`mt-2 text-2xl font-medium tracking-[-0.02em] ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          {irrigationSchedule.summary.monitoringDays} / {irrigationSchedule.summary.holdDays}
                        </p>
                        <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          Hold rain-fed fields and check moisture before watering.
                        </p>
                      </div>
                    </div>

                    <div className={`mt-4 rounded-[22px] p-4 ${isDark ? "bg-[var(--surface-2)]" : "bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_100%)]"}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className={`text-xs font-medium ${softTextClass}`}>
                            Decision cue
                          </p>
                          <p className={`mt-1 text-base font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            {irrigationSchedule.summary.focusFieldName} should be checked first.
                          </p>
                        </div>
                        <Clock3 size={36} className="text-[#1d9e75]" />
                      </div>

                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <div className={`rounded-2xl border px-4 py-3 shadow-sm ${shellCardClass}`}>
                          <p className={`text-xs font-medium ${softTextClass}`}>
                            Soil moisture
                          </p>
                          <p className={`mt-2 text-2xl font-medium tracking-[-0.02em] ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            {soilHealth.moisture}%
                          </p>
                          <p className={`mt-1 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            Current profile from the latest sample.
                          </p>
                        </div>
                        <div className={`rounded-2xl border px-4 py-3 shadow-sm ${shellCardClass}`}>
                          <p className={`text-xs font-medium ${softTextClass}`}>
                            Weekly forecast
                          </p>
                          <p className={`mt-2 text-2xl font-medium tracking-[-0.02em] ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            {irrigationForecast[0]?.condition ?? "Stable"}
                          </p>
                          <p className={`mt-1 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            Generated from the next seven days of weather.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className={`rounded-[24px] border p-5 ${sectionSurfaceClass}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className={`text-base font-medium ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Weekly Calendar
                        </h2>
                        <p className={`text-sm ${mutedTextClass}`}>
                          Each tile shows the recommended action for one forecast day.
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${isDark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-600"}`}>
                        {irrigationSchedule.items.length} days
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {irrigationSchedule.items.map((item) => {
                        const actionStyle =
                          item.action === "water"
                            ? isDark
                              ? "border-blue-700 bg-blue-950/40"
                              : "border-blue-200 bg-blue-50"
                            : item.action === "hold"
                              ? isDark
                                ? "border-amber-700 bg-amber-950/40"
                                : "border-amber-200 bg-amber-50"
                              : isDark
                                ? "border-[color:var(--surface-2)] bg-[var(--surface-2)]"
                                : "border-slate-200 bg-slate-50";

                        const priorityStyle =
                          item.priority === "high"
                            ? "bg-red-100 text-red-900"
                            : item.priority === "medium"
                              ? "bg-sky-100 text-sky-900"
                              : "bg-emerald-100 text-emerald-900";

                        return (
                          <article key={`${item.date.toISOString()}-${item.fieldId}`} className={`rounded-2xl border p-4 shadow-sm ${actionStyle}`}>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${softTextClass}`}>
                                  {item.dayLabel}
                                </p>
                                <p className={`mt-1 text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                                  {item.dateLabel}
                                </p>
                              </div>
                              <span className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${priorityStyle}`}>
                                {item.priority}
                              </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div>
                                <p className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                                  {item.fieldName}
                                </p>
                                <p className={`text-xs ${mutedTextClass}`}>
                                  {item.timeWindow}
                                </p>
                              </div>
                              <Droplets size={20} className={item.action === "water" ? "text-[#1d9e75]" : "text-[#64748b]"} />
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                              <div className={`rounded-xl border px-3 py-2 ${shellCardClass}`}>
                                <p className={softTextClass}>Soil moisture</p>
                                <p className={`mt-1 text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                                  {item.soilMoisturePercent}%
                                </p>
                              </div>
                              <div className={`rounded-xl border px-3 py-2 ${shellCardClass}`}>
                                <p className={softTextClass}>Rainfall</p>
                                <p className={`mt-1 text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                                  {item.forecastRainfallMm.toFixed(1)} mm
                                </p>
                              </div>
                              <div className={`rounded-xl border px-3 py-2 ${shellCardClass}`}>
                                <p className={softTextClass}>Heat</p>
                                <p className={`mt-1 text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                                  {item.forecastTempMaxC}°C
                                </p>
                              </div>
                              <div className={`rounded-xl border px-3 py-2 ${shellCardClass}`}>
                                <p className={softTextClass}>Water</p>
                                <p className={`mt-1 text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                                  {item.recommendedWaterMm.toFixed(1)} mm
                                </p>
                              </div>
                            </div>

                            <p className={`mt-3 text-sm ${mutedTextClass}`}>
                              {item.reason}
                            </p>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                </div>
              ) : activeSection === "inputs" ? (
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <section className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${panelSurfaceClass}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className={`text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Seasonal Input Log
                        </h2>
                        <p className={`text-sm ${mutedTextClass}`}>
                          Resource usage by field to explain yield outcomes beyond weather.
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${isDark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-600"}`}>
                        {inputUsageEntries.length} entries
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {Object.entries(resourceMeta).map(([key, meta]) => (
                        <article
                          key={key}
                          className={`rounded-2xl border px-4 py-3 shadow-sm ${shellCardClass}`}
                        >
                          <div className="flex items-center gap-2">
                            {meta.icon}
                            <p className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                              {meta.label}
                            </p>
                          </div>
                          <p className={`mt-2 text-xl font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            {(inputTotals[key] || 0).toFixed(1)}
                          </p>
                          <p className={`text-xs ${softTextClass}`}>
                            Total used this season
                          </p>
                        </article>
                      ))}
                    </div>

                    <div className="mt-4 space-y-3">
                      {inputUsageEntries.slice(0, 7).map((entry) => (
                        <article
                          key={entry.id}
                          className={`rounded-2xl border px-4 py-3 ${sectionSurfaceClass}`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {resourceMeta[entry.resourceType]?.icon}
                              <p className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                                {resourceMeta[entry.resourceType]?.label}
                              </p>
                            </div>
                            <span className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                              {entry.quantity} {entry.unit}
                            </span>
                          </div>

                          <div className={`mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs ${softTextClass}`}>
                            <span>{entry.fieldName}</span>
                            <span>{entry.season} {entry.seasonYear}</span>
                            <span>{entry.dateLabel}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className={`rounded-[24px] border p-5 ${sectionSurfaceClass}`}>
                    <h2 className={`text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                      Log New Input
                    </h2>
                    <p className={`mt-1 text-sm ${mutedTextClass}`}>
                      Capture usage in-season so prediction models can separate input effects from weather effects.
                    </p>

                    <form className="mt-4 space-y-3" onSubmit={handleInputSubmit}>
                      <input
                        name="fieldName"
                        value={inputForm.fieldName}
                        onChange={handleInputChange}
                        placeholder="Field name"
                        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${inputSurfaceClass}`}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          name="season"
                          value={inputForm.season}
                          onChange={handleInputChange}
                          placeholder="Season"
                          className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${inputSurfaceClass}`}
                        />
                        <input
                          name="seasonYear"
                          value={inputForm.seasonYear}
                          onChange={handleInputChange}
                          placeholder="Year"
                          type="number"
                          className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${inputSurfaceClass}`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <select
                          name="resourceType"
                          value={inputForm.resourceType}
                          onChange={handleInputChange}
                          className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${inputSurfaceClass}`}
                        >
                          <option value="fertilizer">Fertilizer</option>
                          <option value="pesticide">Pesticide</option>
                          <option value="water">Water</option>
                          <option value="seed">Seed</option>
                        </select>
                        <select
                          name="unit"
                          value={inputForm.unit}
                          onChange={handleInputChange}
                          className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${inputSurfaceClass}`}
                        >
                          <option value="kg">kg</option>
                          <option value="liters">liters</option>
                          <option value="bags">bags</option>
                          <option value="m3">m3</option>
                        </select>
                      </div>

                      <input
                        name="quantity"
                        value={inputForm.quantity}
                        onChange={handleInputChange}
                        placeholder="Quantity"
                        type="number"
                        min="0"
                        step="0.1"
                        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${inputSurfaceClass}`}
                      />

                      <input
                        name="cost"
                        value={inputForm.cost}
                        onChange={handleInputChange}
                        placeholder="Cost (KSh)"
                        type="number"
                        min="0"
                        step="0.1"
                        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${inputSurfaceClass}`}
                      />

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-[#185fa5] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f76b6]"
                      >
                        Save input usage
                      </button>
                    </form>
                  </section>
                </div>
              ) : activeSection === "alerts" ? (
                <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <section className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${panelSurfaceClass}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className={`text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Alert Feed
                        </h2>
                        <p className={`text-sm ${mutedTextClass}`}>
                          Weather + crop context translated into actionable pest and disease warnings.
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${isDark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-600"}`}>
                        {pestAlerts.length} alerts
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {pestAlerts.map((alert) => (
                        <article
                          key={alert.id}
                          className={`rounded-2xl border px-4 py-4 ${sectionSurfaceClass}`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${alertMeta[alert.alertType]?.className || "bg-slate-100 text-slate-800"}`}>
                                {alertMeta[alert.alertType]?.label || alert.alertType}
                              </span>
                              <span className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${riskMeta[alert.riskLevel]?.className || "bg-slate-100 text-slate-800"}`}>
                                {riskMeta[alert.riskLevel]?.label || alert.riskLevel}
                              </span>
                            </div>
                            <span className={`text-xs ${softTextClass}`}>
                              Risk score {alert.riskScore}
                            </span>
                          </div>

                          <div className="mt-3">
                            <p className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                              {alert.title}
                            </p>
                            <p className={`mt-1 text-sm ${mutedTextClass}`}>
                              {alert.description}
                            </p>
                          </div>

                          <div className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs ${softTextClass}`}>
                            <span>{alert.fieldName}</span>
                            <span>{alert.cropName}</span>
                            <span>{alert.season}</span>
                            <span>Rain {alert.rainfallMm} mm</span>
                            <span>Humidity {alert.humidityPercent}%</span>
                            <span>{alert.temperatureC}°C</span>
                            <span>{alert.createdLabel}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className={`rounded-[24px] border p-5 ${sectionSurfaceClass}`}>
                    <h2 className={`text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                      Why It Matters
                    </h2>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className={`rounded-2xl border px-4 py-3 ${shellCardClass}`}>
                        <p className={`font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Rain + humidity = fungal risk
                        </p>
                        <p className={`mt-1 ${mutedTextClass}`}>
                          Wet weather and dense humidity are the fastest path to leaf and stem disease pressure.
                        </p>
                      </div>
                      <div className={`rounded-2xl border px-4 py-3 ${shellCardClass}`}>
                        <p className={`font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Crop type changes the warning
                        </p>
                        <p className={`mt-1 ${mutedTextClass}`}>
                          The same weather signal means different threats for maize, beans, and vegetables.
                        </p>
                      </div>
                      <div className={`rounded-2xl border px-4 py-3 ${shellCardClass}`}>
                        <p className={`font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Seasonal context sharpens urgency
                        </p>
                        <p className={`mt-1 ${mutedTextClass}`}>
                          Alerts are more useful when they know whether the farm is in a rainy or dry cycle.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              ) : activeSection === "records" ? (
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <section className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${panelSurfaceClass}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className={`text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Yield Records
                        </h2>
                        <p className={`text-sm ${mutedTextClass}`}>
                          Recent harvest and forecast data.
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${isDark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-600"}`}>
                        tons
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {yieldRows.map((row) => (
                        <div
                          key={row.period}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${sectionSurfaceClass}`}
                        >
                          <span className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>{row.period}</span>
                          <span className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className={`rounded-[24px] border p-5 ${sectionSurfaceClass}`}>
                    <h2 className={`text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                      Record Notes
                    </h2>
                    <div className={`mt-4 space-y-3 text-sm ${mutedTextClass}`}>
                      <p className={`rounded-2xl px-4 py-3 shadow-sm ${shellCardClass}`}>
                        The current season is tracking above the last-month baseline.
                      </p>
                      <p className={`rounded-2xl px-4 py-3 shadow-sm ${shellCardClass}`}>
                        Forecast yields are stronger than current yields, which suggests
                        positive farm performance.
                      </p>
                    </div>
                  </section>
                </div>
              ) : activeSection === "financial" ? (
                <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <section className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${panelSurfaceClass}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className={`text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Financial Summary
                        </h2>
                        <p className={`text-sm ${mutedTextClass}`}>
                          Decision-ready view of cost, revenue, and expected profit for the season.
                        </p>
                      </div>
                      <TrendingUp size={38} className="text-[#1d9e75]" />
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className={`rounded-2xl border px-4 py-4 ${sectionSurfaceClass}`}>
                        <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${softTextClass}`}>Cost / hectare</p>
                        <p className={`mt-2 text-2xl font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          KSh {financialSummary.costPerHectare.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                        <p className={`mt-1 text-sm ${mutedTextClass}`}>
                          Based on {financialSummary.totalHectares.toFixed(1)} hectares and logged input spend.
                        </p>
                      </div>
                      <div className={`rounded-2xl border px-4 py-4 ${sectionSurfaceClass}`}>
                        <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${softTextClass}`}>Estimated revenue</p>
                        <p className={`mt-2 text-2xl font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          KSh {financialSummary.estimatedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                        <p className={`mt-1 text-sm ${mutedTextClass}`}>
                          Predicted yield × local market price per ton.
                        </p>
                      </div>
                      <div className={`rounded-2xl border px-4 py-4 ${sectionSurfaceClass}`}>
                        <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${softTextClass}`}>Season profit</p>
                        <p className={`mt-2 text-2xl font-semibold ${financialSummary.seasonProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                          KSh {financialSummary.seasonProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                        <p className={`mt-1 text-sm ${mutedTextClass}`}>
                          Profit margin {Math.round(financialSummary.profitMargin * 100)}%.
                        </p>
                      </div>
                      <div className={`rounded-2xl border px-4 py-4 ${sectionSurfaceClass}`}>
                        <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${softTextClass}`}>Break-even yield</p>
                        <p className={`mt-2 text-2xl font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          {financialSummary.breakEvenYieldTons.toFixed(2)} tons
                        </p>
                        <p className={`mt-1 text-sm ${mutedTextClass}`}>
                          Required output to recover the season input bill.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 lg:grid-cols-2">
                      <div className={`rounded-2xl border px-4 py-4 ${shellCardClass}`}>
                        <p className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Crop price assumptions
                        </p>
                        <div className="mt-3 space-y-2">
                          {financialSummary.cropBreakdown.map((item) => (
                            <div key={item.cropType} className="flex items-center justify-between gap-3 text-sm">
                              <span className={mutedTextClass}>{item.cropType}</span>
                              <span className={`font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                                KSh {item.pricePerTon.toLocaleString(undefined, { maximumFractionDigits: 0 })}/ton
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={`rounded-2xl border px-4 py-4 ${shellCardClass}`}>
                        <p className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Input cost breakdown
                        </p>
                        <div className="mt-3 space-y-2">
                          {financialSummary.resourceCostBreakdown.length > 0 ? financialSummary.resourceCostBreakdown.map((item) => (
                            <div key={item.resourceType} className="flex items-center justify-between gap-3 text-sm">
                              <span className={mutedTextClass}>{item.resourceType}</span>
                              <span className={`font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                                KSh {item.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          )) : (
                            <p className={`text-sm ${mutedTextClass}`}>No input costs logged yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className={`rounded-[24px] border p-5 ${sectionSurfaceClass}`}>
                    <h2 className={`text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                      Why It Matters
                    </h2>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className={`rounded-2xl border px-4 py-3 ${shellCardClass}`}>
                        <p className={`font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Revenue vs cost drives action
                        </p>
                        <p className={`mt-1 ${mutedTextClass}`}>
                          Farmers can compare likely returns against input spend before committing to more fertilizer, seed, or water.
                        </p>
                      </div>
                      <div className={`rounded-2xl border px-4 py-3 ${shellCardClass}`}>
                        <p className={`font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Cost per hectare exposes inefficiency
                        </p>
                        <p className={`mt-1 ${mutedTextClass}`}>
                          This turns spending into a normalized farm metric, making it easier to compare fields or seasons.
                        </p>
                      </div>
                      <div className={`rounded-2xl border px-4 py-3 ${shellCardClass}`}>
                        <p className={`font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          Break-even yield is the decision line
                        </p>
                        <p className={`mt-1 ${mutedTextClass}`}>
                          If predicted yield is above break-even, the season is likely worth scaling; if not, the farm should reduce spend or adjust crop choices.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              ) : activeSection === "analytics" ? (
                <div className={`overflow-hidden rounded-[24px] border p-2 ${sectionSurfaceClass}`}>
                  <Analytics />
                </div>
              ) : activeSection === "profile" ? (
                <div className={`overflow-hidden rounded-[24px] border p-2 ${sectionSurfaceClass}`}>
                  <Profile />
                </div>
              ) : metrics ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {metricCards.map((card) => {
                      const Icon = card.icon;

                      return (
                        <article
                          key={card.label}
                          className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${isDark ? "border-[color:var(--surface-2)] bg-[var(--surface-2)] text-slate-100" : "border-slate-200 bg-white text-slate-900"}`}
                        >
                          <div className="flex flex-col gap-4">
                            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#eaf3de] text-[#1d9e75]">
                              <Icon size={20} />
                            </div>
                            <div>
                              <p className={`text-xs font-medium ${softTextClass}`}>
                                {card.label}
                              </p>
                              <div className="mt-2 flex items-end gap-2">
                                <span className={`text-[2rem] font-medium tracking-[-0.02em] ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                                  {card.value}
                                </span>
                                <span className={`pb-1 text-sm ${mutedTextClass}`}>
                                  {card.unit}
                                </span>
                              </div>
                              <span className="mt-3 inline-flex rounded-full bg-[#eaf3de] px-2.5 py-1 text-xs font-medium text-[#1d9e75]">
                                {card.note}
                              </span>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
                    <section className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${panelSurfaceClass}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className={`text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            Yield Trend
                          </h2>
                          <p className={`text-sm ${mutedTextClass}`}>
                            Seasonal progression across recent months.
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${isDark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-600"}`}>
                          tons
                        </span>
                      </div>

                      <div className={`mt-5 rounded-[22px] p-4 ${isDark ? "bg-[var(--surface-2)]" : "bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_100%)]"}`}>
                        <div className={`relative h-[240px] overflow-hidden rounded-[18px] border p-3 ${isDark ? "border-[color:var(--surface-1)] bg-[var(--surface-0)]" : "border-blue-100 bg-white"}`}>
                          <div className={`absolute inset-x-3 top-14 border-t border-dashed ${isDark ? "border-slate-700" : "border-slate-200"}`} />
                          <div className={`absolute inset-x-3 top-28 border-t border-dashed ${isDark ? "border-slate-700" : "border-slate-200"}`} />
                          <div className={`absolute inset-x-3 top-42 border-t border-dashed ${isDark ? "border-slate-700" : "border-slate-200"}`} />

                          <svg viewBox="0 0 400 140" className="relative h-[170px] w-full">
                            <defs>
                              <linearGradient id="yieldLine" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor="#185fa5" />
                                <stop offset="100%" stopColor="#185fa5" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M 12 104 C 42 96, 58 90, 82 86 S 124 69, 146 65 S 192 78, 220 62 S 264 40, 290 35 S 338 48, 388 24"
                              fill="none"
                              stroke="url(#yieldLine)"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                            <path
                              d="M 12 104 C 42 96, 58 90, 82 86 S 124 69, 146 65 S 192 78, 220 62 S 264 40, 290 35 S 338 48, 388 24 L 388 140 L 12 140 Z"
                              fill="url(#yieldLine)"
                              opacity="0.12"
                            />
                            {[12, 82, 146, 220, 290, 388].map((x, index) => (
                              <circle
                                key={x}
                                cx={x}
                                cy={[104, 86, 65, 62, 35, 24][index]}
                                r="4"
                                fill="#185fa5"
                              />
                            ))}
                            <text x="300" y="28" fill={isDark ? "#f8fafc" : "#0f172a"} fontSize="12">
                              {metrics.totalYield.toFixed(2)} tons
                            </text>
                          </svg>

                          <div className={`mt-[-8px] flex justify-between px-1 text-[0.72rem] ${softTextClass}`}>
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${panelSurfaceClass}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className={`text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            Farm Health
                          </h2>
                          <p className={`text-sm ${mutedTextClass}`}>
                            A quick view of current system conditions.
                          </p>
                        </div>
                        <div className="text-right">
                            <div className={`text-3xl font-semibold ${isDark ? "text-[#97c459]" : "text-[#1d9e75]"}`}>
                            {Math.round(healthScore)}
                          </div>
                          <p className={`text-xs font-medium uppercase tracking-[0.18em] ${softTextClass}`}>
                            {healthStatus}
                          </p>
                        </div>
                      </div>

                      <div className={`mt-5 rounded-[22px] p-4 ${isDark ? "bg-[var(--surface-2)]" : "bg-[#eff6ff]"}`}>
                        <div className={`flex items-center justify-between rounded-[18px] px-4 py-3 shadow-sm ${shellCardClass}`}>
                          <div>
                            <p className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                              Weather Overview
                            </p>
                            <p className={`text-sm ${mutedTextClass}`}>
                              Clear skies with good field conditions.
                            </p>
                          </div>
                          <CloudSunRain size={42} className="text-[#1d9e75]" />
                        </div>

                        <div className={`mt-4 grid gap-3 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                          <div className={`flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm ${shellCardClass}`}>
                            <span>Active crops</span>
                            <span className={`font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                              {metrics.activeCrops}
                            </span>
                          </div>
                          <div className={`flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm ${shellCardClass}`}>
                            <span>Rainfall</span>
                            <span className={`font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                              {metrics.rainfall} mm
                            </span>
                          </div>
                          <div className={`flex items-center justify-between rounded-2xl px-4 py-3 shadow-sm ${shellCardClass}`}>
                            <span>Predicted yield</span>
                            <span className={`font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                              {metrics.predictedYield.toFixed(2)} tons
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <h3 className={`text-sm font-semibold uppercase tracking-[0.18em] ${softTextClass}`}>
                          Recent recommendations
                        </h3>
                        <div className="mt-3 space-y-3">
                          {recommendations.slice(0, 3).map((item) => (
                            <article
                              key={item.id}
                              className={`rounded-2xl border px-4 py-3 ${sectionSurfaceClass}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                                    {item.title}
                                  </p>
                                  <p className={`mt-1 text-sm ${mutedTextClass}`}>
                                    {item.description}
                                  </p>
                                </div>
                                <span className="rounded-full bg-[#eaf3de] px-2.5 py-1 text-[0.7rem] font-medium text-slate-600 shadow-sm">
                                  {item.priority}
                                </span>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <section className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${panelSurfaceClass}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className={`text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            Soil Health
                          </h2>
                          <p className={`text-sm ${mutedTextClass}`}>
                            pH, moisture, and nutrient content are the most direct yield predictors.
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${isDark ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-600"}`}>
                          {soilHealth.status}
                        </span>
                      </div>

                      <div className={`mt-5 rounded-[22px] p-4 ${isDark ? "bg-[var(--surface-2)]" : "bg-[linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)]"}`}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className={`text-sm font-medium uppercase tracking-[0.18em] ${softTextClass}`}>
                              Sample location
                            </p>
                            <p className={`mt-1 text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                              {soilHealth.field}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium uppercase tracking-[0.18em] ${softTextClass}`}>
                              Last sample
                            </p>
                            <p className={`mt-1 text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                              {soilHealth.sampledAt}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          {soilSignals.map((signal) => (
                            <article
                              key={signal.label}
                              className={`rounded-2xl border px-4 py-3 shadow-sm ${shellCardClass}`}
                            >
                              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${softTextClass}`}>
                                {signal.label}
                              </p>
                              <p className={`mt-2 text-2xl font-semibold ${signal.color}`}>
                                {signal.value}
                              </p>
                              <p className={`mt-1 text-xs ${mutedTextClass}`}>
                                {signal.detail}
                              </p>
                            </article>
                          ))}
                        </div>
                      </div>
                    </section>

                    <section className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${panelSurfaceClass}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className={`text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            Soil Impact Notes
                          </h2>
                          <p className={`text-sm ${mutedTextClass}`}>
                            Soil condition breaks down the farm health score into readable parts.
                          </p>
                        </div>
                        <SunMedium size={40} className="text-[#1d9e75]" />
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className={`rounded-2xl border px-4 py-3 ${sectionSurfaceClass}`}>
                          <p className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            pH balance
                          </p>
                          <p className={`mt-1 text-sm ${mutedTextClass}`}>
                            Slightly acidic to neutral conditions support nutrient uptake.
                          </p>
                        </div>
                        <div className={`rounded-2xl border px-4 py-3 ${sectionSurfaceClass}`}>
                          <p className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            Moisture retention
                          </p>
                          <p className={`mt-1 text-sm ${mutedTextClass}`}>
                            Current soil moisture suggests stable irrigation performance.
                          </p>
                        </div>
                        <div className={`rounded-2xl border px-4 py-3 ${sectionSurfaceClass}`}>
                          <p className={`text-sm font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                            Nutrient content
                          </p>
                          <p className={`mt-1 text-sm ${mutedTextClass}`}>
                            Healthy nutrient content indicates lower fertilizer stress this cycle.
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
