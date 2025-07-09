"use client";
import React, { useEffect, useReducer } from "react";
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

export default function Home() {
  const { toast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchArticles(dispatch, toast);
  }, []);

  const { getHighlightedArticles, isSearching } = useArticleSearch(
    state,
    dispatch,
  );
  const { handleSearch } = useSearch("", dispatch, getHighlightedArticles);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header fixe avec recherche */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center space-y-4">
            <SearchBar onSearch={handleSearch} />
            <ArticleTitle length={state.searchResultsMarked?.length ?? 0} />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto px-4 py-8">
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

        {/* Section de la liste des articles */}
        {/* <section>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <ArticleList
              articles={state.articles}
              isLoading={state.isLoading}
              error={state.error}
            />
          </div>
        </section> */}
      </main>
    </div>
  );
}