import { NextResponse } from 'next/server';
import { stitchFetch } from '../../../lib/stitch/client';

type Body = {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
};

export async function POST(request: Request) {
  try {
    const payload: Body = await request.json();
    const { path, method = 'GET', body } = payload;

    if (!process.env.STITCH_BASE_URL) {
      return NextResponse.json({ error: 'STITCH_BASE_URL not configured' }, { status: 500 });
    }

    if (!path || typeof path !== 'string' || !path.startsWith('/') || path.includes('://')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const base = process.env.STITCH_BASE_URL.replace(/\/$/, '');
    const url = base + path;

    const res = await stitchFetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
    });

    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
