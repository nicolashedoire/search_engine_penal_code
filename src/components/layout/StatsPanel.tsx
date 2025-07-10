// src/components/layout/StatsPanel.tsx
import React from 'react';

interface StatItem {
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

interface StatsPanelProps {
  stats: StatItem[];
  className?: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ 
  stats, 
  className = "" 
}) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600', 
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    };
    return colorMap[color] || 'text-gray-600';
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-2xl font-bold mb-1 ${getColorClasses(stat.color)}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Usage example:
/*
const statsData = [
  { label: "Articles disponibles", value: 15847, color: "blue" },
  { label: "Recherches aujourd'hui", value: 2847, color: "green" },
  { label: "Mise à jour", value: "24h", color: "purple" },
  { label: "Disponibilité", value: "99.9%", color: "orange" }
];

<StatsPanel stats={statsData} className="mt-8" />
*/