/**
 * Pie chart visualization for KOL distribution by expertise area.
 * BONUS FEATURE: Second visualization
 */

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { KOL } from '../types/kol';

interface ExpertisePieChartProps {
  kols: KOL[];
}

interface ExpertiseData {
  name: string;
  value: number;
  percentage: number;
}

// Color palette for pie slices
const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: ExpertiseData;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps): JSX.Element | null {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-sm text-gray-600">
          KOLs: <span className="font-bold text-blue-600">{data.value}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {data.percentage.toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
}

export function ExpertisePieChart({ kols }: ExpertisePieChartProps): JSX.Element {
  // Aggregate KOLs by expertise area
  const expertiseData: ExpertiseData[] = React.useMemo(() => {
    const countByExpertise = new Map<string, number>();
    
    kols.forEach(kol => {
      const current = countByExpertise.get(kol.expertiseArea) || 0;
      countByExpertise.set(kol.expertiseArea, current + 1);
    });

    const total = kols.length;
    
    return Array.from(countByExpertise.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: (value / total) * 100,
      }))
      .sort((a, b) => b.value - a.value);
  }, [kols]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        KOL Distribution by Expertise
      </h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={expertiseData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage.toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {expertiseData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value: string) => {
              const item = expertiseData.find(d => d.name === value);
              return item ? `${value} (${item.value})` : value;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {expertiseData.slice(0, 4).map((item, index) => (
            <div key={item.name} className="text-center">
              <div 
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <p className="text-xs font-medium text-gray-600 truncate">
                {item.name}
              </p>
              <p className="text-lg font-bold text-gray-800">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



