import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const res = await request.json();

  try {
    const existingScreenshot = await prisma.screenshots.findUnique({
      where: {
        id: res.id,
      },
    });

    if (existingScreenshot) {
      let updatedVotes = [];

      if (Array.isArray(existingScreenshot.votes)) {
        if (!existingScreenshot.votes.includes(res.username)) {
          // Only add the username if it doesn't already exist in the array
          updatedVotes = [...existingScreenshot.votes, res.username];
        } else {
          // Username already exists, no need to add it again
          updatedVotes = existingScreenshot.votes;
        }
      } else {
        updatedVotes = [res.username];
      }

      await prisma.screenshots.update({
        where: {
          id: res.id,
        },
        data: {
          votes: updatedVotes,
        },
      });

      return NextResponse.json({ message: "success" });
    } else {
      return NextResponse.json(
        { message: "Screenshot not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
