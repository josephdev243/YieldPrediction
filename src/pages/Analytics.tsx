import React from "react";
import { useFarmer } from "../hooks/useFarmer";

/**
 * Analytics & Predictions Page Component
 */
export const Analytics: React.FC = () => {
  const { isLoading, error } = useFarmer();

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Analytics & Predictions
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Average Yield
          </h3>
          <p className="text-3xl font-bold text-green-600">2.45</p>
          <p className="text-gray-500 text-sm">tons per season</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Yield Trend
          </h3>
          <p className="text-3xl font-bold text-green-600">+12.5%</p>
          <p className="text-gray-500 text-sm">vs last season</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Predicted Yield
          </h3>
          <p className="text-3xl font-bold text-green-600">2.8</p>
          <p className="text-gray-500 text-sm">tons (next season)</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Yield Over Time */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Yield Over Time
          </h2>
          <div className="h-64 flex items-end justify-around gap-2">
            {[20, 35, 50, 65, 75, 100].map((height, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="bg-green-500 rounded-t"
                  style={{ height: `${height}%`, width: "100%" }}
                ></div>
                <span className="text-xs text-gray-600">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Crop Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Crop Distribution
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Maize</span>
                <span className="text-gray-600">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "35%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Beans</span>
                <span className="text-gray-600">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">Vegetables</span>
                <span className="text-gray-600">40%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Performance Insights
        </h2>
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-gray-800">
              Your predicted yield (2.8 tons) is higher than current yield. This
              indicates improving practices.
            </p>
          </div>
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-gray-800">
              Excellent farm health score. Continue current practices and
              monitor weather patterns.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <p className="text-gray-800">
              Low rainfall expected next month. Plan irrigation schedules in
              advance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
