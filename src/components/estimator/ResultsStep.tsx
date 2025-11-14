import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, ArrowLeft, Calendar, TrendingUp } from 'lucide-react';
import { ProjectEstimate, ComponentOption } from '@/types/estimator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

interface ResultsStepProps {
  estimate: ProjectEstimate;
  onReset: () => void;
  onSave: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ estimate, onReset, onSave }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  const formatLabel = (str: string) => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase())
      .trim();
  };

  // Prepare cost breakdown data
  const categoryData = [
    { name: 'Construction', value: estimate.categoryBreakdown.construction, color: '#7A1E1F' },
    { name: 'Core Systems', value: estimate.categoryBreakdown.core, color: '#a45a5a' },
    { name: 'Finishes', value: estimate.categoryBreakdown.finishes, color: '#c68e8e' },
    { name: 'Interiors', value: estimate.categoryBreakdown.interiors, color: '#e9cece' },
  ].filter(item => item.value > 0);

  // Component-level breakdown with prices
  const componentBreakdown = [
    { label: 'Civil Quality', value: estimate.civilQuality, category: 'Construction' },
    { label: 'Plumbing', value: estimate.plumbing, category: 'Core Systems' },
    { label: 'Electrical', value: estimate.electrical, category: 'Core Systems' },
    { label: 'AC & HVAC', value: estimate.ac, category: 'Core Systems' },
    { label: 'Elevator', value: estimate.elevator, category: 'Core Systems' },
    { label: 'Building Envelope', value: estimate.buildingEnvelope, category: 'Finishes' },
    { label: 'Lighting', value: estimate.lighting, category: 'Finishes' },
    { label: 'Windows', value: estimate.windows, category: 'Finishes' },
    { label: 'Ceiling', value: estimate.ceiling, category: 'Finishes' },
    { label: 'Surfaces', value: estimate.surfaces, category: 'Finishes' },
    { label: 'Fixed Furniture', value: estimate.fixedFurniture, category: 'Interiors' },
    { label: 'Loose Furniture', value: estimate.looseFurniture, category: 'Interiors' },
    { label: 'Furnishings', value: estimate.furnishings, category: 'Interiors' },
    { label: 'Appliances', value: estimate.appliances, category: 'Interiors' },
    { label: 'Artefacts', value: estimate.artefacts, category: 'Interiors' },
  ].filter(item => item.value !== 'none');

  // Timeline phases
  const timelinePhases = [
    { 
      name: 'Planning & Design', 
      duration: estimate.timeline.phases.planning,
      cost: estimate.phaseBreakdown.planning,
      color: '#FFD700',
      description: 'Design development, approvals, permits'
    },
    { 
      name: 'Construction', 
      duration: estimate.timeline.phases.construction,
      cost: estimate.phaseBreakdown.construction,
      color: '#7A1E1F',
      description: 'Foundation, structure, core systems'
    },
    { 
      name: 'Finishes & Interiors', 
      duration: estimate.timeline.phases.interiors,
      cost: estimate.phaseBreakdown.interiors,
      color: '#a45a5a',
      description: 'Finishes, fixtures, furniture installation'
    },
  ];

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Project Estimate',
        text: `Estimate: ${formatCurrency(estimate.totalCost)} for ${estimate.area} ${estimate.areaUnit} ${estimate.projectType} project in ${estimate.city}`,
      });
    } catch (error) {
      console.log('Sharing not supported');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Project Overview */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Location</h3>
            <p className="font-semibold text-sm">{estimate.city}, {estimate.state}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Project Type</h3>
            <p className="font-semibold text-sm capitalize">{estimate.projectType}</p>
          </div>
          <div>
            <h3 className="text-xs text-vs-dark/70 mb-1">Area</h3>
            <p className="font-semibold text-sm">{estimate.area.toLocaleString()} {estimate.areaUnit}</p>
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-gradient-to-br from-vs/10 to-vs/5 p-6 rounded-xl text-center mt-4">
          <h3 className="text-sm text-vs-dark/70 mb-2">Total Estimated Cost</h3>
          <p className="text-4xl font-bold text-vs mb-2">
            {formatCurrency(estimate.totalCost)}
          </p>
          <p className="text-sm text-vs-dark/70">
            {formatCurrency(Math.round(estimate.totalCost / estimate.area))} per {estimate.areaUnit}
          </p>
        </div>
      </div>

      {/* Cost Distribution Chart */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-vs-dark mb-4 flex items-center gap-2">
          <TrendingUp size={18} />
          Cost Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {categoryData.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Component Breakdown */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-vs-dark mb-4">Detailed Component Breakdown</h3>
        <div className="space-y-3">
          {componentBreakdown.map((item, index) => (
            <div key={index} className="border-b pb-3 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-vs-dark/60">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold capitalize text-vs">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Timeline */}
      <div className="glass-card border border-primary/5 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-vs-dark mb-4 flex items-center gap-2">
          <Calendar size={18} />
          Project Timeline
        </h3>
        
        <div className="mb-6">
          <div className="text-center mb-4">
            <p className="text-2xl font-bold text-vs">{estimate.timeline.totalMonths} Months</p>
            <p className="text-sm text-vs-dark/70">Total Duration</p>
          </div>
          
          <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden flex">
            {timelinePhases.map((phase, index) => {
              const widthPercent = (phase.duration / estimate.timeline.totalMonths) * 100;
              return (
                <div
                  key={index}
                  className="flex items-center justify-center text-white text-xs font-medium px-2"
                  style={{ 
                    width: `${widthPercent}%`,
                    backgroundColor: phase.color
                  }}
                >
                  {phase.duration}m
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {timelinePhases.map((phase, index) => (
            <div key={index} className="border-l-4 pl-4" style={{ borderColor: phase.color }}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-medium text-sm">{phase.name}</p>
                  <p className="text-xs text-vs-dark/60">{phase.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{phase.duration} months</p>
                  <p className="text-xs text-vs-dark/70">{formatCurrency(phase.cost)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-medium text-orange-800 mb-2">Important Notes:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>This is an indicative estimate based on standard inputs and market rates for {estimate.city}</li>
          <li>Final costs may vary based on site conditions, material availability, and specific requirements</li>
          <li>Timeline may vary based on approval processes and weather conditions</li>
          <li>Contact our team for a detailed, customized quote</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-vs hover:bg-vs-light text-white font-semibold rounded-lg transition-colors"
        >
          <Share2 size={18} />
          Share Estimate
        </button>
        <button 
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-3 bg-vs hover:bg-vs-light text-white font-semibold rounded-lg transition-colors"
        >
          <Download size={18} />
          Download PDF
        </button>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 border border-vs text-vs hover:bg-vs/5 font-semibold rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          New Estimate
        </button>
      </div>
    </motion.div>
  );
};

export default ResultsStep;
