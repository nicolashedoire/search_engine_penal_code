// hooks/useKeywordExtraction.ts
import { useState, useCallback } from 'react';
import { 
  DocumentInput, 
  KeywordExtractionResponse, 
  OpenAIError 
} from '@/types/openai';

interface UseKeywordExtractionReturn {
  extractKeywords: (documents: DocumentInput[], context?: string) => Promise<KeywordExtractionResponse>;
  isExtracting: boolean;
  extractedKeywords: KeywordExtractionResponse | null;
  setExtractedKeywords: React.Dispatch<React.SetStateAction<KeywordExtractionResponse | null>>;
  error: string | null;
  clearError: () => void;
}

interface ToastFunction {
  (options: {
    title: string;
    description: string;
    variant?: 'default' | 'destructive';
  }): void;
}

export const useKeywordExtraction = (toast: ToastFunction): UseKeywordExtractionReturn => {
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedKeywords, setExtractedKeywords] = useState<KeywordExtractionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const extractKeywords = useCallback(async (
    documents: DocumentInput[], 
    context: string = ''
  ): Promise<KeywordExtractionResponse> => {
    setIsExtracting(true);
    setError(null);
    
    try {
      // Validation des documents
      if (!documents || documents.length === 0) {
        throw new Error('Aucun document fourni pour l\'analyse');
      }

      // Préparation des données pour l'API
      const documentsForAPI: DocumentInput[] = documents.map(doc => ({
        name: doc.file?.name || doc.name || 'Document sans nom',
        content: doc.content || doc.text || 'Contenu à analyser'
      }));

      const response = await fetch('/api/extract-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documents: documentsForAPI,
          context
        }),
      });

      if (!response.ok) {
        const errorData: OpenAIError = await response.json();
        throw new Error(errorData.details || errorData.error || 'Erreur lors de l\'extraction');
      }

      const result: KeywordExtractionResponse = await response.json();
      
      // Validation de la réponse
      if (!result.keywords || !Array.isArray(result.keywords)) {
        throw new Error('Réponse invalide du serveur');
      }

      setExtractedKeywords(result);
      
      toast({
        title: "Extraction réussie",
        description: `${result.keywords.length} mots-clés extraits (${result.domain})`,
        variant: 'default'
      });
      
      return result;
      
    } catch (error: any) {
      const errorMessage = error.message || 'Impossible d\'extraire les mots-clés';
      setError(errorMessage);
      
      console.error('Erreur extraction:', error);
      
      toast({
        title: "Erreur d'extraction",
        description: errorMessage,
        variant: 'destructive'
      });
      
      throw error;
    } finally {
      setIsExtracting(false);
    }
  }, [toast]);

  return {
    extractKeywords,
    isExtracting,
    extractedKeywords,
    setExtractedKeywords,
    error,
    clearError
  };
};