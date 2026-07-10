import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SalaryMilestone } from "../types";
import { DollarSign, Award } from "lucide-react";

interface SalarySimulatorProps {
  timeline: SalaryMilestone[];
  trackTitle: string;
  selectedLanguage: "english" | "french";
  selectedCountry: string;
}

const CURRENCIES: Record<string, { code: string; symbol: string; rate: number }> = {
  "DRCongo": { code: "CDF", symbol: "FC", rate: 2800 },
  "Senegal": { code: "XOF", symbol: "FCFA", rate: 600 },
  "Ivory Coast": { code: "XOF", symbol: "FCFA", rate: 600 },
  "Gabon": { code: "XAF", symbol: "FCFA", rate: 600 },
  "Congo": { code: "XAF", symbol: "FCFA", rate: 600 },
  "France": { code: "EUR", symbol: "€", rate: 0.92 },
  "Canada": { code: "CAD", symbol: "C$", rate: 1.36 },
  "United States": { code: "USD", symbol: "$", rate: 1.0 },
};

export function SalarySimulator({ timeline, trackTitle, selectedLanguage, selectedCountry }: SalarySimulatorProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const isFrench = selectedLanguage === "french";

  const info = CURRENCIES[selectedCountry] || { code: "USD", symbol: "$", rate: 1.0 };

  // Helper to format currency in local style
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(isFrench ? "fr-FR" : "en-US", {
      style: "currency",
      currency: info.code,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const activeMilestone = timeline[activeIndex] || timeline[0];

  // Map data for Recharts chart using the converted salary
  const chartData = timeline.map((m, idx) => ({
    name: isFrench ? `An ${m.year}` : `Yr ${m.year}`,
    Salary: m.salary * info.rate,
    Role: m.role,
    isActive: idx === activeIndex,
  }));

  const activeSalaryConverted = (activeMilestone?.salary || 0) * info.rate;

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-400/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              {isFrench ? "Simulateur de Progression" : "Progression Simulator"}
            </span>
            <h3 className="text-lg font-bold font-display text-white mt-2">
              {isFrench ? "Trajectoire Salariale sur 10 Ans" : "10-Year Salary Trajectory"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFrench 
                ? `Estimez votre évolution de rémunération pour le poste : ${trackTitle}.`
                : `Select seniority milestones to simulate compensation growth for ${trackTitle}.`}
            </p>
          </div>
        </div>

        {/* Dynamic Highlight Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 rounded-xl p-4 border border-slate-800/60 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{isFrench ? "Salaire de Base Target" : "Target Base Salary"}</p>
              <h4 className="text-2xl font-black font-display text-gradient tracking-tight">
                {formatCurrency(activeSalaryConverted)}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-fuchsia-500/10 rounded-lg text-fuchsia-400 border border-fuchsia-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">
                {isFrench ? `Niveau Prévu (Année ${activeMilestone?.year})` : `Projected Role Level (Year ${activeMilestone?.year})`}
              </p>
              <h4 className="text-base font-bold font-display text-slate-200 truncate max-w-[180px]">
                {activeMilestone?.role}
              </h4>
            </div>
          </div>
        </div>

        {/* Interactive Milestone Slider */}
        <div className="mb-6">
          <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2 font-mono">
            <span>{isFrench ? "Début de Carrière (A1)" : "Career Entry (Y1)"}</span>
            <span>{isFrench ? "Milieu de Carrière (A5)" : "Mid-career (Y5)"}</span>
            <span>{isFrench ? "Expert / Dirigeant (A10)" : "Visionary (Y10)"}</span>
          </div>
          <input
            type="range"
            min="0"
            max={timeline.length - 1}
            value={activeIndex}
            onChange={(e) => setActiveIndex(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          {/* Milestone Labels Grid */}
          <div className="grid grid-cols-5 gap-1 mt-3">
            {timeline.map((m, idx) => (
              <button
                key={m.year}
                onClick={() => setActiveIndex(idx)}
                className={`text-center py-1.5 px-1 rounded-lg transition-all duration-200 border text-xs font-mono font-bold ${
                  idx === activeIndex
                    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/40 shadow-sm"
                    : "bg-slate-900/30 text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-300"
                }`}
              >
                {isFrench ? `An ${m.year}` : `Yr ${m.year}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-44 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #334155)" opacity={0.2} />
            <XAxis
              dataKey="name"
              stroke="var(--chart-text, #94a3b8)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--chart-text, #94a3b8)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                if (info.code === "XAF" || info.code === "XOF") {
                  return `${(v / 1000000).toFixed(0)}M`;
                }
                return `${info.symbol}${(v / 1000).toFixed(0)}k`;
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-left max-w-[200px]">
                      <p className="text-xs font-bold text-indigo-400">{data.name}</p>
                      <p className="text-sm font-semibold text-white mt-1">
                        {formatCurrency(payload[0].value as number)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{data.Role}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="Salary"
              stroke="#818cf8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSalary)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
