import { JSDOM } from "jsdom";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const response = await fetch(
    "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006070719/LEGISCTA000006089684/",
  );
  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;
  let articles: any = [];

  document
    .querySelectorAll(".js-child.list-article-consommation")
    .forEach((articleElement) => {
      const titleElement: any = articleElement.querySelector(".name-article");
      const title: any = titleElement ? titleElement.textContent?.trim() : "";
      const url =
        titleElement && titleElement.querySelector("a")
          ? titleElement.querySelector("a").href
          : "";

      const contentElement = articleElement.querySelector(".content");
      let content = "";
      if (contentElement) {
        contentElement.querySelectorAll("p").forEach((p) => {
          content += p.textContent + "\n";
        });
      }

      articles.push({ title, url, content: `<p>${content.trim()}</p>` });
    });

  res.status(200).json({ data: articles });
}
