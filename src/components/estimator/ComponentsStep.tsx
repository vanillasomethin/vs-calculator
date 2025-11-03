import { Droplet, Wind, Zap, ArrowUp } from "lucide-react";
import { ComponentOption } from "@/types/estimator";
import CategorySelectionGrid from "./CategorySelectionGrid";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface ComponentsStepProps {
  plumbing: ComponentOption;
  ac: ComponentOption;
  electrical: ComponentOption;
  elevator: ComponentOption;
  onOptionChange: (component: string, option: ComponentOption) => void;
}

const ComponentsStep = ({
  plumbing,
  ac,
  electrical,
  elevator,
  onOptionChange,
}: ComponentsStepProps) => {
  // Track which optional components are enabled
  const [enabledComponents, setEnabledComponents] = useState({
    ac: !!ac,
    elevator: !!elevator
  });

  // When a component is disabled, update the parent
  useEffect(() => {
    Object.entries(enabledComponents).forEach(([component, enabled]) => {
      if (!enabled) {
        onOptionChange(component, '');
      }
    });
  }, [enabledComponents, onOptionChange]);

  // When a component option is selected but the component is disabled, enable it
  useEffect(() => {
    if (ac && !enabledComponents.ac) {
      setEnabledComponents(prev => ({ ...prev, ac: true }));
    }
    if (elevator && !enabledComponents.elevator) {
      setEnabledComponents(prev => ({ ...prev, elevator: true }));
    }
  }, [ac, elevator, enabledComponents]);

  // Handle toggling component inclusion
  const handleToggleComponent = (component: string, enabled: boolean) => {
    setEnabledComponents(prev => ({ ...prev, [component]: enabled }));
    
    if (!enabled) {
      onOptionChange(component, '');
    } else {
      onOptionChange(component, 'basic');
    }
  };
  const componentCategories = {
    plumbing: {
      title: "Plumbing Fixtures & Sanitary",
      icon: <Droplet className="size-6" />,
      options: {
        basic: "Standard faucets and fittings with basic fixtures",
        mid: "Designer fittings with energy-efficient systems",
        premium: "Luxury fixtures with smart water systems and touchless operation",
      },
      required: true,
    },
    ac: {
      title: "A.C. Systems",
      icon: <Wind className="size-6" />,
      options: {
        basic: "Split A.C. units for key rooms",
        mid: "Multi-zone ductless systems with better energy efficiency",
        premium: "Centralized HVAC with smart temperature control in all rooms",
      },
      optional: true,
      enabled: enabledComponents.ac
    },
    electrical: {
      title: "Electrical Works",
      icon: <Zap className="size-6" />,
      options: {
        basic: "Standard wiring with basic switches and outlets",
        mid: "Higher-grade wiring with surge protection and better fixtures",
        premium: "Smart electrical systems with home automation capabilities",
      },
      required: true,
    },
    elevator: {
      title: "Elevators/Lifts",
      icon: <ArrowUp className="size-6" />,
      options: {
        basic: "Compact residential lift with basic features",
        mid: "Sleek passenger lift with better aesthetics",
        premium: "High-speed luxury elevator with advanced features",
      },
      optional: true,
      enabled: enabledComponents.elevator
    },
  };

  const selectedOptions = {
    plumbing,
    ac,
    electrical,
    elevator,
  };

  const optionalCategories = {
    ac: componentCategories.ac,
    elevator: componentCategories.elevator
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select Core Components</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose which optional components to include in your estimate. Required components are always included.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(optionalCategories).map(([key, category]) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-lg border hover:border-vs/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-vs/10 p-2 rounded-lg">{category.icon}</div>
                <Label htmlFor={`toggle-${key}`}>{category.title}</Label>
              </div>
              <Switch 
                id={`toggle-${key}`}
                checked={enabledComponents[key as keyof typeof enabledComponents]}
                onCheckedChange={(checked) => handleToggleComponent(key, checked)}
              />
            </div>
          ))}
        </div>
      </div>
      
      <CategorySelectionGrid
        categories={componentCategories}
        selectedOptions={selectedOptions}
        onOptionChange={onOptionChange}
        sectionTitle="Core Building Components"
        sectionDescription="Select quality level for each component."
      />
    </div>
  );
};

export default ComponentsStep;
