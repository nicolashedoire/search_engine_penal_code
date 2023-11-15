import { Article } from "@/types/article";
import React from "react";
import Loader from "./ui/loader";
import { DownloadIcon } from "lucide-react";

interface ArticleListProps {
  articles: Article[];
  isLoading: Boolean;
  error: String | null;
}

export default function ArticleList({
  articles,
  isLoading,
  error,
}: ArticleListProps) {
  const cleanHTML = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  const convertToCSV = (articles: Article[]) => {
    const headers = "Titre,Contenu\n";

    const rows = articles
      .map(
        (article) =>
          `"${article.title.replace(/"/g, '""')}","${cleanHTML(
            article.content,
          ).replace(/"/g, '""')}"`,
      )
      .join("\n");

    return headers + rows;
  };

  const downloadCSV = (articles: Article[]) => {
    const csvContent = convertToCSV(articles);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "articles.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed right-0 top-0 h-full overflow-hidden w-1/3 border p-3 z-50 text-gray-600">
      {isLoading ? (
        <div className="text-center mt-12">
          <p className="mb-12">Chargement des données en cours</p>
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <h1 className="mb-3 flex items-center">
              Nombre d&apos;articles :
              <span className="font-medium">{articles.length}</span>
            </h1>
            <span
              className="flex items-center mb-3 cursor-pointer"
              onClick={() => downloadCSV(articles)}
            >
              Télécharger
              <DownloadIcon size={16} className="ml-2" />
            </span>
          </div>
          <div className="h-full overflow-hidden overflow-y-auto mb-42">
            {articles.map((article: Article, index) => {
              return (
                <div
                  key={`${article.title}_${index}`}
                  className="border shadow-sm mb-3 p-2"
                >
                  <p className="font-medium mb-2">{article.title}</p>
                  <p
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  ></p>
                </div>
              );
            })}
          </div>
        </>
      )}
      {error ? <p>{error}</p> : null}
    </div>
  );
}
