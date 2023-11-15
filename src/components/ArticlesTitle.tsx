import React from "react";

export default function ArticleTitle({ length }: { length: number }) {
  return length > 0 ? (
    <h1 className="text-center mb-6 text-2xl">
      {length > 1 ? `${length} résultats` : `${length} résultat`}{" "}
    </h1>
  ) : null;
}
