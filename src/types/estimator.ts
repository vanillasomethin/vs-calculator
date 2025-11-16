// Component quality options
export type ComponentOption = "none" | "standard" | "premium" | "luxury";

// Detailed component options for Residence/Villa projects
export type CementOption = "economy" | "economy-plus" | "premium";
export type SteelOption = "economy" | "economy-plus" | "premium";
export type BrickOption = "red-clay" | "fly-ash" | "aac-blocks";
export type FlooringOption = "vitrified-45" | "vitrified-60" | "vitrified-120" | "wooden" | "marble" | "none";
export type WindowOption = "aluminium-19mm" | "aluminium-25mm" | "upvc";
export type WindowSillOption = "marble" | "wooden" | "granite-80" | "granite-120" | "none";
export type WindowGrillOption = "basic-ms" | "designer-ms" | "none";
export type DoorOption = "hardwood-engineered-35mm" | "pine-flush-laminate-40mm" | "pine-flush-veneer-45mm" | "teak-flush-laminate-40mm";
export type StaircaseOption = "granite-standard" | "granite-80" | "granite-120" | "none";
export type ElectricalOption = "anchor-basic" | "anchor-havells" | "legrand-schneider";
export type BathroomFixtureOption = "economy" | "economy-plus" | "premium";
export type PaintingOption = "tractor-emulsion" | "premium-emulsion" | "washable-emulsion";
export type KitchenSinkOption = "single-bowl" | "single-bowl-drainer" | "double-bowl-drainer";
export type CountertopOption = "granite-150" | "galaxy-black-180" | "jet-black-250";
export type WaterTankOption = "2000ltr" | "4000ltr" | "6000ltr" | "none";
export type BooleanOption = "yes" | "no";

// Category breakdown for cost visualization
export interface CategoryBreakdown {
  construction: number;
  core: number;
  finishes: number;
  interiors: number;
}

// Detailed phase breakdown for cost
export interface PhaseBreakdown {
  planning: number;
  siteWorkFoundation: number;
  superstructure: number;
  mepRoughIns: number;
  interiorFinishes: number;
  exteriorFinalTouches: number;
}

// Timeline information with detailed phases
export interface Timeline {
  totalMonths: number;
  phases: {
    planning: number;
    siteWorkFoundation: number;
    superstructure: number;
    mepRoughIns: number;
    interiorFinishes: number;
    exteriorFinalTouches: number;
  };
}

// Individual phase item for detailed breakdown
export interface PhaseItem {
  name: string;
  cost: number;
  phase: string;
  startMonth?: number;
  endMonth?: number;
  duration?: number;
}

// Project subcategory types (now called "Type of Work")
export type ProjectSubcategory = "interiors" | "construction" | "landscape";

// Room configuration types for Residential projects
export type RoomConfiguration =
  | "1BHK"
  | "2BHK"
  | "3BHK"
  | "4BHK"
  | "5BHK+"
  | "Studio"
  | "Penthouse"
  | "Villa";

// Landscape area types
export type LandscapeArea =
  | "Front Yard"
  | "Back Yard"
  | "Terrace Garden"
  | "Rooftop Garden"
  | "Full Compound"
  | "Courtyard";

// Main project estimate interface
export interface ProjectEstimate {
  // Location
  state: string;
  city: string;

  // Project basics
  projectType: string;
  workTypes: ProjectSubcategory[]; // Multiple selection for type of work
  roomConfiguration?: RoomConfiguration; // For Residential projects
  landscapeAreas?: LandscapeArea[]; // For Landscape work
  area: number;
  areaUnit: "sqft" | "sqm";
  complexity: number;
  selectedMaterials: string[];

  // Legacy field for backward compatibility
  projectSubcategory?: ProjectSubcategory | "";
  
  // Core building components
  civilQuality: ComponentOption;
  plumbing: ComponentOption;
  electrical: ComponentOption;
  ac: ComponentOption;
  elevator: ComponentOption;
  
  // Finishes
  buildingEnvelope: ComponentOption;
  lighting: ComponentOption;
  windows: ComponentOption;
  ceiling: ComponentOption;
  surfaces: ComponentOption;
  
  // Interiors
  fixedFurniture: ComponentOption;
  looseFurniture: ComponentOption;
  furnishings: ComponentOption;
  appliances: ComponentOption;
  artefacts: ComponentOption;

  // Detailed Residential/Villa Components (optional - only for residential projects)
  cement?: CementOption;
  steel?: SteelOption;
  bricks?: BrickOption;
  flooringType?: FlooringOption;
  windowType?: WindowOption;
  windowSill?: WindowSillOption;
  windowGrill?: WindowGrillOption;
  doorType?: DoorOption;
  staircaseType?: StaircaseOption;
  electricalBrand?: ElectricalOption;
  bathroomFixtures?: BathroomFixtureOption;
  paintType?: PaintingOption;
  kitchenSink?: KitchenSinkOption;
  countertop?: CountertopOption;
  overheadTank?: WaterTankOption;
  undergroundTank?: WaterTankOption;
  modularKitchen?: BooleanOption;
  homeAutomation?: BooleanOption;

  // Calculated values
  totalCost: number;
  categoryBreakdown: CategoryBreakdown;
  phaseBreakdown: PhaseBreakdown;
  timeline: Timeline;
  detailedBreakdown?: PhaseItem[]; // Detailed itemized breakdown
  
  // Architect Fee related fields (optional)
  architectFee?: {
    baseFee: number;
    ffeFee: number;
    landscapeFee: number;
    vizFee: number;
    overheadAllocation: number;
    profit: number;
    tax: number;
    totalFee: number;
    currency: string;
  };
}

// For saved estimates
export interface SavedEstimate extends ProjectEstimate {
  id: string;
  savedAt: string;
}

// User form data
export interface UserFormData {
  name: string;
  email: string;
  phone?: string;
}
