import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Get all teams
export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        players: true,
      },
    });
    return NextResponse.json(teams);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching teams" }, { status: 500 });
  }
}

// Create new team
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const team = await prisma.team.create({
      data: {
        name: data.name,
        total_matches: data.total_matches,
        win_rate: data.win_rate,
        total_kills: data.total_kills,
        avg_survival: data.avg_survival,
        players: {
          create: data.players,
        },
      },
      include: {
        players: true,
      },
    });
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ error: "Error creating team" }, { status: 500 });
  }
}

// Update team
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    // Update team and its players
    const team = await prisma.team.update({
      where: { id },
      data: {
        ...updateData,
        players: {
          deleteMany: {},
          create: data.players,
        },
      },
      include: {
        players: true,
      },
    });
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ error: "Error updating team" }, { status: 500 });
  }
}

// Delete team
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Team ID required" }, { status: 400 });
    }

    await prisma.team.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting team" }, { status: 500 });
  }
}
