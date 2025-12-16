/**
 * Pie chart visualization for KOL distribution by expertise area.
 * BONUS FEATURE: Second visualization
 */

import { useMemo } from 'react';
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

// Professional muted color palette
const COLORS = [
  '#475569', // slate-600
  '#64748b', // slate-500
  '#78716c', // stone-500
  '#6b7280', // gray-500
  '#71717a', // zinc-500
  '#52525b', // zinc-600
  '#57534e', // stone-600
  '#44403c', // stone-700
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
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-800">{data.name}</p>
        <p className="text-sm text-gray-600">
          KOLs: <span className="font-semibold">{data.value}</span>
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
  const expertiseData: ExpertiseData[] = useMemo(() => {
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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-6">
        KOL Distribution by Expertise
      </h2>
      
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={expertiseData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage.toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            stroke="#fff"
            strokeWidth={2}
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
    </div>
  );
}
