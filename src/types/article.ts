export type Article = {
  title: string;
  url: string;
  content: string;
};

export type State = {
  articles: Article[];
  searchTerm: string;
  searchResultsMarked: Article[];
  caseSensitive: boolean;
  error: string | null;
  isLoading: boolean;
};

export type SetArticlesAction = {
  type: "SET_ARTICLES";
  payload: Article[];
};

export type SetSearchTermAction = {
  type: "SET_SEARCH_TERM";
  payload: string;
};

export type SetSearchResultsAction = {
  type: "SET_SEARCH_RESULTS";
  payload: Article[];
};

export type ToggleCaseSensitiveAction = {
  type: "TOGGLE_CASE_SENSITIVE";
};

export type SetErrorAction = {
  type: "SET_ERROR";
  payload: string | null;
};

export type SetLoadingAction = {
  type: "SET_LOADING";
  payload: boolean;
};

export type Action =
  | SetArticlesAction
  | SetSearchTermAction
  | SetSearchResultsAction
  | ToggleCaseSensitiveAction
  | SetErrorAction
  | SetLoadingAction;
