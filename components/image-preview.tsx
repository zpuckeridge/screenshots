"use client";

import React, { useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
import { Lightbox, addToolbarButton } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";
import NextJsImage from "./nextjs-image-render";
import Vote from "./vote";

export default function ImagePreview({ images }: { images: any }) {
  const [index, setIndex] = useState(-1);
  const [loadedImages, setLoadedImages] = useState<any[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: any[] = [];

      for (const image of images) {
        try {
          const img = new Image();
          img.src = image.src;
          await img.decode();

          loadedImages.push({
            ...image,
            width: img.width,
            height: img.height,
          });
        } catch (error) {
          console.error("Error loading image:", error);
        }
      }

      setLoadedImages(loadedImages);
    };

    loadImages();
  }, [images]);

  function MyPlugin({ augment }: { augment: any }) {
    augment(({ toolbar, ...restProps }: any) => ({
      toolbar: addToolbarButton(
        toolbar,
        "my-button",
        <Vote data={loadedImages[index] ? loadedImages[index] : null} />
      ),
      ...restProps,
    }));
  }

  return (
    <>
      <PhotoAlbum
        layout="masonry"
        photos={loadedImages}
        renderPhoto={NextJsImage}
        targetRowHeight={150}
        sizes={{ size: "calc(100vw - 240px)" }}
        onClick={({ index: current }) => setIndex(current)}
      />

      <Lightbox
        index={index}
        slides={loadedImages}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Zoom, Thumbnails, Captions, MyPlugin]}
      />
    </>
  );
}
