import ImagePreview from "@/components/image-preview";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs";

// Define a type for the imagesByTitle object
type ImagesByTitle = Record<string, any[]>;

async function retrieveImages() {
  const submissions = await prisma.screenshots.findMany();
  return submissions;
}

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    return <p>You are not logged in.</p>;
  }

  const discord = await clerkClient.users.getUserOauthAccessToken(
    userId,
    "oauth_discord"
  );

  const token = discord[0].token;

  const response = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  const zsuGuild = data.find((guild: any) => guild.id === "124430303820382208");

  if (zsuGuild) {
    const images = await retrieveImages();

    // Create an object to store images grouped by title
    const imagesByTitle: ImagesByTitle = {};

    // Group images by title
    images.forEach((image) => {
      const title = image.title;

      if (!imagesByTitle[title]) {
        imagesByTitle[title] = [];
      }

      imagesByTitle[title].push({
        id: image.id,
        src: image.image,
        author: image.author,
        width: image.width,
        height: image.height,
        title: image.title,
        description: `Screenshot taken by ${image.author}`,
        votes: image.votes,
      });
    });

    // Convert the object into an array of grouped images
    const groupedImages = Object.entries(imagesByTitle).map(
      ([title, images]) => {
        return {
          title: title,
          images: images,
        };
      }
    );

    return (
      <div className="container py-8">
        {groupedImages.map((group, index) => (
          <div key={index} className="mb-12 space-y-2">
            <h2 className="font-semibold text-xl tracking-tighter">
              {group.title} <Separator />
            </h2>
            <ImagePreview images={group.images} />
          </div>
        ))}
      </div>
    );
  } else {
    // If the user is not a member of the ZSU Guild
    return (
      <p className="text-center my-10 container">
        You are not apart of the ZSU Discord. Feel free to join:{" "}
        <a
          href="https://discord.gg/zsu"
          className="hover:text-blue-400 underline hover:no-underline">
          https://discord.gg/zsu
        </a>
      </p>
    );
  }
}
