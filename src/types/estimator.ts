
export type ComponentOption = "none" | "standard" | "premium" | "luxury" | "";
export type PriceTier = "basic" | "mid" | "premium";
export type AreaUnit = "sqft" | "sqm";

export type CategoryBreakdown = {
  [key: string]: number;
};

export type ProjectEstimate = {
  state: string;
  city: string;
  projectType: string;
  area: number;
  areaUnit: AreaUnit;
  plumbing: ComponentOption;
  ac: ComponentOption;
  electrical: ComponentOption;
  elevator: ComponentOption;
  civilQuality: ComponentOption;
  lighting: ComponentOption;
  windows: ComponentOption;
  ceiling: ComponentOption;
  surfaces: ComponentOption;
  buildingEnvelope: ComponentOption;
  fixedFurniture: ComponentOption;
  looseFurniture: ComponentOption;
  furnishings: ComponentOption;
  appliances: ComponentOption;
  artefacts: ComponentOption;
  totalCost: number;
  phaseBreakdown: {
    planning: number;
    construction: number;
    interiors: number;
  };
  categoryBreakdown: CategoryBreakdown;
  timeline: {
    totalMonths: number;
    phases: {
      planning: number;
      construction: number;
      interiors: number;
    };
  };
}

export const initialEstimate: ProjectEstimate = {
  state: "",
  city: "",
  projectType: "",
  area: 0,
  areaUnit: "sqft",
  plumbing: "standard",
  ac: "none",
  electrical: "standard",
  elevator: "none",
  civilQuality: "standard",
  lighting: "none",
  windows: "none",
  ceiling: "none",
  surfaces: "none",
  buildingEnvelope: "none",
  fixedFurniture: "none",
  looseFurniture: "none",
  furnishings: "none",
  appliances: "none",
  artefacts: "none",
  totalCost: 0,
  phaseBreakdown: {
    planning: 0,
    construction: 0,
    interiors: 0
  },
  categoryBreakdown: {
    core: 0,
    finishes: 0,
    interiors: 0
  },
  timeline: {
    totalMonths: 0,
    phases: {
      planning: 0,
      construction: 0,
      interiors: 0
    }
  }
};
