import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, jobTitle, system_prompt, history, photo_url, voice_id, birthDate, city, socials, traits } = body;

        // Generate unique ID for the portfolio
        const uniqueId = uuidv4();
        // Use ID as slug to ensure uniqueness and avoid homonyms
        const slug = uniqueId;

        const portfolio = {
            id: uniqueId,
            slug,
            name,
            jobTitle,
            birthDate,
            city,
            socials,
            traits: traits || [], // Save traits
            photo_url: photo_url || undefined,
            voice_id: voice_id || 'default', // Fallback
            system_prompt,
            conversation_history: history,
            created_at: new Date().toISOString()
        };

        await storage.savePortfolio(slug, portfolio);

        return NextResponse.json({ success: true, slug });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 });
    }
}
