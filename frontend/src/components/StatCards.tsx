/**
 * Dashboard statistics cards component.
 * Displays key metrics in a responsive grid layout.
 */

import React from 'react';
import type { KOLStats } from '../types/kol';

interface StatCardsProps {
  stats: KOLStats;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  bgColor: string;
}

function StatCard({ title, value, icon, bgColor }: StatCardProps): JSX.Element {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}

export function StatCards({ stats }: StatCardsProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total KOLs"
        value={stats.total_kols.toLocaleString()}
        icon="👥"
        bgColor="bg-blue-600"
      />
      <StatCard
        title="Countries"
        value={stats.unique_countries}
        icon="🌍"
        bgColor="bg-green-600"
      />
      <StatCard
        title="Total Publications"
        value={stats.total_publications.toLocaleString()}
        icon="📚"
        bgColor="bg-purple-600"
      />
      <StatCard
        title="Avg H-Index"
        value={stats.avg_h_index.toFixed(1)}
        icon="📊"
        bgColor="bg-orange-600"
      />
    </div>
  );
}

