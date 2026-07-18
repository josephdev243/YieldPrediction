import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Leaf } from "lucide-react";
import { DashboardPreview } from "./DashboardPreview";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-28 sm:pb-18 sm:pt-32 lg:pt-36">
      <div className="absolute inset-0 -z-20 bg-[#020617]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_30%,rgba(74,222,128,0.32),transparent_28%),radial-gradient(circle_at_90%_15%,rgba(250,204,21,0.42),transparent_22%),linear-gradient(90deg,rgba(11,61,46,0.96)_0%,rgba(20,83,45,0.94)_38%,rgba(22,101,52,0.88)_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-55 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:100%_100%,100%_100%]" />
      <div className="absolute right-0 top-0 -z-10 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.38)_0%,rgba(250,204,21,0.16)_26%,rgba(250,204,21,0.04)_52%,transparent_70%)] blur-3xl" />
      <div className="absolute left-[-15%] top-[12%] -z-10 h-[560px] w-[760px] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.38)_0%,rgba(20,83,45,0.42)_34%,transparent_70%)] blur-3xl" />

      <div className="mx-auto max-w-[1152px] relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-[0.86fr_1.32fr] lg:gap-7">
          <div className="max-w-[450px] text-white lg:pt-2">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#14532d]/90 px-4 py-2 text-[0.92rem] font-medium text-white shadow-[0_10px_25px_rgba(0,0,0,0.18)] ring-1 ring-white/10">
              <Leaf size={18} className="text-[#4ade80]" />
              <span>Powering Sustainable Agriculture</span>
            </div>
            <h1 className="max-w-[430px] text-[3.15rem] font-medium leading-[0.94] tracking-[-0.03em] sm:text-[4rem] lg:text-[4.1rem]">
              Smart Farming
              <span className="block text-[#4ade80]">Starts Here</span>
            </h1>
            <p className="mt-6 max-w-[430px] text-[1.02rem] leading-8 text-[#d1d5db]">
              Empower your farming with data-driven insights. Track yields,
              monitor weather, and optimize your crops for maximum productivity.
            </p>
            <div className="mb-9 mt-7 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex w-fit items-center justify-center gap-3 rounded-lg bg-[#22c55e] px-8 py-4 text-[1rem] font-medium text-white shadow-[0_16px_30px_rgba(34,197,94,0.28)] transition hover:bg-[#4ade80]"
              >
                Get Started <ChevronRight size={20} />
              </Link>
              <button className="inline-flex w-fit items-center justify-center gap-3 rounded-lg border border-white/18 bg-transparent px-8 py-4 text-[1rem] font-medium text-white/95 transition hover:bg-white/10">
                Request Demo{" "}
                <span className="grid h-5 w-5 place-items-center rounded-full border border-white/70 text-[0.62rem]">
                  ▶
                </span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-yellow-400 text-lg font-medium shadow-sm">
                  👨
                </div>
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-pink-400 text-lg font-medium shadow-sm">
                  👩
                </div>
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-blue-400 text-lg font-medium shadow-sm">
                  👨
                </div>
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-orange-400 text-lg font-medium shadow-sm">
                  👨
                </div>
              </div>
              <div className="text-[0.9rem] leading-6 text-[#d1d5db]">
                <p>Trusted by 5,000+ farmers</p>
                <p>across the region</p>
              </div>
            </div>
          </div>

          <DashboardPreview />
        </div>
      </div>
    </section>
  );
};
