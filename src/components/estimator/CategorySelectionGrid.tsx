import { useState } from "react";
import { cn } from "@/lib/utils";
// Assuming ComponentOption is defined in "@/types/estimator" as 'string'
import { ComponentOption } from "@/types/estimator"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- INTERFACE DEFINITIONS ---
// Assuming CategoryConfig is correctly defined in this file or imported
interface CategorySelectionGridProps {
  categories: Record<string, CategoryConfig>;
  selectedOptions: Record<string, ComponentOption>;
  onOptionChange: (component: string, option: ComponentOption) => void;
  sectionTitle?: string;
  sectionDescription?: string;
}

interface CategoryConfig {
  title: string;
  icon: React.ReactNode;
  options: Record<string, string>; // Maps option key (e.g., 'basic') to description
  required?: boolean;
  optional?: boolean;
  enabled?: boolean;
}
// --- END INTERFACE DEFINITIONS ---


const CategorySelectionGrid = ({
  categories,
  selectedOptions,
  onOptionChange,
  sectionTitle = "Categories",
  sectionDescription = "Select your preferred options for each category."
}: CategorySelectionGridProps) => {
  const [hoveredOption, setHoveredOption] = useState<{component: string, option: string} | null>(null);

  /**
   * Handles the click event on an option button.
   * Key Fix is here: Ensure onOptionChange sends a clear "unselected" signal.
   */
  const handleOptionClick = (key: string, option: string, isDisabled: boolean) => {
    if (isDisabled) return;
    
    // If clicking the same option that's already selected, deselect it
    if (selectedOptions[key] === option) {
      // ✅ This should trigger deselection and price removal in the parent.
      // If the parent expects 'null' or 'undefined' instead of an empty string, 
      // change "" to null (and update ComponentOption type if necessary).
      onOptionChange(key, "" as ComponentOption); 
    } else {
      // Select the new option
      onOptionChange(key, option as ComponentOption);
    }
  };

  return (
    <div className="space-y-8">
      {sectionTitle && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{sectionTitle}</h3>
          {sectionDescription && <p className="text-sm text-muted-foreground">{sectionDescription}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {Object.entries(categories).map(([key, category]) => {
          // Determine if the entire category section is disabled/not included
          const isDisabled = 'optional' in category && category.optional && 'enabled' in category && !category.enabled;
          const isRequired = 'required' in category && category.required;

          return (
            <div 
              key={key} 
              className={cn("space-y-4", isDisabled && "opacity-50 pointer-events-none")}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <div className={cn("bg-vs/10 p-2 rounded-lg", isDisabled && "bg-gray-200")}>
                  {category.icon}
                </div>
                <h4 className={cn("font-medium", isDisabled && "text-gray-400")}>
                  {category.title}
                </h4>
                {isRequired && (
                  <span className="text-xs text-vs bg-vs/10 px-2 py-1 rounded-full font-medium">
                    Required
                  </span>
                )}
                {isDisabled && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    Not Included
                  </span>
                )}
              </div>

              {/* Option Buttons */}
              <TooltipProvider>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(category.options).map(([option, description]) => {
                    // This logic determines the selected state for the visual toggle
                    const isSelected = selectedOptions[key] === option;
                    
                    return (
                      <Tooltip key={option} delayDuration={300}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleOptionClick(key, option, isDisabled)}
                            disabled={isDisabled}
                            className={cn(
                              "rounded-full px-4 py-2 text-sm capitalize transition-all",
                              isSelected && !isDisabled
                                ? "bg-vs text-white"
                                : isDisabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-vs/10 text-vs-dark hover:bg-vs/20"
                            )}
                            onMouseEnter={() => !isDisabled && setHoveredOption({component: key, option})}
                            onMouseLeave={() => setHoveredOption(null)}
                          >
                            {/* Simple text mapping for option keys */}
                            {option === 'basic' ? 'Standard' : option === 'mid' ? 'Premium' : 'Luxury'}
                          </button>
                        </TooltipTrigger>
                        
                        {/* Tooltip Content */}
                        <TooltipContent className="p-3 max-w-xs bg-white shadow-lg border border-gray-100">
                          <p className="text-xs text-gray-600">
                            {isDisabled ? "This component is not required for your project" : description}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>

              {/* Mobile Hover/Description (showing on hover/focused option) */}
              {hoveredOption && hoveredOption.component === key && !isDisabled && (
                <div className="md:hidden p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    {category.options[hoveredOption.option]}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelectionGrid;
