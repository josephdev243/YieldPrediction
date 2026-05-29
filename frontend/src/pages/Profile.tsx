import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useFarmer } from "../hooks/useFarmer";

/**
 * Farmer Profile Page Component
 */
export const Profile: React.FC = () => {
  const { user } = useAuthContext();
  const { farmer, isLoading, error, fetchFarmer, updateFarmer } = useFarmer();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
  });

  useEffect(() => {
    if (user?.id && !farmer) {
      fetchFarmer(user.id);
    }
  }, [fetchFarmer, farmer, user?.id]);

  useEffect(() => {
    if (farmer) {
      setFormData({
        firstName: farmer.firstName || "",
        lastName: farmer.lastName || "",
        email: farmer.email || "",
        phone: farmer.phone || "",
        location: farmer.location || "",
      });
    }
  }, [farmer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setSuccessMessage(null);
      await updateFarmer(formData);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !farmer) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-medium text-slate-500">Loading profile...</p>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-xl border border-slate-200 bg-[#e6f1fb] px-4 py-2.5 text-slate-900 outline-none transition focus:border-[#185fa5]";

  return (
    <div className="mx-auto w-full max-w-5xl p-0 sm:p-2">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-medium tracking-[-0.03em] text-slate-900">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Edit your account and farmer details here.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="rounded-xl bg-[#185fa5] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2f76b6]"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        {user && (
          <div className="mb-6 rounded-[22px] border border-slate-200 bg-[#e6f1fb] p-5">
            <h2 className="mb-4 text-base font-medium text-slate-900">
              Account Information
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-900">Email:</span>{" "}
                {user.email}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-900">Role:</span>{" "}
                {user.role}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-900">Member since:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <div className="rounded-[22px] border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-medium text-slate-900">
              Farmer Information
            </h2>
            <span className="rounded-full bg-[#eaf3de] px-3 py-1 text-xs font-medium text-slate-600">
              {isEditing ? "Editing" : "View Mode"}
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    First Name
                  </label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={fieldClass} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Last Name
                  </label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={fieldClass} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={fieldClass} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={fieldClass} />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className={fieldClass} />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-[#185fa5] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f76b6] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : farmer ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#e6f1fb] p-4">
                <p className="text-xs font-medium text-slate-500">Name</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {farmer.firstName} {farmer.lastName}
                </p>
              </div>
              <div className="rounded-2xl bg-[#e6f1fb] p-4">
                <p className="text-xs font-medium text-slate-500">Email</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {farmer.email}
                </p>
              </div>
              <div className="rounded-2xl bg-[#e6f1fb] p-4">
                <p className="text-xs font-medium text-slate-500">Phone</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {farmer.phone}
                </p>
              </div>
              <div className="rounded-2xl bg-[#e6f1fb] p-4">
                <p className="text-xs font-medium text-slate-500">Location</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {farmer.location}
                </p>
              </div>
              <div className="rounded-2xl bg-[#e6f1fb] p-4 sm:col-span-2">
                <p className="text-xs font-medium text-slate-500">Total Land</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {farmer.totalLand} hectares
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No farmer profile found yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
