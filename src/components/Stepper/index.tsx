import { Step } from "@/components/Stepper/types";
import { CheckCircle } from "lucide-react";
import React from "react";

export const Stepper = ({ currentStep, onStepClick, steps }: {
    currentStep: number;
    onStepClick: (index: number) => void;
    steps: Step[];
  }) => {
    return (
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;
            const isClickable = index <= currentStep || isCompleted;
            
            return (
              <React.Fragment key={step.id}>
                {/* Étape */}
                <div 
                  className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                    isClickable ? 'hover:scale-105' : 'cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => isClickable && onStepClick(index)}
                >
                  {/* Cercle avec icône */}
                  <div className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : isActive 
                        ? 'bg-blue-500 text-white shadow-lg ring-4 ring-blue-200' 
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                    
                    {/* Indicateur de progression */}
                    {isActive && (
                      <div className="absolute -inset-1 bg-blue-500 rounded-full animate-pulse opacity-30"></div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="text-center">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 max-w-20">
                      {step.subtitle}
                    </div>
                  </div>
                </div>
  
                {/* Connecteur */}
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-4 transition-all duration-500
                    ${currentStep > index ? 'bg-green-500' : 'bg-gray-300'}
                  `}>
                    <div className={`
                      h-full transition-all duration-1000 ease-out
                      ${currentStep > index 
                        ? 'w-full bg-green-500' 
                        : currentStep === index 
                          ? 'w-1/2 bg-blue-500' 
                          : 'w-0 bg-gray-300'
                      }
                    `}></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };