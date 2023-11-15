import { createSearchRegex, highlightArticles } from "@/utils/searchUtils";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";

describe("createSearchRegex", () => {
  it("should escape special characters and return a global, case-insensitive RegExp", () => {
    const regex = createSearchRegex("example*");
    expect(regex).toEqual(/example\*/gi);
  });
});

describe("highlightArticles", () => {
  const articles = [
    { id: 1, content: "Example content here" },
    { id: 2, content: "Another example" },
  ];

  it("should highlight matching content in articles", () => {
    const regex = createSearchRegex("example");
    const highlighted = highlightArticles(articles, regex);
    expect(highlighted).toEqual([
      { id: 1, content: "<mark>Example</mark> content here" },
      { id: 2, content: "Another <mark>example</mark>" },
    ]);
  });

  it("should return an empty array if no matches are found", () => {
    const regex = createSearchRegex("notfound");
    const highlighted = highlightArticles(articles, regex);
    expect(highlighted).toEqual([]);
  });
});
