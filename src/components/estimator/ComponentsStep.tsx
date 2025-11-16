import { Droplet, Wind, Zap, ArrowUp, Hammer } from "lucide-react";
import { ComponentOption, ProjectSubcategory } from "@/types/estimator";
import QualityLevelSelector from "./QualityLevelSelector";
import { Badge } from "@/components/ui/badge";

interface ComponentsStepProps {
  plumbing: ComponentOption;
  ac: ComponentOption;
  electrical: ComponentOption;
  elevator: ComponentOption;
  civilQuality: ComponentOption;
  projectSubcategory: ProjectSubcategory | "";
  onOptionChange: (component: string, option: ComponentOption) => void;
}

const ComponentsStep = ({
  plumbing,
  ac,
  electrical,
  elevator,
  civilQuality,
  projectSubcategory,
  onOptionChange,
}: ComponentsStepProps) => {
  // Define which components are available for each subcategory
  const shouldShowComponent = (componentKey: string): boolean => {
    if (!projectSubcategory || projectSubcategory === "combination") {
      return true; // Show all for combination or if not selected
    }

    const componentAvailability: Record<ProjectSubcategory, string[]> = {
      interiors: ["plumbing", "ac", "electrical"], // No civil/construction for interiors
      construction: ["civilQuality", "plumbing", "ac", "electrical", "elevator"],
      landscape: [], // Landscape doesn't need these core components
      renovation: ["civilQuality", "plumbing", "ac", "electrical", "elevator"], // Can include civil modifications
      combination: ["civilQuality", "plumbing", "ac", "electrical", "elevator"],
    };

    return componentAvailability[projectSubcategory]?.includes(componentKey) ?? true;
  };

  const components = [
    {
      key: "civilQuality",
      title: "Quality of Construction - Civil Materials",
      icon: <Hammer className="size-6" />,
      value: civilQuality,
      required: projectSubcategory === "construction",
      description: "Structural materials quality including cement grade, steel specifications, brick/block quality, and construction workmanship standards",
    },
    {
      key: "plumbing",
      title: "Plumbing Fixtures & Sanitary",
      icon: <Droplet className="size-6" />,
      value: plumbing,
      required: true,
      description: "Water supply systems, drainage networks, sanitary fixtures (toilets, sinks, showers), pipe quality, and water treatment systems",
    },
    {
      key: "ac",
      title: "A.C. & HVAC Systems",
      icon: <Wind className="size-6" />,
      value: ac,
      required: false,
      description: "Climate control systems including split/VRV/central AC units, ducting, ventilation, air quality control, and temperature management solutions",
    },
    {
      key: "electrical",
      title: "Electrical Systems",
      icon: <Zap className="size-6" />,
      value: electrical,
      required: true,
      description: "Complete electrical installation with distribution boards, wiring networks, circuit breakers, switches, power outlets, earthing systems, and MCB protection",
    },
    {
      key: "elevator",
      title: "Vertical Transportation (Elevator/Lift)",
      icon: <ArrowUp className="size-6" />,
      value: elevator,
      required: false,
      description: "Passenger/goods lifts with safety mechanisms, cabin finishes, control systems, emergency backup, and maintenance access for multi-story buildings",
    },
  ].filter(component => shouldShowComponent(component.key));

  if (components.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No core building components are typically required for {projectSubcategory} projects.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Core Building Components</h3>
        <p className="text-sm text-muted-foreground">
          Select the quality level for each component. Choose "Not Required" to exclude optional items.
          {projectSubcategory && projectSubcategory !== "combination" && (
            <span className="block mt-2 text-xs text-vs">
              Filtered for {projectSubcategory} projects
            </span>
          )}
        </p>
      </div>

      {components.map((component) => (
        <div key={component.key} className="space-y-3 pb-6 border-b last:border-b-0">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-vs/10 text-vs">
              {component.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-vs-dark">{component.title}</h4>
                {component.required && (
                  <Badge variant="outline" className="text-xs border-vs/30 text-vs">
                    Required
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{component.description}</p>
            </div>
          </div>

          <QualityLevelSelector
            component={component.key}
            currentValue={component.value}
            onChange={(value) => onOptionChange(component.key, value)}
          />
        </div>
      ))}
    </div>
  );
};

export default ComponentsStep;
