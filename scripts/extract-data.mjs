import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

const fetchWithTimeout = async (resource, options) => {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
};

const csvWriter = createCsvWriter({
  path: "scripts/articles.csv",
  header: [
    { id: "title", title: "title" },
    { id: "url", title: "url" },
    { id: "content", title: "content" },
  ],
});

async function main() {
  try {
    const response = await fetchWithTimeout(
      "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070719/LEGISCTA000006089684/",
      { timeout: 10000 },
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    let articles = [];

    document
      .querySelectorAll(".js-child.list-article-consommation")
      .forEach((articleElement) => {
        const titleElement = articleElement.querySelector(".name-article");
        const title = titleElement?.textContent?.trim() ?? "";
        const url = titleElement?.querySelector("a")?.href ?? "";
        const contentElement = articleElement.querySelector(".content");
        let content = "";
        if (contentElement) {
          contentElement.querySelectorAll("p").forEach((p) => {
            content += p.textContent + "\n";
          });
        }

        articles.push({ title, url, content: content.trim() });
      });

    await csvWriter.writeRecords(articles);
    console.log("CSV file written successfully");
  } catch (error) {
    console.error("Erreur lors de la requête:", error);
  }
}

main();
