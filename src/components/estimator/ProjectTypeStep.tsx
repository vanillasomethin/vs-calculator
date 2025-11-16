
import { motion } from "framer-motion";
import { Building2, Home, Building, Paintbrush, HardHat, Trees, Wrench, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedText from "@/components/AnimatedText";
import { ProjectSubcategory } from "@/types/estimator";

type ProjectType = "residential" | "commercial" | "mixed-use";

interface ProjectOption {
  id: ProjectType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface SubcategoryOption {
  id: ProjectSubcategory;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ProjectTypeStepProps {
  selectedType: string;
  selectedSubcategory: ProjectSubcategory | "";
  onSelect: (type: ProjectType) => void;
  onSubcategorySelect: (subcategory: ProjectSubcategory) => void;
}

const ProjectTypeStep = ({ selectedType, selectedSubcategory, onSelect, onSubcategorySelect }: ProjectTypeStepProps) => {
  const projectOptions: ProjectOption[] = [
    {
      id: "residential",
      title: "Residential",
      description: "Houses, apartments, and living spaces",
      icon: <Home className="size-6" />
    },
    {
      id: "commercial",
      title: "Commercial",
      description: "Offices, retail, and business spaces",
      icon: <Building className="size-6" />
    },
    {
      id: "mixed-use",
      title: "Mixed-Use",
      description: "Combined residential and commercial spaces",
      icon: <Building2 className="size-6" />
    }
  ];

  const subcategoryOptions: SubcategoryOption[] = [
    {
      id: "interiors",
      title: "Interiors Only",
      description: "Interior design and furnishing for existing spaces",
      icon: <Paintbrush className="size-5" />
    },
    {
      id: "construction",
      title: "Full Construction",
      description: "Complete building construction from foundation",
      icon: <HardHat className="size-5" />
    },
    {
      id: "landscape",
      title: "Landscape",
      description: "Outdoor spaces, gardens, and landscaping",
      icon: <Trees className="size-5" />
    },
    {
      id: "renovation",
      title: "Renovation",
      description: "Modifications and upgrades to existing structures",
      icon: <Wrench className="size-5" />
    },
    {
      id: "combination",
      title: "Combination",
      description: "Multiple types of work combined",
      icon: <Layers className="size-5" />
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <AnimatedText
          text="What type of project are you planning?"
          className="text-2xl font-display mb-8 text-center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {projectOptions.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: projectOptions.findIndex(o => o.id === option.id) * 0.1 }}
              className={cn(
                "group flex flex-col justify-between border rounded-xl p-6 cursor-pointer transition-all duration-300",
                selectedType === option.id
                  ? "border-vs bg-vs/5"
                  : "border-primary/10 hover:border-primary/30"
              )}
              onClick={() => onSelect(option.id as ProjectType)}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex-shrink-0 flex items-center justify-center size-12 rounded-lg transition-colors",
                  selectedType === option.id
                    ? "bg-vs text-white"
                    : "bg-primary/5 text-primary/70 group-hover:bg-primary/10"
                )}>
                  {option.icon}
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2 text-[#4f090c]">{option.title}</h3>
                  <p className="text-[#4f090c]/80">{option.description}</p>
                </div>
              </div>

              <div className={cn(
                "mt-4 h-1 rounded-full bg-vs/20 overflow-hidden",
                selectedType === option.id ? "opacity-100" : "opacity-0 group-hover:opacity-50"
              )}>
                <motion.div
                  className="h-full bg-vs"
                  initial={{ width: "0%" }}
                  animate={{ width: selectedType === option.id ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatedText
            text="What type of work is involved?"
            className="text-xl font-display mb-6 text-center"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {subcategoryOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "group flex flex-col items-center justify-center border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md",
                  selectedSubcategory === option.id
                    ? "border-vs bg-vs/5 shadow-sm"
                    : "border-primary/10 hover:border-primary/30"
                )}
                onClick={() => onSubcategorySelect(option.id)}
              >
                <div className={cn(
                  "flex items-center justify-center size-10 rounded-lg transition-colors mb-3",
                  selectedSubcategory === option.id
                    ? "bg-vs text-white"
                    : "bg-primary/5 text-primary/70 group-hover:bg-primary/10"
                )}>
                  {option.icon}
                </div>

                <h4 className="text-sm font-medium mb-1 text-[#4f090c] text-center">{option.title}</h4>
                <p className="text-xs text-[#4f090c]/70 text-center">{option.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-8 text-center text-[#4f090c]/70 text-sm">
        <p>Choose the options that best describe your construction project</p>
      </div>
    </div>
  );
};

export default ProjectTypeStep;
