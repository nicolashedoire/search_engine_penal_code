import { Action, Article } from "@/types/article";
import { useCallback, useEffect, useState } from "react";

interface ArticleSearchState {
  articles: Article[];
  searchTerm: string;
  caseSensitive: boolean;
}

const useArticleSearch = (
  state: ArticleSearchState,
  dispatch: React.Dispatch<Action>,
) => {
  const [worker, setWorker] = useState<Worker | undefined>();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch("/searchWorker.js")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const newWorker = new Worker(URL.createObjectURL(blob));
        newWorker.onmessage = (e) => {
          const articlesMarked = e.data;
          dispatch({ type: "SET_SEARCH_RESULTS", payload: articlesMarked });
          setIsSearching(false);
        };

        newWorker.onerror = (error) => {
          console.error("Erreur dans le Worker: ", error.message);
          setIsSearching(false);
        };

        setWorker(newWorker);
      });
    return () => worker?.terminate();
  }, []);

  const getHighlightedArticles = useCallback(() => {
    if (worker) {
      setIsSearching(true);
      worker.postMessage({
        articles: state.articles,
        searchTerm: state.searchTerm,
        caseSensitive: state.caseSensitive,
      });
    }
  }, [state, worker]);

  return { getHighlightedArticles, isSearching };
};

export default useArticleSearch;
