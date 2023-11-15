const levenshteinDistance = (a, b) => {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1),
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const highlightContent = (content, searchTerm) => {
  const regex = new RegExp(
    searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
    "gi",
  );
  return content.replace(regex, (match) => `<mark>${match}</mark>`);
};

self.onmessage = function (e) {
  const { articles, searchTerm, caseSensitive } = e.data;
  const threshold = 2;

  if (searchTerm === "") {
    postMessage([]);
    return;
  }

  const isCloseMatch = (word, searchTerm) => {
    return (
      levenshteinDistance(word.toLowerCase(), searchTerm.toLowerCase()) <=
      threshold
    );
  };

  const createSearchRegex = (searchTerm, caseSensitive) => {
    const safeSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const flags = caseSensitive ? "g" : "gi";
    return new RegExp(safeSearchTerm, flags);
  };

  const regex = createSearchRegex(searchTerm, caseSensitive);

  const highlightArticles = (articles, regex) => {
    return articles.reduce((filtered, article) => {
      let contentHighlighted = false;
      let titleHighlighted = false;

      const words = article.content.split(/\s+/);
      const titleWords = article.title.split(/\s+/);

      const isContentMatch = words.some((word) =>
        isCloseMatch(word, searchTerm),
      );
      const isTitleMatch = titleWords.some((word) =>
        isCloseMatch(word, searchTerm),
      );

      if (isContentMatch || regex.test(article.content)) {
        article.content = highlightContent(article.content, searchTerm);
        contentHighlighted = true;
      }

      if (isTitleMatch || regex.test(article.title)) {
        article.title = highlightContent(article.title, searchTerm);
        titleHighlighted = true;
      }

      if (contentHighlighted || titleHighlighted) {
        filtered.push(article);
      }

      return filtered;
    }, []);
  };

  const articlesMarked = highlightArticles(articles, regex);
  postMessage(articlesMarked);
};
