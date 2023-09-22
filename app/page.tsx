import ImagePreview from "@/components/image-preview";
import prisma from "@/lib/prisma";

async function retrieveImages() {
  const submissions = await prisma.screenshots.findMany();
  return submissions;
}

export default async function Home() {
  const images = await retrieveImages();

  const data = images.map((image: any) => {
    return {
      src: image.image,
      title: image.title,
      description: `Screenshot taken by ${image.author}`,
    };
  });

  return (
    <>
      <ImagePreview images={data} />
    </>
  );
}
