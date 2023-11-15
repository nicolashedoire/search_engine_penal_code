import React from "react";
import { Terminal } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Article } from "@/types/article";

interface SearchResultProps {
  articles: Article[];
}

export default function SearchResult({ articles }: SearchResultProps) {
  return (
    <div className="w-full flex justify-center">
      {articles.length > 0 ? (
        <div className="w-1/2">
          {articles.map((article: any, index) => {
            return (
              <div
                key={`${article.title}_${index}`}
                className="border shadow-md mb-3 p-2"
              >
                <p
                  className="font-medium mb-2"
                  dangerouslySetInnerHTML={{ __html: article.title }}
                ></p>
                <p
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                ></p>
              </div>
            );
          })}
        </div>
      ) : (
        <Alert className="mt-12 w-1/2 bg-gray-50">
          <Terminal className="h-4 w-4" />
          <AlertDescription>Aucun résultat de recherche...</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
