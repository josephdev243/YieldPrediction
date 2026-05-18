import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
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
  const [role, setRole] = useState<"farmer" | "operator" | "admin">("farmer");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    // Validate inputs
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
      // Redirect to dashboard on success
      window.location.href = "/dashboard";
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">YPF</h1>
          <p className="text-gray-600">Yield Prediction & Farming</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Create Account
        </h2>

        {/* Error Messages */}
        {(error || validationError) && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error || validationError}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-black"
              placeholder="John Doe"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-black"
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Role
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "farmer" | "operator" | "admin")
                }
                className="w-full appearance-none bg-white px-4 py-2 pr-10 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-green-600"
                disabled={isLoading}
              >
                <option value="farmer" className="text-gray-900">
                  Farmer
                </option>
                <option value="operator" className="text-gray-900">
                  Operator
                </option>
                <option value="admin" className="text-gray-900">
                  Admin
                </option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-black"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-black"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-green-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
