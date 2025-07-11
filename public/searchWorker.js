function escapeRegex(term) {
  return term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function highlightText(text, regex) {
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}

function searchAndHighlight(articles, term, caseSensitive) {
  if (!term) return [];

  const flags = caseSensitive ? "g" : "gi";
  const regex = new RegExp(escapeRegex(term), flags);

  return articles.reduce((acc, article) => {
    let matchFound = false;
    let title = article.title;
    let content = article.content;

    if (regex.test(title)) {
      title = highlightText(title, regex);
      matchFound = true;
    }

    regex.lastIndex = 0;

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

self.onmessage = function (e) {
  const { articles, searchTerm, caseSensitive } = e.data;
  const result = searchAndHighlight(articles, searchTerm, caseSensitive);
  postMessage(result);
};
