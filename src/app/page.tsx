"use client";
import React, { useEffect, useReducer, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { useToast } from "@/components/ui/use-toast";
import SearchResult from "@/components/SearchResults";
import ArticleList from "@/components/ArticlesList";
import ArticleTitle from "@/components/ArticlesTitle";
import Loader from "@/components/ui/loader";
import { initialState, reducer } from "@/reducers/articlesReducer";
import useSearch from "@/hooks/useSearch";
import useArticleSearch from "@/hooks/useArticleSearch";
import { fetchArticles } from "@/utils/fetchArticles";
import { 
  BookOpen, 
  Filter, 
  TrendingUp, 
  Bell, 
  Star, 
  Clock, 
  Users,
  BarChart3,
  Zap,
  AlertCircle,
  Calendar,
  Download,
  Search
} from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showStats, setShowStats] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    fetchArticles(dispatch, toast);
  }, []);

  const { getHighlightedArticles, isSearching } = useArticleSearch(
    state,
    dispatch,
  );
  const { handleSearch } = useSearch("", dispatch, getHighlightedArticles);

  // Fonction pour gérer la recherche (simplifiée)
  const handleSearchWithInput = (searchTerm: string) => {
    handleSearch(searchTerm);
  };

  const handleInputFocus = (focused: boolean) => {
    setIsInputFocused(focused);
    
    // Si l'input perd le focus et qu'on est en mode focus, sortir du mode focus
    if (!focused && focusMode) {
      setTimeout(() => {
        setFocusMode(false);
      }, 150);
    }
  };

  // Fonction pour activer le mode focus
  const enterFocusMode = () => {
    setFocusMode(true);
    // Optionnel : focus automatique sur l'input
    setTimeout(() => {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  // Fonction pour quitter le mode focus
  const exitFocusMode = () => {
    setFocusMode(false);
  };

  // Données fake pour la demo
  const fakeStats = {
    totalArticles: 15847,
    searchesToday: 2847,
    popularTerms: ["divorce", "licenciement", "succession", "contrat"],
    lastUpdate: "2025-01-15"
  };

  const fakeTrendingSearches = [
    "Article 1382 - Responsabilité civile",
    "Délai de prescription",
    "Rupture conventionnelle",
    "Garde alternée",
    "Licenciement économique"
  ];

  const fakeFilters = [
    { id: "all", label: "Tous les codes", count: 15847 },
    { id: "civil", label: "Code civil", count: 8542 },
    { id: "travail", label: "Code du travail", count: 3251 },
    { id: "penal", label: "Code pénal", count: 2847 },
    { id: "commerce", label: "Code de commerce", count: 1207 }
  ];

  const fakeRecentUpdates = [
    { date: "2025-01-15", title: "Réforme du divorce par consentement mutuel", type: "Modification" },
    { date: "2025-01-12", title: "Nouveaux barèmes indemnités prud'homales", type: "Ajout" },
    { date: "2025-01-10", title: "Évolution droit de succession", type: "Modification" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header fixe avec recherche */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Logo/Titre */}
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">LegalSearch Pro</h1>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                BETA
              </span>
            </div>
            
            <SearchBar searchTerm={state.searchTerm} onSearch={handleSearch} onFocusChange={handleInputFocus}  />
            <ArticleTitle length={state.searchResultsMarked?.length ?? 0} />
            
            {/* Actions rapides */}
            <div className="flex items-center gap-4 text-sm">
              <button 
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Statistiques
              </button>
              <button className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                <Bell className="w-4 h-4" />
                Alertes (3)
              </button>
              <button className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Banner (si activé et pas en mode focus) */}
        {showStats && !focusMode && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{fakeStats.totalArticles}</div>
                <div className="text-sm text-gray-500">Articles disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{fakeStats.searchesToday}</div>
                <div className="text-sm text-gray-500">Recherches aujourd'hui</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24h</div>
                <div className="text-sm text-gray-500">Mise à jour</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">99.9%</div>
                <div className="text-sm text-gray-500">Disponibilité</div>
              </div>
            </div>
          </div>
        )}

        <div className={`grid ${focusMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'} gap-8`}>
          {/* Sidebar gauche - cachée en mode focus */}
          {!focusMode && (
            <div className="lg:col-span-1 space-y-6">
              {/* Filtres */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                  <Filter className="w-4 h-4" />
                  Filtres
                </h3>
                <div className="space-y-2">
                  {fakeFilters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeFilter === filter.id 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{filter.label}</span>
                        <span className="text-xs text-gray-500">{filter.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recherches populaires */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                  <TrendingUp className="w-4 h-4" />
                  Tendances
                </h3>
                <div className="space-y-2">
                  {fakeTrendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchWithInput(search.split(' - ')[0])}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 text-xs bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{search}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mises à jour récentes */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                  <AlertCircle className="w-4 h-4" />
                  Mises à jour
                </h3>
                <div className="space-y-3">
                  {fakeRecentUpdates.map((update, index) => (
                    <div key={index} className="pb-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{update.date}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          update.type === 'Modification' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {update.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{update.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contenu principal */}
          <div className={focusMode ? 'col-span-1' : 'lg:col-span-3'}>
            {/* Section des résultats de recherche */}
            {(isSearching || state.searchResultsMarked?.length > 0) && (
              <section className="mb-12">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-16 px-8">
                      <div className="mb-6">
                        <Loader />
                      </div>
                      <p className="text-slate-600 text-center font-medium">
                        Le moteur de recherche effectue les calculs...
                      </p>
                    </div>
                  ) : (
                    <div className="p-6">
                      <SearchResult articles={state.searchResultsMarked} />
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Section d'accueil (quand pas de recherche) */}
            {!isSearching && (!state.searchResultsMarked || state.searchResultsMarked.length === 0) && !focusMode && (
              <div className="space-y-6">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl font-bold mb-4">
                      Recherche juridique moderne et intuitive
                    </h2>
                    <p className="text-blue-100 mb-6">
                      Accédez instantanément à plus de 15 000 articles de loi avec notre moteur de recherche intelligent. 
                      Highlighting automatique, suggestions contextuelles et interface moderne.
                    </p>
                    <div className="flex gap-4">
                      <button 
                        onClick={enterFocusMode}
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                      >
                        Commencer la recherche
                      </button>
                      <button className="border border-blue-200 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors">
                        Voir la demo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <Zap className="w-8 h-8 text-yellow-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Recherche rapide</h3>
                    <p className="text-sm text-gray-600">Trouvez un article en moins de 2 secondes</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <Star className="w-8 h-8 text-purple-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Favoris</h3>
                    <p className="text-sm text-gray-600">Sauvegardez vos articles préférés</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <Clock className="w-8 h-8 text-green-500 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Historique</h3>
                    <p className="text-sm text-gray-600">Retrouvez vos recherches passées</p>
                  </div>
                </div>

                {/* Suggestions de recherche */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Essayez ces recherches populaires</h3>
                  <div className="flex flex-wrap gap-2">
                    {fakeStats.popularTerms.map(term => (
                      <button
                        key={term}
                        onClick={() => handleSearchWithInput(term)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode focus - Message d'aide */}
            {focusMode && !isSearching && (!state.searchResultsMarked || state.searchResultsMarked.length === 0) && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Mode recherche activé
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Tapez vos mots-clés dans la barre de recherche ci-dessus pour trouver les articles de loi pertinents.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Conseil :</strong> Utilisez des termes spécifiques comme "divorce", "licenciement" ou "succession" pour de meilleurs résultats.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}