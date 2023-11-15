import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    let articlePromises = [];

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

        const articleData = { title, url, content: content.trim() };
        articlePromises.push(prisma.article.create({ data: articleData }));
      });

    await Promise.all(articlePromises);
    console.log("Articles insérés avec succès dans la base de données");
  } catch (error) {
    console.error("Erreur lors de la requête:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
