import React, { useState, useRef } from 'react';
import { calculateArchitectFee } from '@/utils/feeCalculations';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ArchitectFee = () => {
  const [projectType, setProjectType] = useState('Individual House');
  const [constructionCost, setConstructionCost] = useState<number>(5000000);
  const [area, setArea] = useState<number>(2000);
  const [clientType, setClientType] = useState('Individual');
  const [complexity, setComplexity] = useState('Standard');
  const [includeFFE, setIncludeFFE] = useState(false);
  const [includeLandscape, setIncludeLandscape] = useState(false);
  const [vizPackage, setVizPackage] = useState('Standard');
  const [isRush, setIsRush] = useState(false);
  const [currency, setCurrency] = useState('INR');

  const contentRef = useRef<HTMLDivElement>(null);

  const architectFee = calculateArchitectFee(
    projectType,
    constructionCost,
    area,
    clientType,
    complexity,
    includeFFE,
    includeLandscape,
    vizPackage,
    isRush,
    currency
  );

  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';

  const exportToPDF = async () => {
    if (!contentRef.current) return;

    try {
      // Create a clone of the content for PDF generation
      const clonedContent = contentRef.current.cloneNode(true) as HTMLElement;

      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.padding = '20mm';
      tempContainer.style.backgroundColor = 'white';
      document.body.appendChild(tempContainer);

      // Add logo to the cloned content
      const logoDiv = document.createElement('div');
      logoDiv.style.textAlign = 'center';
      logoDiv.style.marginBottom = '20px';
      const logo = document.createElement('img');
      logo.src = '/lovable-uploads/1938f286-8b49-49bf-bc47-3ac7ef7d6cab.png';
      logo.style.height = '80px';
      logo.style.margin = '0 auto';
      logoDiv.appendChild(logo);

      tempContainer.appendChild(logoDiv);
      tempContainer.appendChild(clonedContent);

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate canvas from the temporary container
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('architect-fee-estimate.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container-custom max-w-6xl mx-auto">
        <div ref={contentRef}>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display mb-2">
              Architect Fee Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              Calculate professional fees based on your project details
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Input Section */}
            <div className="glass-card border border-primary/5 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-lg">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Individual House">Individual House</option>
                    <option value="Residential Block">Residential Block</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Construction Cost ({currencySymbol})</label>
                  <input
                    type="number"
                    value={constructionCost}
                    onChange={(e) => setConstructionCost(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Area (sq m)</label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Client Type</label>
                  <select
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Friend/Family">Friend/Family</option>
                    <option value="Individual">Individual</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Developer">Developer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Complexity</label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Simple">Simple</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Visualization Package</label>
                  <select
                    value={vizPackage}
                    onChange={(e) => setVizPackage(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="None">None</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeFFE}
                      onChange={(e) => setIncludeFFE(e.target.checked)}
                      className="w-4 h-4 rounded border-primary/10"
                    />
                    <span className="text-sm font-medium">Include FF&E Procurement</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={includeLandscape}
                      onChange={(e) => setIncludeLandscape(e.target.checked)}
                      className="w-4 h-4 rounded border-primary/10"
                    />
                    <span className="text-sm font-medium">Include Landscape Design</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isRush}
                      onChange={(e) => setIsRush(e.target.checked)}
                      className="w-4 h-4 rounded border-primary/10"
                    />
                    <span className="text-sm font-medium">Rush Project (25% premium)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="glass-card border border-primary/5 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-lg">Fee Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-primary/5">
                  <span className="text-sm">Base Design Fee:</span>
                  <span className="text-sm font-medium">{currencySymbol}{architectFee.baseFee.toLocaleString()}</span>
                </div>

                {includeFFE && (
                  <div className="flex justify-between py-2 border-b border-primary/5">
                    <span className="text-sm">FF&E Fee:</span>
                    <span className="text-sm font-medium">{currencySymbol}{architectFee.ffeFee.toLocaleString()}</span>
                  </div>
                )}

                {includeLandscape && (
                  <div className="flex justify-between py-2 border-b border-primary/5">
                    <span className="text-sm">Landscape Design:</span>
                    <span className="text-sm font-medium">{currencySymbol}{architectFee.landscapeFee.toLocaleString()}</span>
                  </div>
                )}

                {vizPackage !== 'None' && (
                  <div className="flex justify-between py-2 border-b border-primary/5">
                    <span className="text-sm">Visualization Package:</span>
                    <span className="text-sm font-medium">{currencySymbol}{architectFee.vizFee.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b border-primary/5">
                  <span className="text-sm">Overhead Allocation:</span>
                  <span className="text-sm font-medium">{currencySymbol}{architectFee.overheadAllocation.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-primary/5">
                  <span className="text-sm">Profit Margin (15%):</span>
                  <span className="text-sm font-medium">{currencySymbol}{architectFee.profit.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-primary/5">
                  <span className="text-sm">Tax (18%):</span>
                  <span className="text-sm font-medium">{currencySymbol}{architectFee.tax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-3 mt-4 bg-primary/5 px-4 rounded-lg">
                  <span className="font-semibold">Total Professional Fee:</span>
                  <span className="font-semibold text-lg">{currencySymbol}{architectFee.totalFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={exportToPDF}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Export to PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectFee;
