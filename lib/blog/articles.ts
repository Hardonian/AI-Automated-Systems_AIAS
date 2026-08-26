export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  publishedDate: string;
  category: string;
  author: string;
  tags: string[];
  systemsThinking: boolean;
  genAIContentEngine?: boolean;
  seoKeywords?: string[];
}

const articles: BlogArticle[] = [
  {
    slug: "systems-thinking-ai-scale",
    title: "Systems Thinking: The Key to Scaling AI Safely",
    excerpt:
      "Why most AI projects fail and how systems thinking can ensure your automations are reliable and scalable.",
    publishedDate: "2024-03-20",
    category: "Strategy",
    author: "AIAS Team",
    tags: ["ai", "strategy", "systems-thinking"],
    systemsThinking: true,
  },
  {
    slug: "automating-canadian-business",
    title: "Automating the Canadian Business: Wave, Shopify, and More",
    excerpt:
      "A guide to connecting your core business tools for seamless Canadian operations.",
    publishedDate: "2024-03-15",
    category: "Guides",
    author: "AIAS Team",
    tags: ["shopify", "wave", "automation"],
    systemsThinking: false,
  },
  {
    slug: "launch-comfyui-workflow-pack",
    title:
      "We Launched the ComfyUI Workflow Pack — 11 Production Workflows, Yours to Own",
    excerpt:
      "A local-first bundle of 11 battle-tested ComfyUI workflows for portrait, product, and concept generation. No subscriptions, no cloud lock-in, no token meters. Buy once, run forever on hardware you control.",
    content: `Most AI image tooling rents you capability. You pay per generation, your prompts leave your machine, and the moment you stop paying the workflows vanish. The ComfyUI Workflow Pack is the opposite: a one-time purchase of 11 production-grade workflows that run entirely on your own GPU.

## What you get

11 workflows covering the jobs local-first creators actually need:

- **Private portrait studio** — consent-only, no cloud upload, built for people who care where their face data goes.
- **Product shot generator** — clean on-white and lifestyle renders for store listings.
- **Concept + moodboard pipeline** — fast exploration without leaving your machine.
- **Upscale / repair chains** — recover low-res outputs to print quality.
- **Batch variants** — generate controlled permutations for A/B testing creative.

Every workflow is delivered as a ready-to-load .json plus a one-page runbook: required models, recommended VRAM, and the exact node order.

## Why local-first matters

When generation runs on your hardware:

- **Your prompts and images never leave the box.** No third-party retention, no training-on-your-data.
- **Cost is predictable.** One purchase, infinite runs. No per-image fees, no monthly ceiling.
- **It keeps working.** No API deprecation, no vendor pivot, no account ban mid-project.

This is the same operating model behind the rest of the catalog — private inference access, sovereign compute, and audit tooling that doesn't phone home.

## Who it's for

Solo creators, indie studios, and AI-lab owners who already run ComfyUI (or want to) and are done renting their own outputs back from a dashboard.

## Get it

The pack is $29, one-time. Purchase runs through a standard Stripe checkout and the files are delivered to your machine immediately on payment.

[Get the ComfyUI Workflow Pack →](https://aiautomatedsystems.ca/p/comfyui-workflow-pack)`,
    publishedDate: "2026-08-22",
    category: "Product Launch",
    author: "AIAS Team",
    tags: [
      "comfyui",
      "local-first",
      "sovereign-ai",
      "image-generation",
      "workflows",
    ],
    systemsThinking: false,
    genAIContentEngine: false,
    seoKeywords: [
      "comfyui workflows",
      "local AI image generation",
      "private comfyui",
      "buy comfyui workflows",
      "sovereign AI",
    ],
  },
];

const sortedArticlesCache = [...articles].sort(
  (a, b) =>
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
);

export function getLatestArticles(limit: number): BlogArticle[] {
  return sortedArticlesCache.slice(0, limit);
}

export function getFeaturedArticles(): BlogArticle[] {
  return articles.slice(0, 2);
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return articles.find((article) => article.slug === slug);
}
