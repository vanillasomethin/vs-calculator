import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";
import EstimatorWizard from "@/components/EstimatorWizard";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-background py-4 px-4">
      {/* Simple Header with Logo/Title */}
      <div className="container-custom max-w-5xl mx-auto mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/1938f286-8b49-49bf-bc47-3ac7ef7d6cab.png" 
              alt="Vanilla & Somethin'" 
              className="h-16 md:h-20"
            />
          </div>
          <Link 
            to="/architect-fee"
            className="flex items-center gap-2 px-4 py-2 text-sm bg-vs/10 hover:bg-vs/20 text-vs rounded-lg transition-colors"
          >
            <Calculator size={16} />
            <span className="hidden sm:inline">Detailed Fee Calculator</span>
            <span className="sm:hidden">Fees</span>
          </Link>
        </div>
      </div>

      <div className="container-custom max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-display mb-2">
            Project Cost Estimator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Get an accurate estimate for your architecture or interior design project in just a few steps.
          </p>
        </div>
        
        <EstimatorWizard />
      </div>

      {/* Footer */}
      <div className="container-custom max-w-5xl mx-auto mt-8">
        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          <p>© {new Date().getFullYear()} VS Collective LLP. All rights reserved.</p>
          <p className="mt-2">
            <a href="mailto:design@vanillasometh.in" className="hover:text-vs transition-colors">
              design@vanillasometh.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
