import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectEstimate, ComponentOption } from "@/types/estimator";
import { Share, CheckCircle2, Download, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImprovedCostVisualization from "./ImprovedCostVisualization";
import PhaseTimelineCost from "./PhaseTimelineCost";
import MeetingScheduler from "./MeetingScheduler";
import { generateEstimatePDF } from "@/utils/pdfExport";

interface ResultsStepProps {
  estimate: ProjectEstimate;
  onReset: () => void;
  onSave: () => void;
}

// Component pricing per square meter mapping for display
// Updated for Bangalore 2025 market rates
const COMPONENT_PRICING_PER_SQM: Record<string, Record<ComponentOption, number>> = {
  civilQuality: { none: 0, standard: 900, premium: 1400, luxury: 2200 },
  plumbing: { none: 0, standard: 300, premium: 550, luxury: 950 },
  electrical: { none: 0, standard: 250, premium: 480, luxury: 850 },
  ac: { none: 0, standard: 350, premium: 600, luxury: 1100 },
  elevator: { none: 0, standard: 1100, premium: 1700, luxury: 2800 },
  buildingEnvelope: { none: 0, standard: 250, premium: 500, luxury: 950 },
  lighting: { none: 0, standard: 180, premium: 400, luxury: 800 },
  windows: { none: 0, standard: 300, premium: 600, luxury: 1200 },
  ceiling: { none: 0, standard: 180, premium: 360, luxury: 750 },
  surfaces: { none: 0, standard: 350, premium: 700, luxury: 1400 },
  fixedFurniture: { none: 0, standard: 500, premium: 900, luxury: 1700 },
  looseFurniture: { none: 0, standard: 350, premium: 700, luxury: 1500 },
  furnishings: { none: 0, standard: 120, premium: 280, luxury: 600 },
  appliances: { none: 0, standard: 250, premium: 500, luxury: 1000 },
  artefacts: { none: 0, standard: 100, premium: 250, luxury: 550 },
};

// Component descriptions for detailed breakdown
const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  civilQuality: "Cement, steel, bricks/blocks, concrete work, masonry",
  plumbing: "Pipes, fixtures, toilets, sinks, showers, drainage systems",
  electrical: "Wiring, boards, switches, outlets, MCB, earthing",
  ac: "AC units, ducting, ventilation, controls",
  elevator: "Lift cabin, mechanism, safety systems, controls",
  buildingEnvelope: "Facade cladding, insulation, exterior finishes",
  lighting: "Light fixtures, LED systems, controls, outdoor lighting",
  windows: "Frames, glazing, security grills",
  ceiling: "False ceiling, gypsum, POP, acoustic panels",
  surfaces: "Flooring, wall finishes, tiles, marble, paint",
  fixedFurniture: "Wardrobes, kitchen cabinets, vanities, shelving",
  looseFurniture: "Sofas, beds, dining sets, tables, chairs",
  furnishings: "Curtains, rugs, bedding, cushions, linens",
  appliances: "Kitchen appliances, home electronics, smart devices",
  artefacts: "Artwork, sculptures, decorative pieces",
};

const ResultsStep = ({ estimate, onReset, onSave }: ResultsStepProps) => {
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const toSentenceCase = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

  const handleShare = () => {
    const shareText = `My Construction Estimate:\n\n` +
      `Location: ${estimate.city}, ${estimate.state}\n` +
      `Project: ${toSentenceCase(estimate.projectType)}\n` +
      `Area: ${estimate.area} ${estimate.areaUnit}\n` +
      `Total Cost: ${formatCurrency(estimate.totalCost)}\n` +
      `Per ${estimate.areaUnit}: ${formatCurrency(Math.round(estimate.totalCost / estimate.area))}\n\n` +
      `Get your estimate at: ${window.location.origin}`;

    if (navigator.share) {
      navigator.share({
        title: 'My Construction Cost Estimate',
        text: shareText,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "Share text has been copied to your clipboard."
        });
      });
    }
  };

  const handleDownloadPDF = () => {
    try {
      generateEstimatePDF(estimate);
      toast({
        title: "PDF Generated!",
        description: "Your estimate has been downloaded as a PDF."
      });
    } catch (error) {
      toast({
        title: "Error generating PDF",
        description: "There was a problem creating your PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Helper to check if component is included
  const isIncluded = (value: string | undefined): boolean => {
    return !!(value && value !== 'none' && value !== '');
  };

  // Helper to format level label
  const formatLevel = (level: ComponentOption) => {
    if (level === 'standard') return 'Standard';
    if (level === 'premium') return 'Premium';
    if (level === 'luxury') return 'Luxury';
    return level;
  };

  // Calculate per sqm for each component
  const areaInSqM = estimate.areaUnit === "sqft" ? estimate.area * 0.092903 : estimate.area;

  // Create pricing list with per sqm costs
  const pricingList = [
    isIncluded(estimate.civilQuality) && {
      category: "Core Components",
      name: "Quality of Construction - Civil Materials",
      level: estimate.civilQuality,
      description: COMPONENT_DESCRIPTIONS.civilQuality,
      perSqm: COMPONENT_PRICING_PER_SQM.civilQuality[estimate.civilQuality],
    },
    isIncluded(estimate.plumbing) && {
      category: "Core Components",
      name: "Plumbing & Sanitary",
      level: estimate.plumbing,
      description: COMPONENT_DESCRIPTIONS.plumbing,
      perSqm: COMPONENT_PRICING_PER_SQM.plumbing[estimate.plumbing],
    },
    isIncluded(estimate.electrical) && {
      category: "Core Components",
      name: "Electrical Systems",
      level: estimate.electrical,
      description: COMPONENT_DESCRIPTIONS.electrical,
      perSqm: COMPONENT_PRICING_PER_SQM.electrical[estimate.electrical],
    },
    isIncluded(estimate.ac) && {
      category: "Core Components",
      name: "AC & HVAC Systems",
      level: estimate.ac,
      description: COMPONENT_DESCRIPTIONS.ac,
      perSqm: COMPONENT_PRICING_PER_SQM.ac[estimate.ac],
    },
    isIncluded(estimate.elevator) && {
      category: "Core Components",
      name: "Elevator/Lift",
      level: estimate.elevator,
      description: COMPONENT_DESCRIPTIONS.elevator,
      perSqm: COMPONENT_PRICING_PER_SQM.elevator[estimate.elevator],
    },
    isIncluded(estimate.buildingEnvelope) && {
      category: "Finishes",
      name: "Building Envelope & Facade",
      level: estimate.buildingEnvelope,
      description: COMPONENT_DESCRIPTIONS.buildingEnvelope,
      perSqm: COMPONENT_PRICING_PER_SQM.buildingEnvelope[estimate.buildingEnvelope],
    },
    isIncluded(estimate.lighting) && {
      category: "Finishes",
      name: "Lighting Systems & Fixtures",
      level: estimate.lighting,
      description: COMPONENT_DESCRIPTIONS.lighting,
      perSqm: COMPONENT_PRICING_PER_SQM.lighting[estimate.lighting],
    },
    isIncluded(estimate.windows) && {
      category: "Finishes",
      name: "Windows & Glazing",
      level: estimate.windows,
      description: COMPONENT_DESCRIPTIONS.windows,
      perSqm: COMPONENT_PRICING_PER_SQM.windows[estimate.windows],
    },
    isIncluded(estimate.ceiling) && {
      category: "Finishes",
      name: "Ceiling Design & Finishes",
      level: estimate.ceiling,
      description: COMPONENT_DESCRIPTIONS.ceiling,
      perSqm: COMPONENT_PRICING_PER_SQM.ceiling[estimate.ceiling],
    },
    isIncluded(estimate.surfaces) && {
      category: "Finishes",
      name: "Wall & Floor Finishes",
      level: estimate.surfaces,
      description: COMPONENT_DESCRIPTIONS.surfaces,
      perSqm: COMPONENT_PRICING_PER_SQM.surfaces[estimate.surfaces],
    },
    isIncluded(estimate.fixedFurniture) && {
      category: "Interiors",
      name: "Fixed Furniture & Cabinetry",
      level: estimate.fixedFurniture,
      description: COMPONENT_DESCRIPTIONS.fixedFurniture,
      perSqm: COMPONENT_PRICING_PER_SQM.fixedFurniture[estimate.fixedFurniture],
    },
    isIncluded(estimate.looseFurniture) && {
      category: "Interiors",
      name: "Loose Furniture",
      level: estimate.looseFurniture,
      description: COMPONENT_DESCRIPTIONS.looseFurniture,
      perSqm: COMPONENT_PRICING_PER_SQM.looseFurniture[estimate.looseFurniture],
    },
    isIncluded(estimate.furnishings) && {
      category: "Interiors",
      name: "Furnishings & Soft Decor",
      level: estimate.furnishings,
      description: COMPONENT_DESCRIPTIONS.furnishings,
      perSqm: COMPONENT_PRICING_PER_SQM.furnishings[estimate.furnishings],
    },
    isIncluded(estimate.appliances) && {
      category: "Interiors",
      name: "Appliances & Equipment",
      level: estimate.appliances,
      description: COMPONENT_DESCRIPTIONS.appliances,
      perSqm: COMPONENT_PRICING_PER_SQM.appliances[estimate.appliances],
    },
    isIncluded(estimate.artefacts) && {
      category: "Interiors",
      name: "Artefacts & Art Pieces",
      level: estimate.artefacts,
      description: COMPONENT_DESCRIPTIONS.artefacts,
      perSqm: COMPONENT_PRICING_PER_SQM.artefacts[estimate.artefacts],
    },
  ].filter(Boolean);

  // Calculate total per sqm from selected components
  const totalPerSqm = pricingList.reduce((sum, item) => sum + (item.perSqm || 0), 0);

  // Calculate architect fee (COA standards)
  const getArchitectFeePercentage = (projectCost: number): number => {
    if (projectCost <= 5000000) return 12;
    if (projectCost <= 10000000) return 10;
    if (projectCost <= 50000000) return 9;
    return 8;
  };

  const architectFeePercent = getArchitectFeePercentage(estimate.totalCost);
  const architectFee = estimate.totalCost * (architectFeePercent / 100);
  const totalWithArchitectFee = estimate.totalCost + architectFee;

  return (
    <div className="space-y-6 overflow-y-auto overflow-x-hidden max-h-[85vh] px-2 pb-6">
      {/* Main Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-5 rounded-xl border border-vs/10 shadow-sm space-y-5"
      >
        <h2 className="text-xl font-bold text-vs-dark text-center">Your Construction Estimate</h2>

        {/* Project Details */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Location</h3>
            <p className="font-semibold text-sm">{estimate.city}, {estimate.state}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Project Type</h3>
            <p className="font-semibold text-sm">{toSentenceCase(estimate.projectType)}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Area</h3>
            <p className="font-semibold text-sm">{estimate.area.toLocaleString()} {estimate.areaUnit}</p>
          </div>
        </div>

        {/* Total Cost - Prominent */}
        <div className="bg-gradient-to-br from-vs/10 to-vs/5 p-6 rounded-xl text-center">
          <h3 className="text-sm text-vs-dark/70 mb-2">Estimated Project Cost</h3>
          <p className="text-4xl font-bold text-vs mb-2">{formatCurrency(estimate.totalCost)}</p>
          <p className="text-sm text-vs-dark/70">
            {formatCurrency(Math.round(estimate.totalCost / estimate.area))} per {estimate.areaUnit}
          </p>
        </div>

        {/* Architect Fee */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-blue-900">Architect's Fee (as per COA standards)</h3>
            <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded">{architectFeePercent}%</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-blue-800">Professional architectural services</p>
            <p className="text-lg font-bold text-blue-900">{formatCurrency(Math.round(architectFee))}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-blue-900">Total with Architect Fee</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(Math.round(totalWithArchitectFee))}</p>
            </div>
          </div>
        </div>

        {/* Per Sqm Breakdown */}
        <div>
          <h3 className="text-base font-semibold text-vs-dark mb-3">Cost per {estimate.areaUnit === "sqft" ? "sqm" : "sqm"} Breakdown</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-center mb-3">
              <p className="text-sm text-gray-600 mb-1">Total Rate per sqm</p>
              <p className="text-3xl font-bold text-vs">₹ {totalPerSqm.toLocaleString()}/sqm</p>
            </div>
            <div className="text-xs text-gray-600 text-center">
              Based on selected component quality levels
            </div>
          </div>
        </div>

        {/* Cost Breakdown Visualization */}
        <div>
          <h3 className="text-base font-semibold text-vs-dark mb-3">Cost Distribution</h3>
          <ImprovedCostVisualization estimate={estimate} />
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-base font-semibold text-vs-dark mb-3">Project Timeline & Costs</h3>
          <PhaseTimelineCost estimate={estimate} />
        </div>

        {/* Selected Features - List Format with Pricing */}
        <div>
          <h3 className="text-base font-semibold text-vs-dark mb-3">Selected Components & Features</h3>
          <div className="space-y-2">
            {pricingList.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <span className="text-xs font-semibold text-vs bg-vs/10 px-2 py-1 rounded-full whitespace-nowrap">
                          {formatLevel(item.level)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                          <IndianRupee className="size-3" />
                          <span className="font-medium">{item.perSqm}/sqm</span>
                        </div>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">{item.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pricingList.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No components selected</p>
          )}

          {/* Total Summary */}
          <div className="mt-4 pt-4 border-t border-gray-300">
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="text-vs-dark">Total Selected Components</span>
              <div className="flex items-center gap-1 text-vs">
                <IndianRupee className="size-5" />
                <span>{formatCurrency(estimate.totalCost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Range & Market Positioning */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Market Positioning (Bangalore 2025)</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-800">Estimated Range:</span>
              <span className="text-sm font-bold text-blue-900">
                {formatCurrency(Math.round(estimate.totalCost * 0.95))} - {formatCurrency(Math.round(estimate.totalCost * 1.05))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-800">Per {estimate.areaUnit} Range:</span>
              <span className="text-sm font-bold text-blue-900">
                ₹{Math.round((estimate.totalCost / estimate.area) * 0.95).toLocaleString()} - ₹{Math.round((estimate.totalCost / estimate.area) * 1.05).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Based on current Bangalore market rates (₹1,750-1,900/sqft standard range)
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-gray-700">
          <p className="font-medium text-orange-800 mb-1">Important Disclaimer:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Rates based on Bangalore 2025 market standards (₹1,750-1,900/sqft for standard quality)</li>
            <li>Actual costs may vary ±10% based on site conditions and material price fluctuations</li>
            <li>GST (12% effective) and professional fees included in estimate</li>
            <li>Detailed BOQ will be provided after site visit and requirement analysis</li>
            <li>Final pricing subject to contractor quotes and material availability</li>
          </ul>
        </div>
      </motion.div>

      {/* Meeting Scheduler */}
      <MeetingScheduler />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Download size={18} /> Download PDF
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-vs hover:bg-vs-light text-white font-semibold rounded-lg transition-colors"
        >
          <Share size={18} /> Share Estimate
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Start New Estimate
        </button>
      </div>
    </div>
  );
};

export default ResultsStep;
