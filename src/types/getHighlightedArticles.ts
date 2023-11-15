import { Action } from "./article";

export type GetHighlightedArticlesFunction = (searchTerm: string, dispatch: React.Dispatch<Action>) => void;