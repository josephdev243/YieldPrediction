import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Navbar, Features, Footer } from "./components";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useThemeContext } from "./context/ThemeContext";
import {
  Home,
  HowItWorks,
  AboutUs,
  Pricing,
  Contact,
  Dashboard,
  Login,
  Signup,
  Profile,
  Analytics,
} from "./pages";

function AppShell() {
  const location = useLocation();
  const { isDark } = useThemeContext();
  const isDashboardRoute = location.pathname === "/dashboard";
  const isDashboardSubroute = location.pathname.startsWith("/dashboard/");
  const showSiteChrome = !(isDashboardRoute || isDashboardSubroute);

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
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
        <Router>
          <AppShell />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
