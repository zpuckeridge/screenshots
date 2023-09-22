"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function Home({ submissions }: { submissions: any }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openDialog = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeDialog = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Dialog>
        {submissions.map((submission: any) => (
          <div key={submission.id} className="relative">
            <DialogTrigger asChild>
              <Image
                src={submission.image}
                width={500}
                height={500}
                alt={submission.title}
                onClick={() => openDialog(submission.image)}
                style={{ cursor: "pointer" }}
              />
            </DialogTrigger>
            <div className="absolute bottom-0 left-0 right-0 bg-black text-white p-2 opacity-75">
              <h2 className="text-xl font-semibold">{submission.title}</h2>
              <p className="text-sm">{submission.description}</p>
              <p className="text-sm">{submission.author}</p>
            </div>
          </div>
        ))}
        {selectedImage && (
          <DialogContent>
            <div className="p-4">
              <Image
                src={selectedImage}
                width={800} // Adjust the width and height as needed
                height={600}
                alt="Large Image"
              />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
