import { Droplet, Wind, Zap, ArrowUp } from "lucide-react";
import { ComponentOption } from "@/types/estimator";
import CategorySelectionGrid from "./CategorySelectionGrid";

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
        none: "Not required",
        basic: "Split A.C. units for key rooms",
        mid: "Multi-zone ductless systems with better energy efficiency",
        premium: "Centralized HVAC with smart temperature control in all rooms",
      },
      optional: true,
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
        none: "Not required",
        basic: "Compact residential lift with basic features",
        mid: "Sleek passenger lift with better aesthetics",
        premium: "High-speed luxury elevator with advanced features",
      },
      optional: true,
    },
  };

  const selectedOptions = {
    plumbing,
    ac: ac || "none",
    electrical,
    elevator: elevator || "none",
  };

  return (
    <div className="space-y-8">
      <CategorySelectionGrid
        categories={componentCategories}
        selectedOptions={selectedOptions}
        onOptionChange={onOptionChange}
        sectionTitle="Core Building Components"
        sectionDescription="Select your preferred options for the building components. Choose 'Not required' for optional ones."
      />
    </div>
  );
};

export default ComponentsStep;
