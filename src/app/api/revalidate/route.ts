import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json() as { path?: string; tag?: string };

    if (body.tag) {
      revalidateTag(body.tag);
    } else if (body.path) {
      revalidatePath(body.path);
    } else {
      // Revalidate all public pages
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
