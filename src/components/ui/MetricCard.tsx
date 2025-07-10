// src/components/ui/MetricCard.tsx
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  color = 'blue',
  size = 'md',
  className = ""
}) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      red: 'bg-red-50 text-red-700 border-red-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getValueColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      red: 'text-red-600'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getSizeClasses = (size: string) => {
    const sizeMap = {
      sm: 'p-4 text-2xl',
      md: 'p-6 text-3xl',
      lg: 'p-8 text-4xl'
    };
    return sizeMap[size] || sizeMap.md;
  };

  return (
    <div className={`text-center rounded-xl border ${getColorClasses(color)} ${getSizeClasses(size)} ${className}`}>
      <div className={`font-bold mb-2 ${getValueColorClasses(color)} ${getSizeClasses(size).split(' ')[1]}`}>
        {value}
      </div>
      <div className="text-sm font-medium">{title}</div>
      {subtitle && (
        <div className="text-xs opacity-75 mt-1">{subtitle}</div>
      )}
    </div>
  );
};

// Usage examples:
/*
<MetricCard 
  title="Articles pertinents" 
  value={12} 
  color="blue" 
  size="md" 
/>

<MetricCard 
  title="Score de pertinence" 
  value="85%" 
  subtitle="Très élevé" 
  color="green" 
  size="lg" 
/>
*/