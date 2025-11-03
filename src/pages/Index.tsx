
import { useEffect } from "react";
import EstimatorWizard from "@/components/EstimatorWizard";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container-custom max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display mb-4">
            Project Cost Estimator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get an accurate estimate for your architecture or interior design project in just a few steps.
          </p>
        </div>
        
        <EstimatorWizard />
      </div>
    </div>
  );
};

export default Index;
