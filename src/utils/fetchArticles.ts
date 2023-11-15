import { Action } from "@/types/article";
import { ToastFunction } from "@/types/toast";

export const fetchArticles = async (
  dispatch: React.Dispatch<Action>,
  toast: ToastFunction,
) => {
  dispatch({ type: "SET_LOADING", payload: true });
  try {
    const response = await fetch(`/api/penal-code`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const articles = await response.json();
    dispatch({ type: "SET_ARTICLES", payload: articles });
  } catch (error) {
    if (error instanceof Error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la récupération des articles",
      });
    }
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
};
