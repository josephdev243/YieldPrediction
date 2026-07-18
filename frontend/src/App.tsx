import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Routes,
  Route,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { Navbar, Features, Footer } from "./components";
import { AuthProvider } from "./context/AuthContext";
import { AppFlowProvider, useAppFlowContext } from "./context/AppFlowContext";
import { ThemeProvider, useThemeContext } from "./context/ThemeContext";
import { AppLayout } from "./components/app/AppLayout";
import { buildReturnTo } from "./lib/appFlow";
import {
  AdminUsersPage,
  DashboardHomePage,
  FarmDashboardPage,
  FarmDetailPage,
  FarmsPage,
  FieldDetailPage,
  FieldsPage,
  HarvestPlantingPage,
  Home,
  InputAnalyticsPage,
  InputsPage,
  NewFarmPage,
  NewFieldPage,
  NewInputPage,
  NewPlantingPage,
  OnboardingPage,
  PestDetailPage,
  PestsPage,
  PlantingDetailPage,
  PlantingsPage,
  RecommendationsPage,
  SettingsPage,
  WeatherPage,
  YieldsAnalyticsPage,
  YieldsPage,
  HowItWorks,
  AboutUs,
  Pricing,
  Contact,
  Login,
  Signup,
  Analytics,
} from "./pages";
import { useAuthContext } from "./context/AuthContext";

function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading session...</div>;
  }

  if (!isAuthenticated) {
    const returnTo = buildReturnTo(location.pathname, location.search, location.hash);
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  return <Outlet />;
}

function RequireOnboarding() {
  const { onboardingCompleted } = useAppFlowContext();

  if (onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function RequireCompletedOnboarding() {
  const { onboardingCompleted } = useAppFlowContext();

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { onboardingCompleted } = useAppFlowContext();
  const [searchParams] = useSearchParams();

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  const returnTo = searchParams.get("returnTo");
  return <Navigate to={returnTo || "/dashboard"} replace />;
}

function AppShell() {
  const location = useLocation();
  const { isDark } = useThemeContext();
  const appShellPaths = [
    "/onboarding",
    "/dashboard",
    "/farms",
    "/fields",
    "/plantings",
    "/yields",
    "/weather",
    "/pests",
    "/inputs",
    "/recommendations",
    "/settings",
    "/admin/users",
  ];
  const showSiteChrome = !appShellPaths.some((path) => location.pathname.startsWith(path));

  return (
    <div
      className={`min-h-screen overflow-x-hidden flex flex-col transition-colors duration-300 ${
        isDark ? "bg-[#07111f] text-slate-100" : "bg-[#f5f7fb] text-slate-900"
      }`}
    >
      {showSiteChrome ? <Navbar /> : null}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route element={<RequireOnboarding />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>

            <Route element={<RequireCompletedOnboarding />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardHomePage />} />
                <Route path="/farms" element={<FarmsPage />} />
                <Route path="/farms/new" element={<NewFarmPage />} />
                <Route path="/farms/:id" element={<FarmDetailPage />} />
                <Route path="/farms/:id/dashboard" element={<FarmDashboardPage />} />
                <Route path="/fields" element={<FieldsPage />} />
                <Route path="/fields/new" element={<NewFieldPage />} />
                <Route path="/fields/:id" element={<FieldDetailPage />} />
                <Route path="/plantings" element={<PlantingsPage />} />
                <Route path="/plantings/new" element={<NewPlantingPage />} />
                <Route path="/plantings/:id" element={<PlantingDetailPage />} />
                <Route path="/plantings/:id/harvest" element={<HarvestPlantingPage />} />
                <Route path="/yields" element={<YieldsPage />} />
                <Route path="/yields/analytics" element={<YieldsAnalyticsPage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/pests" element={<PestsPage />} />
                <Route path="/pests/:id" element={<PestDetailPage />} />
                <Route path="/inputs" element={<InputsPage />} />
                <Route path="/inputs/new" element={<NewInputPage />} />
                <Route path="/inputs/analytics" element={<InputAnalyticsPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showSiteChrome ? <Footer /> : null}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppFlowProvider>
          <Router>
            <AppShell />
          </Router>
        </AppFlowProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
