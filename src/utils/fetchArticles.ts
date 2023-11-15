// Dans fetchArticles.js
export const fetchArticles = async (dispatch: any, toast: any) => {
  dispatch({ type: "SET_LOADING", payload: true });
  try {
    const response = await fetch(`/api/fetchCodePenal`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const articles = await response.json();
    dispatch({ type: "SET_ARTICLES", payload: articles.data });
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
