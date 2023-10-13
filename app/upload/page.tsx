import UploadForm from "@/components/upload-form";
import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs";

async function getMissions() {
  return await prisma.mission.findMany();
}

async function getScreenshots() {
  return await prisma.screenshots.findMany();
}

export default async function UploadPage() {
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
    // If the user is a member of the ZSU Guild
    const missions = await getMissions();
    const screenshots = await getScreenshots();

    return (
      <>
        <div className="container my-10">
          <div className="max-w-2xl mx-auto">
            <UploadForm missions={missions} screenshots={screenshots} />
          </div>
        </div>
      </>
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
