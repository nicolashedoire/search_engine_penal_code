import { State, Action } from "@/types/article";

export const initialState: State = {
  articles: [],
  searchTerm: "",
  searchResultsMarked: [],
  caseSensitive: false,
  error: null,
  isLoading: true,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ARTICLES":
      return { ...state, articles: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResultsMarked: action.payload };
    case "TOGGLE_CASE_SENSITIVE":
      return { ...state, caseSensitive: !state.caseSensitive };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}
