import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const match = await prisma.match.create({
      data: {
        round: json.round,
        placement: json.placement,
        kills: json.kills,
        date: new Date(json.date),
        prize: json.prize,
        tournamentId: params.id
      }
    });
    return NextResponse.json(match);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 });
  }
}
