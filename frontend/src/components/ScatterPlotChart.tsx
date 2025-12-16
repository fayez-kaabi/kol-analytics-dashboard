/**
 * Scatter plot showing relationship between publications and citations.
 * BONUS FEATURE: Second visualization (scatter plot)
 */

import { useMemo } from 'react';
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
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs">
        <p className="font-medium text-gray-800 mb-1">{data.name}</p>
        <p className="text-xs text-gray-500 mb-2">{data.country}</p>
        <div className="space-y-1 text-sm text-gray-600">
          <p>Publications: <span className="font-medium text-gray-800">{data.publications}</span></p>
          <p>Citations: <span className="font-medium text-gray-800">{data.citations.toLocaleString()}</span></p>
          <p>H-Index: <span className="font-medium text-gray-800">{data.hIndex}</span></p>
          <p>Ratio: <span className="font-medium text-slate-700">{ratio}</span></p>
        </div>
      </div>
    );
  }
  return null;
}

export function ScatterPlotChart({ kols }: ScatterPlotChartProps): JSX.Element {
  const scatterData: ScatterDataPoint[] = useMemo(() => {
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
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <h2 className="text-base font-semibold text-gray-800 mb-1">
        Publications vs Citations Analysis
      </h2>
      <p className="text-xs text-gray-500 mb-6">
        Each point represents a KOL. Size indicates H-Index.
      </p>
      
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            dataKey="publications"
            name="Publications"
            label={{
              value: 'Publications',
              position: 'bottom',
              offset: 10,
              style: { fontSize: 12, fill: '#64748b' },
            }}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <YAxis
            type="number"
            dataKey="citations"
            name="Citations"
            label={{
              value: 'Citations',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 12, fill: '#64748b' },
            }}
            tick={{ fontSize: 11, fill: '#64748b' }}
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
            payload={[{ value: 'KOLs (size = H-Index)', type: 'circle', color: '#64748b' }]}
          />
          <Scatter 
            name="KOLs" 
            data={scatterData} 
            fill="#64748b"
            fillOpacity={0.5}
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Key Insights */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Key Insights</p>
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-slate-400">→</span>
            <p><span className="font-medium text-gray-700">Positive correlation:</span> More publications generally lead to more citations</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-slate-400">→</span>
            <p><span className="font-medium text-gray-700">Outliers above trend:</span> High impact researchers with exceptional citation ratios</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-slate-400">→</span>
            <p><span className="font-medium text-gray-700">Bubble size:</span> Larger bubbles indicate higher H-Index (research impact)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-slate-400">→</span>
            <p><span className="font-medium text-gray-700">Top right quadrant:</span> Most prolific and cited researchers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
