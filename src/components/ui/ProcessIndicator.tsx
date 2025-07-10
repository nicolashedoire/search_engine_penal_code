// src/components/ui/ProcessIndicator.tsx
import React from 'react';
import { CheckCircle, LucideIcon } from 'lucide-react';
import Loader from '@/components/ui/loader';

interface ProcessStep {
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon?: LucideIcon;
}

interface ProcessIndicatorProps {
  steps: ProcessStep[];
  className?: string;
}

export const ProcessIndicator: React.FC<ProcessIndicatorProps> = ({ 
  steps, 
  className = "" 
}) => {
  const getStatusColors = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-blue-50 border-blue-200';
      case 'in-progress': return 'bg-purple-50 border-purple-200';
      case 'pending': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconColors = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-blue-500 text-white';
      case 'in-progress': return 'bg-purple-500 text-white';
      case 'pending': return 'bg-gray-300 text-gray-600';
      default: return 'bg-gray-300 text-gray-600';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {steps.map((step, index) => (
        <div 
          key={index}
          className={`flex items-center gap-4 p-4 rounded-lg ${getStatusColors(step.status)}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconColors(step.status)}`}>
            {step.status === 'completed' ? (
              <CheckCircle className="w-6 h-6" />
            ) : step.status === 'in-progress' ? (
              <Loader />
            ) : step.icon ? (
              <step.icon className="w-6 h-6" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-current opacity-30" />
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">{step.title}</div>
            <div className="text-sm text-gray-600">{step.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Usage example:
/*
const analysisSteps = [
  {
    title: "Extraction du texte",
    description: "OCR et lecture des documents terminée",
    status: "completed"
  },
  {
    title: "Analyse IA",
    description: "Identification du domaine juridique et des éléments clés...",
    status: "in-progress"
  }
];

<ProcessIndicator steps={analysisSteps} />
*/