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
  const [clientInvolvement, setClientInvolvement] = useState('Moderate');
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
    currency,
    clientInvolvement
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
            <h1 className="text-3xl md:text-4xl font-display mb-2 text-vs-dark">
              Architect Fee Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              Calculate professional fees based on COA standards and your project details
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Input Section */}
            <div className="glass-card border border-vs/10 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4 text-lg text-vs-dark">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-vs/20 bg-background focus:outline-none focus:ring-2 focus:ring-vs/30"
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
                    className="w-full px-4 py-2 rounded-lg border border-vs/20 bg-background focus:outline-none focus:ring-2 focus:ring-vs/30"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Area (sqft)</label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border border-vs/20 bg-background focus:outline-none focus:ring-2 focus:ring-vs/30"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Client Type</label>
                  <select
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-vs/20 bg-background focus:outline-none focus:ring-2 focus:ring-vs/30"
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
                    className="w-full px-4 py-2 rounded-lg border border-vs/20 bg-background focus:outline-none focus:ring-2 focus:ring-vs/30"
                  >
                    <option value="Simple">Simple</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Client Involvement Level</label>
                  <select
                    value={clientInvolvement}
                    onChange={(e) => setClientInvolvement(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-vs/20 bg-background focus:outline-none focus:ring-2 focus:ring-vs/30"
                  >
                    <option value="Minimal">Minimal (+2-5%)</option>
                    <option value="Low">Low (+5-10%)</option>
                    <option value="Moderate">Moderate (+10-15%)</option>
                    <option value="High">High (+15-20%)</option>
                    <option value="Flexible">Flexible (Negotiated)</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {clientInvolvement === 'Minimal' && 'Client provides clear brief, trusts design decisions'}
                    {clientInvolvement === 'Low' && 'Occasional input on major decisions only'}
                    {clientInvolvement === 'Moderate' && 'Regular reviews and feedback on key milestones'}
                    {clientInvolvement === 'High' && 'Frequent involvement, detailed reviews, multiple revisions'}
                    {clientInvolvement === 'Flexible' && 'Custom arrangement based on project needs'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Visualization Package</label>
                  <select
                    value={vizPackage}
                    onChange={(e) => setVizPackage(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-vs/20 bg-background focus:outline-none focus:ring-2 focus:ring-vs/30"
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
                    className="w-full px-4 py-2 rounded-lg border border-vs/20 bg-background focus:outline-none focus:ring-2 focus:ring-vs/30"
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
            <div className="glass-card border border-vs/10 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4 text-lg text-vs-dark">Fee Breakdown</h3>

              {/* Total Fee - Prominent Display */}
              <div className="bg-gradient-to-br from-vs/10 to-vs/5 p-5 rounded-xl text-center mb-5">
                <h3 className="text-sm text-vs-dark/70 mb-2">Total Professional Fee</h3>
                <p className="text-3xl font-bold text-vs mb-1">{currencySymbol}{architectFee.totalFee.toLocaleString()}</p>
                <p className="text-xs text-vs-dark/50">Including GST @ 18%</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">Base Design Fee:</span>
                  <span className="text-sm font-semibold text-vs-dark">{currencySymbol}{architectFee.baseFee.toLocaleString()}</span>
                </div>

                {architectFee.cifAdjustment > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-700">
                      Client Involvement Factor:
                      <span className="text-xs text-muted-foreground ml-1">({clientInvolvement})</span>
                    </span>
                    <span className="text-sm font-semibold text-vs-dark">+{currencySymbol}{architectFee.cifAdjustment.toLocaleString()}</span>
                  </div>
                )}

                {includeFFE && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-700">FF&E Procurement:</span>
                    <span className="text-sm font-semibold text-vs-dark">{currencySymbol}{architectFee.ffeFee.toLocaleString()}</span>
                  </div>
                )}

                {includeLandscape && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-700">Landscape Design:</span>
                    <span className="text-sm font-semibold text-vs-dark">{currencySymbol}{architectFee.landscapeFee.toLocaleString()}</span>
                  </div>
                )}

                {vizPackage !== 'None' && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-700">Visualization Package:</span>
                    <span className="text-sm font-semibold text-vs-dark">{currencySymbol}{architectFee.vizFee.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">Overhead Allocation:</span>
                  <span className="text-sm font-semibold text-vs-dark">{currencySymbol}{architectFee.overheadAllocation.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">Profit Margin (15%):</span>
                  <span className="text-sm font-semibold text-vs-dark">{currencySymbol}{architectFee.profit.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-700">GST (18%):</span>
                  <span className="text-sm font-semibold text-vs-dark">{currencySymbol}{architectFee.tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={exportToPDF}
                  className="w-full bg-vs hover:bg-vs-light text-white transition-colors"
                >
                  Export to PDF
                </Button>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-gray-700">
                  <p className="font-medium text-orange-800 mb-1">Note:</p>
                  <p className="text-gray-600">Fees calculated as per Council of Architecture (COA) guidelines</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectFee;
