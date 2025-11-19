import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, IndianRupee } from "lucide-react";
import { ComponentOption, ProjectEstimate } from "@/types/estimator";

interface BudgetMatchingStepProps {
  budget: number;
  estimate: ProjectEstimate;
  onBudgetChange: (budget: number) => void;
  onApplySuggestions: (suggestions: Partial<ProjectEstimate>) => void;
}

interface ComponentSuggestion {
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
}

// Component pricing per square meter (same as in EstimatorContext)
const COMPONENT_PRICING: Record<string, Record<ComponentOption, number>> = {
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

const BASE_CONSTRUCTION_COST: Record<string, number> = {
  residential: 18000,
  commercial: 22000,
  "mixed-use": 26000,
};

const BudgetMatchingStep = ({
  budget,
  estimate,
  onBudgetChange,
  onApplySuggestions,
}: BudgetMatchingStepProps) => {
  const [inputBudget, setInputBudget] = useState<string>(budget > 0 ? budget.toString() : "");
  const [suggestions, setSuggestions] = useState<ComponentSuggestion | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [budgetStatus, setBudgetStatus] = useState<"low" | "moderate" | "good" | "excellent" | null>(null);

  // Calculate area in square meters
  const areaInSqM = estimate.areaUnit === "sqft" ? estimate.area * 0.092903 : estimate.area;

  // Calculate minimum viable budget
  const calculateMinimumBudget = (): number => {
    const baseCost = (BASE_CONSTRUCTION_COST[estimate.projectType] || BASE_CONSTRUCTION_COST.residential) * areaInSqM;

    // Minimum components at standard level
    const minComponents = (
      COMPONENT_PRICING.civilQuality.standard * areaInSqM * 0.15 +
      COMPONENT_PRICING.plumbing.standard * areaInSqM +
      COMPONENT_PRICING.electrical.standard * areaInSqM +
      COMPONENT_PRICING.lighting.standard * areaInSqM +
      COMPONENT_PRICING.ceiling.standard * areaInSqM +
      COMPONENT_PRICING.surfaces.standard * areaInSqM
    );

    const subtotal = baseCost + minComponents;
    const withOverheads = subtotal * 1.22; // 13% professional fees + 9% contingency
    const withGST = withOverheads * 1.12; // 12% GST

    return Math.round(withGST);
  };

  const minimumBudget = calculateMinimumBudget();

  // Generate budget-based suggestions
  const generateSuggestions = (targetBudget: number): ComponentSuggestion => {
    const baseCost = (BASE_CONSTRUCTION_COST[estimate.projectType] || BASE_CONSTRUCTION_COST.residential) * areaInSqM;
    const availableForComponents = (targetBudget / 1.12 / 1.22) - baseCost; // Remove GST and overheads
    const perSqmBudget = availableForComponents / areaInSqM;

    const hasConstruction = estimate.workTypes?.includes("construction") ?? false;
    const hasInteriors = estimate.workTypes?.includes("interiors") ?? false;

    // Default suggestions
    const suggestion: ComponentSuggestion = {
      civilQuality: hasConstruction ? "standard" : "none",
      plumbing: "standard",
      electrical: "standard",
      ac: "none",
      elevator: "none",
      buildingEnvelope: hasConstruction ? "standard" : "none",
      lighting: "standard",
      windows: hasConstruction ? "standard" : "none",
      ceiling: "standard",
      surfaces: "standard",
      fixedFurniture: hasInteriors ? "standard" : "none",
      looseFurniture: hasInteriors ? "none" : "none",
      furnishings: hasInteriors ? "none" : "none",
      appliances: hasInteriors ? "none" : "none",
      artefacts: "none",
    };

    // Budget tiers
    if (perSqmBudget > 8000) {
      // Luxury budget
      suggestion.civilQuality = hasConstruction ? "luxury" : "none";
      suggestion.plumbing = "luxury";
      suggestion.electrical = "luxury";
      suggestion.ac = "luxury";
      suggestion.elevator = "premium";
      suggestion.buildingEnvelope = hasConstruction ? "luxury" : "none";
      suggestion.lighting = "luxury";
      suggestion.windows = hasConstruction ? "luxury" : "none";
      suggestion.ceiling = "luxury";
      suggestion.surfaces = "luxury";
      suggestion.fixedFurniture = hasInteriors ? "luxury" : "none";
      suggestion.looseFurniture = hasInteriors ? "luxury" : "none";
      suggestion.furnishings = hasInteriors ? "premium" : "none";
      suggestion.appliances = hasInteriors ? "premium" : "none";
      suggestion.artefacts = hasInteriors ? "standard" : "none";
    } else if (perSqmBudget > 5000) {
      // Premium budget
      suggestion.civilQuality = hasConstruction ? "premium" : "none";
      suggestion.plumbing = "premium";
      suggestion.electrical = "premium";
      suggestion.ac = "premium";
      suggestion.elevator = "standard";
      suggestion.buildingEnvelope = hasConstruction ? "premium" : "none";
      suggestion.lighting = "premium";
      suggestion.windows = hasConstruction ? "premium" : "none";
      suggestion.ceiling = "premium";
      suggestion.surfaces = "premium";
      suggestion.fixedFurniture = hasInteriors ? "premium" : "none";
      suggestion.looseFurniture = hasInteriors ? "standard" : "none";
      suggestion.furnishings = hasInteriors ? "standard" : "none";
      suggestion.appliances = hasInteriors ? "standard" : "none";
    } else if (perSqmBudget > 3500) {
      // Good budget
      suggestion.civilQuality = hasConstruction ? "standard" : "none";
      suggestion.plumbing = "premium";
      suggestion.electrical = "premium";
      suggestion.ac = "standard";
      suggestion.buildingEnvelope = hasConstruction ? "standard" : "none";
      suggestion.lighting = "premium";
      suggestion.windows = hasConstruction ? "standard" : "none";
      suggestion.ceiling = "standard";
      suggestion.surfaces = "premium";
      suggestion.fixedFurniture = hasInteriors ? "standard" : "none";
      suggestion.looseFurniture = hasInteriors ? "none" : "none";
      suggestion.furnishings = hasInteriors ? "none" : "none";
    } else if (perSqmBudget > 2500) {
      // Standard budget
      suggestion.ac = "none";
      suggestion.elevator = "none";
    }

    return suggestion;
  };

  // Estimate cost with suggestions
  const estimateCostWithSuggestions = (sug: ComponentSuggestion): number => {
    const baseCost = (BASE_CONSTRUCTION_COST[estimate.projectType] || BASE_CONSTRUCTION_COST.residential) * areaInSqM;

    const componentCost = Object.entries(sug).reduce((sum, [key, value]) => {
      const pricing = COMPONENT_PRICING[key];
      if (!pricing) return sum;

      let cost = pricing[value] * areaInSqM;
      if (key === "civilQuality") cost *= 0.15;

      return sum + cost;
    }, 0);

    const subtotal = baseCost + componentCost;
    const withOverheads = subtotal * 1.22;
    const withGST = withOverheads * 1.12;

    return Math.round(withGST);
  };

  // Handle budget analysis
  const analyzeBudget = () => {
    const budgetValue = parseFloat(inputBudget);

    if (isNaN(budgetValue) || budgetValue <= 0) {
      setSuggestions(null);
      setBudgetStatus(null);
      return;
    }

    onBudgetChange(budgetValue);
    const generatedSuggestions = generateSuggestions(budgetValue);
    setSuggestions(generatedSuggestions);

    const cost = estimateCostWithSuggestions(generatedSuggestions);
    setEstimatedCost(cost);

    // Determine budget status
    if (budgetValue < minimumBudget * 0.8) {
      setBudgetStatus("low");
    } else if (budgetValue < minimumBudget * 1.2) {
      setBudgetStatus("moderate");
    } else if (budgetValue < minimumBudget * 2) {
      setBudgetStatus("good");
    } else {
      setBudgetStatus("excellent");
    }
  };

  const handleApplySuggestions = () => {
    if (suggestions) {
      onApplySuggestions(suggestions);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getQualityBadgeColor = (option: ComponentOption) => {
    switch (option) {
      case "luxury": return "bg-purple-100 text-purple-800 border-purple-300";
      case "premium": return "bg-blue-100 text-blue-800 border-blue-300";
      case "standard": return "bg-green-100 text-green-800 border-green-300";
      case "none": return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <Sparkles className="size-5 text-vs" />
          Budget-Based Component Matching
        </h3>
        <p className="text-sm text-muted-foreground">
          Tell us your budget, and we'll suggest the best combination of components to match it.
          You can always customize these selections later.
        </p>
      </div>

      {/* Budget Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="size-5" />
            Enter Your Budget
          </CardTitle>
          <CardDescription>
            What's your total project budget? We'll help you make the most of it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget Amount (INR)</Label>
            <div className="flex gap-3">
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 5000000"
                value={inputBudget}
                onChange={(e) => setInputBudget(e.target.value)}
                className="flex-1"
              />
              <Button onClick={analyzeBudget} className="bg-vs hover:bg-vs/90">
                Analyze Budget
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Minimum recommended budget for your project: <strong className="text-vs">{formatCurrency(minimumBudget)}</strong></p>
          </div>
        </CardContent>
      </Card>

      {/* Budget Status Messages */}
      {budgetStatus === "low" && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="size-4 text-orange-600" />
          <AlertDescription className="text-orange-900">
            <strong>Hey there!</strong> We appreciate your enthusiasm, but your budget might be a bit tight for what you have in mind.
            The minimum we'd recommend for a quality project of this size is around <strong>{formatCurrency(minimumBudget)}</strong>.
            <br /><br />
            Don't worry though! We can still work with what you have - we'll focus on the essentials and keep things smart and simple.
            You might want to consider phasing the project or adjusting the scope to make it work beautifully within your means.
          </AlertDescription>
        </Alert>
      )}

      {budgetStatus === "moderate" && (
        <Alert className="border-blue-200 bg-blue-50">
          <TrendingUp className="size-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Good start!</strong> Your budget gives us room to work with the essentials and add some nice touches.
            We'll make every rupee count by focusing on quality where it matters most. Let's create something you'll love!
          </AlertDescription>
        </Alert>
      )}

      {budgetStatus === "good" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="size-4 text-green-600" />
          <AlertDescription className="text-green-900">
            <strong>Excellent!</strong> Your budget allows us to deliver a well-rounded project with quality materials and finishes.
            We can incorporate some premium elements while maintaining great value. This is a sweet spot for creating something special!
          </AlertDescription>
        </Alert>
      )}

      {budgetStatus === "excellent" && (
        <Alert className="border-purple-200 bg-purple-50">
          <Sparkles className="size-4 text-purple-600" />
          <AlertDescription className="text-purple-900">
            <strong>Wonderful!</strong> With this budget, we can truly bring your vision to life with premium materials,
            luxury finishes, and all the bells and whistles. Let's create something extraordinary together!
          </AlertDescription>
        </Alert>
      )}

      {/* Suggestions */}
      {suggestions && (
        <Card className="border-vs/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recommended Component Selection</span>
              <Badge variant="outline" className="text-vs border-vs">
                Estimated: {formatCurrency(estimatedCost)}
              </Badge>
            </CardTitle>
            <CardDescription>
              Based on your budget of {formatCurrency(parseFloat(inputBudget))}, here's what we recommend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(suggestions).map(([key, value]) => {
                if (value === "none") return null;

                const displayNames: Record<string, string> = {
                  civilQuality: "Civil Materials",
                  plumbing: "Plumbing",
                  electrical: "Electrical",
                  ac: "A.C. & HVAC",
                  elevator: "Elevator",
                  buildingEnvelope: "Building Envelope",
                  lighting: "Lighting",
                  windows: "Windows",
                  ceiling: "Ceiling",
                  surfaces: "Surfaces",
                  fixedFurniture: "Fixed Furniture",
                  looseFurniture: "Loose Furniture",
                  furnishings: "Furnishings",
                  appliances: "Appliances",
                  artefacts: "Artefacts",
                };

                return (
                  <div key={key} className="flex flex-col gap-1 p-3 rounded-lg border bg-card">
                    <span className="text-xs font-medium text-muted-foreground">
                      {displayNames[key]}
                    </span>
                    <Badge variant="outline" className={getQualityBadgeColor(value)}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Badge>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleApplySuggestions} className="flex-1 bg-vs hover:bg-vs/90">
                Apply These Suggestions
              </Button>
              <Button variant="outline" onClick={() => setSuggestions(null)}>
                Clear
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Don't worry - you can customize any of these selections in the next step!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Skip Option */}
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          Not sure about your budget yet? That's okay! You can skip this step and select components manually.
        </p>
      </div>
    </div>
  );
};

export default BudgetMatchingStep;
