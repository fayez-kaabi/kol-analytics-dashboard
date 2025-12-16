/**
 * Scatter plot showing relationship between publications and citations.
 * BONUS FEATURE: Second visualization (scatter plot)
 */

import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Legend,
} from 'recharts';
import type { KOL } from '../types/kol';

interface ScatterPlotChartProps {
  kols: KOL[];
}

interface ScatterDataPoint {
  name: string;
  publications: number;
  citations: number;
  hIndex: number;
  country: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ScatterDataPoint;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps): JSX.Element | null {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    const ratio = data.publications > 0 
      ? (data.citations / data.publications).toFixed(2) 
      : 'N/A';
    
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-xs">
        <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
        <p className="text-xs text-gray-600">{data.country}</p>
        <div className="mt-2 space-y-1 text-sm">
          <p className="text-gray-700">
            <span className="font-medium">Publications:</span> {data.publications}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Citations:</span> {data.citations.toLocaleString()}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">H-Index:</span> {data.hIndex}
          </p>
          <p className="text-blue-700 font-medium">
            <span className="font-medium">Ratio:</span> {ratio}
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function ScatterPlotChart({ kols }: ScatterPlotChartProps): JSX.Element {
  // Prepare data for scatter plot (filter out KOLs with missing data)
  const scatterData: ScatterDataPoint[] = React.useMemo(() => {
    return kols
      .filter(kol => 
        kol.publicationsCount !== null && 
        kol.citations !== null && 
        kol.hIndex !== null
      )
      .map(kol => ({
        name: kol.name,
        publications: kol.publicationsCount!,
        citations: kol.citations!,
        hIndex: kol.hIndex!,
        country: kol.country,
      }));
  }, [kols]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Publications vs Citations Analysis
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Each dot represents a KOL. Hover to see details. Size indicates H-Index.
      </p>
      
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            dataKey="publications"
            name="Publications"
            label={{
              value: 'Number of Publications',
              position: 'bottom',
              offset: 10,
              style: { fontSize: 14, fill: '#4b5563' },
            }}
            tick={{ fontSize: 12, fill: '#4b5563' }}
          />
          <YAxis
            type="number"
            dataKey="citations"
            name="Citations"
            label={{
              value: 'Total Citations',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 14, fill: '#4b5563' },
            }}
            tick={{ fontSize: 12, fill: '#4b5563' }}
          />
          <ZAxis 
            type="number" 
            dataKey="hIndex" 
            range={[50, 400]} 
            name="H-Index"
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            payload={[
              { 
                value: 'KOLs (size = H-Index)', 
                type: 'circle', 
                color: '#3b82f6' 
              }
            ]}
          />
          <Scatter 
            name="KOLs" 
            data={scatterData} 
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Key Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">📈</span>
            <p>
              <strong>Positive correlation:</strong> More publications generally lead to more citations
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-green-600 mr-2">💡</span>
            <p>
              <strong>Outliers above trend:</strong> High impact researchers with exceptional citation ratios
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-purple-600 mr-2">🎯</span>
            <p>
              <strong>Bubble size:</strong> Larger bubbles indicate higher H-Index (research impact)
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-orange-600 mr-2">⭐</span>
            <p>
              <strong>Top right quadrant:</strong> Most prolific and cited researchers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



