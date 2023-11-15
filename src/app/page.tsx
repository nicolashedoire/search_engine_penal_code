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
    <>
      <div className="w-2/3 sticky top-0 z-50">
        <div className="sticky top-0 bg-white w-full justify-center flex-col flex z-10 overflow-hidden">
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
          <ArticleTitle length={state.searchResultsMarked?.length ?? 0} />
        </div>
      </div>
      <div className="flex min-h-full w-2/3 flex-col items-center overflow-hidden">
        {isSearching ? (
          <div>
            <p className="mb-12">Le moteur de recherche effectue les calculs</p>{" "}
            <Loader />
          </div>
        ) : (
          <SearchResult articles={state.searchResultsMarked} />
        )}
        <ArticleList
          articles={state.articles}
          isLoading={state.isLoading}
          error={state.error}
        />
      </div>
    </>
  );
}
