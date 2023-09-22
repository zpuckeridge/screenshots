import ImagePreview from "@/components/image-preview";
import prisma from "@/lib/prisma";

async function retrieveImages() {
  const submissions = await prisma.screenshots.findMany();

  return submissions;
}

export default async function Home() {
  const submissions = await retrieveImages();

  return (
    <>
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        <ImagePreview submissions={submissions} />
      </div>
    </>
  );
}
