import { Action } from "@/types/article";
import { GetHighlightedArticlesFunction } from "@/types/getHighlightedArticles";
import { useState, useEffect, useCallback } from "react";

const useSearch = (
  initialSearchTerm: string,
  dispatch: React.Dispatch<Action>,
  getHighlightedArticles: GetHighlightedArticlesFunction,
) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getHighlightedArticles(searchTerm, dispatch);
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchTerm(query);
      dispatch({ type: "SET_SEARCH_TERM", payload: query });
    },
    [dispatch],
  );

  return { searchTerm, handleSearch };
};

export default useSearch;
