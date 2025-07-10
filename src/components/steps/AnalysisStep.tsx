// components/steps/AnalysisStep.v2.tsx
import React, { useEffect, useState } from 'react';
import { Brain, CheckCircle, FileText, Sparkles, AlertCircle, Zap, Target, Loader } from 'lucide-react';
import { NatureDemande } from '@/types/openai';

// --- PROPS (inchangées) ---
interface AnalysisStepProps {
  description: string;
  onSimulateAnalysis: () => void;
  isAnalyzing?: boolean;
  extractedKeywords?: string[];
  natureDemande?: NatureDemande | null;
  error?: string | null;
}

// --- SOUS-COMPOSANTS POUR LA CLARTÉ ---

/**
 * Timeline visuelle pour montrer la progression de l'analyse.
 * C'est l'élément central pendant la phase de chargement.
 */
const AnalysisTimeline: React.FC<{ activePhase: 'extracting' | 'analyzing' | 'processing' }> = ({ activePhase }) => {
  const phases = [
    { id: 'extracting', title: 'Lecture des documents', icon: <FileText size={20} /> },
    { id: 'analyzing', title: 'Analyse par l\'IA', icon: <Brain size={20} /> },
    { id: 'processing', title: 'Extraction des mots-clés', icon: <Sparkles size={20} /> },
  ];
  const activeIndex = phases.findIndex(p => p.id === activePhase);

  return (
    <div className="w-full max-w-sm mx-auto">
      {phases.map((phase, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;

        return (
          <div key={phase.id} className="flex items-start">
            {/* Icône et ligne de connexion */}
            <div className="flex flex-col items-center mr-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isActive ? 'bg-indigo-600 border-indigo-600 text-white animate-pulse' :
                  'bg-slate-100 border-slate-300 text-slate-500'
                }`}
              >
                {isCompleted ? <CheckCircle size={20} /> : phase.icon}
              </div>
              {index < phases.length - 1 && (
                <div className={`w-0.5 h-12 transition-colors duration-300 ${isCompleted ? 'bg-green-500' : 'bg-slate-300'}`} />
              )}
            </div>
            {/* Texte de la phase */}
            <div className="pt-2">
              <p className={`font-semibold transition-colors duration-300 ${
                isCompleted ? 'text-green-600' :
                isActive ? 'text-indigo-600' :
                'text-slate-500'
              }`}>{phase.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};


/**
 * Version 2 du composant d'étape d'analyse.
 * L'objectif est de clarifier l'expérience en 3 états distincts :
 * 1. Prêt à lancer
 * 2. En cours d'analyse
 * 3. Résultats affichés
 */
export const AnalysisStep: React.FC<AnalysisStepProps> = ({
  onSimulateAnalysis,
  isAnalyzing = false,
  extractedKeywords = [],
  natureDemande,
  error
}) => {
  const [currentPhase, setCurrentPhase] = useState<'extracting' | 'analyzing' | 'processing'>('extracting');

  useEffect(() => {
    if (!isAnalyzing) return;
    
    // Simule la progression à travers les phases
    const timeouts = [
      setTimeout(() => setCurrentPhase('analyzing'), 1500),
      setTimeout(() => setCurrentPhase('processing'), 3500)
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [isAnalyzing]);

  const hasResults = extractedKeywords.length > 0;

  // --- RENDU CONDITIONNEL SELON L'ÉTAT ---

  // 1. État initial : Prêt à lancer l'analyse
  if (!isAnalyzing && !hasResults) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
        <div className="p-4 bg-indigo-100 rounded-full mb-4">
          <Zap className="w-10 h-10 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Prêt à lancer l'analyse IA</h2>
        <p className="text-slate-600 mt-2 max-w-lg">
          L'intelligence artificielle va lire vos documents, identifier les concepts juridiques clés et extraire les termes pertinents pour optimiser la recherche.
        </p>

        {natureDemande && (
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full max-w-md">
            <p className="font-semibold text-slate-700">Contexte d'analyse : <span className="text-indigo-600">{natureDemande.title}</span></p>
            <p className="text-slate-500">L'analyse sera spécialisée pour ce domaine.</p>
          </div>
        )}

        <button
          onClick={onSimulateAnalysis}
          className="mt-8 inline-flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-all transform hover:scale-105"
        >
          <Brain size={20} />
          Lancer l'analyse
        </button>
      </div>
    );
  }

  // 2. État intermédiaire : Analyse en cours
  if (isAnalyzing) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyse en cours...</h2>
        <p className="text-slate-600 mb-8">L'IA examine vos documents, veuillez patienter.</p>
        <AnalysisTimeline activePhase={currentPhase} />
      </div>
    );
  }

  // 3. État final : Résultats de l'analyse
  if (hasResults) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
        <div className="p-4 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Analyse terminée !</h2>
        <p className="text-slate-600 mt-2 max-w-lg">
          {extractedKeywords.length} mots-clés pertinents ont été extraits. Vous pouvez maintenant passer à la recherche.
        </p>
        
        <div className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-xl w-full max-w-2xl">
          <h3 className="text-left font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Target className="text-indigo-500" /> Mots-clés identifiés
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {extractedKeywords.map(keyword => (
              <span key={keyword} className="px-3 py-1 bg-white text-slate-700 rounded-full border border-slate-300 text-sm font-medium">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // État d'erreur (si nécessaire)
  if (error) {
    return (
       <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200 flex flex-col items-center">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-800">Une erreur est survenue</h2>
        <p className="text-red-700 mt-2">{error}</p>
      </div>
    );
  }

  return null; // Fallback
};