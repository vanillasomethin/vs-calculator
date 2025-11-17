import { ProjectEstimate, ComponentOption } from "@/types/estimator";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface ImprovedCostVisualizationProps {
  estimate: ProjectEstimate;
}

const ImprovedCostVisualization = ({ estimate }: ImprovedCostVisualizationProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  // Component pricing per sqm (same as in ResultsStep)
  const COMPONENT_PRICING_PER_SQM: Record<string, Record<ComponentOption, number>> = {
    civilQuality: { none: 0, standard: 1500, premium: 2300, luxury: 3800 },
    plumbing: { none: 0, standard: 500, premium: 1000, luxury: 2000 },
    electrical: { none: 0, standard: 450, premium: 850, luxury: 1650 },
    ac: { none: 0, standard: 650, premium: 1300, luxury: 2800 },
    elevator: { none: 0, standard: 1500, premium: 2300, luxury: 3800 },
    buildingEnvelope: { none: 0, standard: 400, premium: 800, luxury: 1600 },
    lighting: { none: 0, standard: 300, premium: 650, luxury: 1300 },
    windows: { none: 0, standard: 500, premium: 1000, luxury: 2000 },
    ceiling: { none: 0, standard: 300, premium: 600, luxury: 1200 },
    surfaces: { none: 0, standard: 550, premium: 1100, luxury: 2200 },
    fixedFurniture: { none: 0, standard: 900, premium: 1700, luxury: 3200 },
    looseFurniture: { none: 0, standard: 650, premium: 1300, luxury: 3000 },
    furnishings: { none: 0, standard: 200, premium: 450, luxury: 950 },
    appliances: { none: 0, standard: 400, premium: 800, luxury: 1800 },
    artefacts: { none: 0, standard: 150, premium: 400, luxury: 900 },
  };

  // Color palette for components (gradient from dark to light red/orange)
  const COMPONENT_COLORS = [
    '#8B0000', '#A52A2A', '#B22222', '#CD5C5C', '#DC143C',
    '#E9967A', '#F08080', '#FA8072', '#FFA07A', '#FF6347',
    '#FF7F50', '#FF8C00', '#FFA500', '#FFB347', '#FFCBA4'
  ];

  // Helper to check if component is included
  const isIncluded = (value: string | undefined): boolean => {
    return !!(value && value !== 'none' && value !== '');
  };

  // Calculate area in sqm
  const areaInSqM = estimate.areaUnit === "sqft" ? estimate.area * 0.092903 : estimate.area;

  // Build component data for visualization
  const componentList = [
    { key: 'civilQuality', name: 'Construction', level: estimate.civilQuality },
    { key: 'plumbing', name: 'Plumbing', level: estimate.plumbing },
    { key: 'electrical', name: 'Electrical', level: estimate.electrical },
    { key: 'ac', name: 'AC/HVAC', level: estimate.ac },
    { key: 'elevator', name: 'Elevator', level: estimate.elevator },
    { key: 'buildingEnvelope', name: 'Facade', level: estimate.buildingEnvelope },
    { key: 'lighting', name: 'Lighting', level: estimate.lighting },
    { key: 'windows', name: 'Windows', level: estimate.windows },
    { key: 'ceiling', name: 'Ceiling', level: estimate.ceiling },
    { key: 'surfaces', name: 'Surfaces', level: estimate.surfaces },
    { key: 'fixedFurniture', name: 'Fixed Furniture', level: estimate.fixedFurniture },
    { key: 'looseFurniture', name: 'Loose Furniture', level: estimate.looseFurniture },
    { key: 'furnishings', name: 'Furnishings', level: estimate.furnishings },
    { key: 'appliances', name: 'Appliances', level: estimate.appliances },
    { key: 'artefacts', name: 'Artefacts', level: estimate.artefacts },
  ];

  const categoryData = componentList
    .filter(item => isIncluded(item.level))
    .map((item, index) => {
      const perSqm = COMPONENT_PRICING_PER_SQM[item.key]?.[item.level] || 0;
      const totalCost = Math.round(perSqm * areaInSqM);
      return {
        name: item.name,
        value: totalCost,
        color: COMPONENT_COLORS[index % COMPONENT_COLORS.length]
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value); // Sort by cost descending

  const barData = categoryData.map(item => ({
    name: item.name,
    amount: item.value,
    fill: item.color
  }));

  return (
    <div className="w-full space-y-3">
      <h3 className="text-sm font-semibold text-vs-dark mb-2">Component Cost Breakdown</h3>
      
      {/* Donut Chart */}
      <div className="flex justify-center">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ fontSize: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-1.5 mb-3 max-h-24 overflow-y-auto">
        {categoryData.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[9px] text-vs-dark/70 truncate">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Horizontal Bar Chart */}
      <div className="w-full" style={{ height: Math.min(barData.length * 22 + 30, 200) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            layout="vertical"
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 8 }}
              tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 8 }}
              width={65}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ fontSize: 10 }}
            />
            <Bar dataKey="amount" barSize={14} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost Breakdown List */}
      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {categoryData.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-[10px] py-1 px-2 bg-vs/5 rounded">
            <span className="text-vs-dark/70">{item.name}</span>
            <span className="font-semibold text-vs">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImprovedCostVisualization;
