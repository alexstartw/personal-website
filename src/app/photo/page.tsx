import { getPhotoWorksByCategory, getPhotoWorkBySlug } from "@/lib/photos";
import { PhotoHomeClient } from "@/components/photo/PhotoHomeClient";
import { img } from "@/lib/utils";

export default function PhotoHomePage() {
  const portraitWorks = getPhotoWorksByCategory("portrait");
  const coserWorks = getPhotoWorksByCategory("coser");

  const portraitCoverWork = getPhotoWorkBySlug("依凡-電動");
  const coserCoverWork = getPhotoWorkBySlug("AOI-FF46");

  return (
    <PhotoHomeClient
      portraitWorks={portraitWorks}
      coserWorks={coserWorks}
      portraitCoverSrc={
        portraitCoverWork?.images[0]
          ? img(portraitCoverWork.images[0])
          : undefined
      }
      coserCoverSrc={
        coserCoverWork?.images[0] ? img(coserCoverWork.images[0]) : undefined
      }
    />
  );
}
