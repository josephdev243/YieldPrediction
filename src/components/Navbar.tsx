import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Menu, MoonStar, X, LogOut } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/features" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "About Us", to: "/about" },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact", to: "/contact" },
];

// Links only shown to authenticated users
const authLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Analytics", to: "/analytics" },
  { label: "Profile", to: "/profile" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthContext();

  // Combine nav links based on auth status
  const displayNavLinks = isAuthenticated
    ? [...navLinks, ...authLinks]
    : navLinks;

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="border-b border-white/10 bg-gradient-to-r from-[#0b3d2e]/95 via-[#14532d]/95 to-[#166534]/90 backdrop-blur-md shadow-[0_12px_35px_rgba(0,0,0,0.18)]">
        <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 lg:gap-5">
            <Leaf size={28} className="text-[#4ade80]" />
            <div className="leading-tight">
              <span className="block text-[1.05rem] font-bold tracking-[-0.02em] text-[#4ade80]">
                YPF
              </span>
              <span className="text-[0.65rem] text-[#d1d5db]">
                Yield Prediction & Farming
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10">
            {displayNavLinks.map((link) => {
              const active =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname === link.to;

              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={
                    active
                      ? "relative text-[#22c55e] text-sm lg:text-base font-medium whitespace-nowrap"
                      : "text-[#d1d5db] hover:text-[#4ade80] text-sm lg:text-base font-medium transition whitespace-nowrap"
                  }
                >
                  {link.label}
                  {active ? (
                    <span className="absolute left-0 -bottom-2 h-[2px] w-full rounded-full bg-[#22c55e]" />
                  ) : null}
                </Link>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-3 lg:gap-5">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full text-white/90 transition hover:bg-white/10"
              aria-label="Toggle theme"
            >
              <MoonStar size={18} />
            </button>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="hidden md:block rounded-xl border border-white/15 px-5 py-2.5 text-sm lg:text-base font-medium text-white transition hover:bg-white/10"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="hidden md:block rounded-xl bg-[#22c55e] px-5 py-2.5 text-sm lg:text-base font-semibold text-white shadow-[0_10px_25px_rgba(34,197,94,0.3)] transition hover:bg-[#4ade80]"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-[#d1d5db]">
                  Welcome, {user?.name || user?.email?.split("@")[0]}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}

            {/* Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/10 md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#0b3d2e] px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {displayNavLinks.map((link) => {
                const active =
                  link.to === "/"
                    ? location.pathname === "/"
                    : location.pathname === link.to;

                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={
                      active
                        ? "rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-[#4ade80]"
                        : "rounded-lg px-3 py-2 text-sm font-medium text-[#d1d5db] transition hover:bg-white/5 hover:text-[#4ade80]"
                    }
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="mt-2 flex gap-3 pt-2">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-xl bg-[#22c55e] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-[0_10px_25px_rgba(34,197,94,0.3)] transition hover:bg-[#4ade80]"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-[#d1d5db] py-2">
                      Welcome, {user?.name || user?.email?.split("@")[0]}
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
