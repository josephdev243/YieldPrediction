import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Features, Footer } from "./components";
import { AuthProvider } from "./context/AuthContext";
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#061b0e] text-white overflow-x-hidden flex flex-col">
          <Navbar />
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
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
