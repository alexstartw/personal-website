export type PhotoCategory = "portrait" | "coser";

export interface PhotoWork {
  slug: string;
  title: string;
  category: PhotoCategory;
  images: string[];
  igUrl: string;
  date: string;
  description?: string;
  subject?: string; // coser: character / show name
}
