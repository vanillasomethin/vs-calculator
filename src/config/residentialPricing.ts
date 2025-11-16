import type {
  CementOption,
  SteelOption,
  BrickOption,
  FlooringOption,
  WindowOption,
  WindowSillOption,
  WindowGrillOption,
  DoorOption,
  StaircaseOption,
  ElectricalOption,
  BathroomFixtureOption,
  PaintingOption,
  KitchenSinkOption,
  CountertopOption,
  WaterTankOption,
  BooleanOption,
} from "@/types/estimator";

// All pricing is per square foot (INR)

export interface ComponentPricing {
  label: string;
  pricePerSqft?: number;
  fixedPrice?: number; // For items not dependent on area
  description: string;
}

export const CEMENT_PRICING: Record<CementOption, ComponentPricing> = {
  "economy": {
    label: "Economy",
    pricePerSqft: 8,
    description: "Standard OPC 43 grade cement",
  },
  "economy-plus": {
    label: "Economy Plus",
    pricePerSqft: 12,
    description: "OPC 53 grade cement with better strength",
  },
  "premium": {
    label: "Premium",
    pricePerSqft: 18,
    description: "PPC cement with superior quality and durability",
  },
};

export const STEEL_PRICING: Record<SteelOption, ComponentPricing> = {
  "economy": {
    label: "Economy",
    pricePerSqft: 45,
    description: "Fe 415 grade TMT bars",
  },
  "economy-plus": {
    label: "Economy Plus",
    pricePerSqft: 52,
    description: "Fe 500 grade TMT bars",
  },
  "premium": {
    label: "Premium",
    pricePerSqft: 65,
    description: "Fe 550 grade corrosion-resistant TMT bars",
  },
};

export const BRICK_PRICING: Record<BrickOption, ComponentPricing> = {
  "red-clay": {
    label: "Red Clay Bricks",
    pricePerSqft: 28,
    description: "Traditional clay bricks - durable and economical",
  },
  "fly-ash": {
    label: "Fly Ash Bricks",
    pricePerSqft: 32,
    description: "Eco-friendly lightweight bricks with good insulation",
  },
  "aac-blocks": {
    label: "AAC Blocks",
    pricePerSqft: 42,
    description: "Autoclaved Aerated Concrete - lightweight, energy-efficient",
  },
};

export const FLOORING_PRICING: Record<FlooringOption, ComponentPricing> = {
  "vitrified-45": {
    label: "Vitrified Tiles",
    pricePerSqft: 45,
    description: "Standard 600x600mm vitrified tiles",
  },
  "vitrified-60": {
    label: "Vitrified Tiles Premium",
    pricePerSqft: 60,
    description: "800x800mm designer vitrified tiles",
  },
  "vitrified-120": {
    label: "Vitrified Tiles Luxury",
    pricePerSqft: 120,
    description: "Large format 1200x1200mm imported tiles",
  },
  "wooden": {
    label: "Wooden Flooring",
    pricePerSqft: 180,
    description: "Engineered wood/laminate flooring",
  },
  "marble": {
    label: "Marble Flooring",
    pricePerSqft: 250,
    description: "Premium Italian/Indian marble",
  },
  "none": {
    label: "Not Required",
    pricePerSqft: 0,
    description: "Skip flooring",
  },
};

export const WINDOW_PRICING: Record<WindowOption, ComponentPricing> = {
  "aluminium-19mm": {
    label: "Aluminium 19mm",
    pricePerSqft: 80,
    description: "Standard aluminium sliding windows",
  },
  "aluminium-25mm": {
    label: "Aluminium 25mm",
    pricePerSqft: 120,
    description: "Heavy duty aluminium casement windows",
  },
  "upvc": {
    label: "uPVC Windows",
    pricePerSqft: 180,
    description: "Energy-efficient uPVC windows with double glazing",
  },
};

export const WINDOW_SILL_PRICING: Record<WindowSillOption, ComponentPricing> = {
  "marble": {
    label: "Marble Sill",
    pricePerSqft: 150,
    description: "Marble window sills",
  },
  "wooden": {
    label: "Wooden Window Sill",
    pricePerSqft: 120,
    description: "Engineered wood sills",
  },
  "granite-80": {
    label: "Granite",
    pricePerSqft: 80,
    description: "Standard granite window sills",
  },
  "granite-120": {
    label: "Granite Premium",
    pricePerSqft: 120,
    description: "Premium black granite sills",
  },
  "none": {
    label: "Not Required",
    pricePerSqft: 0,
    description: "Skip window sills",
  },
};

export const WINDOW_GRILL_PRICING: Record<WindowGrillOption, ComponentPricing> = {
  "basic-ms": {
    label: "Basic MS Grill",
    pricePerSqft: 45,
    description: "Standard mild steel safety grills",
  },
  "designer-ms": {
    label: "Designer MS Grill",
    pricePerSqft: 85,
    description: "Decorative designer grills with coating",
  },
  "none": {
    label: "Not Required",
    pricePerSqft: 0,
    description: "Skip window grills",
  },
};

export const DOOR_PRICING: Record<DoorOption, ComponentPricing> = {
  "hardwood-engineered-35mm": {
    label: "Hardwood Frame & Engineered Door 35mm",
    pricePerSqft: 280,
    description: "Hardwood frame with engineered wood shutters",
  },
  "pine-flush-laminate-40mm": {
    label: "Pine Frame & Flush Door Laminate 40mm",
    pricePerSqft: 320,
    description: "Pine wood frame with laminate finish flush doors",
  },
  "pine-flush-veneer-45mm": {
    label: "Pine Frame & Flush Door Veneer 45mm",
    pricePerSqft: 420,
    description: "Pine wood frame with natural veneer finish",
  },
  "teak-flush-laminate-40mm": {
    label: "Teak Frame & Flush Door Laminate 40mm",
    pricePerSqft: 550,
    description: "Premium teak wood frame with laminate finish",
  },
};

export const STAIRCASE_PRICING: Record<StaircaseOption, ComponentPricing> = {
  "granite-standard": {
    label: "Granite Standard",
    pricePerSqft: 120,
    description: "Standard granite staircase",
  },
  "granite-80": {
    label: "Granite",
    pricePerSqft: 80,
    description: "Economy granite staircase",
  },
  "granite-120": {
    label: "Granite Premium",
    pricePerSqft: 120,
    description: "Premium black/imported granite",
  },
  "none": {
    label: "Not Required",
    pricePerSqft: 0,
    description: "Skip staircase (single floor)",
  },
};

export const ELECTRICAL_PRICING: Record<ElectricalOption, ComponentPricing> = {
  "anchor-basic": {
    label: "Anchor (Basic Series)",
    pricePerSqft: 18,
    description: "Anchor Roma/Penta basic switches & sockets",
  },
  "anchor-havells": {
    label: "Anchor/Havells Premium",
    pricePerSqft: 28,
    description: "Anchor Curve/Havells Crabtree premium range",
  },
  "legrand-schneider": {
    label: "Legrand/Schneider",
    pricePerSqft: 45,
    description: "Imported Legrand Arteor/Schneider switches",
  },
};

export const BATHROOM_FIXTURE_PRICING: Record<BathroomFixtureOption, ComponentPricing> = {
  "economy": {
    label: "Economy",
    pricePerSqft: 85,
    description: "Parryware/Cera basic range sanitary ware",
  },
  "economy-plus": {
    label: "Economy Plus",
    pricePerSqft: 140,
    description: "Jaquar/Kohler mid-range fixtures",
  },
  "premium": {
    label: "Premium",
    pricePerSqft: 250,
    description: "Grohe/Hansgrohe premium imported fixtures",
  },
};

export const PAINTING_PRICING: Record<PaintingOption, ComponentPricing> = {
  "tractor-emulsion": {
    label: "Tractor Emulsion",
    pricePerSqft: 12,
    description: "Asian Paints Tractor emulsion - basic",
  },
  "premium-emulsion": {
    label: "Premium Emulsion",
    pricePerSqft: 18,
    description: "Asian Paints Apcolite/Royale emulsion",
  },
  "washable-emulsion": {
    label: "Washable Emulsion",
    pricePerSqft: 28,
    description: "Asian Paints Royale Shyne/Premium washable",
  },
};

export const KITCHEN_SINK_PRICING: Record<KitchenSinkOption, ComponentPricing> = {
  "single-bowl": {
    label: "Single Sink Bowl",
    fixedPrice: 3500,
    description: "Single bowl stainless steel sink",
  },
  "single-bowl-drainer": {
    label: "Single Bowl with Drainer & Faucets",
    fixedPrice: 8500,
    description: "Single bowl with drainer and faucet set",
  },
  "double-bowl-drainer": {
    label: "Double Bowl with Drainer & Faucets",
    fixedPrice: 15000,
    description: "Double bowl with drainer and premium faucet",
  },
};

export const COUNTERTOP_PRICING: Record<CountertopOption, ComponentPricing> = {
  "granite-150": {
    label: "Granite",
    pricePerSqft: 150,
    description: "Standard granite countertop",
  },
  "galaxy-black-180": {
    label: "Galaxy Black Granite",
    pricePerSqft: 180,
    description: "Premium galaxy black granite",
  },
  "jet-black-250": {
    label: "Jet Black Granite",
    pricePerSqft: 250,
    description: "Imported jet black granite countertop",
  },
};

export const WATER_TANK_PRICING: Record<WaterTankOption, ComponentPricing> = {
  "2000ltr": {
    label: "2000 Ltr",
    fixedPrice: 12000,
    description: "2000 liter water tank",
  },
  "4000ltr": {
    label: "4000 Ltr",
    fixedPrice: 22000,
    description: "4000 liter water tank",
  },
  "6000ltr": {
    label: "6000 Ltr",
    fixedPrice: 32000,
    description: "6000 liter water tank",
  },
  "none": {
    label: "Not Required",
    fixedPrice: 0,
    description: "Skip water tank",
  },
};

export const MODULAR_KITCHEN_PRICING: Record<BooleanOption, ComponentPricing> = {
  "yes": {
    label: "Yes",
    pricePerSqft: 450,
    description: "Modular kitchen with cabinets and hardware",
  },
  "no": {
    label: "No",
    pricePerSqft: 0,
    description: "Traditional kitchen setup",
  },
};

export const HOME_AUTOMATION_PRICING: Record<BooleanOption, ComponentPricing> = {
  "yes": {
    label: "Yes",
    pricePerSqft: 85,
    description: "Smart home automation system",
  },
  "no": {
    label: "No",
    pricePerSqft: 0,
    description: "Standard electrical setup",
  },
};
