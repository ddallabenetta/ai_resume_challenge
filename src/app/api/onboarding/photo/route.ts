import { NextResponse } from 'next/server';

import { put } from '@vercel/blob';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Check if we have Blob token, otherwise mock
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const blob = await put(file.name, file, { access: 'public' });
            return NextResponse.json({ url: blob.url });
        } else {
            // Mock return for local dev without Blob
            return NextResponse.json({
                url: `https://avatar.vercel.sh/${Math.random()}`,
                warning: 'Using mock avatar (BLOB_READ_WRITE_TOKEN missing)'
            });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Photo upload failed' }, { status: 500 }); // Fix: Return 500 error properly
    }
}
