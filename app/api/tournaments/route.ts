import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// Helper function to check auth
function getAuthCookie() {
  const cookieStore = cookies();
  return cookieStore.get('auth');
}

// Helper function to create JSON response
function json(data: any, init?: ResponseInit) {
  return new NextResponse(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
}

export async function GET() {
  try {
    // Check auth
    if (!getAuthCookie()) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tournaments = await prisma.tournament.findMany({
      include: { matches: true }
    });

    return json({ tournaments });
  } catch (error) {
    console.error('GET /api/tournaments error:', error);
    return json({ error: 'Failed to fetch tournaments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check auth
    if (!getAuthCookie()) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Validate tournament name
    if (!body?.name || typeof body.name !== 'string') {
      return json({ error: 'Name is required' }, { status: 400 });
    }

    // Create tournament
    const tournament = await prisma.tournament.create({
      data: { name: body.name }
    });

    return json({ tournament }, { status: 201 });
  } catch (error) {
    console.error('POST /api/tournaments error:', error);
    return json({ error: 'Failed to create tournament' }, { status: 500 });
  }
}
