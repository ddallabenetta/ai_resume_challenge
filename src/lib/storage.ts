import { createClient } from 'redis';

export interface PortfolioData {
    id: string;
    slug: string;
    name: string;
    // Add other fields as needed
    [key: string]: any;
}

// Global scope check for the Redis client to prevent multiple connections in dev
const globalForRedis = global as unknown as { redis: ReturnType<typeof createClient> };

export const redis =
    globalForRedis.redis ??
    createClient({
        url: process.env.KV_URL || process.env.REDIS_URL || 'redis://localhost:6379',
    });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

redis.on('error', (err) => console.error('Redis Client Error', err));

const getClient = async () => {
    if (!redis.isOpen) {
        await redis.connect();
    }
    return redis;
};

export const storage = {
    // KV Operations
    async savePortfolio(slug: string, data: PortfolioData) {
        const client = await getClient();
        // Save to KV with a prefix
        await client.set(`portfolio:${slug}`, JSON.stringify(data));
        // Also add to a list of portfolios if needed
        // await client.sadd('portfolios', slug);
    },

    async getPortfolio(slug: string): Promise<PortfolioData | null> {
        const client = await getClient();
        const data = await client.get(`portfolio:${slug}`);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Failed to parse portfolio data", e);
            return null;
        }
    },
};
