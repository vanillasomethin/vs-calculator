import { ProjectEstimate } from "@/types/estimator";

interface PhaseTimelineCostProps {
  estimate: ProjectEstimate;
}

interface Phase {
  name: string;
  duration: number;
  cost: number;
  percentage: number;
  color: string;
  startMonth: number;
  endMonth: number;
}

const PhaseTimelineCost = ({ estimate }: PhaseTimelineCostProps) => {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value).replace('₹', '₹');
  };

  // Calculate proper timeline phases
  let currentMonth = 1;

  // Timeline phases with costs - using red hues theme
  const phases: Phase[] = [
    {
      name: "Home Design & Approval",
      duration: estimate.timeline.phases.planning,
      cost: estimate.phaseBreakdown.planning,
      percentage: (estimate.phaseBreakdown.planning / estimate.totalCost) * 100,
      color: "#8B0000", // Dark red
      startMonth: currentMonth,
      endMonth: currentMonth + estimate.timeline.phases.planning - 1
    },
    (() => {
      currentMonth += estimate.timeline.phases.planning;
      const duration = Math.max(1, Math.ceil(estimate.timeline.phases.construction * 0.1));
      const phase = {
        name: "Excavation",
        duration,
        cost: estimate.phaseBreakdown.construction * 0.05,
        percentage: (estimate.phaseBreakdown.construction * 0.05 / estimate.totalCost) * 100,
        color: "#B22222", // Firebrick
        startMonth: currentMonth,
        endMonth: currentMonth + duration - 1
      };
      currentMonth += duration;
      return phase;
    })(),
    (() => {
      const duration = Math.max(1, Math.ceil(estimate.timeline.phases.construction * 0.25));
      const phase = {
        name: "Footing & Foundation",
        duration,
        cost: estimate.categoryBreakdown.construction * 0.25,
        percentage: (estimate.categoryBreakdown.construction * 0.25 / estimate.totalCost) * 100,
        color: "#CD5C5C", // Indian red
        startMonth: currentMonth,
        endMonth: currentMonth + duration - 1
      };
      currentMonth += duration;
      return phase;
    })(),
    (() => {
      const duration = Math.max(1, Math.ceil(estimate.timeline.phases.construction * 0.25));
      const phase = {
        name: "RCC Work - Columns & Slabs",
        duration,
        cost: estimate.categoryBreakdown.construction * 0.40,
        percentage: (estimate.categoryBreakdown.construction * 0.40 / estimate.totalCost) * 100,
        color: "#DC143C", // Crimson
        startMonth: currentMonth,
        endMonth: currentMonth + duration - 1
      };
      currentMonth += duration;
      return phase;
    })(),
    (() => {
      const duration = Math.max(1, Math.ceil(estimate.timeline.phases.construction * 0.20));
      const phase = {
        name: "Roof Slab",
        duration,
        cost: estimate.categoryBreakdown.construction * 0.30,
        percentage: (estimate.categoryBreakdown.construction * 0.30 / estimate.totalCost) * 100,
        color: "#E9967A", // Dark salmon
        startMonth: currentMonth,
        endMonth: currentMonth + duration - 1
      };
      currentMonth += duration;
      return phase;
    })(),
    (() => {
      const duration = Math.max(1, Math.ceil(estimate.timeline.phases.construction * 0.15));
      const phase = {
        name: "Brickwork and Plastering",
        duration,
        cost: estimate.categoryBreakdown.finishes * 0.30,
        percentage: (estimate.categoryBreakdown.finishes * 0.30 / estimate.totalCost) * 100,
        color: "#F08080", // Light coral
        startMonth: currentMonth,
        endMonth: currentMonth + duration - 1
      };
      currentMonth += duration;
      return phase;
    })(),
    (() => {
      const duration = Math.max(1, Math.ceil(estimate.timeline.phases.interiors * 0.30));
      const phase = {
        name: "Flooring & Tiling",
        duration,
        cost: estimate.categoryBreakdown.finishes * 0.40,
        percentage: (estimate.categoryBreakdown.finishes * 0.40 / estimate.totalCost) * 100,
        color: "#FA8072", // Salmon
        startMonth: currentMonth,
        endMonth: currentMonth + duration - 1
      };
      currentMonth += duration;
      return phase;
    })(),
    (() => {
      const duration = Math.max(1, Math.ceil(estimate.timeline.phases.interiors * 0.25));
      const phase = {
        name: "Electric Wiring",
        duration,
        cost: estimate.categoryBreakdown.core * 0.35,
        percentage: (estimate.categoryBreakdown.core * 0.35 / estimate.totalCost) * 100,
        color: "#FFA07A", // Light salmon
        startMonth: currentMonth,
        endMonth: currentMonth + duration - 1
      };
      currentMonth += duration;
      return phase;
    })(),
    (() => {
      const duration = Math.max(1, Math.ceil(estimate.timeline.phases.interiors * 0.20));
      const phase = {
        name: "Water Supply & Plumbing",
        duration,
        cost: estimate.categoryBreakdown.core * 0.40,
        percentage: (estimate.categoryBreakdown.core * 0.40 / estimate.totalCost) * 100,
        color: "#FFB6C1", // Light pink
        startMonth: currentMonth,
        endMonth: currentMonth + duration - 1
      };
      currentMonth += duration;
      return phase;
    })(),
    (() => {
      const duration = Math.max(1, Math.ceil(estimate.timeline.phases.interiors * 0.25));
      const phase = {
        name: "Door & Windows",
        duration,
        cost: estimate.categoryBreakdown.finishes * 0.30,
        percentage: (estimate.categoryBreakdown.finishes * 0.30 / estimate.totalCost) * 100,
        color: "#FFC0CB", // Pink
        startMonth: currentMonth,
        endMonth: currentMonth + duration - 1
      };
      return phase;
    })(),
  ];

  const totalDuration = estimate.timeline.totalMonths;

  return (
    <div className="space-y-3">
      {/* Overall duration banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
        <p className="text-xs text-yellow-800">
          <span className="font-semibold">Overall duration:</span> {totalDuration} Months ({Math.round(totalDuration * 30)} Days)
        </p>
      </div>

      {/* Phase breakdown */}
      <div className="space-y-2">
        {phases.map((phase, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-700 font-medium">{phase.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">
                  {phase.duration} {phase.duration === 1 ? 'Month' : 'Months'}
                </span>
                <span className="text-vs font-semibold">{formatCurrency(phase.cost)}</span>
              </div>
            </div>
            
            {/* Timeline bar */}
            <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div 
                className="absolute top-0 h-full flex items-center px-2 text-white text-[10px] font-medium transition-all"
                style={{ 
                  backgroundColor: phase.color,
                  width: `${(phase.duration / totalDuration) * 100}%`,
                  left: `${((phase.startMonth - 1) / totalDuration) * 100}%`
                }}
              >
                <span className="truncate">
                  {phase.duration > 1 ? `${phase.duration} months` : '1 month'}
                </span>
              </div>
            </div>

            {/* Cost percentage */}
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Month {phase.startMonth} - {phase.endMonth}</span>
              <span>{phase.percentage.toFixed(1)}% of total</span>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline ruler */}
      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          {Array.from({ length: Math.min(totalDuration + 1, 13) }, (_, i) => (
            <span key={i}>M{i}</span>
          ))}
        </div>
        <div className="h-1 bg-gray-200 w-full rounded-full"></div>
      </div>

      {/* Detailed Cost & Timeline Table */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-vs-dark mb-3">Phase-wise Cost & Timeline Summary</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-vs/10">
                <th className="border border-vs/20 px-2 py-2 text-left font-semibold text-vs-dark">Phase</th>
                <th className="border border-vs/20 px-2 py-2 text-center font-semibold text-vs-dark">Duration</th>
                <th className="border border-vs/20 px-2 py-2 text-center font-semibold text-vs-dark">Timeline</th>
                <th className="border border-vs/20 px-2 py-2 text-right font-semibold text-vs-dark">Cost</th>
                <th className="border border-vs/20 px-2 py-2 text-center font-semibold text-vs-dark">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((phase, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-200 px-2 py-2 text-gray-800">{phase.name}</td>
                  <td className="border border-gray-200 px-2 py-2 text-center text-gray-700">
                    {phase.duration} {phase.duration === 1 ? 'month' : 'months'}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 text-center text-gray-600">
                    M{phase.startMonth}-M{phase.endMonth}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 text-right font-semibold text-vs">
                    {formatCurrency(phase.cost)}
                  </td>
                  <td className="border border-gray-200 px-2 py-2 text-center text-gray-600">
                    {phase.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="bg-vs/5 font-bold">
                <td className="border border-vs/30 px-2 py-2 text-vs-dark">Total</td>
                <td className="border border-vs/30 px-2 py-2 text-center text-vs-dark">
                  {totalDuration} months
                </td>
                <td className="border border-vs/30 px-2 py-2 text-center text-vs-dark">
                  M1-M{totalDuration}
                </td>
                <td className="border border-vs/30 px-2 py-2 text-right text-vs">
                  {formatCurrency(estimate.totalCost)}
                </td>
                <td className="border border-vs/30 px-2 py-2 text-center text-vs-dark">
                  100%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost distribution summary */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="bg-red-50 p-2 rounded-lg border border-red-100">
          <p className="text-[10px] text-red-700 mb-0.5">Construction Phase</p>
          <p className="text-sm font-bold text-red-900">
            {formatCurrency(estimate.phaseBreakdown.construction)}
          </p>
          <p className="text-[10px] text-red-600">
            {((estimate.phaseBreakdown.construction / estimate.totalCost) * 100).toFixed(0)}% of total
          </p>
        </div>

        <div className="bg-orange-50 p-2 rounded-lg border border-orange-100">
          <p className="text-[10px] text-orange-700 mb-0.5">Finishes & Interiors</p>
          <p className="text-sm font-bold text-orange-900">
            {formatCurrency(estimate.phaseBreakdown.interiors)}
          </p>
          <p className="text-[10px] text-orange-600">
            {((estimate.phaseBreakdown.interiors / estimate.totalCost) * 100).toFixed(0)}% of total
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhaseTimelineCost;
