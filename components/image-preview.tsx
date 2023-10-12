"use client";

import React, { useState } from "react";
import PhotoAlbum, { RenderPhotoProps } from "react-photo-album";
import { Lightbox, useLightboxState } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Download from "yet-another-react-lightbox/plugins/download";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Vote from "./vote";
import Image from "next/image";
import { ThumbsUp } from "lucide-react";

export default function ImagePreview({ images }: { images: any }) {
  const [index, setIndex] = useState(-1);

  function VoteButton() {
    const { currentIndex } = useLightboxState();

    return <Vote data={images[currentIndex] ? images[currentIndex] : null} />;
  }

  function NextJsImage({
    photo,
    imageProps: { alt, title, sizes, className, onClick },
    wrapperStyle,
  }: RenderPhotoProps) {
    // @ts-ignore
    const voteCount = Array.isArray(photo.votes) ? photo.votes : [];
    const totalVotes = voteCount.length;

    return (
      <div style={{ ...wrapperStyle, position: "relative" }}>
        <Image
          fill
          src={photo}
          {...{ alt, title, sizes, className, onClick }}
        />
        <div className="absolute bottom-0 left-0 w-full p-4 text-white flex gap-2">
          <ThumbsUp /> {totalVotes}
        </div>
      </div>
    );
  }

  return (
    <>
      <PhotoAlbum
        layout="masonry"
        photos={images}
        renderPhoto={NextJsImage}
        targetRowHeight={150}
        sizes={{ size: "calc(100vw - 240px)" }}
        onClick={({ index: current }) => setIndex(current)}
      />

      <Lightbox
        index={index}
        slides={images}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Zoom, Download, Thumbnails, Captions]}
        toolbar={{
          buttons: [
            <VoteButton key="my-button" />,
            "zoom",
            "fullscreen",
            "download",
            "close",
          ],
        }}
      />
    </>
  );
}
