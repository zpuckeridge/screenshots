import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { title, author, images } = json;

    const createdPosts = [];

    for (const image of images) {
      const post = await prisma.screenshots.create({
        data: {
          title: title,
          author: author,
          image: image.secure_url,
          width: image.width,
          height: image.height,
        },
      });
      createdPosts.push(post);
    }

    return NextResponse.json(createdPosts, { status: 201 });
  } catch (error) {
    console.error("Error creating posts:", error);
    return NextResponse.json("Something went wrong.", { status: 500 });
  }
}
