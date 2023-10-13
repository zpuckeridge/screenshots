import ImagePreview from "@/components/image-preview";
import prisma from "@/lib/prisma";

// Define a type for the imagesByTitle object
type ImagesByTitle = Record<string, any[]>;

async function retrieveImages() {
  const submissions = await prisma.screenshots.findMany();
  return submissions;
}

export default async function Home() {
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
  const groupedImages = Object.entries(imagesByTitle).map(([title, images]) => {
    return {
      title: title,
      images: images,
    };
  });

  return (
    <div className="container py-8">
      {groupedImages.map((group, index) => (
        <div key={index} className="mb-4 space-y-2">
          <h2 className="font-semibold text-xl underline">{group.title}</h2>
          <ImagePreview images={group.images} />
        </div>
      ))}
    </div>
  );
}
