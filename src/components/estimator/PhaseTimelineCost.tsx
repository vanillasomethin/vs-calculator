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

  // Helper function to distribute months proportionally
  const distributeMonths = (totalMonths: number, percentages: number[]): number[] => {
    if (totalMonths === 0) return percentages.map(() => 0);

    // Calculate initial durations with floor to be conservative
    const durations = percentages.map(p => Math.floor(totalMonths * p));

    // Calculate remainder to distribute
    let remainder = totalMonths - durations.reduce((sum, d) => sum + d, 0);

    // Calculate fractional parts for smart distribution
    const fractionalParts = percentages.map((p, i) => ({
      index: i,
      fraction: (totalMonths * p) - durations[i]
    }));

    // Sort by fractional part (largest first) to distribute remainder fairly
    fractionalParts.sort((a, b) => b.fraction - a.fraction);

    // Distribute remainder to phases with largest fractional parts
    for (let i = 0; i < remainder; i++) {
      durations[fractionalParts[i].index]++;
    }

    // Ensure each phase has at least 1 month if total > 0
    if (totalMonths > 0) {
      for (let i = 0; i < durations.length; i++) {
        if (durations[i] === 0) {
          durations[i] = 1;
          // Take from the largest phase
          const maxIndex = durations.indexOf(Math.max(...durations.filter((_, idx) => idx !== i)));
          if (durations[maxIndex] > 1) {
            durations[maxIndex]--;
          }
        }
      }
    }

    return durations;
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

    // Define construction sub-phases with their percentages
    const constructionPhaseData = [
      { name: "Excavation & Earthwork", timePercent: 0.12, costPercent: 0.08, color: "#FFC0CB" },
      { name: "Foundation & Footing", timePercent: 0.18, costPercent: 0.20, color: "#FFB6C1" },
      { name: "Structural Work (RCC)", timePercent: 0.35, costPercent: 0.42, color: "#FFA07A" },
      { name: "Roof Slab & Walls", timePercent: 0.20, costPercent: 0.25, color: "#FA8072" },
      { name: "Plastering & Masonry", timePercent: 0.15, costPercent: 0.05, color: "#F08080" }
    ];

    // Distribute months properly to ensure they sum to constructionMonths
    const durations = distributeMonths(
      constructionMonths,
      constructionPhaseData.map(p => p.timePercent)
    );

    // Create phases with properly distributed durations
    constructionPhaseData.forEach((phaseData, index) => {
      const duration = durations[index];
      if (duration > 0) {
        phases.push({
          name: phaseData.name,
          duration: duration,
          cost: constructionCost * phaseData.costPercent,
          percentage: (constructionCost * phaseData.costPercent / estimate.totalCost) * 100,
          color: phaseData.color,
          startMonth: currentMonth,
          endMonth: currentMonth + duration - 1
        });
        currentMonth += duration;
      }
    });
  }

  // Interior & Finishing phases
  const interiorsMonths = estimate.timeline.phases.interiors;
  const interiorsCost = estimate.phaseBreakdown.interiors;

  // Define interiors sub-phases with their percentages
  const interiorsPhaseData = [
    { name: "Flooring & Tiling", timePercent: 0.25, costPercent: 0.20, color: "#E9967A" },
    { name: "MEP Installation", timePercent: 0.25, costPercent: 0.25, color: "#DC143C" },
    { name: "Carpentry & Fixtures", timePercent: 0.20, costPercent: 0.22, color: "#CD5C5C" },
    { name: "Doors & Windows", timePercent: 0.15, costPercent: 0.15, color: "#B22222" },
    { name: "Painting & Finishes", timePercent: 0.10, costPercent: 0.10, color: "#A52A2A" },
    { name: "Final Inspection & Handover", timePercent: 0.05, costPercent: 0.08, color: "#8B0000" }
  ];

  // Distribute months properly to ensure they sum to interiorsMonths
  const interiorDurations = distributeMonths(
    interiorsMonths,
    interiorsPhaseData.map(p => p.timePercent)
  );

  // Create phases with properly distributed durations
  interiorsPhaseData.forEach((phaseData, index) => {
    const duration = interiorDurations[index];
    if (duration > 0) {
      phases.push({
        name: phaseData.name,
        duration: duration,
        cost: interiorsCost * phaseData.costPercent,
        percentage: (interiorsCost * phaseData.costPercent / estimate.totalCost) * 100,
        color: phaseData.color,
        startMonth: currentMonth,
        endMonth: currentMonth + duration - 1
      });
      currentMonth += duration;
    }
  });

  const totalDuration = estimate.timeline.totalMonths;

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
