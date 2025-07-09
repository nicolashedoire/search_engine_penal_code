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
    let currentWorker: Worker | undefined;
  
    fetch("/searchWorker.js")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const newWorker = new Worker(URL.createObjectURL(blob));
        currentWorker = newWorker; // ✅ Stocker dans la variable locale
        
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
      
    return () => currentWorker?.terminate(); // ✅ Utiliser la variable locale
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
