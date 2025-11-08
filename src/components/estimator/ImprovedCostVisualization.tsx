import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ProjectEstimate } from "@/types/estimator";

interface ImprovedCostVisualizationProps {
  estimate: ProjectEstimate;
}

interface CostItem {
  name: string;
  cost: number;
  percentage: number;
  category: string;
  color: string;
}

// Category colors matching the reference
const CATEGORY_COLORS: Record<string, string> = {
  "Planning": "#FFD700",
  "Foundation": "#000000",
  "Structure": "#0000FF",
  "Masonry": "#FF0000",
  "Brickwork": "#FFC0CB",
  "Finishes": "#800080",
  "Electrical": "#FFA500",
  "Plumbing": "#808080",
  "Doors": "#A0522D",
  "Core": "#008000",
};

const ImprovedCostVisualization = ({ estimate }: ImprovedCostVisualizationProps) => {
  const [data, setData] = useState<CostItem[]>([]);
  
  useEffect(() => {
    const formatData = () => {
      const items: CostItem[] = [];
      const totalCost = estimate.totalCost;
      
      const isIncluded = (value: any) => value && value !== 'none' && value !== '';
      
      // Planning phase
      const planningCost = estimate.phaseBreakdown.planning;
      if (planningCost > 0) {
        items.push({
          name: "Home Design & Approval",
          cost: planningCost,
          percentage: (planningCost / totalCost) * 100,
          category: "Planning",
          color: CATEGORY_COLORS["Planning"]
        });
      }
      
      // Construction breakdown
      const constructionCost = estimate.categoryBreakdown.construction;
      if (constructionCost > 0) {
        items.push({
          name: "Footing & Foundation",
          cost: constructionCost * 0.25,
          percentage: (constructionCost * 0.25 / totalCost) * 100,
          category: "Foundation",
          color: CATEGORY_COLORS["Foundation"]
        });
        
        items.push({
          name: "RCC Work - Columns & Slabs",
          cost: constructionCost * 0.40,
          percentage: (constructionCost * 0.40 / totalCost) * 100,
          category: "Structure",
          color: CATEGORY_COLORS["Structure"]
        });
        
        items.push({
          name: "Roof Slab",
          cost: constructionCost * 0.35,
          percentage: (constructionCost * 0.35 / totalCost) * 100,
          category: "Masonry",
          color: CATEGORY_COLORS["Masonry"]
        });
      }
      
      // Finishes breakdown
      const finishes = estimate.categoryBreakdown.finishes;
      if (finishes > 0) {
        if (isIncluded(estimate.buildingEnvelope)) {
          items.push({
            name: "Brickwork and Plastering",
            cost: finishes * 0.30,
            percentage: (finishes * 0.30 / totalCost) * 100,
            category: "Brickwork",
            color: CATEGORY_COLORS["Brickwork"]
          });
        }
        
        if (isIncluded(estimate.surfaces)) {
          items.push({
            name: "Flooring & Tiling",
            cost: finishes * 0.40,
            percentage: (finishes * 0.40 / totalCost) * 100,
            category: "Finishes",
            color: CATEGORY_COLORS["Finishes"]
          });
        }
        
        if (isIncluded(estimate.windows)) {
          items.push({
            name: "Door & Windows",
            cost: finishes * 0.30,
            percentage: (finishes * 0.30 / totalCost) * 100,
            category: "Doors",
            color: CATEGORY_COLORS["Doors"]
          });
        }
      }
      
      // Core systems
      const core = estimate.categoryBreakdown.core;
      if (core > 0) {
        if (isIncluded(estimate.electrical)) {
          items.push({
            name: "Electric Wiring",
            cost: core * 0.35,
            percentage: (core * 0.35 / totalCost) * 100,
            category: "Electrical",
            color: CATEGORY_COLORS["Electrical"]
          });
        }
        
        if (isIncluded(estimate.plumbing)) {
          items.push({
            name: "Water Supply & Plumbing",
            cost: core * 0.40,
            percentage: (core * 0.40 / totalCost) * 100,
            category: "Plumbing",
            color: CATEGORY_COLORS["Plumbing"]
          });
        }
        
        if (isIncluded(estimate.ac)) {
          items.push({
            name: "AC & HVAC Systems",
            cost: core * 0.25,
            percentage: (core * 0.25 / totalCost) * 100,
            category: "Core",
            color: CATEGORY_COLORS["Core"]
          });
        }
      }
      
      // Sort by cost descending
      return items.sort((a, b) => b.cost - a.cost);
    };
    
    setData(formatData());
  }, [estimate]);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value).replace('₹', '₹');
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded-md shadow-md text-xs">
          <p className="font-medium">{data.name}</p>
          <p className="text-vs">{formatCurrency(data.cost)}</p>
          <p className="text-gray-500">{data.percentage.toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-3">
      {/* Donut Chart */}
      <div className="flex justify-center">
        <div className="w-40 h-40">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <g transform="translate(100, 100)">
              {data.map((item, index) => {
                const startAngle = data.slice(0, index).reduce((sum, d) => sum + (d.percentage / 100) * 360, 0);
                const endAngle = startAngle + (item.percentage / 100) * 360;
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                
                const innerRadius = 50;
                const outerRadius = 80;
                
                const x1 = Math.cos(startRad) * innerRadius;
                const y1 = Math.sin(startRad) * innerRadius;
                const x2 = Math.cos(startRad) * outerRadius;
                const y2 = Math.sin(startRad) * outerRadius;
                const x3 = Math.cos(endRad) * outerRadius;
                const y3 = Math.sin(endRad) * outerRadius;
                const x4 = Math.cos(endRad) * innerRadius;
                const y4 = Math.sin(endRad) * innerRadius;
                
                const largeArc = item.percentage > 50 ? 1 : 0;
                
                const pathData = [
                  `M ${x1} ${y1}`,
                  `L ${x2} ${y2}`,
                  `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}`,
                  `L ${x4} ${y4}`,
                  `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`,
                  'Z'
                ].join(' ');
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px]">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-2.5 h-2.5 mr-1 rounded-sm flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-700 truncate">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Horizontal Bar Chart */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={Math.min(data.length * 25 + 20, 150)}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 5, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={0}
              tick={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost breakdown list */}
      <div className="space-y-0.5 max-h-40 overflow-y-auto">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-[10px] py-1 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <div 
                className="w-1.5 h-1.5 rounded-sm flex-shrink-0" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700 truncate">{item.name}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="font-medium text-vs">{formatCurrency(item.cost)}</span>
              <span className="text-gray-500 text-[9px] w-8 text-right">{item.percentage.toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImprovedCostVisualization;
