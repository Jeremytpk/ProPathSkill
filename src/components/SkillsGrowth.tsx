import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SkillGrowth } from "../types";
import { TrendingUp } from "lucide-react";

interface SkillsGrowthProps {
  skills: SkillGrowth[];
  trackTitle: string;
  selectedLanguage?: "english" | "french";
}

export function SkillsGrowth({ skills, trackTitle, selectedLanguage = "english" }: SkillsGrowthProps) {
  const isFrench = selectedLanguage === "french";
  const currentLevelLabel = isFrench ? "Niveau Actuel" : "Current Level";
  const projectionLabel = isFrench ? "Projection sur 5 Ans" : "5-Year Projection";

  // Setup data format for Recharts
  const data = skills.map((s) => ({
    name: s.name,
    [currentLevelLabel]: s.current,
    [projectionLabel]: s.predicted,
    growth: s.predicted - s.current,
  }));

  const avgGrowth = Math.round(skills.reduce((acc, s) => acc + (s.predicted - s.current), 0) / skills.length);

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-400/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              {isFrench ? "Prévision de Croissance des Compétences" : "Competency Growth Forecast"}
            </span>
            <h3 className="text-lg font-bold font-display text-white mt-2">
              {isFrench ? "Maturité Prévue des Compétences" : "Predicted Skills Maturity"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFrench 
                ? "Visualisation comparative du niveau d'aptitude actuel par rapport à la trajectoire d'expert à 5 ans."
                : "Comparative visualization of current aptitude baseline versus 5-year expert trajectory."}
            </p>
          </div>
        </div>

        {/* Visual Callout */}
        <div className="flex items-center gap-3 bg-slate-900/40 rounded-xl p-3 border border-slate-800/60 mb-6 text-xs text-slate-300">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-white">
              {isFrench ? "Croissance Cumulative des Compétences :" : "Compound Skills Accrual:"}
            </span>{" "}
            {isFrench ? (
              <>
                Vos compétences clés pour le poste <span className="text-indigo-300 font-medium">{trackTitle}</span> devraient progresser en moyenne de <span className="text-gradient font-extrabold font-mono">+{avgGrowth}%</span> sur 60 mois de placement professionnel de haut niveau.
              </>
            ) : (
              <>
                Core proficiencies in <span className="text-indigo-300 font-medium">{trackTitle}</span> are forecasted to mature by an average of <span className="text-gradient font-extrabold font-mono">+{avgGrowth}%</span> over 60 months of high-impact industry placement.
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-64 w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #334155)" opacity={0.2} />
            <XAxis
              dataKey="name"
              stroke="var(--chart-text, #94a3b8)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={(props) => {
                const { x, y, payload } = props;
                // Truncate labels if too long
                const label = payload.value.length > 15 ? `${payload.value.substring(0, 13)}...` : payload.value;
                return (
                  <text x={x} y={y + 12} fill="var(--chart-text, #94a3b8)" fontSize={9} textAnchor="middle" className="font-mono font-semibold">
                    {label}
                  </text>
                );
              }}
            />
            <YAxis
              stroke="var(--chart-text, #94a3b8)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-left max-w-[220px]">
                      <p className="text-xs font-bold text-white mb-2">{item.name}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">{isFrench ? "Base Actuelle :" : "Current Base:"}</span>
                          <span className="text-indigo-400 font-bold font-mono">{item[currentLevelLabel]}%</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-fuchsia-400 font-medium">{isFrench ? "Cible 5 Ans :" : "5-Yr Target:"}</span>
                          <span className="text-fuchsia-300 font-bold font-mono">{item[projectionLabel]}%</span>
                        </div>
                        <div className="border-t border-slate-800 pt-1 mt-1 flex justify-between gap-4 text-[10px] text-indigo-400 font-bold">
                          <span>{isFrench ? "Delta Prévu :" : "Projected Delta:"}</span>
                          <span>+{item.growth}% {isFrench ? "Expansion" : "Expansion"}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, color: "#94a3b8", paddingTop: 10 }}
            />
            <Bar
              dataKey={currentLevelLabel}
              fill="#6366F1"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
            <Bar
              dataKey={projectionLabel}
              fill="#A855F7"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
