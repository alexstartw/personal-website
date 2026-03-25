export type PhotoCategory = "portrait" | "coser";

export interface PhotoPerson {
  name: string;
  ig?: string;
}

export interface PhotoLocation {
  name: string;
  ig?: string;
}

export interface PhotoWork {
  slug: string;
  title: string;
  category: PhotoCategory;
  images: string[];      // max 3
  igUrl: string;
  date: string;
  description?: string;
  subject?: string;      // coser: character / show name

  // Rich metadata
  model?: PhotoPerson;
  location?: PhotoLocation;
  camera?: string;
  lens?: string;
}
