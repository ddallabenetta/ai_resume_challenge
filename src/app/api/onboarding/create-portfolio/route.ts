import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, system_prompt, history, photo_url, voice_id } = body;

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'user-' + Date.now();

        const portfolio = {
            id: uuidv4(),
            slug,
            name,
            photo_url: photo_url || '/placeholder-avatar.png',
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
