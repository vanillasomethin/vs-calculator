import React, { useState, useRef, useEffect } from 'react';
import { calculateArchitectFee } from '@/utils/feeCalculations';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle, Users, Building2, Zap, FileText, Home, Building, Store } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ArchitectFee() {
  const [projectType, setProjectType] = useState<string | null>(null);
  const [constructionCost, setConstructionCost] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [clientType, setClientType] = useState<string | null>(null);
  const [complexity, setComplexity] = useState<string | null>(null);
  const [clientInvolvement, setClientInvolvement] = useState<string | null>(null);
  const [includeFFE, setIncludeFFE] = useState(false);
  const [includeLandscape, setIncludeLandscape] = useState(false);
  const [vizPackage, setVizPackage] = useState('None');
  const [isRush, setIsRush] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [costError, setCostError] = useState('');
  const [areaError, setAreaError] = useState('');

  const contentRef = useRef<HTMLDivElement>(null);

  // Project type options with icons and descriptions
  const projectTypes = [
    {
      id: 'Individual House',
      name: 'Individual House',
      icon: Home,
      description: 'Single residential unit design',
      baseRate: '8% of construction cost',
      minFee: '₹20,000'
    },
    {
      id: 'Residential Block',
      name: 'Residential Block',
      icon: Building2,
      description: 'Multi-unit residential complex',
      baseRate: '5% of construction cost',
      minFee: '₹50,000'
    },
    {
      id: 'Commercial',
      name: 'Commercial',
      icon: Building,
      description: 'Office, retail, or commercial space',
      baseRate: '4% of construction cost',
      minFee: '₹80,000'
    }
  ];

  // Client type options
  const clientTypes = [
    {
      id: 'Friend/Family',
      name: 'Friend/Family',
      description: 'Special discounted rate',
      multiplier: '0.85×',
      discount: '15% off'
    },
    {
      id: 'Individual',
      name: 'Individual',
      description: 'Standard client rate',
      multiplier: '1.0×',
      discount: 'Standard'
    },
    {
      id: 'Corporate',
      name: 'Corporate',
      description: 'Corporate/business client',
      multiplier: '1.15×',
      discount: '+15%'
    },
    {
      id: 'Developer',
      name: 'Developer',
      description: 'Real estate developer',
      multiplier: '1.10×',
      discount: '+10%'
    }
  ];

  // Complexity levels
  const complexityLevels = [
    {
      id: 'Simple',
      name: 'Simple',
      description: 'Straightforward design, minimal complexity',
      multiplier: '0.9×',
      inclusions: ['Basic layouts', 'Standard materials', 'Simple elevations']
    },
    {
      id: 'Standard',
      name: 'Standard',
      description: 'Moderate complexity with custom elements',
      multiplier: '1.0×',
      inclusions: ['Custom layouts', 'Mixed materials', 'Detailed elevations', 'Basic 3D views']
    },
    {
      id: 'Premium',
      name: 'Premium',
      description: 'High-end design with advanced features',
      multiplier: '1.2×',
      inclusions: ['Complex layouts', 'Premium materials', 'Advanced elevations', 'Multiple 3D renderings', 'Custom details']
    },
    {
      id: 'Luxury',
      name: 'Luxury',
      description: 'Ultra-luxury with bespoke design elements',
      multiplier: '1.5×',
      inclusions: ['Bespoke layouts', 'Luxury finishes', 'Architectural features', 'Extensive 3D work', 'Custom millwork', 'High-end detailing']
    }
  ];

  // Client involvement levels
  const involvementLevels = [
    {
      id: 'Minimal',
      name: 'Minimal Involvement',
      description: 'Provide clear brief, trust design decisions',
      multiplier: '1.035×',
      premium: '+3.5%',
      inclusions: ['Initial consultation', 'Design presentation (2 rounds)', 'Email updates']
    },
    {
      id: 'Low',
      name: 'Low Involvement',
      description: 'Occasional input on major decisions only',
      multiplier: '1.075×',
      premium: '+7.5%',
      inclusions: ['Regular consultation', 'Design reviews (3 rounds)', 'Bi-weekly updates']
    },
    {
      id: 'Moderate',
      name: 'Moderate Involvement',
      description: 'Regular reviews and feedback on key milestones',
      multiplier: '1.125×',
      premium: '+12.5%',
      inclusions: ['Weekly meetings', 'Design reviews (4 rounds)', 'Phone & email support']
    },
    {
      id: 'High',
      name: 'High Involvement',
      description: 'Frequent involvement, detailed reviews, multiple revisions',
      multiplier: '1.175×',
      premium: '+17.5%',
      inclusions: ['Bi-weekly meetings', 'Design reviews (unlimited)', 'Priority support', 'Real-time collaboration']
    },
    {
      id: 'Flexible',
      name: 'Flexible',
      description: 'Custom arrangement based on project needs',
      multiplier: '1.10×',
      premium: '+10%',
      inclusions: ['Negotiated schedule', 'Custom review rounds', 'Flexible communication']
    }
  ];

  // Visualization packages
  const vizPackages = [
    {
      id: 'None',
      name: 'No Visualization',
      description: '2D drawings only',
      price: 0,
      inclusions: []
    },
    {
      id: 'Standard',
      name: 'Standard Package',
      description: 'Basic 3D renderings',
      price: 25000,
      inclusions: ['3-4 exterior views', 'Basic materials', 'HD resolution']
    },
    {
      id: 'Premium',
      name: 'Premium Package',
      description: 'Detailed 3D visualization',
      price: 50000,
      inclusions: ['6-8 views (exterior + interior)', 'Realistic materials', '4K resolution', 'Day & night shots']
    },
    {
      id: 'Luxury',
      name: 'Luxury Package',
      description: 'Photorealistic renders + walkthrough',
      price: 100000,
      inclusions: ['10+ views', 'Photorealistic materials', '4K resolution', '360° panoramas', 'Animated walkthrough']
    }
  ];

  // Calculate fee whenever inputs change
  const architectFee = React.useMemo(() => {
    if (!projectType || !clientType || !complexity || !clientInvolvement || !constructionCost || !area) {
      return {
        baseFee: 0,
        cifAdjustment: 0,
        ffeFee: 0,
        landscapeFee: 0,
        vizFee: 0,
        overheadAllocation: 0,
        profit: 0,
        tax: 0,
        totalFee: 0
      };
    }

    return calculateArchitectFee(
      projectType,
      parseFloat(constructionCost) || 0,
      parseFloat(area) || 0,
      clientType,
      complexity,
      includeFFE,
      includeLandscape,
      vizPackage,
      isRush,
      currency,
      clientInvolvement
    );
  }, [projectType, constructionCost, area, clientType, complexity, includeFFE, includeLandscape, vizPackage, isRush, currency, clientInvolvement]);

  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';

  const handleCostInput = (value: string) => {
    setCostError('');
    const cost = parseFloat(value);

    if (value === '') {
      setConstructionCost(value);
      return;
    }

    if (isNaN(cost) || cost <= 0) {
      setCostError('Please enter a valid construction cost greater than 0');
      setConstructionCost(value);
      return;
    }

    if (cost > 1000000000) {
      setCostError('Cost exceeds typical range. Please contact for consultation.');
      setConstructionCost(value);
      return;
    }

    setConstructionCost(value);
  };

  const handleAreaInput = (value: string) => {
    setAreaError('');
    const areaValue = parseFloat(value);

    if (value === '') {
      setArea(value);
      return;
    }

    if (isNaN(areaValue) || areaValue <= 0) {
      setAreaError('Please enter a valid area greater than 0');
      setArea(value);
      return;
    }

    if (areaValue > 1000000) {
      setAreaError('Area exceeds typical range. Please contact for consultation.');
      setArea(value);
      return;
    }

    setArea(value);
  };

  const exportToPDF = async () => {
    if (!contentRef.current) return;

    try {
      const clonedContent = contentRef.current.cloneNode(true) as HTMLElement;
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '210mm';
      tempContainer.style.padding = '20mm';
      tempContainer.style.backgroundColor = 'white';
      document.body.appendChild(tempContainer);

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

      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(tempContainer);

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

  // Get all inclusions
  const getAllInclusions = () => {
    let inclusions: string[] = [];

    // Base inclusions
    inclusions.push('Professional Consultation');
    inclusions.push('COA Compliance');
    inclusions.push('Technical Documentation');

    // Complexity inclusions
    if (complexity) {
      const complexityData = complexityLevels.find(c => c.id === complexity);
      if (complexityData) {
        inclusions.push(...complexityData.inclusions);
      }
    }

    // Involvement inclusions
    if (clientInvolvement) {
      const involvementData = involvementLevels.find(i => i.id === clientInvolvement);
      if (involvementData) {
        inclusions.push(...involvementData.inclusions);
      }
    }

    // Visualization inclusions
    if (vizPackage !== 'None') {
      const vizData = vizPackages.find(v => v.id === vizPackage);
      if (vizData) {
        inclusions.push(...vizData.inclusions);
      }
    }

    // Additional services
    if (includeFFE) {
      inclusions.push('FF&E Procurement Services');
      inclusions.push('Furniture & Equipment Planning');
    }

    if (includeLandscape) {
      inclusions.push('Landscape Design');
      inclusions.push('Garden & Outdoor Planning');
    }

    if (isRush) {
      inclusions.push('Priority Rush Service');
      inclusions.push('Expedited Delivery');
    }

    return [...new Set(inclusions)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-2">
                Professional Fee Calculator
              </h1>
              <p className="text-gray-600">
                Calculate architect fees based on COA standards and project requirements
              </p>
            </div>
            {isRush && (
              <div className="bg-amber-100 border border-amber-300 rounded-lg px-4 py-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-900">Rush Project</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - Calculator */}
          <div className="lg:col-span-2.5 space-y-8">

            {/* Step 1: Project Type */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step 1: Project Type</h2>

              <div className="grid gap-4">
                {projectTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setProjectType(type.id)}
                      className={`text-left p-5 rounded-lg border-2 transition-all ${
                        projectType === type.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                          projectType === type.id ? 'bg-emerald-500' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${projectType === type.id ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{type.name}</p>
                          <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span><strong>Rate:</strong> {type.baseRate}</span>
                            <span><strong>Min:</strong> {type.minFee}</span>
                          </div>
                        </div>
                        {projectType === type.id && (
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Project Details */}
            {projectType && (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step 2: Project Details</h2>

                <div className="space-y-6">
                  {/* Construction Cost */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Construction Cost ({currencySymbol})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={constructionCost}
                        onChange={(e) => handleCostInput(e.target.value)}
                        placeholder="e.g., 5000000"
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                          costError
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-gray-300 focus:border-emerald-500'
                        }`}
                      />
                      <span className="absolute right-4 top-3.5 text-gray-500 font-medium">{currencySymbol}</span>
                    </div>

                    {costError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{costError}</p>
                      </div>
                    )}
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Built-up Area (sq.ft)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={area}
                        onChange={(e) => handleAreaInput(e.target.value)}
                        placeholder="e.g., 2000"
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                          areaError
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-gray-300 focus:border-emerald-500'
                        }`}
                      />
                      <span className="absolute right-4 top-3.5 text-gray-500 font-medium">sq.ft</span>
                    </div>

                    {areaError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{areaError}</p>
                      </div>
                    )}
                  </div>

                  {/* Currency Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Currency
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['INR', 'USD', 'EUR'].map(curr => (
                        <button
                          key={curr}
                          onClick={() => setCurrency(curr)}
                          className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                            currency === curr
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {curr} ({curr === 'INR' ? '₹' : curr === 'USD' ? '$' : '€'})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Client Type */}
            {projectType && constructionCost && area && !costError && !areaError && (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step 3: Client Type</h2>

                <div className="grid md:grid-cols-2 gap-3">
                  {clientTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setClientType(type.id)}
                      className={`text-left px-4 py-4 rounded-lg border-2 transition-all ${
                        clientType === type.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-900">{type.name}</p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          clientType === type.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {type.discount}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{type.description}</p>
                      <p className="text-xs text-gray-500">Multiplier: {type.multiplier}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Complexity */}
            {clientType && (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step 4: Design Complexity</h2>

                <div className="space-y-3">
                  {complexityLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setComplexity(level.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        complexity === level.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{level.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded ${
                          complexity === level.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {level.multiplier}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {level.inclusions.map((inc, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {inc}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Client Involvement */}
            {complexity && (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Users className="w-6 h-6 text-emerald-600" />
                  Step 5: Client Involvement Level
                </h2>
                <p className="text-gray-600 mb-6">
                  Select your expected involvement throughout the project (affects fee & timeline)
                </p>

                <div className="space-y-3">
                  {involvementLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setClientInvolvement(level.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        clientInvolvement === level.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{level.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded flex-shrink-0 ${
                          clientInvolvement === level.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {level.premium}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Multiplier: ×{level.multiplier} on base fee
                      </p>
                    </button>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">📋 Client Involvement Factor:</span> COA-compliant adjustment for the time and iterations required based on your expected engagement level.
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Additional Services */}
            {clientInvolvement && (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Step 6: Additional Services (Optional)</h2>

                <div className="space-y-6">
                  {/* Visualization Package */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Visualization Package</h3>
                    <div className="space-y-3">
                      {vizPackages.map(pkg => (
                        <button
                          key={pkg.id}
                          onClick={() => setVizPackage(pkg.id)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            vizPackage === pkg.id
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{pkg.name}</p>
                              <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                              {pkg.inclusions.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {pkg.inclusions.map((inc, idx) => (
                                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                      {inc}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              <p className="font-semibold text-emerald-600">
                                {pkg.price === 0 ? 'Included' : `+${currencySymbol}${pkg.price.toLocaleString()}`}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Other Add-ons */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Services</h3>
                    <div className="space-y-3">
                      <div
                        onClick={() => setIncludeFFE(!includeFFE)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          includeFFE
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                            includeFFE
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-gray-300'
                          }`}>
                            {includeFFE && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">FF&E Procurement</p>
                            <p className="text-sm text-gray-600 mt-1">Furniture, Fixtures & Equipment planning and procurement</p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="font-semibold text-emerald-600">Calculated</p>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => setIncludeLandscape(!includeLandscape)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          includeLandscape
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                            includeLandscape
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-gray-300'
                          }`}>
                            {includeLandscape && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Landscape Design</p>
                            <p className="text-sm text-gray-600 mt-1">Garden design and outdoor space planning</p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="font-semibold text-emerald-600">Calculated</p>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => setIsRush(!isRush)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isRush
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                            isRush
                              ? 'bg-amber-500 border-amber-500'
                              : 'border-gray-300'
                          }`}>
                            {isRush && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                              Rush Project
                              <Zap className="w-4 h-4 text-amber-600" />
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Expedited delivery with priority handling</p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="font-semibold text-amber-600">+25%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Summary */}
          <div className="lg:col-span-1.5">
            <div className="sticky top-28 space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Professional Fee Quote
                </h3>

                {architectFee.totalFee > 0 ? (
                  <>
                    {/* Breakdown */}
                    <div className="space-y-3 mb-8 pb-8 border-b border-gray-200 text-sm">
                      {architectFee.baseFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Design Fee</span>
                          <span className="font-semibold text-gray-900">
                            {currencySymbol}{architectFee.baseFee.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {architectFee.cifAdjustment > 0 && (
                        <div className="flex justify-between bg-amber-50 px-3 py-2 rounded">
                          <span className="text-amber-900 font-medium">
                            Client Involvement
                            <span className="text-xs text-amber-700 ml-1">({clientInvolvement})</span>
                          </span>
                          <span className="font-semibold text-amber-900">
                            +{currencySymbol}{architectFee.cifAdjustment.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {architectFee.ffeFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">FF&E Procurement</span>
                          <span className="font-semibold text-gray-900">
                            {currencySymbol}{architectFee.ffeFee.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {architectFee.landscapeFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Landscape Design</span>
                          <span className="font-semibold text-gray-900">
                            {currencySymbol}{architectFee.landscapeFee.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {architectFee.vizFee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Visualization Package</span>
                          <span className="font-semibold text-gray-900">
                            {currencySymbol}{architectFee.vizFee.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {architectFee.overheadAllocation > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Overhead Allocation</span>
                          <span className="font-semibold text-gray-900">
                            {currencySymbol}{architectFee.overheadAllocation.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {architectFee.profit > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Profit Margin (15%)</span>
                          <span className="font-semibold text-gray-900">
                            {currencySymbol}{architectFee.profit.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {architectFee.tax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">GST (18%)</span>
                          <span className="font-semibold text-gray-900">
                            {currencySymbol}{architectFee.tax.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="mb-8">
                      <p className="text-gray-600 text-sm mb-2">Total Professional Fee</p>
                      <p className="text-5xl font-light text-emerald-600">
                        {currencySymbol}{architectFee.totalFee.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">Including GST @ 18%</p>
                    </div>

                    {/* Payment Breakdown */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-8">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                        Payment Schedule (50-30-20)
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Upfront (50%)</span>
                          <span className="font-semibold text-gray-900">
                            {currencySymbol}{Math.round(architectFee.totalFee * 0.5).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Submission (30%)</span>
                          <span className="font-semibold text-gray-900">
                            {currencySymbol}{Math.round(architectFee.totalFee * 0.3).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Delivery (20%)</span>
                          <span className="font-semibold text-gray-900">
                            {currencySymbol}{Math.round(architectFee.totalFee * 0.2).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <Button
                      onClick={exportToPDF}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors mb-3"
                    >
                      Export to PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Send Quote via Email
                    </Button>

                    {/* COA Compliance Note */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">COA Compliant</p>
                          <p>Pricing follows Council of Architecture guidelines & standards.</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Complete the steps to calculate your professional fee
                    </p>
                  </div>
                )}
              </div>

              {/* What's Included */}
              {architectFee.totalFee > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    Included in Your Quote
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getAllInclusions().map((inclusion, idx) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
                        <span className="text-gray-700">{inclusion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COA Standards */}
              {projectType && (
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                  <h4 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    COA Standards
                  </h4>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li className="flex gap-2">
                      <span className="font-bold flex-shrink-0">•</span>
                      <span>National Building Code (NBC) Compliance</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold flex-shrink-0">•</span>
                      <span>Local Municipal Building Bylaws</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold flex-shrink-0">•</span>
                      <span>Professional Liability Insurance</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold flex-shrink-0">•</span>
                      <span>Registered Architect Supervision</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden content for PDF export */}
      <div className="hidden">
        <div ref={contentRef}>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Professional Fee Estimate
            </h1>
            <p className="text-gray-600">COA Compliant Architecture Services</p>
          </div>

          {architectFee.totalFee > 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Project Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Project Type:</span>
                    <span className="ml-2 font-medium">{projectType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Client Type:</span>
                    <span className="ml-2 font-medium">{clientType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Construction Cost:</span>
                    <span className="ml-2 font-medium">{currencySymbol}{parseFloat(constructionCost).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Area:</span>
                    <span className="ml-2 font-medium">{area} sq.ft</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Complexity:</span>
                    <span className="ml-2 font-medium">{complexity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Involvement:</span>
                    <span className="ml-2 font-medium">{clientInvolvement}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Fee Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span>Base Design Fee</span>
                    <span className="font-semibold">{currencySymbol}{architectFee.baseFee.toLocaleString()}</span>
                  </div>
                  {architectFee.cifAdjustment > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span>Client Involvement Adjustment</span>
                      <span className="font-semibold">+{currencySymbol}{architectFee.cifAdjustment.toLocaleString()}</span>
                    </div>
                  )}
                  {architectFee.ffeFee > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span>FF&E Procurement</span>
                      <span className="font-semibold">{currencySymbol}{architectFee.ffeFee.toLocaleString()}</span>
                    </div>
                  )}
                  {architectFee.landscapeFee > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span>Landscape Design</span>
                      <span className="font-semibold">{currencySymbol}{architectFee.landscapeFee.toLocaleString()}</span>
                    </div>
                  )}
                  {architectFee.vizFee > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span>Visualization Package</span>
                      <span className="font-semibold">{currencySymbol}{architectFee.vizFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span>Overhead Allocation</span>
                    <span className="font-semibold">{currencySymbol}{architectFee.overheadAllocation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Profit Margin (15%)</span>
                    <span className="font-semibold">{currencySymbol}{architectFee.profit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>GST (18%)</span>
                    <span className="font-semibold">{currencySymbol}{architectFee.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span>Total Professional Fee</span>
                    <span className="text-emerald-600">{currencySymbol}{architectFee.totalFee.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center border-t pt-4">
                <p>This estimate is based on COA (Council of Architecture) guidelines and industry standards.</p>
                <p className="mt-1">Valid for 30 days from date of generation.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-3">
            Questions about your quote?
          </h2>
          <p className="text-gray-600 mb-6">
            Our COA-registered architects can help you customize your package or answer any questions.
          </p>
          <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Schedule a Free Consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
