const highlightContent = (content, searchTerm) => {
  const regex = new RegExp(
    searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
    "gi",
  );
  return content.replace(regex, (match) => `<mark>${match}</mark>`);
};

self.onmessage = function (e) {
  const { articles, searchTerm, caseSensitive } = e.data;

  if (searchTerm === "") {
    postMessage([]);
    return;
  }

  const createSearchRegex = (searchTerm, caseSensitive) => {
    const safe = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const flags = caseSensitive ? "g" : "gi";
    return new RegExp(safe, flags);
  };

  const regex = createSearchRegex(searchTerm, caseSensitive);

  const highlightArticles = (articles, regex) => {
    return articles.reduce((filtered, article) => {
      let contentHighlighted = false;
      let titleHighlighted = false;

      // Test de correspondance exacte uniquement
      if (regex.test(article.content)) {
        article.content = highlightContent(article.content, searchTerm);
        contentHighlighted = true;
      }

      // Reset du regex pour le titre (important avec le flag 'g')
      regex.lastIndex = 0;
      
      if (regex.test(article.title)) {
        article.title = highlightContent(article.title, searchTerm);
        titleHighlighted = true;
      }

      // Reset du regex pour la prochaine itération
      regex.lastIndex = 0;

      if (contentHighlighted || titleHighlighted) {
        filtered.push(article);
      }

      return filtered;
    }, []);
  };

  const articlesMarked = highlightArticles(articles, regex);
  postMessage(articlesMarked);
};