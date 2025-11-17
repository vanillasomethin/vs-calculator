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

  // Check if this is an interior-only project
  const isInteriorOnly = estimate.workTypes?.includes("interiors") &&
                         !estimate.workTypes?.includes("construction");
  const hasConstruction = estimate.workTypes?.includes("construction");

  // Calculate proper timeline phases
  let currentMonth = 1;
  const phases: Phase[] = [];

  // Planning/Design phase - always present
  phases.push({
    name: "Design & Approvals",
    duration: estimate.timeline.phases.planning,
    cost: estimate.phaseBreakdown.planning,
    percentage: (estimate.phaseBreakdown.planning / estimate.totalCost) * 100,
    color: "#FFE4E1", // Lightest red/misty rose - start of gradient
    startMonth: currentMonth,
    endMonth: currentMonth + estimate.timeline.phases.planning - 1
  });
  currentMonth += estimate.timeline.phases.planning;

  // Construction phases - only if project includes construction
  if (hasConstruction) {
    const constructionMonths = estimate.timeline.phases.construction;
    const constructionCost = estimate.phaseBreakdown.construction;

    // Excavation & Earthwork
    const excavationDuration = Math.max(1, Math.ceil(constructionMonths * 0.12));
    phases.push({
      name: "Excavation & Earthwork",
      duration: excavationDuration,
      cost: constructionCost * 0.08,
      percentage: (constructionCost * 0.08 / estimate.totalCost) * 100,
      color: "#FFC0CB", // Light pink
      startMonth: currentMonth,
      endMonth: currentMonth + excavationDuration - 1
    });
    currentMonth += excavationDuration;

    // Foundation
    const foundationDuration = Math.max(1, Math.ceil(constructionMonths * 0.18));
    phases.push({
      name: "Foundation & Footing",
      duration: foundationDuration,
      cost: constructionCost * 0.20,
      percentage: (constructionCost * 0.20 / estimate.totalCost) * 100,
      color: "#FFB6C1", // Light pink (slightly darker)
      startMonth: currentMonth,
      endMonth: currentMonth + foundationDuration - 1
    });
    currentMonth += foundationDuration;

    // Structural Work
    const structuralDuration = Math.max(1, Math.ceil(constructionMonths * 0.35));
    phases.push({
      name: "Structural Work (RCC)",
      duration: structuralDuration,
      cost: constructionCost * 0.42,
      percentage: (constructionCost * 0.42 / estimate.totalCost) * 100,
      color: "#FFA07A", // Light salmon
      startMonth: currentMonth,
      endMonth: currentMonth + structuralDuration - 1
    });
    currentMonth += structuralDuration;

    // Roof & Walls
    const roofDuration = Math.max(1, Math.ceil(constructionMonths * 0.20));
    phases.push({
      name: "Roof Slab & Walls",
      duration: roofDuration,
      cost: constructionCost * 0.25,
      percentage: (constructionCost * 0.25 / estimate.totalCost) * 100,
      color: "#FA8072", // Salmon
      startMonth: currentMonth,
      endMonth: currentMonth + roofDuration - 1
    });
    currentMonth += roofDuration;

    // Plastering
    const plasterDuration = Math.max(1, Math.ceil(constructionMonths * 0.15));
    phases.push({
      name: "Plastering & Masonry",
      duration: plasterDuration,
      cost: constructionCost * 0.05,
      percentage: (constructionCost * 0.05 / estimate.totalCost) * 100,
      color: "#F08080", // Light coral
      startMonth: currentMonth,
      endMonth: currentMonth + plasterDuration - 1
    });
    currentMonth += plasterDuration;
  }

  // Interior & Finishing phases
  const interiorsMonths = estimate.timeline.phases.interiors;
  const interiorsCost = estimate.phaseBreakdown.interiors;

  // Flooring & Tiling
  const flooringDuration = Math.max(1, Math.ceil(interiorsMonths * 0.25));
  phases.push({
    name: "Flooring & Tiling",
    duration: flooringDuration,
    cost: interiorsCost * 0.20,
    percentage: (interiorsCost * 0.20 / estimate.totalCost) * 100,
    color: "#E9967A", // Dark salmon
    startMonth: currentMonth,
    endMonth: currentMonth + flooringDuration - 1
  });
  currentMonth += flooringDuration;

  // MEP (Mechanical, Electrical, Plumbing)
  const mepDuration = Math.max(1, Math.ceil(interiorsMonths * 0.25));
  phases.push({
    name: "MEP Installation",
    duration: mepDuration,
    cost: interiorsCost * 0.25,
    percentage: (interiorsCost * 0.25 / estimate.totalCost) * 100,
    color: "#DC143C", // Crimson
    startMonth: currentMonth,
    endMonth: currentMonth + mepDuration - 1
  });
  currentMonth += mepDuration;

  // Carpentry & Fixtures
  const carpentryDuration = Math.max(1, Math.ceil(interiorsMonths * 0.20));
  phases.push({
    name: "Carpentry & Fixtures",
    duration: carpentryDuration,
    cost: interiorsCost * 0.22,
    percentage: (interiorsCost * 0.22 / estimate.totalCost) * 100,
    color: "#CD5C5C", // Indian red
    startMonth: currentMonth,
    endMonth: currentMonth + carpentryDuration - 1
  });
  currentMonth += carpentryDuration;

  // Doors & Windows
  const doorsWindowsDuration = Math.max(1, Math.ceil(interiorsMonths * 0.15));
  phases.push({
    name: "Doors & Windows",
    duration: doorsWindowsDuration,
    cost: interiorsCost * 0.15,
    percentage: (interiorsCost * 0.15 / estimate.totalCost) * 100,
    color: "#B22222", // Firebrick
    startMonth: currentMonth,
    endMonth: currentMonth + doorsWindowsDuration - 1
  });
  currentMonth += doorsWindowsDuration;

  // Painting & Finishes
  const paintingDuration = Math.max(1, Math.ceil(interiorsMonths * 0.10));
  phases.push({
    name: "Painting & Finishes",
    duration: paintingDuration,
    cost: interiorsCost * 0.10,
    percentage: (interiorsCost * 0.10 / estimate.totalCost) * 100,
    color: "#A52A2A", // Brown-red
    startMonth: currentMonth,
    endMonth: currentMonth + paintingDuration - 1
  });
  currentMonth += paintingDuration;

  // Final Handover - calculate remaining time to match total timeline
  const totalDuration = estimate.timeline.totalMonths;
  const handoverDuration = Math.max(1, totalDuration - currentMonth + 1);
  phases.push({
    name: "Final Inspection & Handover",
    duration: handoverDuration,
    cost: interiorsCost * 0.08,
    percentage: (interiorsCost * 0.08 / estimate.totalCost) * 100,
    color: "#8B0000", // Dark red - end of gradient
    startMonth: currentMonth,
    endMonth: totalDuration
  });

  return (
    <div className="space-y-3">
      {/* Overall duration banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
        <p className="text-xs text-yellow-800">
          <span className="font-semibold">Overall duration:</span> {totalDuration} Months ({Math.round(totalDuration * 30)} Days)
        </p>
        {isInteriorOnly && (
          <p className="text-[10px] text-yellow-700 mt-1">
            Interior-only project (no construction work)
          </p>
        )}
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
          {Array.from({ length: Math.min(totalDuration, 12) }, (_, i) => (
            <span key={i}>M{i + 1}</span>
          ))}
          {totalDuration > 12 && <span>M{totalDuration}</span>}
        </div>
        <div className="h-1 bg-gray-200 w-full rounded-full"></div>
      </div>

      {/* Cost distribution summary */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {hasConstruction && (
          <div className="bg-red-50 p-2 rounded-lg border border-red-100">
            <p className="text-[10px] text-red-700 mb-0.5">Construction Phase</p>
            <p className="text-sm font-bold text-red-900">
              {formatCurrency(estimate.phaseBreakdown.construction)}
            </p>
            <p className="text-[10px] text-red-600">
              {((estimate.phaseBreakdown.construction / estimate.totalCost) * 100).toFixed(0)}% of total
            </p>
          </div>
        )}

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
