/**
 * Pie chart visualization for KOL distribution by expertise area.
 * BONUS FEATURE: Second visualization
 * 
 * Shows top 8 expertise areas, groups rest as "Other" to avoid UI clutter.
 */

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { KOL } from '../types/kol';

const MAX_CATEGORIES = 8; // Show top 8, group rest as "Other"

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
  '#6b7280', // gray (for "Other")
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
  // Aggregate KOLs by expertise area, limit to top categories
  const { chartData, totalCategories } = useMemo(() => {
    const countByExpertise = new Map<string, number>();
    
    kols.forEach(kol => {
      const current = countByExpertise.get(kol.expertiseArea) || 0;
      countByExpertise.set(kol.expertiseArea, current + 1);
    });

    const total = kols.length;
    const totalCats = countByExpertise.size;
    
    // Sort by count descending
    const sorted = Array.from(countByExpertise.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: (value / total) * 100,
      }))
      .sort((a, b) => b.value - a.value);

    // Take top N and group rest as "Other"
    if (sorted.length <= MAX_CATEGORIES) {
      return { chartData: sorted, totalCategories: totalCats };
    }

    const top = sorted.slice(0, MAX_CATEGORIES);
    const otherValue = sorted.slice(MAX_CATEGORIES).reduce((sum, item) => sum + item.value, 0);
    
    if (otherValue > 0) {
      top.push({
        name: `Other (${sorted.length - MAX_CATEGORIES} more)`,
        value: otherValue,
        percentage: (otherValue / total) * 100,
      });
    }

    return { chartData: top, totalCategories: totalCats };
  }, [kols]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          KOL Distribution by Expertise
        </h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {totalCategories} categories
        </span>
      </div>
      
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="w-full lg:w-1/2">
          <div className="space-y-2">
            {chartData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-700 truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
