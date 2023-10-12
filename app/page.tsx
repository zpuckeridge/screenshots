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
      id: image.id,
      src: image.image,
      width: image.width,
      height: image.height,
      title: image.title,
      description: `Screenshot taken by ${image.author}`,
      votes: image.votes,
    };
  });

  return (
    <div className="container py-8">
      <ImagePreview images={data} />
    </div>
  );
}
