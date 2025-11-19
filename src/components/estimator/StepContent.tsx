import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
// 🛠️ FIX 1: Ensure handleOptionChange is destructured
import { useEstimator } from "@/context/EstimatorContext";
import LocationStep from "@/components/estimator/LocationStep";
import ProjectTypeStep from "@/components/estimator/ProjectTypeStep";
import AreaStep from "@/components/estimator/AreaStep";
import BudgetMatchingStep from "@/components/estimator/BudgetMatchingStep";
import ComponentsStep from "@/components/estimator/ComponentsStep";
import FinishesStep from "@/components/estimator/FinishesStep";
import InteriorsStep from "@/components/estimator/InteriorsStep";
import ResultsStep from "@/components/estimator/ResultsStep";

const StepContent = () => {
  // ✅ FIX 1: Destructure handleOptionChange
  const { step, estimate, updateEstimate, handleReset, handleSaveEstimate, handleOptionChange } = useEstimator();

  // Set default "standard" options when first reaching step 5 (components step)
  useEffect(() => {
    if (step === 5) {
      const componentsToInitialize = [
        'plumbing', 'ac', 'electrical', 'elevator', 'civilQuality',
        'lighting', 'windows', 'ceiling', 'surfaces', 'buildingEnvelope',
        'fixedFurniture', 'looseFurniture', 'furnishings', 'appliances', 'artefacts'
      ];

      componentsToInitialize.forEach(component => {
        if (!estimate[component as keyof typeof estimate]) {
          updateEstimate(component as keyof typeof estimate, 'standard');
        }
      });
    }
  }, [step, estimate, updateEstimate]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="min-h-[300px]"
      >
        {step === 1 && (
          <LocationStep
            selectedState={estimate.state}
            selectedCity={estimate.city}
            onStateSelect={(state) => updateEstimate('state', state)}
            onCitySelect={(city) => updateEstimate('city', city)}
          />
        )}

        {step === 2 && (
          <ProjectTypeStep
            selectedType={estimate.projectType}
            selectedWorkTypes={estimate.workTypes}
            selectedRoomConfig={estimate.roomConfiguration}
            selectedLandscapeAreas={estimate.landscapeAreas}
            selectedConstructionSubtype={estimate.constructionSubtype}
            selectedFloorCount={estimate.floorCount}
            selectedAreaInputType={estimate.areaInputType}
            onSelectType={(type) => updateEstimate('projectType', type)}
            onSelectWorkTypes={(workTypes) => updateEstimate('workTypes', workTypes)}
            onSelectRoomConfig={(config) => updateEstimate('roomConfiguration', config)}
            onSelectLandscapeAreas={(areas) => updateEstimate('landscapeAreas', areas)}
            onSelectConstructionSubtype={(subtype) => updateEstimate('constructionSubtype', subtype)}
            onSelectFloorCount={(count) => updateEstimate('floorCount', count)}
            onSelectAreaInputType={(type) => updateEstimate('areaInputType', type)}
          />
        )}

        {step === 3 && (
          <AreaStep
            area={estimate.area}
            areaUnit={estimate.areaUnit}
            projectType={estimate.projectType}
            city={estimate.city}
            constructionSubtype={estimate.constructionSubtype}
            floorCount={estimate.floorCount}
            areaInputType={estimate.areaInputType}
            onAreaChange={(area) => updateEstimate('area', area)}
            onUnitChange={(unit) => updateEstimate('areaUnit', unit)}
            onBuiltUpAreaChange={(builtUpArea) => updateEstimate('builtUpArea', builtUpArea)}
            onFSIComplianceChange={(isCompliant) => updateEstimate('fsiCompliant', isCompliant)}
          />
        )}

        {step === 4 && (
          <BudgetMatchingStep
            budget={estimate.budget || 0}
            estimate={estimate}
            onBudgetChange={(budget) => updateEstimate('budget', budget)}
            onApplySuggestions={(suggestions) => {
              Object.entries(suggestions).forEach(([key, value]) => {
                updateEstimate(key as keyof typeof estimate, value);
              });
            }}
          />
        )}

        {step === 5 && (
          <div className="space-y-6">
            <ComponentsStep
              plumbing={estimate.plumbing}
              ac={estimate.ac}
              electrical={estimate.electrical}
              elevator={estimate.elevator}
              civilQuality={estimate.civilQuality}
              workTypes={estimate.workTypes}
              onOptionChange={handleOptionChange}
            />

            <FinishesStep
              lighting={estimate.lighting}
              windows={estimate.windows}
              ceiling={estimate.ceiling}
              surfaces={estimate.surfaces}
              buildingEnvelope={estimate.buildingEnvelope}
              workTypes={estimate.workTypes}
              onOptionChange={handleOptionChange}
            />

            <InteriorsStep
              fixedFurniture={estimate.fixedFurniture}
              looseFurniture={estimate.looseFurniture}
              furnishings={estimate.furnishings}
              appliances={estimate.appliances}
              artefacts={estimate.artefacts}
              workTypes={estimate.workTypes}
              onOptionChange={handleOptionChange}
            />
          </div>
        )}

        {step === 6 && (
          <ResultsStep
            estimate={estimate}
            onReset={handleReset}
            onSave={handleSaveEstimate}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default StepContent;
