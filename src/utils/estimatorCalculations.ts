
import { ComponentOption, ProjectEstimate } from "@/types/estimator";

export const calculateCosts = (estimate: ProjectEstimate) => {
  const baseRatesPerSqm: Record<string, number> = {
    'residential': 35000,
    'commercial': 45000,
    'mixed-use': 50000,
  };
  
  const areaInSqm = estimate.areaUnit === "sqft" ? estimate.area / 10.764 : estimate.area;
  
  const componentMultipliers: Record<string, Record<ComponentOption, number>> = {
    'plumbing': { 'basic': 1.0, 'mid': 1.3, 'premium': 1.8, 'none': 0, '': 0 },
    'ac': { 'basic': 1.0, 'mid': 1.4, 'premium': 2.0, 'none': 0, '': 0 },
    'electrical': { 'basic': 1.0, 'mid': 1.2, 'premium': 1.7, 'none': 0, '': 0 },
    'elevator': { 'basic': 1.0, 'mid': 1.5, 'premium': 2.2, 'none': 0, '': 0 },
    'lighting': { 'basic': 1.0, 'mid': 1.3, 'premium': 1.9, 'none': 0, '': 0 },
    'windows': { 'basic': 1.0, 'mid': 1.4, 'premium': 2.1, 'none': 0, '': 0 },
    'ceiling': { 'basic': 1.0, 'mid': 1.3, 'premium': 1.8, 'none': 0, '': 0 },
    'surfaces': { 'basic': 1.0, 'mid': 1.5, 'premium': 2.3, 'none': 0, '': 0 },
    'fixedFurniture': { 'basic': 1.0, 'mid': 1.6, 'premium': 2.5, 'none': 0, '': 0 },
    'looseFurniture': { 'basic': 1.0, 'mid': 1.4, 'premium': 2.2, 'none': 0, '': 0 },
    'furnishings': { 'basic': 1.0, 'mid': 1.3, 'premium': 2.0, 'none': 0, '': 0 },
    'appliances': { 'basic': 1.0, 'mid': 1.6, 'premium': 2.4, 'none': 0, '': 0 }
  };
  
  const locationMultiplier = 1.0;
  
  const coreComponentsCost = calculateCategoryTotal([
    'plumbing', 'ac', 'electrical', 'elevator'
  ], componentMultipliers, estimate, areaInSqm * 0.3);
  
  const finishesCost = calculateCategoryTotal([
    'lighting', 'windows', 'ceiling', 'surfaces'
  ], componentMultipliers, estimate, areaInSqm * 0.25);
  
  const interiorsCost = calculateCategoryTotal([
    'fixedFurniture', 'looseFurniture', 'furnishings', 'appliances'
  ], componentMultipliers, estimate, areaInSqm * 0.2);
  
  const baseRate = baseRatesPerSqm[estimate.projectType] || baseRatesPerSqm.residential;
  const baseCost = areaInSqm * baseRate * locationMultiplier;
  
  const totalCost = (baseCost + coreComponentsCost + finishesCost + interiorsCost) * 1.1;
  
  const planningCost = totalCost * 0.15;
  const constructionCost = totalCost * 0.6;
  const interiorsCostTotal = totalCost * 0.25;
  
  const baseMonths = Math.max(6, Math.ceil(Math.sqrt(areaInSqm) / 5));
  const projectTypeMultiplier = estimate.projectType === 'commercial' ? 1.2 : 
                              estimate.projectType === 'mixed-use' ? 1.3 : 1.0;
  
  const totalMonths = Math.ceil(baseMonths * projectTypeMultiplier);
  const planningMonths = Math.ceil(totalMonths * 0.2);
  const constructionMonths = Math.ceil(totalMonths * 0.5);
  const interiorsMonths = Math.ceil(totalMonths * 0.3);
  
  return {
    totalCost,
    phaseBreakdown: {
      planning: planningCost,
      construction: constructionCost,
      interiors: interiorsCostTotal
    },
    categoryBreakdown: {
      core: coreComponentsCost,
      finishes: finishesCost,
      interiors: interiorsCost
    },
    timeline: {
      totalMonths,
      phases: {
        planning: planningMonths,
        construction: constructionMonths,
        interiors: interiorsMonths
      }
    }
  };
};

const calculateCategoryTotal = (
  components: string[], 
  multipliers: Record<string, Record<ComponentOption, number>>,
  estimate: ProjectEstimate,
  baseAmount: number
) => {
  let total = 0;
  
  components.forEach(component => {
    const option = estimate[component as keyof ProjectEstimate] as ComponentOption;
    if (option) {
      total += baseAmount * (multipliers[component][option] || 1);
    }
  });
  
  return total;
};
