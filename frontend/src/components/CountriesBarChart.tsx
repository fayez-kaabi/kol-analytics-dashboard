/**
 * Bar chart visualization for top 10 countries by KOL count.
 * Uses Recharts library with interactive tooltips.
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CountryCount } from '../types/kol';

interface CountriesBarChartProps {
  data: CountryCount[];
}

// Color palette for bars
const COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#84cc16', // lime-500
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: CountryCount;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps): JSX.Element | null {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-800">{data.country}</p>
        <p className="text-sm text-gray-600">
          KOLs: <span className="font-bold text-blue-600">{data.count}</span>
        </p>
      </div>
    );
  }
  return null;
}

export function CountriesBarChart({ data }: CountriesBarChartProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Top 10 Countries by KOL Count
      </h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="country"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12, fill: '#4b5563' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#4b5563' }}
            label={{
              value: 'Number of KOLs',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 14, fill: '#4b5563' },
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

