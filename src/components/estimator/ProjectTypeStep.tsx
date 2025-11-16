
import { motion } from "framer-motion";
import { Building2, Home, Building, Paintbrush, HardHat, Trees, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedText from "@/components/AnimatedText";
import { ProjectSubcategory, RoomConfiguration, LandscapeArea } from "@/types/estimator";

type ProjectType = "residential" | "commercial" | "mixed-use";

interface ProjectOption {
  id: ProjectType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface WorkTypeOption {
  id: ProjectSubcategory;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface RoomConfigOption {
  id: RoomConfiguration;
  title: string;
  description: string;
}

interface LandscapeAreaOption {
  id: LandscapeArea;
  title: string;
}

interface ProjectTypeStepProps {
  selectedType: string;
  selectedWorkTypes: ProjectSubcategory[];
  selectedRoomConfig?: RoomConfiguration;
  selectedLandscapeAreas?: LandscapeArea[];
  onSelectType: (type: ProjectType) => void;
  onSelectWorkTypes: (workTypes: ProjectSubcategory[]) => void;
  onSelectRoomConfig: (config: RoomConfiguration) => void;
  onSelectLandscapeAreas: (areas: LandscapeArea[]) => void;
}

const ProjectTypeStep = ({
  selectedType,
  selectedWorkTypes,
  selectedRoomConfig,
  selectedLandscapeAreas = [],
  onSelectType,
  onSelectWorkTypes,
  onSelectRoomConfig,
  onSelectLandscapeAreas,
}: ProjectTypeStepProps) => {
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

  const workTypeOptions: WorkTypeOption[] = [
    {
      id: "construction",
      title: "Construction",
      description: "Complete building construction from foundation",
      icon: <HardHat className="size-5" />
    },
    {
      id: "interiors",
      title: "Interiors",
      description: "Interior design and furnishing for existing spaces",
      icon: <Paintbrush className="size-5" />
    },
    {
      id: "landscape",
      title: "Landscape",
      description: "Outdoor spaces, gardens, and landscaping",
      icon: <Trees className="size-5" />
    },
  ];

  const roomConfigOptions: RoomConfigOption[] = [
    { id: "Studio", title: "Studio", description: "Open plan living space" },
    { id: "1BHK", title: "1 BHK", description: "1 Bedroom, Hall, Kitchen" },
    { id: "2BHK", title: "2 BHK", description: "2 Bedrooms, Hall, Kitchen" },
    { id: "3BHK", title: "3 BHK", description: "3 Bedrooms, Hall, Kitchen" },
    { id: "4BHK", title: "4 BHK", description: "4 Bedrooms, Hall, Kitchen" },
    { id: "5BHK+", title: "5+ BHK", description: "5 or more Bedrooms" },
    { id: "Penthouse", title: "Penthouse", description: "Luxury top-floor residence" },
    { id: "Villa", title: "Villa", description: "Independent house" },
  ];

  const landscapeAreaOptions: LandscapeAreaOption[] = [
    { id: "Front Yard", title: "Front Yard" },
    { id: "Back Yard", title: "Back Yard" },
    { id: "Terrace Garden", title: "Terrace Garden" },
    { id: "Rooftop Garden", title: "Rooftop Garden" },
    { id: "Full Compound", title: "Full Compound" },
    { id: "Courtyard", title: "Courtyard" },
  ];

  const toggleWorkType = (workType: ProjectSubcategory) => {
    const newWorkTypes = selectedWorkTypes.includes(workType)
      ? selectedWorkTypes.filter(t => t !== workType)
      : [...selectedWorkTypes, workType];
    onSelectWorkTypes(newWorkTypes);
  };

  const toggleLandscapeArea = (area: LandscapeArea) => {
    const newAreas = selectedLandscapeAreas.includes(area)
      ? selectedLandscapeAreas.filter(a => a !== area)
      : [...selectedLandscapeAreas, area];
    onSelectLandscapeAreas(newAreas);
  };

  return (
    <div className="space-y-8">
      {/* Project Type Selection */}
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
              onClick={() => onSelectType(option.id as ProjectType)}
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

      {/* Type of Work Selection (Multiple) */}
      {selectedType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatedText
            text="Type of Work (Select all that apply)"
            className="text-xl font-display mb-6 text-center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {workTypeOptions.map((option, index) => {
              const isSelected = selectedWorkTypes.includes(option.id);
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    "group relative flex flex-col items-start border rounded-lg p-5 cursor-pointer transition-all duration-300 hover:shadow-md",
                    isSelected
                      ? "border-vs bg-vs/5 shadow-sm"
                      : "border-primary/10 hover:border-primary/30"
                  )}
                  onClick={() => toggleWorkType(option.id)}
                >
                  {/* Checkmark indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 size-6 bg-vs rounded-full flex items-center justify-center"
                    >
                      <Check className="size-4 text-white" />
                    </motion.div>
                  )}

                  <div className="flex items-start gap-3 w-full">
                    <div className={cn(
                      "flex-shrink-0 flex items-center justify-center size-10 rounded-lg transition-colors",
                      isSelected
                        ? "bg-vs text-white"
                        : "bg-primary/5 text-primary/70 group-hover:bg-primary/10"
                    )}>
                      {option.icon}
                    </div>

                    <div className="flex-1">
                      <h4 className="text-lg font-medium mb-1 text-[#4f090c]">{option.title}</h4>
                      <p className="text-sm text-[#4f090c]/70">{option.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Room Configuration (Conditional - for Residential) */}
      {selectedType === "residential" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatedText
            text="Room Configuration / Typology"
            className="text-xl font-display mb-6 text-center"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {roomConfigOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className={cn(
                  "group flex flex-col items-center justify-center border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md",
                  selectedRoomConfig === option.id
                    ? "border-vs bg-vs/5 shadow-sm"
                    : "border-primary/10 hover:border-primary/30"
                )}
                onClick={() => onSelectRoomConfig(option.id)}
              >
                <div className={cn(
                  "w-full text-center py-2 px-3 rounded-md transition-colors mb-2",
                  selectedRoomConfig === option.id
                    ? "bg-vs text-white"
                    : "bg-primary/5 text-primary/70 group-hover:bg-primary/10"
                )}>
                  <h4 className="text-base font-semibold">{option.title}</h4>
                </div>
                <p className="text-xs text-[#4f090c]/70 text-center">{option.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Landscape Area Selection (Conditional - if Landscape is selected) */}
      {selectedWorkTypes.includes("landscape") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatedText
            text="Landscape Areas / Sections (Select all that apply)"
            className="text-xl font-display mb-6 text-center"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {landscapeAreaOptions.map((option, index) => {
              const isSelected = selectedLandscapeAreas.includes(option.id);
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={cn(
                    "group relative flex items-center justify-center border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md",
                    isSelected
                      ? "border-vs bg-vs/5 shadow-sm"
                      : "border-primary/10 hover:border-primary/30"
                  )}
                  onClick={() => toggleLandscapeArea(option.id)}
                >
                  {/* Checkmark indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 size-5 bg-vs rounded-full flex items-center justify-center"
                    >
                      <Check className="size-3 text-white" />
                    </motion.div>
                  )}

                  <h4 className={cn(
                    "text-sm font-medium text-center transition-colors",
                    isSelected ? "text-[#4f090c]" : "text-[#4f090c]/70"
                  )}>
                    {option.title}
                  </h4>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="mt-8 text-center text-[#4f090c]/70 text-sm">
        <p>Choose the options that best describe your project</p>
      </div>
    </div>
  );
};

export default ProjectTypeStep;
