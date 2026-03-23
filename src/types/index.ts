export interface ProjectSection {
  heading: string;
  items: string[];
  benefits?: string[];
}

export interface Project {
  slug: string;
  title: string;
  titleZh?: string;
  description: string;
  descriptionZh?: string;
  longDescription: string;
  longDescriptionZh?: string;
  sections?: ProjectSection[];
  sectionsZh?: ProjectSection[];
  images?: string[];
  tech: string[];
  category: string;
  image: string;
  links: {
    github?: string;
    demo?: string;
  };
  featured: boolean;
  year: string;
}

export interface Skill {
  name: string;
  category: "backend" | "data" | "cloud" | "tools";
}

export interface ExperienceSection {
  heading: string;
  items: string[];
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  titleZh?: string;
  company: string;
  companyZh?: string;
  logo?: string;
  type: "work" | "education";
  /** true = freelance / side project running concurrently with main role */
  freelance?: boolean;
  description: string[];
  descriptionZh?: string[];
  /** Rich structured content for the detail page (English) */
  sections?: ExperienceSection[];
  /** Rich structured content for the detail page (Chinese) */
  sectionsZh?: ExperienceSection[];
  tags: string[];
}
