import { fetchArticles } from "@/utils/fetchArticles";
import fetchMock from "jest-fetch-mock";

describe("fetchArticles", () => {
  const mockDispatch = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    fetchMock.resetMocks();
    mockDispatch.mockReset();
    mockToast.mockReset();
  });

  it("should fetch articles and update state", async () => {
    const articles = [{ id: 1, title: "Article 1" }];
    fetchMock.mockResponseOnce(JSON.stringify(articles));

    await fetchArticles(mockDispatch, mockToast);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_LOADING",
      payload: true,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_ARTICLES",
      payload: articles,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_LOADING",
      payload: false,
    });
  });

  it("should handle fetch error", async () => {
    fetchMock.mockReject(new Error("Network error"));

    await fetchArticles(mockDispatch, mockToast);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_LOADING",
      payload: true,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_ERROR",
      payload: "Network error",
    });
    expect(mockToast).toHaveBeenCalledWith({
      title: "Erreur",
      description:
        "Une erreur est survenue lors de la récupération des articles",
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_LOADING",
      payload: false,
    });
  });
});
