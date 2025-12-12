import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    // In a real app we would fetch from KV here
    const { slug } = await params;
    return NextResponse.json({ slug: slug, message: 'Portfolio data' });
}
