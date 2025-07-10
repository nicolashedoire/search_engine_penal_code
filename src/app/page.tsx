"use client";
import React, { useEffect, useReducer, useState, useCallback, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { initialState, reducer } from "@/reducers/articlesReducer";
import useSearch from "@/hooks/useSearch";
import useArticleSearch from "@/hooks/useArticleSearch";
import { useKeywordExtraction } from "@/hooks/useKeywordExtraction"; // 🆕 Nouveau hook
import { fetchArticles } from "@/utils/fetchArticles";
import { DocumentInput, AnalysisResult, StepData, NatureDemande } from "@/types/openai"; // 🆕 Types TypeScript

// Layout Components
import { Header } from "@/components/layout/Header";
import { StatsPanel } from "@/components/layout/StatsPanel";

// UI Components
import { Stepper } from "@/components/Stepper";
import { StepNavigation } from "@/components/StepNavigation";

// Step Components
import { NatureDemandStep } from "@/components/steps/NatureDemandStep"; // 🆕 Nouvelle étape
import { UploadStep } from "@/components/steps/UploadStep";
import { AnalysisStep } from "@/components/steps/AnalysisStep";
import { SearchStep } from "@/components/steps/SearchStep";
import { ResultsStep } from "@/components/steps/ResultsStep";

// Configuration
import { stepsConfig } from "@/config/steps";

export default function Home(): JSX.Element {
  const { toast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showStats, setShowStats] = useState<boolean>(false);
  
  // État du stepper (maintenant 5 étapes au lieu de 4)
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepData, setStepData] = useState<StepData>({
    natureDemande: undefined, // 🆕 Nature de la demande
    customDescription: '', // 🆕 Description personnalisée
    documents: [],
    searchTerms: '',
    analysis: null,
    results: []
  });

  // 🆕 Hook pour l'extraction de mots-clés avec types TypeScript
  const { 
    extractKeywords, 
    isExtracting, 
    extractedKeywords, 
    error: extractionError,
    clearError
  } = useKeywordExtraction(toast);

  useEffect(() => {
    fetchArticles(dispatch, toast);
  }, [toast]);

  const { getHighlightedArticles, isSearching } = useArticleSearch(
    state,
    dispatch,
  );
  const { handleSearch } = useSearch("", dispatch, getHighlightedArticles);

  // Configuration des étapes
  const steps = useMemo(() => stepsConfig, []);

  // Fonctions de navigation avec useCallback
  const goToStep = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // 🆕 Handler pour la sélection de la nature de demande
  const handleNatureSelect = useCallback((nature: NatureDemande, customDescription?: string) => {
    setStepData(prev => ({ 
      ...prev, 
      natureDemande: nature,
      customDescription: customDescription || ''
    }));
    
    toast({
      title: "Nature du besoin sélectionnée",
      description: `${nature.title} - L'analyse sera optimisée pour ce domaine`
    });

    // ✅ AJOUT CLÉ : On déclenche le passage à l'étape suivante ici !
    nextStep();

  }, [toast, nextStep]); 

  // Callbacks pour les étapes - avec persistance des données et types TypeScript
  const handleFilesChange = useCallback((files: DocumentInput[]) => {
    setStepData(prev => ({ ...prev, documents: files }));
  }, []);

  const handleAnalysisComplete = useCallback((analysis: AnalysisResult) => {
    setStepData(prev => ({ ...prev, analysis }));
  }, []);

  const handleStepComplete = useCallback((step: string) => {
    if (step === 'nature' && currentStep === 0) {
      // Nature sélectionnée, permettre de continuer
    }
    if (step === 'upload' && currentStep === 1) {
      // Documents uploadés, permettre de continuer
    }
    if (step === 'analysis' && currentStep === 2) {
      // Analyse terminée, permettre de continuer
    }
  }, [currentStep]);

  const handleSearchWithInput = useCallback((searchTerm: string) => {
    handleSearch(searchTerm);
    setStepData(prev => ({ ...prev, searchTerms: searchTerm }));
    
    // Si on est en mode stepper et qu'on fait une recherche, aller à l'étape recherche
    if (currentStep < 3) {
      setCurrentStep(3);
    }
  }, [handleSearch, currentStep]);

  const handleInputFocus = useCallback((focused: boolean) => {
    // Logique de focus si nécessaire
  }, []);

  // 🆕 Fonction d'analyse améliorée avec la nature de demande
  const simulateAnalysis = useCallback(async (): Promise<void> => {
    if (stepData.documents.length === 0) {
      toast({
        title: "Erreur",
        description: "Aucun document à analyser. Retournez à l'étape upload.",
        variant: 'destructive'
      });
      return;
    }

    try {
      clearError();
      
      // Construire le contexte avec la nature de demande
      let context = 'Analyse juridique française';
      if (stepData.natureDemande) {
        context = `${stepData.natureDemande.title} - ${stepData.natureDemande.description}`;
        if (stepData.customDescription) {
          context += `. Situation spécifique: ${stepData.customDescription}`;
        }
      }
      
      // Extraire les mots-clés avec OpenAI
      const keywordResult = await extractKeywords(
        stepData.documents as DocumentInput[], 
        context
      );
      
      // Combiner les mots-clés de la nature de demande avec ceux extraits
      let allKeywords = keywordResult.keywords || [];
      if (stepData.natureDemande?.keywords) {
        allKeywords = [...new Set([...stepData.natureDemande.keywords, ...allKeywords])];
      }
      
      // Créer l'analyse avec les résultats d'OpenAI
      const analysisResult: AnalysisResult = {
        domain: keywordResult.domain || stepData.natureDemande?.title || 'Analyse juridique',
        keywords: allKeywords,
        documents: stepData.documents.map((doc: DocumentInput) => doc.file?.name || doc.name),
        confidence: keywordResult.confidence || 0.85,
        extractedKeywords: allKeywords,
        natureDemande: stepData.natureDemande // 🆕 Inclure la nature de demande
      };
      
      setStepData(prev => ({ ...prev, analysis: analysisResult }));
      
      // 🆕 PAS de passage automatique - l'utilisateur peut voir les résultats
      toast({
        title: "Analyse terminée !",
        description: `${allKeywords.length} mots-clés extraits avec succès`,
        variant: 'default'
      });
      
    } catch (error: any) {
      console.error('Erreur lors de l\'analyse:', error);
      
      // Fallback avec la nature de demande sélectionnée
      const fallbackKeywords = stepData.natureDemande?.keywords || ['analyse', 'juridique'];
      
      const fallbackAnalysis: AnalysisResult = {
        domain: stepData.natureDemande?.title || 'Analyse juridique',
        keywords: fallbackKeywords,
        documents: stepData.documents.map((doc: DocumentInput) => doc.file?.name || doc.name),
        confidence: 0.75,
        extractedKeywords: fallbackKeywords,
        natureDemande: stepData.natureDemande
      };
      
      setStepData(prev => ({ ...prev, analysis: fallbackAnalysis }));
      
      toast({
        title: "Analyse effectuée",
        description: "Analyse basée sur la nature du besoin (OpenAI indisponible)",
        variant: 'default'
      });
    }
  }, [stepData.documents, stepData.natureDemande, stepData.customDescription, toast, extractKeywords, clearError]);

  // 🆕 Vérifier si on peut passer à l'étape suivante (mis à jour pour 5 étapes)
  const canProceedToNext = useMemo(() => {
    switch(currentStep) {
      case 0: return stepData.natureDemande !== undefined; // 🆕 Nature du besoin sélectionnée
      case 1: return stepData.documents.length > 0; // Documents uploadés
      case 2: return stepData.analysis !== null; // Analyse terminée
      case 3: return stepData.searchTerms.length > 0; // Recherche effectuée
      case 4: return true; // Résultats (dernière étape)
      default: return false;
    }
  }, [currentStep, stepData]);

  // Données pour les statistiques
  const statsData = useMemo(() => [
    { label: "Articles disponibles", value: 15847, color: "blue" as const },
    { label: "Recherches aujourd'hui", value: 2847, color: "green" as const },
    { label: "Mise à jour", value: "24h", color: "purple" as const },
    { label: "Disponibilité", value: "99.9%", color: "orange" as const }
  ], []);

  // Handlers pour le header
  const handleToggleStats = useCallback(() => {
    setShowStats(prev => !prev);
  }, []);

  const handleAlertsClick = useCallback(() => {
    toast({
      title: "Alertes",
      description: "3 nouvelles alertes disponibles"
    });
  }, [toast]);

  const handleExportClick = useCallback(() => {
    toast({
      title: "Export",
      description: "Export en cours de préparation..."
    });
  }, [toast]);

  // 🆕 Rendu conditionnel selon l'étape (mis à jour pour 5 étapes)
  const renderStepContent = useCallback(() => {
    switch(currentStep) {
      case 0: // 🆕 Étape Nature du besoin
        return (
          <NatureDemandStep
            description={steps[0].description}
            onNatureSelect={handleNatureSelect}
            selectedNature={stepData.natureDemande}
            customDescription={stepData.customDescription}
          />
        );

      case 1: // Upload des documents
        return (
          <UploadStep
            description={steps[1].description}
            onFilesChange={handleFilesChange}
            onAnalysisComplete={handleAnalysisComplete}
            onStepComplete={handleStepComplete}
            existingDocuments={stepData.documents}
            natureDemande={stepData.natureDemande} // 🆕 Passer la nature de demande
          />
        );

      case 2: // Analyse
        return (
          <AnalysisStep
            description={steps[2].description}
            onSimulateAnalysis={simulateAnalysis}
            isAnalyzing={isExtracting} // 🆕 Passer l'état de chargement OpenAI
            extractedKeywords={extractedKeywords?.keywords} // 🆕 Afficher les mots-clés extraits
            natureDemande={stepData.natureDemande} // 🆕 Passer la nature de demande
            error={extractionError} // 🆕 Passer les erreurs
          />
        );

      case 3: // Recherche
        return (
          <SearchStep
            description={steps[3].description}
            searchTerm={state.searchTerm}
            onSearch={handleSearchWithInput}
            onFocusChange={handleInputFocus}
            isSearching={isSearching}
            searchResults={state.searchResultsMarked || []}
            suggestedKeywords={stepData.analysis?.extractedKeywords} // 🆕 Proposer les mots-clés extraits
            natureDemande={stepData.natureDemande} // 🆕 Passer la nature de demande
          />
        );

      case 4: // Résultats
        return (
          <ResultsStep
            articlesCount={state.searchResultsMarked?.length || 12}
            confidenceScore={stepData.analysis?.confidence ? Math.round(stepData.analysis.confidence * 100) : 85}
            attentionPoints={3}
            extractedKeywords={stepData.analysis?.extractedKeywords} // 🆕 Afficher les mots-clés dans les résultats
            natureDemande={stepData.natureDemande} // 🆕 Passer la nature de demande
          />
        );

      default:
        return null;
    }
  }, [
    currentStep, 
    steps, 
    stepData,
    handleNatureSelect, // 🆕 Handler pour la nature
    handleFilesChange, 
    handleAnalysisComplete, 
    handleStepComplete, 
    simulateAnalysis,
    isExtracting, // 🆕 État de chargement OpenAI
    extractedKeywords, // 🆕 Mots-clés extraits
    extractionError, // 🆕 Erreurs d'extraction
    state.searchTerm,
    state.searchResultsMarked,
    handleSearchWithInput,
    handleInputFocus,
    isSearching
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <Header 
        showStats={showStats}
        onToggleStats={handleToggleStats}
        alertsCount={3}
        onAlertsClick={handleAlertsClick}
        onExportClick={handleExportClick}
      />

      <div className="max-w-6xl mx-auto px-4">

        {/* Navigation */}
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={previousStep}
          onNext={nextStep}
          isNextDisabled={!canProceedToNext}
        />
        {/* Stepper */}
        <Stepper 
          currentStep={currentStep}
          onStepClick={goToStep}
          steps={steps}
        />

        {/* Contenu de l'étape */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Stats Panel */}
        {showStats && (
          <StatsPanel 
            stats={statsData} 
            className="mt-8" 
          />
        )}
      </div>
    </div>
  );
}