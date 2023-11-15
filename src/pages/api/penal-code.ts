import { NextApiRequest, NextApiResponse } from "next";
import client from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  if (req.method === "GET") {
    try {
      const articles = await client.article.findMany({});
      await client.$disconnect();
      return res.status(200).json(articles);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error: "Une erreur est survenue lors de la récupération des articles",
      });
    }
  }
}
