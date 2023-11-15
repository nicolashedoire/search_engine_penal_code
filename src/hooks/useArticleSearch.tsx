import { useCallback, useEffect, useState } from "react";

const useArticleSearch = (state: any, dispatch: any) => {
  const [worker, setWorker] = useState<any>();
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
        const worker = new Worker(URL.createObjectURL(blob));
        worker.onmessage = (e) => {
          const articlesMarked = e.data;
          dispatch({ type: "SET_SEARCH_RESULTS", payload: articlesMarked });
          setIsSearching(false);
        };

        worker.onerror = (error) => {
          console.error("Erreur dans le Worker: ", error.message);
          setIsSearching(false);
        };

        setWorker(worker);
      });
    return () => worker && worker.terminate();
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
