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
        slug: 'systems-thinking-ai-scale',
        title: 'Systems Thinking: The Key to Scaling AI Safely',
        excerpt: 'Why most AI projects fail and how systems thinking can ensure your automations are reliable and scalable.',
        publishedDate: '2024-03-20',
        category: 'Strategy',
        author: 'AIAS Team',
        tags: ['ai', 'strategy', 'systems-thinking'],
        systemsThinking: true,
    },
    {
        slug: 'automating-canadian-business',
        title: 'Automating the Canadian Business: Wave, Shopify, and More',
        excerpt: 'A guide to connecting your core business tools for seamless Canadian operations.',
        publishedDate: '2024-03-15',
        category: 'Guides',
        author: 'AIAS Team',
        tags: ['shopify', 'wave', 'automation'],
        systemsThinking: false,
    },
];

export function getLatestArticles(limit: number): BlogArticle[] {
    return [...articles].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()).slice(0, limit);
}

export function getFeaturedArticles(): BlogArticle[] {
    return articles.slice(0, 2);
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
    return articles.find(article => article.slug === slug);
}
