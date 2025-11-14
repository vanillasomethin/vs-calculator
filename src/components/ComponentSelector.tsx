// components/ComponentSelector.tsx
import React from 'react';
import { useEstimator } from '@/contexts/EstimatorContext';
import { COMPONENT_INFO, ComponentOption } from '@/types/estimator';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const ComponentSelector: React.FC = () => {
  const { 
    estimate, 
    handleOptionChange, 
    componentDetails, 
    projectTypes,
    handleNext,
    handlePrevious,
  } = useEstimator();

  const projectConfig = projectTypes[estimate.projectType as keyof typeof projectTypes];
  const areaInSqM = estimate.areaUnit === 'sqft' ? estimate.area * 0.092903 : estimate.area;

  // Filter components based on project type
  const availableComponents = COMPONENT_INFO.filter(
    comp => !projectConfig.excludes.includes(comp.key)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getOptionLabel = (option: ComponentOption) => {
    const labels = {
      none: 'Not Included',
      standard: 'Standard',
      premium: 'Premium',
      luxury: 'Luxury',
    };
    return labels[option];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" style={{ cursor: 'default' }}>
      {/* Sticky Estimate Summary */}
      <div className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Total Estimated Cost</h2>
              <p className="text-sm text-slate-600 mt-1">
                {estimate.area} {estimate.areaUnit === 'sqft' ? 'sq.ft.' : 'sq.m.'} • {projectConfig.label}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">
                {formatCurrency(estimate.totalCost)}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {formatCurrency(estimate.totalCost / estimate.area)} per {estimate.areaUnit === 'sqft' ? 'sq.ft.' : 'sq.m.'}
              </div>
            </div>
          </div>
          
          {/* Quick Category Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
            {estimate.categoryBreakdown.construction > 0 && (
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-600 font-medium">Construction</div>
                <div className="text-lg font-bold text-slate-900">
                  {formatCurrency(estimate.categoryBreakdown.construction)}
                </div>
              </div>
            )}
            {estimate.categoryBreakdown.core > 0 && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-600 font-medium">Core Systems</div>
                <div className="text-lg font-bold text-blue-900">
                  {formatCurrency(estimate.categoryBreakdown.core)}
                </div>
              </div>
            )}
            {estimate.categoryBreakdown.finishes > 0 && (
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-xs text-purple-600 font-medium">Finishes</div>
                <div className="text-lg font-bold text-purple-900">
                  {formatCurrency(estimate.categoryBreakdown.finishes)}
                </div>
              </div>
            )}
            {estimate.categoryBreakdown.interiors > 0 && (
              <div className="bg-amber-50 rounded-lg p-3">
                <div className="text-xs text-amber-600 font-medium">Interiors</div>
                <div className="text-lg font-bold text-amber-900">
                  {formatCurrency(estimate.categoryBreakdown.interiors)}
                </div>
              </div>
            )}
            {estimate.categoryBreakdown.landscape > 0 && (
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-green-600 font-medium">Landscape</div>
                <div className="text-lg font-bold text-green-900">
                  {formatCurrency(estimate.categoryBreakdown.landscape)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Component Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Customize Your Project Components
          </h1>
          <p className="text-slate-600">
            Select the quality level for each component. Costs update in real-time.
          </p>
        </div>

        <div className="space-y-6">
          {availableComponents.map((component) => {
            const currentValue = estimate[component.key as keyof typeof estimate] as ComponentOption;
            const componentCost = estimate.componentCosts?.[component.key] || 0;
            const details = componentDetails[component.key]?.[currentValue] || [];

            return (
              <div
                key={component.key}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-md"
                style={{ cursor: 'default' }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-slate-900">
                          {component.name}
                        </h3>
                        {componentCost > 0 && (
                          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {formatCurrency(componentCost)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{component.description}</p>
                    </div>
                  </div>

                  {/* Option Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['none', 'standard', 'premium', 'luxury'] as ComponentOption[]).map((option) => {
                      const isSelected = currentValue === option;
                      const pricing = componentDetails[component.key]?.[option] || [];
                      const optionCost = pricing.length > 0 
                        ? (componentDetails[component.key]?.[option]?.length || 0) * areaInSqM 
                        : 0;

                      return (
                        <button
                          key={option}
                          onClick={() => handleOptionChange(component.key, option)}
                          className={`
                            relative p-4 rounded-lg border-2 transition-all duration-200
                            ${isSelected 
                              ? 'border-blue-600 bg-blue-50 shadow-md scale-105' 
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                            }
                          `}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="text-sm font-semibold text-slate-900">
                            {getOptionLabel(option)}
                          </div>
                          {option !== 'none' && (
                            <div className="text-xs text-slate-600 mt-1">
                              +{formatCurrency((componentDetails[component.key]?.[option]?.length || 0) * areaInSqM)}
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <ChevronDown className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Included Elements */}
                  {details.length > 0 && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Included Elements:</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {details.map((item, idx) => (
                          <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={handlePrevious}
            className="px-6 py-3 text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200"
            style={{ cursor: 'pointer' }}
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{ cursor: 'pointer' }}
          >
            View Detailed Report →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentSelector;
