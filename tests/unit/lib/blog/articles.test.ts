import { describe, it, expect } from "vitest";
import {
  getFeaturedArticles,
  getLatestArticles,
  getArticleBySlug,
} from "../../../../lib/blog/articles";

describe("Blog Articles Data Layer", () => {
  describe("getFeaturedArticles", () => {
    it("should return exactly 2 items", () => {
      const articles = getFeaturedArticles();
      expect(articles.length).toBe(2);
      expect(articles[0]?.slug).toBe("systems-thinking-ai-scale");
      expect(articles[1]?.slug).toBe("automating-canadian-business");
    });
  });

  describe("getLatestArticles", () => {
    it("should return the requested number of articles", () => {
      const articles = getLatestArticles(1);
      expect(articles.length).toBe(1);
    });

    it("should be sorted by date (newest first)", () => {
      const articles = getLatestArticles(2);
      expect(articles.length).toBe(2);
      const date1 = new Date(articles[0]?.publishedDate ?? "").getTime();
      const date2 = new Date(articles[1]?.publishedDate ?? "").getTime();
      expect(date1).toBeGreaterThanOrEqual(date2);
      expect(date1).toBeGreaterThan(date2);
      expect(articles[1]?.slug).toBe("automating-canadian-business"); // 2024-03-15
    });
  });

  describe("getArticleBySlug", () => {
    it("should return the correct article for a valid slug", () => {
      const article = getArticleBySlug("systems-thinking-ai-scale");
      expect(article).toBeDefined();
      expect(article?.title).toBe(
        "Systems Thinking: The Key to Scaling AI Safely",
      );
      expect(article?.systemsThinking).toBe(true);
    });

    it("should return undefined for an invalid slug", () => {
      const article = getArticleBySlug("non-existent-article-slug");
      expect(article).toBeUndefined();
    });
  });
});
