// components/navigation/StepNavigation.v2.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

// --- PROPS (inchangées) ---
interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
}

/**
 * Version 2 du composant de navigation entre les étapes.
 * Intègre une barre de progression visuelle et un style de boutons modernisé
 * pour une meilleure clarté et une expérience utilisateur plus engageante.
 */
export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isNextDisabled,
}) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  // --- Classes de style pour les boutons pour une meilleure lisibilité ---
  const baseButtonClasses = "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const prevButtonClasses = `
    ${baseButtonClasses}
    ${currentStep === 0 
      ? 'text-slate-400 cursor-not-allowed' 
      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400'
    }
  `;

  const nextButtonClasses = `
    ${baseButtonClasses}
    ${isNextDisabled 
      ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm'
    }
  `;

  return (
    <div className="w-full space-y-5 border-t border-slate-200 pt-5">
      {/* Section de la barre de progression */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-blue-700">
            Étape {currentStep + 1} sur {totalSteps}
          </span>
          <span className="text-sm text-slate-500">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Section des boutons de navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={currentStep === 0}
          className={prevButtonClasses}
        >
          <ChevronLeft className="w-5 h-5" />
          Précédent
        </button>

        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={nextButtonClasses}
        >
          Suivant
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};