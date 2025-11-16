import { ProjectEstimate } from "@/types/estimator";

interface DetailedCostBreakdownTableProps {
  estimate: ProjectEstimate;
}

interface PhaseDetail {
  phaseName: string;
  items: {
    name: string;
    cost: number;
  }[];
  totalCost: number;
  duration: number;
  startMonth: number;
  endMonth: number;
}

const DetailedCostBreakdownTable = ({ estimate }: DetailedCostBreakdownTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(value).replace('₹', '₹ ');
  };

  // Calculate cumulative months
  let cumulativeMonth = 1;
  const phases: PhaseDetail[] = [];

  // Phase 1: Planning & Design
  if (estimate.phaseBreakdown.planning > 0) {
    const duration = estimate.timeline.phases.planning;
    const startMonth = cumulativeMonth;
    const endMonth = startMonth + duration - 1;

    phases.push({
      phaseName: "Phase 1: Planning & Design",
      items: [
        { name: "Architectural Design", cost: estimate.phaseBreakdown.planning * 0.4 },
        { name: "Structural Design", cost: estimate.phaseBreakdown.planning * 0.25 },
        { name: "MEP Design", cost: estimate.phaseBreakdown.planning * 0.2 },
        { name: "Approvals & Permits", cost: estimate.phaseBreakdown.planning * 0.15 },
      ],
      totalCost: estimate.phaseBreakdown.planning,
      duration,
      startMonth,
      endMonth,
    });
    cumulativeMonth = endMonth + 1;
  }

  // Phase 2: Site Work & Foundation
  if (estimate.phaseBreakdown.siteWorkFoundation > 0) {
    const duration = estimate.timeline.phases.siteWorkFoundation;
    const startMonth = cumulativeMonth;
    const endMonth = startMonth + duration - 1;

    phases.push({
      phaseName: "Phase 2: Site Work & Foundation",
      items: [
        { name: "Excavation & Earthwork", cost: estimate.phaseBreakdown.siteWorkFoundation * 0.25 },
        { name: "Foundation (PCC & RCC)", cost: estimate.phaseBreakdown.siteWorkFoundation * 0.55 },
        { name: "Termite Treatment & Waterproofing", cost: estimate.phaseBreakdown.siteWorkFoundation * 0.20 },
      ],
      totalCost: estimate.phaseBreakdown.siteWorkFoundation,
      duration,
      startMonth,
      endMonth,
    });
    cumulativeMonth = endMonth + 1;
  }

  // Phase 3: Superstructure
  if (estimate.phaseBreakdown.superstructure > 0) {
    const duration = estimate.timeline.phases.superstructure;
    const startMonth = cumulativeMonth;
    const endMonth = startMonth + duration - 1;

    phases.push({
      phaseName: "Phase 3: Superstructure (Framing & Masonry)",
      items: [
        { name: "RCC Columns, Beams, Slabs", cost: estimate.phaseBreakdown.superstructure * 0.50 },
        { name: "Brickwork / Blockwork", cost: estimate.phaseBreakdown.superstructure * 0.35 },
        { name: "Lintels & Chajjas", cost: estimate.phaseBreakdown.superstructure * 0.15 },
      ],
      totalCost: estimate.phaseBreakdown.superstructure,
      duration,
      startMonth,
      endMonth,
    });
    cumulativeMonth = endMonth + 1;
  }

  // Phase 4: MEP & Rough-ins
  if (estimate.phaseBreakdown.mepRoughIns > 0) {
    const duration = estimate.timeline.phases.mepRoughIns;
    const startMonth = cumulativeMonth;
    const endMonth = startMonth + duration - 1;

    phases.push({
      phaseName: "Phase 4: MEP & Interior Rough-ins",
      items: [
        { name: "Electrical Conduiting & Wiring", cost: estimate.phaseBreakdown.mepRoughIns * 0.30 },
        { name: "Plumbing & Sanitary Pipes", cost: estimate.phaseBreakdown.mepRoughIns * 0.35 },
        { name: "HVAC Ducting", cost: estimate.phaseBreakdown.mepRoughIns * 0.15 },
        { name: "Internal Plastering", cost: estimate.phaseBreakdown.mepRoughIns * 0.20 },
      ],
      totalCost: estimate.phaseBreakdown.mepRoughIns,
      duration,
      startMonth,
      endMonth,
    });
    cumulativeMonth = endMonth + 1;
  }

  // Phase 5: Interior Finishes
  if (estimate.phaseBreakdown.interiorFinishes > 0) {
    const duration = estimate.timeline.phases.interiorFinishes;
    const startMonth = cumulativeMonth;
    const endMonth = startMonth + duration - 1;

    phases.push({
      phaseName: "Phase 5: Interior Finishes & Flooring",
      items: [
        { name: "Flooring (Tiles/Marble/Wood)", cost: estimate.phaseBreakdown.interiorFinishes * 0.30 },
        { name: "Doors & Windows Installation", cost: estimate.phaseBreakdown.interiorFinishes * 0.25 },
        { name: "False Ceiling & POP", cost: estimate.phaseBreakdown.interiorFinishes * 0.15 },
        { name: "Kitchen & Bathroom Fixtures", cost: estimate.phaseBreakdown.interiorFinishes * 0.20 },
        { name: "Built-in Furniture", cost: estimate.phaseBreakdown.interiorFinishes * 0.10 },
      ],
      totalCost: estimate.phaseBreakdown.interiorFinishes,
      duration,
      startMonth,
      endMonth,
    });
    cumulativeMonth = endMonth + 1;
  }

  // Phase 6: Exterior & Final Touches
  if (estimate.phaseBreakdown.exteriorFinalTouches > 0) {
    const duration = estimate.timeline.phases.exteriorFinalTouches;
    const startMonth = cumulativeMonth;
    const endMonth = startMonth + duration - 1;

    phases.push({
      phaseName: "Phase 6: Exterior & Final Touches",
      items: [
        { name: "Exterior Plastering & Painting", cost: estimate.phaseBreakdown.exteriorFinalTouches * 0.35 },
        { name: "Internal Painting & Polishing", cost: estimate.phaseBreakdown.exteriorFinalTouches * 0.30 },
        { name: "Staircase & Railings", cost: estimate.phaseBreakdown.exteriorFinalTouches * 0.15 },
        { name: "Landscaping & Compound Wall", cost: estimate.phaseBreakdown.exteriorFinalTouches * 0.12 },
        { name: "Final Site Cleanup", cost: estimate.phaseBreakdown.exteriorFinalTouches * 0.08 },
      ],
      totalCost: estimate.phaseBreakdown.exteriorFinalTouches,
      duration,
      startMonth,
      endMonth,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-vs-dark">Detailed Cost Breakdown</h3>
        <p className="text-xs text-gray-500">An itemized look at where your money goes in each phase</p>
      </div>

      {phases.map((phase, phaseIndex) => (
        <div key={phaseIndex} className="border border-red-200 rounded-lg overflow-hidden shadow-sm">
          {/* Phase Header */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 px-4 py-3 border-b border-red-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-red-900">{phase.phaseName}</h4>
              <div className="flex items-center gap-4">
                <span className="text-xs text-red-700">
                  Month {phase.startMonth}{phase.endMonth !== phase.startMonth ? ` - ${phase.endMonth}` : ''} ({phase.duration} {phase.duration === 1 ? 'month' : 'months'})
                </span>
                <span className="font-bold text-sm text-red-900">{formatCurrency(phase.totalCost)}</span>
              </div>
            </div>
          </div>

          {/* Phase Items */}
          <div className="bg-white">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold text-gray-700">Item</th>
                  <th className="text-right px-4 py-2 font-semibold text-gray-700">Estimated Cost</th>
                </tr>
              </thead>
              <tbody>
                {phase.items.map((item, itemIndex) => (
                  <tr
                    key={itemIndex}
                    className={`border-b border-gray-100 hover:bg-red-50/30 transition-colors ${
                      itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-4 py-2.5 text-gray-700">{item.name}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-gray-900">{formatCurrency(item.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Grand Total */}
      <div className="bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-300 rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-base text-red-900">GRAND TOTAL</h4>
            <p className="text-xs text-red-700 mt-0.5">
              {phases.length} phases • {estimate.timeline.totalMonths} months total duration
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-900">{formatCurrency(estimate.totalCost)}</p>
            <p className="text-xs text-red-700 mt-0.5">
              ₹{Math.round(estimate.totalCost / estimate.area).toLocaleString('en-IN')} per {estimate.areaUnit}
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
        <p className="text-xs text-amber-800">
          <span className="font-semibold">Note:</span> This is an indicative breakdown based on standard construction practices.
          Actual costs may vary based on site conditions, material availability, contractor rates, and specific project requirements.
          For a detailed itemized quote, please contact our team.
        </p>
      </div>
    </div>
  );
};

export default DetailedCostBreakdownTable;
