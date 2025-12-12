import { kv } from '@vercel/kv';
import { put } from '@vercel/blob';

export interface PortfolioData {
    id: string;
    slug: string;
    name: string;
    // Add other fields as needed
    [key: string]: any;
}

export const storage = {
    // KV Operations
    async savePortfolio(slug: string, data: PortfolioData) {
        // Save to KV with a prefix
        await kv.set(`portfolio:${slug}`, data);
        // Also add to a list of portfolios if needed
        // await kv.sadd('portfolios', slug);
    },

    async getPortfolio(slug: string): Promise<PortfolioData | null> {
        return await kv.get(`portfolio:${slug}`);
    },

    // Blob Operations usually happen directly in API routes or client, 
    // but we can add helpers here if needed.
};

export { kv };
