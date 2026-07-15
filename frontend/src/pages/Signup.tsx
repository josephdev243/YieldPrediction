import React, { useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { validateEmail } from "../lib/utils";

/**
 * Signup Page Component
 */
export const Signup: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<"farmer" | "operator" | "extension_officer" | "admin">("farmer");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!name || !email || !password || !confirmPassword) {
      setValidationError("All fields are required");
      return;
    }

    if (name.length < 2) {
      setValidationError("Name must be at least 2 characters");
      return;
    }

    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    try {
      await register(email, password, name, role);
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
        <div className="grid w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] lg:grid-cols-[0.95fr_1fr]">
          <div className="hidden bg-[linear-gradient(180deg,var(--surface-1)_0%,var(--surface-0)_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(234,243,222,0.12)] px-3 py-1 text-xs font-medium text-[#97c459] ring-1 ring-white/10">
                Create your account
              </div>
              <h1 className="mt-6 max-w-md text-4xl font-medium tracking-[-0.03em] text-white">
                Join the farm operations workspace.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-blue-100/70">
                Keep yields, inputs, weather, and financial tracking in one place.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <h1 className="text-2xl font-medium tracking-[-0.03em] text-slate-900">YPF</h1>
                <p className="mt-1 text-sm text-slate-500">Yield Prediction & Farming</p>
              </div>

              <h2 className="text-base font-medium text-slate-900">Create account</h2>
              <p className="mt-1 text-sm text-slate-500">Use a business email and choose your role.</p>

              {(error || validationError) && (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error || validationError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={fieldClass}
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>

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
                  <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as "farmer" | "operator" | "extension_officer" | "admin")}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-[#e6f1fb] px-4 py-2.5 pr-10 text-slate-900 outline-none transition focus:border-[#185fa5]"
                      disabled={isLoading}
                    >
                      <option value="farmer" className="text-slate-900">Farmer</option>
                      <option value="operator" className="text-slate-900">Operator</option>
                      <option value="extension_officer" className="text-slate-900">Extension Officer</option>
                      <option value="admin" className="text-slate-900">Admin</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${fieldClass} pr-12`}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-[#185fa5] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f76b6] disabled:opacity-50"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </button>
              </form>

              <div className="mt-6 text-sm text-slate-500">
                Already have an account? <a href="/login" className="text-[#185fa5] hover:underline">Login here</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
