export interface FeeRates {
  typologies: Record<string, { model: 'PERCENT' | 'SQM'; rate: number; min: number }>;
  clientMultipliers: Record<string, number>;
  complexity: Record<string, number>;
  premiumMultiplier: number;
  rushMultiplier: number;
  vizPrices: Record<string, number>;
  extraRender: Record<string, number>;
  conversionRates: Record<string, number>;
  profitMargin: number;
  taxRate: number;
  minimumFeeStudio: number;
}

export const defaultFeeRates: FeeRates = {
  typologies: {
    "Individual House": { model: "PERCENT", rate: 0.08, min: 20000 },
    "Residential Block": { model: "PERCENT", rate: 0.05, min: 50000 },
    "Commercial": { model: "PERCENT", rate: 0.04, min: 80000 },
    // ... other typologies
  },
  clientMultipliers: {
    "Friend/Family": 0.85,
    "Individual": 1.0,
    // ... other client types
  },
  // ... other rate configurations
};

export function calculateArchitectFee(
  projectType: string,
  constructionCost: number,
  area: number,
  clientType: string = "Individual",
  complexity: string = "Standard",
  includeFFE: boolean = false,
  includeLandscape: boolean = false,
  vizPackage: string = "Standard",
  isRush: boolean = false,
  currency: string = "INR",
  rates: FeeRates = defaultFeeRates
) {
  const typ = rates.typologies[projectType] || rates.typologies["Individual House"];
  const clientMult = rates.clientMultipliers[clientType] || 1;
  const complexityMult = rates.complexity[complexity] || 1;
  const premiumMult = rates.premiumMultiplier;
  const rushMult = isRush ? rates.rushMultiplier : 1;

  let rawFee = typ.model === "PERCENT" ? 
    constructionCost * typ.rate : 
    area * typ.rate;

  const feeAfterMultipliers = rawFee * clientMult * complexityMult * premiumMult * rushMult;
  const baseFee = Math.max(typ.min || 0, rates.minimumFeeStudio || 0, feeAfterMultipliers);

  const ffeFee = includeFFE ? 
    Math.max(
      rates.typologies["FF&E Procurement"].min,
      constructionCost * 0.15 * rates.typologies["FF&E Procurement"].rate
    ) : 0;

  const landscapeFee = includeLandscape ? 
    Math.max(
      rates.typologies["Landscape - Detailed"].min,
      area * rates.typologies["Landscape - Detailed"].rate
    ) : 0;

  const vizFee = rates.vizPrices[vizPackage] || 0;
  const overheadAllocation = 80000 / 3;

  const subtotal = baseFee + ffeFee + landscapeFee + vizFee + overheadAllocation;
  const profit = Math.round(subtotal * rates.profitMargin);
  const tax = Math.round((subtotal + profit) * rates.taxRate);
  const totalFee = subtotal + profit + tax;

  const fx = rates.conversionRates[currency] || 1;
  const totalInCurrency = +(totalFee / fx).toFixed(2);

  return {
    baseFee,
    ffeFee,
    landscapeFee,
    vizFee,
    overheadAllocation,
    profit,
    tax,
    totalFee: totalInCurrency,
    currency
  };
}
