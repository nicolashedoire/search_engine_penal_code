import React from "react";
import { Search } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Article } from "@/types/article";

interface SearchResultProps {
  articles: Article[];
}

export default function SearchResult({ articles }: SearchResultProps) {
  return (
    <div className="w-full flex justify-center">
      {articles.length > 0 ? (
        <div className="w-full max-w-2xl">
          {articles.map((article: Article, index) => {
            return (
              <div
                key={`${article.title}_${index}`}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-4 p-4"
              >
                <p
                  className="font-semibold text-gray-900 mb-3 leading-snug [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded"
                  dangerouslySetInnerHTML={{ __html: article.title }}
                ></p>
                <p
                  className="text-sm text-gray-700 leading-relaxed [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:rounded"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                ></p>
              </div>
            );
          })}
        </div>
      ) : (
        <Alert className="mt-12 w-full max-w-2xl bg-blue-50 border-blue-200">
          <Search className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Aucun résultat de recherche...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}