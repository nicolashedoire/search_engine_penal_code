import { Article } from "@/types/article";

export interface SearchOptions {
  caseSensitive: boolean;
}

function escapeRegex(term: string): string {
  return term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function highlightText(text: string, regex: RegExp): string {
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}

export function searchAndHighlight(
  articles: Article[],
  term: string,
  options: SearchOptions
): Article[] {
  if (!term) return [];

  const safeTerm = escapeRegex(term);
  const flags = options.caseSensitive ? "g" : "gi";
  const regex = new RegExp(safeTerm, flags);

  return articles.reduce<Article[]>((acc, article) => {
    let matchFound = false;

    let title = article.title;
    let content = article.content;

    if (regex.test(title)) {
      title = highlightText(title, regex);
      matchFound = true;
    }

    regex.lastIndex = 0; // reset pour éviter bugs avec flag `g`

    if (regex.test(content)) {
      content = highlightText(content, regex);
      matchFound = true;
    }

    regex.lastIndex = 0;

    if (matchFound) {
      acc.push({
        ...article,
        title,
        content,
      });
    }

    return acc;
  }, []);
}
