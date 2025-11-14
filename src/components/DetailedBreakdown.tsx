// components/DetailedBreakdown.tsx
import React from 'react';
import { useEstimator } from '@/contexts/EstimatorContext';
import { COMPONENT_INFO } from '@/types/estimator';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Package, CheckCircle } from 'lucide-react';

const DetailedBreakdown: React.FC = () => {
  const { 
    estimate, 
    componentDetails, 
    projectTypes,
    handleNext,
    handlePrevious,
  } = useEstimator();

  const projectConfig = projectTypes[estimate.projectType as keyof typeof projectTypes];
  const areaInSqM = estimate.areaUnit === 'sqft' ? estimate.area * 0.092903 : estimate.area;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Prepare data for category pie chart
  const categoryData = [
    { name: 'Construction', value: estimate.categoryBreakdown.construction, color: '#64748b' },
    { name: 'Core Systems', value: estimate.categoryBreakdown.core, color: '#3b82f6' },
    { name: 'Finishes', value: estimate.categoryBreakdown.finishes, color: '#a855f7' },
    { name: 'Interiors', value: estimate.categoryBreakdown.interiors, color: '#f59e0b' },
    { name: 'Landscape', value: estimate.categoryBreakdown.landscape, color: '#10b981' },
  ].filter(item => item.value > 0);

  // Prepare data for phase breakdown
  const phaseData = [
    { name: 'Planning & Design', cost: estimate.phaseBreakdown.planning, months: estimate.timeline.phases.planning },
    { name: 'Construction', cost: estimate.phaseBreakdown.construction, months: estimate.timeline.phases.construction },
    { name: 'Interiors & Finishes', cost: estimate.phaseBreakdown.interiors, months: estimate.timeline.phases.interiors },
  ];

  // Component breakdown data
  const componentBreakdown = COMPONENT_INFO
    .filter(comp => !projectConfig.excludes.includes(comp.key))
    .map(comp => {
      const currentValue = estimate[comp.key as keyof typeof estimate];
      const cost = estimate.componentCosts?.[comp.key] || 0;
      const details = componentDetails[comp.key]?.[currentValue as string] || [];
      return {
        ...comp,
        selectedOption: currentValue,
        cost,
        details,
      };
    })
    .filter(comp => comp.cost > 0);

  const getOptionLabel = (option: string) => {
    const labels: Record<string, string> = {
      none: 'Not Included',
      standard: 'Standard',
      premium: 'Premium',
      luxury: 'Luxury',
    };
    return labels[option] || option;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" style={{ cursor: 'default' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Detailed Cost Breakdown & Timeline
          </h1>
          <p className="text-lg text-slate-600">
            Complete analysis of your {projectConfig.label.toLowerCase()} project
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Total</span>
            </div>
            <div className="text-3xl font-bold mb-2">{formatCurrency(estimate.totalCost)}</div>
            <div className="text-blue-100">
              {formatCurrency(estimate.totalCost / estimate.area)} per {estimate.areaUnit === 'sqft' ? 'sq.ft.' : 'sq.m.'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Area</span>
            </div>
            <div className="text-3xl font-bold mb-2">
              {estimate.area} {estimate.areaUnit === 'sqft' ? 'sq.ft.' : 'sq.m.'}
            </div>
            <div className="text-purple-100">
              {estimate.buildingType.charAt(0).toUpperCase() + estimate.buildingType.slice(1)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Duration</span>
            </div>
            <div className="text-3xl font-bold mb-2">{estimate.timeline.totalMonths} Months</div>
            <div className="text-amber-100">Expected completion time</div>
          </div>
        </div>

        {/* Cost Distribution Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Cost Distribution by Category</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${((entry.value / estimate.totalCost) * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {categoryData.map((category, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium text-slate-900">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{formatCurrency(category.value)}</div>
                    <div className="text-sm text-slate-600">
                      {((category.value / estimate.totalCost) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Timeline */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Project Timeline & Phase Breakdown</h2>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={phaseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
              <Tooltip 
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Bar dataKey="cost" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {phaseData.map((phase, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">{phase.name}</h3>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Cost:</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(phase.cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Duration:</span>
                    <span className="font-semibold text-slate-900">{phase.months} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Percentage:</span>
                    <span className="font-semibold text-slate-900">
                      {((phase.cost / estimate.totalCost) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Component Breakdown */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Component-wise Breakdown</h2>
          
          <div className="space-y-4">
            {componentBreakdown.map((component, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-white p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-lg">{component.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Quality: <span className="font-medium text-blue-600">{getOptionLabel(component.selectedOption as string)}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(component.cost)}</div>
                    <div className="text-sm text-slate-600">
                      {formatCurrency(component.cost / areaInSqM)} per {estimate.areaUnit === 'sqft' ? 'sq.ft.' : 'sq.m.'}
                    </div>
                  </div>
                </div>
                
                {component.details.length > 0 && (
                  <div className="p-4 bg-slate-50">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Included Elements:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {component.details.map((detail, detailIdx) => (
                        <div key={detailIdx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <button
            onClick={handlePrevious}
            className="px-6 py-3 text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200"
            style={{ cursor: 'pointer' }}
          >
            ← Back to Components
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{ cursor: 'pointer' }}
          >
            Schedule Consultation →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedBreakdown;
