import { Article } from "@/types/article";

export interface State {
  articles: Article[];
  searchTerm: string;
  searchResultsMarked: Article[];
  caseSensitive: boolean;
  error: string | null;
  isLoading: boolean;
}

export const initialState: State = {
  articles: [],
  searchTerm: "",
  searchResultsMarked: [],
  caseSensitive: false,
  error: null,
  isLoading: true,
};

interface SetArticlesAction {
  type: "SET_ARTICLES";
  payload: Article[];
}

interface SetSearchTermAction {
  type: "SET_SEARCH_TERM";
  payload: string;
}

interface SetSearchResultsAction {
  type: "SET_SEARCH_RESULTS";
  payload: Article[];
}

interface ToggleCaseSensitiveAction {
  type: "TOGGLE_CASE_SENSITIVE";
}

interface SetErrorAction {
  type: "SET_ERROR";
  payload: string | null;
}

interface SetLoadingAction {
  type: "SET_LOADING";
  payload: boolean;
}

type Action =
  | SetArticlesAction
  | SetSearchTermAction
  | SetSearchResultsAction
  | ToggleCaseSensitiveAction
  | SetErrorAction
  | SetLoadingAction;

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
