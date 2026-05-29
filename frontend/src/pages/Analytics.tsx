import React from "react";
import { useFarmer } from "../hooks/useFarmer";

/**
 * Analytics & Predictions Page Component
 */
export const Analytics: React.FC = () => {
  const { isLoading, error } = useFarmer();

  if (isLoading) {
    return <div className="py-8 text-center text-sm font-medium text-slate-500">Loading analytics...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-8 text-slate-900">
      <h1 className="mb-8 text-2xl font-medium tracking-[-0.03em] text-slate-900">
        Analytics & Predictions
      </h1>

      {error && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {[
          { label: "Average Yield", value: "2.45", note: "tons per season" },
          { label: "Yield Trend", value: "+12.5%", note: "vs last season" },
          { label: "Predicted Yield", value: "2.8", note: "tons (next season)" },
        ].map((card) => (
          <div key={card.label} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-medium tracking-[-0.02em] text-[#1d9e75]">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <h2 className="mb-4 text-base font-medium text-slate-900">Yield Over Time</h2>
          <div className="flex h-64 items-end justify-around gap-2">
            {[20, 35, 50, 65, 75, 100].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t bg-[#185fa5]" style={{ height: `${height}%` }} />
                <span className="text-xs text-slate-500">{["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <h2 className="mb-4 text-base font-medium text-slate-900">Crop Distribution</h2>
          <div className="space-y-4">
            {[
              ["Maize", "35%"],
              ["Beans", "25%"],
              ["Vegetables", "40%"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-700">{label}</span>
                  <span className="text-slate-500">{value}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-[#1d9e75]" style={{ width: value }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <h2 className="mb-4 text-base font-medium text-slate-900">Performance Insights</h2>
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#e6f1fb] bg-[#e6f1fb] px-4 py-3">
            <p className="text-sm text-slate-700">
              Your predicted yield (2.8 tons) is higher than current yield. This indicates improving practices.
            </p>
          </div>
          <div className="rounded-2xl border border-[#eaf3de] bg-[#eaf3de] px-4 py-3">
            <p className="text-sm text-slate-700">
              Excellent farm health score. Continue current practices and monitor weather patterns.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-sm text-slate-700">
              Low rainfall expected next month. Plan irrigation schedules in advance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
