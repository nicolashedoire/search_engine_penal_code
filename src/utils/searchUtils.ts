import { Article } from "@/types/article";

export const createSearchRegex = (
  searchTerm: string,
  caseSensitive: boolean,
): RegExp => {
  const safeSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const flags = caseSensitive ? "g" : "gi";
  return new RegExp(safeSearchTerm, flags);
};

export const highlightArticles = (
  articles: Article[],
  regex: RegExp,
): Article[] => {
  return articles.reduce((filtered: Article[], article: Article) => {
    if (regex.test(article.content)) {
      const content = article.content.replace(
        regex,
        (match: string) => `<mark>${match}</mark>`,
      );
      filtered.push({ ...article, content });
    }
    return filtered;
  }, []);
};
