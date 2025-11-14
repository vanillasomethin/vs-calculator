// types/estimator.ts

export type ComponentOption = 'none' | 'standard' | 'premium' | 'luxury';

export type ProjectType = 
  | 'interior-only' 
  | 'core-shell' 
  | 'full-project' 
  | 'full-landscape' 
  | 'renovation';

export type BuildingType = 'residential' | 'commercial' | 'mixed-use';

export interface ProjectEstimate {
  // Location
  state: string;
  city: string;
  
  // Project Details
  projectType: ProjectType;
  buildingType: BuildingType;
  area: number;
  areaUnit: 'sqft' | 'sqm';
  complexity: number;
  selectedMaterials: string[];
  
  // Components
  civilQuality: ComponentOption;
  plumbing: ComponentOption;
  electrical: ComponentOption;
  ac: ComponentOption;
  elevator: ComponentOption;
  buildingEnvelope: ComponentOption;
  lighting: ComponentOption;
  windows: ComponentOption;
  ceiling: ComponentOption;
  surfaces: ComponentOption;
  fixedFurniture: ComponentOption;
  looseFurniture: ComponentOption;
  furnishings: ComponentOption;
  appliances: ComponentOption;
  artefacts: ComponentOption;
  landscape: ComponentOption;
  
  // Calculated Values
  totalCost: number;
  componentCosts: Record<string, number>;
  categoryBreakdown: {
    construction: number;
    core: number;
    finishes: number;
    interiors: number;
    landscape: number;
  };
  phaseBreakdown: {
    planning: number;
    construction: number;
    interiors: number;
  };
  timeline: {
    totalMonths: number;
    phases: {
      planning: number;
      construction: number;
      interiors: number;
    };
  };
}

export interface ComponentInfo {
  name: string;
  key: string;
  category: 'construction' | 'core' | 'finishes' | 'interiors' | 'landscape';
  description: string;
  icon?: string;
}

export const COMPONENT_INFO: ComponentInfo[] = [
  {
    name: 'Civil Quality',
    key: 'civilQuality',
    category: 'construction',
    description: 'Foundation, structure, and basic construction quality',
  },
  {
    name: 'Plumbing',
    key: 'plumbing',
    category: 'core',
    description: 'Water supply, drainage, and sanitary systems',
  },
  {
    name: 'Electrical',
    key: 'electrical',
    category: 'core',
    description: 'Wiring, switches, outlets, and electrical panels',
  },
  {
    name: 'Air Conditioning',
    key: 'ac',
    category: 'core',
    description: 'HVAC systems and climate control',
  },
  {
    name: 'Elevator',
    key: 'elevator',
    category: 'core',
    description: 'Lift installation and shaft construction',
  },
  {
    name: 'Building Envelope',
    key: 'buildingEnvelope',
    category: 'finishes',
    description: 'Exterior walls, facade, and weather protection',
  },
  {
    name: 'Lighting',
    key: 'lighting',
    category: 'finishes',
    description: 'Light fixtures, ambient and task lighting',
  },
  {
    name: 'Windows & Doors',
    key: 'windows',
    category: 'finishes',
    description: 'Window frames, glazing, and door systems',
  },
  {
    name: 'Ceiling',
    key: 'ceiling',
    category: 'finishes',
    description: 'False ceiling, gypsum work, and cove lighting',
  },
  {
    name: 'Surfaces',
    key: 'surfaces',
    category: 'finishes',
    description: 'Flooring, wall finishes, and countertops',
  },
  {
    name: 'Fixed Furniture',
    key: 'fixedFurniture',
    category: 'interiors',
    description: 'Built-in wardrobes, kitchen cabinets, and storage',
  },
  {
    name: 'Loose Furniture',
    key: 'looseFurniture',
    category: 'interiors',
    description: 'Movable furniture like sofas, beds, and dining sets',
  },
  {
    name: 'Furnishings',
    key: 'furnishings',
    category: 'interiors',
    description: 'Curtains, blinds, cushions, and soft furnishings',
  },
  {
    name: 'Appliances',
    key: 'appliances',
    category: 'interiors',
    description: 'Kitchen and home appliances',
  },
  {
    name: 'Artefacts & Decor',
    key: 'artefacts',
    category: 'interiors',
    description: 'Decorative items, artwork, and accessories',
  },
  {
    name: 'Landscape',
    key: 'landscape',
    category: 'landscape',
    description: 'Outdoor spaces, gardens, and hardscaping',
  },
];
