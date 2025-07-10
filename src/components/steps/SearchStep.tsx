// components/steps/SearchStep.v2.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, FileText } from 'lucide-react';

// Supposons que ces composants existent et sont stylés
import SearchBar from '@/components/SearchBar'; // Le même SearchBar
import SearchResult from '@/components/SearchResults'; // Le même SearchResult

// Interface mise à jour pour inclure les mots-clés de l'IA
interface SearchStepProps {
  description: string;
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
  onFocusChange: (focused: boolean) => void;
  isSearching: boolean;
  searchResults: any[];
  suggestedKeywords?: string[]; // Ajout crucial
}

/**
 * Composant pour l'état de chargement "squelette".
 * C'est une technique UX moderne pour améliorer la perception de la vitesse.
 */
const SearchResultsSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-4 border border-slate-200 rounded-lg animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
      </div>
    ))}
  </div>
);


/**
 * Version 2 du composant de recherche, conçu comme un outil interactif
 * plutôt qu'une simple étape de formulaire.
 */
export const SearchStep: React.FC<SearchStepProps> = ({
  description,
  searchTerm: initialSearchTerm,
  onSearch,
  onFocusChange,
  isSearching,
  searchResults,
  suggestedKeywords = []
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleLocalSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  const handleKeywordClick = (keyword: string) => {
    const newSearchTerm = searchTerm ? `${searchTerm} ${keyword}` : keyword;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Panneau de Contrôle (Gauche) */}
        <div className="md:col-span-1 md:border-r md:pr-8 border-slate-200">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <Search className="text-indigo-500" />
              Recherche
            </h2>
            <p className="text-sm text-slate-600 mt-1 mb-6">{description}</p>

            <SearchBar
              searchTerm={searchTerm}
              onSearch={handleLocalSearch}
              onFocusChange={onFocusChange}
              placeholder="Rechercher"
            />
            
            {suggestedKeywords.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Sparkles size={16} className="text-yellow-500" />
                  Mots-clés suggérés
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {suggestedKeywords.map(keyword => (
                    <button
                      key={keyword}
                      onClick={() => handleKeywordClick(keyword)}
                      className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panneau de Résultats (Droite) */}
        <div className="md:col-span-3 min-h-[400px]">
          {isSearching ? (
            <SearchResultsSkeleton />
          ) : searchResults.length > 0 ? (
            <div>
              <p className="text-sm text-slate-600 mb-4">
                <span className="font-semibold text-indigo-600">{searchResults.length}</span> {searchResults.length > 1 ? 'résultats trouvés' : 'résultat trouvé'} pour <span className="font-medium text-slate-800">"{searchTerm}"</span>
              </p>
              <SearchResult articles={searchResults} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center bg-slate-50 rounded-xl p-8">
              <FileText size={48} className="text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">Lancez une recherche pour commencer</h3>
              <p className="text-slate-500 max-w-sm">Utilisez la barre de recherche ou cliquez sur un mot-clé suggéré pour trouver les articles de loi pertinents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};