import { Article } from "@/types/article";
import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";

const fetchWithTimeout = async (resource: string, options: { timeout: number}) => {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  try {
    const response = await fetchWithTimeout(
      "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070719/LEGISCTA000006089684/",
      { timeout: 10000 }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    let articles: Article[] = [];
  
    document
      .querySelectorAll(".js-child.list-article-consommation")
      .forEach((articleElement) => {
        const titleElement: Element | null = articleElement.querySelector(".name-article");
        const title: string = titleElement?.textContent?.trim() ?? "";
        const url: string = titleElement?.querySelector("a")?.href ?? "";
        const contentElement: Element | null = articleElement.querySelector(".content");
        let content = "";
        if (contentElement) {
          contentElement.querySelectorAll("p").forEach((p) => {
            content += p.textContent + "\n";
          });
        }
  
        articles.push({ title, url, content: `<p>${content.trim()}</p>` });
      });
  
    res.status(200).json({ data: articles });
  } catch (error) {
    console.error("Erreur lors de la requête:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données." });
  }
}
