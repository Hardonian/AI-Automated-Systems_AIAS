import type { Metadata } from 'next';

export function generateMetadata(config: any): Metadata {
    return {
        title: config.title,
        description: config.description,
        keywords: config.keywords,
    };
}
