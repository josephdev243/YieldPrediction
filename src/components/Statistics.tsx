import React from "react";
import { Users, Leaf as LeafIcon, TrendingUp, Droplets } from "lucide-react";

export const Statistics: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-green-900 to-green-800 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users size={32} className="text-green-300" />
            </div>
            <div className="text-4xl font-bold mb-2">5,000+</div>
            <div className="text-green-100 font-semibold">Active Farmers</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <LeafIcon size={32} className="text-green-300" />
            </div>
            <div className="text-4xl font-bold mb-2">15,000+</div>
            <div className="text-green-100 font-semibold">
              Hectares Monitored
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp size={32} className="text-green-300" />
            </div>
            <div className="text-4xl font-bold mb-2">25%</div>
            <div className="text-green-100 font-semibold">
              Average Yield Increase
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Droplets size={32} className="text-green-300" />
            </div>
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-green-100 font-semibold">
              Satisfaction Rate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
