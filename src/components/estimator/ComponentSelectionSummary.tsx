import { ProjectEstimate, ComponentOption } from "@/types/estimator";

interface ComponentSelectionSummaryProps {
  estimate: ProjectEstimate;
}

interface SelectedComponent {
  category: string;
  name: string;
  selection: string;
  pricePerSqft?: number;
  phase: string;
}

const ComponentSelectionSummary = ({ estimate }: ComponentSelectionSummaryProps) => {
  const formatLevel = (level: ComponentOption | string | undefined): string => {
    if (!level || level === '' || level === 'none') return 'Not Required';
    return level
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Component pricing per sqft (from your existing COMPONENT_PRICING)
  const PRICING_PER_SQFT: Record<string, Record<string, number>> = {
    civilQuality: { none: 0, standard: 70, premium: 118, luxury: 215 },
    plumbing: { none: 0, standard: 48, premium: 91, luxury: 172 },
    electrical: { none: 0, standard: 43, premium: 80, luxury: 161 },
    ac: { none: 0, standard: 97, premium: 172, luxury: 323 },
    elevator: { none: 0, standard: 48, premium: 91, luxury: 194 },
    buildingEnvelope: { none: 0, standard: 38, premium: 75, luxury: 150 },
    lighting: { none: 0, standard: 32, premium: 70, luxury: 150 },
    windows: { none: 0, standard: 43, premium: 86, luxury: 183 },
    ceiling: { none: 0, standard: 30, premium: 59, luxury: 129 },
    surfaces: { none: 0, standard: 48, premium: 97, luxury: 215 },
    fixedFurniture: { none: 0, standard: 91, premium: 161, luxury: 301 },
    looseFurniture: { none: 0, standard: 59, premium: 118, luxury: 269 },
    furnishings: { none: 0, standard: 21, premium: 48, luxury: 107 },
    appliances: { none: 0, standard: 38, premium: 80, luxury: 194 },
    artefacts: { none: 0, standard: 16, premium: 43, luxury: 107 },
  };

  const components: SelectedComponent[] = [];

  // Helper to add component
  const addComponent = (
    category: string,
    name: string,
    selection: ComponentOption | string | undefined,
    priceKey: string,
    phase: string
  ) => {
    if (selection && selection !== '' && selection !== 'none') {
      const pricePerSqft = PRICING_PER_SQFT[priceKey]?.[selection];
      components.push({
        category,
        name,
        selection: formatLevel(selection),
        pricePerSqft,
        phase,
      });
    }
  };

  // Core Building Components (Phase 2 & 3)
  addComponent('Core', 'Quality of Construction', estimate.civilQuality, 'civilQuality', 'Superstructure');
  addComponent('Core', 'Plumbing & Sanitary', estimate.plumbing, 'plumbing', 'MEP Rough-ins');
  addComponent('Core', 'Electrical Systems', estimate.electrical, 'electrical', 'MEP Rough-ins');
  addComponent('Core', 'AC & HVAC', estimate.ac, 'ac', 'MEP Rough-ins');
  addComponent('Core', 'Elevator/Lift', estimate.elevator, 'elevator', 'Superstructure');

  // Finishes (Phase 4 & 5)
  addComponent('Finishes', 'Building Envelope', estimate.buildingEnvelope, 'buildingEnvelope', 'Exterior');
  addComponent('Finishes', 'Lighting Systems', estimate.lighting, 'lighting', 'Interior Finishes');
  addComponent('Finishes', 'Windows & Glazing', estimate.windows, 'windows', 'Interior Finishes');
  addComponent('Finishes', 'Ceiling Design', estimate.ceiling, 'ceiling', 'Interior Finishes');
  addComponent('Finishes', 'Wall & Floor Finishes', estimate.surfaces, 'surfaces', 'Interior Finishes');

  // Interiors (Phase 5)
  addComponent('Interiors', 'Fixed Furniture', estimate.fixedFurniture, 'fixedFurniture', 'Interior Finishes');
  addComponent('Interiors', 'Loose Furniture', estimate.looseFurniture, 'looseFurniture', 'Interior Finishes');
  addComponent('Interiors', 'Furnishings', estimate.furnishings, 'furnishings', 'Interior Finishes');
  addComponent('Interiors', 'Appliances', estimate.appliances, 'appliances', 'Interior Finishes');
  addComponent('Interiors', 'Artefacts & Art', estimate.artefacts, 'artefacts', 'Exterior');

  if (components.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">No components selected</p>
      </div>
    );
  }

  // Group by category
  const groupedComponents: Record<string, SelectedComponent[]> = {};
  components.forEach(comp => {
    if (!groupedComponents[comp.category]) {
      groupedComponents[comp.category] = [];
    }
    groupedComponents[comp.category].push(comp);
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value).replace('₹', '₹ ');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-vs-dark">Selected Components & Specifications</h3>
        <p className="text-xs text-gray-500">{components.length} components selected</p>
      </div>

      <div className="border border-red-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-xs">
          <thead className="bg-gradient-to-r from-red-50 to-red-100 border-b-2 border-red-200">
            <tr>
              <th className="text-left px-4 py-3 font-bold text-red-900">Component</th>
              <th className="text-left px-4 py-3 font-bold text-red-900">Selection</th>
              <th className="text-left px-4 py-3 font-bold text-red-900">Phase</th>
              <th className="text-right px-4 py-3 font-bold text-red-900">Price/Sqft</th>
              <th className="text-right px-4 py-3 font-bold text-red-900">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedComponents).map(([category, items], categoryIndex) => (
              <>
                <tr key={`category-${categoryIndex}`} className="bg-red-50/50 border-t border-red-200">
                  <td colSpan={5} className="px-4 py-2 font-bold text-xs text-red-800 uppercase tracking-wide">
                    {category}
                  </td>
                </tr>
                {items.map((component, itemIndex) => {
                  const totalCost = component.pricePerSqft ? component.pricePerSqft * estimate.area : 0;
                  return (
                    <tr
                      key={`${categoryIndex}-${itemIndex}`}
                      className={`border-b border-gray-100 hover:bg-red-50/30 transition-colors ${
                        itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="px-4 py-2.5 text-gray-700 font-medium">{component.name}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 text-red-800 text-xs font-medium">
                          {component.selection}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-600 text-xs">{component.phase}</td>
                      <td className="px-4 py-2.5 text-right text-gray-700 font-medium">
                        {component.pricePerSqft ? formatCurrency(component.pricePerSqft) : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-900 font-semibold">
                        {totalCost > 0 ? formatCurrency(totalCost) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-red-100 to-red-200 border border-red-300 rounded-lg p-4 shadow-sm mt-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-red-700 font-medium uppercase tracking-wide mb-1">Total Components</p>
            <p className="text-xl font-bold text-red-900">{components.length}</p>
          </div>
          <div>
            <p className="text-xs text-red-700 font-medium uppercase tracking-wide mb-1">Project Area</p>
            <p className="text-xl font-bold text-red-900">
              {estimate.area.toLocaleString('en-IN')} {estimate.areaUnit}
            </p>
          </div>
          <div>
            <p className="text-xs text-red-700 font-medium uppercase tracking-wide mb-1">Average Cost</p>
            <p className="text-xl font-bold text-red-900">
              {formatCurrency(Math.round(estimate.totalCost / estimate.area))}/<span className="text-sm">{estimate.areaUnit}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentSelectionSummary;
