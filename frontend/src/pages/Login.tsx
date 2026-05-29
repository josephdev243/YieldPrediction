import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { validateEmail } from "../lib/utils";

/**
 * Login Page Component
 */
export const Login: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email || !password) {
      setValidationError("Email and password are required");
      return;
    }

    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email");
      return;
    }

    try {
      await login(email, password);
      window.location.href = "/dashboard";
    } catch {
      // Handled by the auth hook.
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-[#e6f1fb] px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#185fa5]";

  return (
    <div className="min-h-screen bg-[#eef4fb] px-4 py-10 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1120px] items-center justify-center">
        <div className="grid w-full gap-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] lg:grid-cols-[1fr_0.95fr]">
          <div className="relative hidden overflow-hidden bg-[linear-gradient(180deg,var(--surface-1)_0%,var(--surface-0)_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(24,95,165,0.24),transparent_28%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100 ring-1 ring-white/10">
                Yield Prediction & Farming
              </div>
              <h1 className="mt-6 max-w-md text-4xl font-medium tracking-[-0.03em] text-white">
                Sign in to your farm dashboard.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-blue-100/70">
                Monitor yield, weather, inputs, and farm health from one control surface.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <h1 className="text-2xl font-medium tracking-[-0.03em] text-slate-900">YPF</h1>
                <p className="mt-1 text-sm text-slate-500">Yield Prediction & Farming</p>
              </div>

              <div className="mb-6">
                <h2 className="text-base font-medium text-slate-900">Login</h2>
                <p className="mt-1 text-sm text-slate-500">Use your registered email and password.</p>
              </div>

              {(error || validationError) && (
                <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error || validationError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldClass}
                    placeholder="your@email.com"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${fieldClass} pr-12`}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-[#185fa5] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f76b6] disabled:opacity-50"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <span>
                  Don’t have an account? <Link to="/signup" className="text-[#185fa5] hover:underline">Sign up</Link>
                </span>
                <a href="/forgot-password" className="text-[#185fa5] hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
