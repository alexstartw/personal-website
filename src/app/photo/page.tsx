import { getPhotoWorksByCategory } from "@/lib/photos";
import { PhotoHomeClient } from "@/components/photo/PhotoHomeClient";

export default function PhotoHomePage() {
  const portraitWorks = getPhotoWorksByCategory("portrait");
  const coserWorks = getPhotoWorksByCategory("coser");

  return (
    <PhotoHomeClient portraitWorks={portraitWorks} coserWorks={coserWorks} />
  );
}
