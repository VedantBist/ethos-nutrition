import React, { useState } from "react";
import {
  HISTORY_ENTRIES_7_DAYS,
  HISTORY_ENTRIES_30_DAYS,
} from "../data/initialData";
import { UserProfile, ActiveTab } from "../types";

interface VitalsHistoryViewProps {
  userProfile: UserProfile;
  setActiveTab: (tab: ActiveTab) => void;
}

export const HistoryView: React.FC<VitalsHistoryViewProps> = ({
  userProfile,
  setActiveTab,
}) => {
  const [timeframe, setTimeframe] = useState<"7" | "30" | "90">("7");
  const [hoveredPoint, setHoveredPoint] = useState<{
    day: string;
    date: string;
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);

  const data =
    timeframe === "7" ? HISTORY_ENTRIES_7_DAYS : HISTORY_ENTRIES_30_DAYS;

  const avgKcal = Math.round(
    data.reduce((s, d) => s + d.kcal, 0) / data.length,
  );
  const avgPro = Math.round(
    data.reduce((s, d) => s + d.protein, 0) / data.length,
  );
  const avgCarbs = Math.round(
    data.reduce((s, d) => s + d.carbs, 0) / data.length,
  );
  const avgFat = Math.round(data.reduce((s, d) => s + d.fat, 0) / data.length);

  // SVG Chart Calculations
  const chartHeight = 240;
  const chartWidth = 800;
  const minKcal = 1600;
  const maxKcal = 2400;

  const points = data.map((d, index) => {
    const x = (index / (data.length - 1)) * (chartWidth - 80) + 40;
    const normalizedY = 1 - (d.kcal - minKcal) / (maxKcal - minKcal);
    const y = Math.max(
      30,
      Math.min(chartHeight - 30, normalizedY * (chartHeight - 60) + 30),
    );
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  // Target line Y
  const targetNormY =
    1 - (userProfile.targetKcal - minKcal) / (maxKcal - minKcal);
  const targetY = Math.max(
    30,
    Math.min(chartHeight - 30, targetNormY * (chartHeight - 60) + 30),
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-12 animate-fade-in">
      {/* Header Section */}
      <header className="border-b border-[#444748]/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="font-label-caps text-xs text-[#bacbbc] uppercase tracking-widest block mb-2">
            Nutrition Analytics
          </span>
          <h2 className="font-display-lg text-3xl md:text-5xl text-[#e5e2e1] mb-2 font-light">
            NUTRITION HISTORY
          </h2>
          <p className="font-body-lg text-[#c4c7c7] max-w-2xl font-light">
            Review long-term caloric intake and macronutrient trends over time.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex space-x-6 border-b border-[#444748]/30 pb-1">
          <button
            onClick={() => setTimeframe("7")}
            className={`font-label-caps text-xs tracking-widest pb-1 transition-all ${
              timeframe === "7"
                ? "text-[#e5e2e1] border-b-2 border-[#bacbbc] font-bold"
                : "text-[#c4c7c7] hover:text-[#e5e2e1]"
            }`}
          >
            7 DAYS
          </button>
          <button
            onClick={() => setTimeframe("30")}
            className={`font-label-caps text-xs tracking-widest pb-1 transition-all ${
              timeframe === "30"
                ? "text-[#e5e2e1] border-b-2 border-[#bacbbc] font-bold"
                : "text-[#c4c7c7] hover:text-[#e5e2e1]"
            }`}
          >
            30 DAYS
          </button>
          <button
            onClick={() => setTimeframe("90")}
            className={`font-label-caps text-xs tracking-widest pb-1 transition-all ${
              timeframe === "90"
                ? "text-[#e5e2e1] border-b-2 border-[#bacbbc] font-bold"
                : "text-[#c4c7c7] hover:text-[#e5e2e1]"
            }`}
          >
            90 DAYS
          </button>
        </div>
      </header>

      {/* Summary Banner */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#191818] border border-[#444748]/30 p-5 rounded-xl">
        <div>
          <span className="font-label-caps text-[11px] text-[#8e9191] uppercase tracking-wider">
            Average Energy
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-data-highlight text-3xl text-[#e5e2e1]">
              {avgKcal.toLocaleString("en-US")}
            </span>
            <span className="text-[13px] text-[#c4c7c7]">kcal / day</span>
          </div>
        </div>

        <div>
          <span className="font-label-caps text-[11px] text-[#8e9191] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bacbbc]" /> Avg
            Protein
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-data-highlight text-2xl text-[#e5e2e1]">
              {avgPro}g
            </span>
            <span className="text-[13px] text-[#c4c7c7]">/ day</span>
          </div>
        </div>

        <div>
          <span className="font-label-caps text-[11px] text-[#8e9191] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E8E77]" /> Avg Carbs
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-data-highlight text-2xl text-[#e5e2e1]">
              {avgCarbs}g
            </span>
            <span className="text-[13px] text-[#c4c7c7]">/ day</span>
          </div>
        </div>

        <div>
          <span className="font-label-caps text-[11px] text-[#8e9191] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8e9192]" /> Avg Fats
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-data-highlight text-2xl text-[#e5e2e1]">
              {avgFat}g
            </span>
            <span className="text-[13px] text-[#c4c7c7]">/ day</span>
          </div>
        </div>
      </section>

      {/* SVG Chart Visualization */}
      <section className="border border-[#444748]/30 bg-[#191818] p-6 rounded-xl relative">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-label-caps text-[11px] text-[#8e9191] uppercase tracking-wider">
            Caloric Intake Trendline
          </h3>
          <div className="flex items-center gap-6 text-[11px] font-label-caps">
            <span className="flex items-center gap-1.5 text-[#e5e2e1]">
              <span className="w-2.5 h-0.5 bg-[#c8c6c5]" /> Ingested
            </span>
            <span className="flex items-center gap-1.5 text-[#bacbbc]">
              <span className="w-2.5 h-0.5 border-t border-dashed border-[#bacbbc]" />{" "}
              Target ({userProfile.targetKcal} kcal)
            </span>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="w-full h-[280px] relative">
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            {/* Horizontal Grid lines */}
            <line
              x1="40"
              y1="50"
              x2={chartWidth - 40}
              y2="50"
              stroke="rgba(229, 226, 225, 0.05)"
              strokeWidth="1"
            />
            <line
              x1="40"
              y1="120"
              x2={chartWidth - 40}
              y2="120"
              stroke="rgba(229, 226, 225, 0.05)"
              strokeWidth="1"
            />
            <line
              x1="40"
              y1="190"
              x2={chartWidth - 40}
              y2="190"
              stroke="rgba(229, 226, 225, 0.05)"
              strokeWidth="1"
            />

            {/* Target Line */}
            <line
              x1="40"
              y1={targetY}
              x2={chartWidth - 40}
              y2={targetY}
              stroke="#bacbbc"
              strokeDasharray="4 4"
              strokeWidth="1.5"
              opacity="0.8"
            />

            {/* Data Line Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#c8c6c5"
              strokeWidth="2"
              className="transition-all duration-500"
            />

            {/* Data Points */}
            {points.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.date === pt.date ? 6 : 4}
                className="fill-[#c8c6c5] hover:fill-[#bacbbc] cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </svg>

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[#bacbbc]/50 px-4 py-2 rounded-lg shadow-2xl flex items-center gap-4 animate-fade-in pointer-events-none">
              <div>
                <span className="font-label-caps text-[10px] text-[#bacbbc] uppercase">
                  {hoveredPoint.date} ({hoveredPoint.day})
                </span>
                <p className="font-headline-sm text-base text-[#e5e2e1] font-medium">
                  {hoveredPoint.kcal} kcal
                </p>
              </div>
              <div className="text-[10px] font-label-caps text-[#c4c7c7] border-l border-[#444748]/30 pl-3">
                <p>{hoveredPoint.protein}g Protein</p>
                <p>{hoveredPoint.carbs}g Carbs</p>
                <p>{hoveredPoint.fat}g Fat</p>
              </div>
            </div>
          )}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between text-[#c4c7c7] font-label-caps text-[10px] uppercase tracking-widest mt-4 px-4">
          {data.slice(0, 10).map((d, i) => (
            <span key={i}>{d.day}</span>
          ))}
        </div>
      </section>

      {/* Adherence & Consistency Insights */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#1a1a1a]/60 border border-[#444748]/20 rounded-xl">
          <h4 className="font-headline-sm text-xl text-[#e5e2e1] mb-2">
            Macro Calibration Ratio
          </h4>
          <p className="font-body-md text-xs text-[#c4c7c7] font-light mb-6">
            Proportional split of ingested macro energy across the active
            timeframe.
          </p>

          <div className="w-full h-3 rounded-full bg-[#201f1f] flex overflow-hidden mb-4">
            <div
              style={{ width: "25%" }}
              className="bg-[#bacbbc]"
              title="Protein (25%)"
            />
            <div
              style={{ width: "50%" }}
              className="bg-[#9E8E77]"
              title="Carbohydrates (50%)"
            />
            <div
              style={{ width: "25%" }}
              className="bg-[#8e9192]"
              title="Fats (25%)"
            />
          </div>

          <div className="flex justify-between text-xs font-label-caps text-[#c4c7c7]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#bacbbc]" /> 25% Protein
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#9E8E77]" /> 50% Carbs
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#8e9192]" /> 25% Fat
            </span>
          </div>
        </div>

        <div className="p-6 bg-[#1a1a1a]/60 border border-[#444748]/20 rounded-xl flex flex-col justify-between">
          <div>
            <h4 className="font-headline-sm text-xl text-[#e5e2e1] mb-2">
              Goal Adherence Index
            </h4>
            <p className="font-body-md text-xs text-[#c4c7c7] font-light mb-4">
              93.4% of logged days maintained within ±10% of prescribed caloric
              target.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("profile")}
            className="w-fit font-label-caps text-xs text-[#bacbbc] hover:text-[#e5e2e1] uppercase tracking-widest border-b border-[#bacbbc]/40 pb-1"
          >
            Adjust Target Nutrition →
          </button>
        </div>
      </section>
    </div>
  );
};

export const VitalsHistoryView = HistoryView;
