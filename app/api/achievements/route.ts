import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { CreateAchievementDTO } from '@/app/types/achievement';

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: CreateAchievementDTO = await request.json();
    const achievement = await prisma.achievement.create({
      data: {
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      }
    });

    return NextResponse.json(achievement);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}
