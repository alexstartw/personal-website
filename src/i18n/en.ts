export interface Locale {
  nav: {
    about: string;
    skills: string;
    experience: string;
    projects: string;
    contact: string;
    blog: string;
  };
  hero: {
    badge: string;
    name: string;
    title: string;
    subtitle: string;
    cta_projects: string;
    cta_contact: string;
    scroll: string;
  };
  about: {
    label: string;
    heading: string;
    bio1: string;
    bio2: string;
    bio3: string;
    bio4: string;
    stats: { value: string; label: string; items?: string[] }[];
  };
  skills: {
    label: string;
    heading: string;
    categories: {
      backend: string;
      data: string;
      cloud: string;
      tools: string;
    };
  };
  experience: {
    label: string;
    heading: string;
    work_label: string;
    edu_label: string;
  };
  projects: {
    label: string;
    heading: string;
    view_all: string;
    category_map: Record<string, string>;
  };
  contact: {
    label: string;
    heading: string;
    subtitle: string;
    available: string;
    links: {
      email: string;
      linkedin: string;
      github: string;
    };
    footer: string;
  };
}

export const en: Locale = {
  nav: {
    about: "About",
    skills: "Skills",
    experience: "Experience",
    projects: "Projects",
    contact: "Contact",
    blog: "Blog",
  },
  hero: {
    badge: "Available for opportunities",
    name: "Li-Yu Alex Lin",
    title: "Data Engineer",
    subtitle:
      "5+ years building data-intensive systems in event-driven architectures and cloud-native environments. Specializing in scalable data solutions and GenAI applications.",
    cta_projects: "View Projects",
    cta_contact: "Get in Touch",
    scroll: "Scroll",
  },
  about: {
    label: "About",
    heading: "Building the infrastructure that powers modern data products.",
    bio1: "I'm Li-Yu (Alex) Lin, a Senior Data Engineer based in Taipei, Taiwan. With over 5 years of experience, I specialize in building data-intensive systems across event-driven architectures and cloud-native environments.",
    bio2: "My journey spans semiconductor manufacturing automation at UMC, backend API development at Migo Corp, and now leading enterprise-grade data platform engineering at Datarget. I've built systems that process TB-level data traffic daily and developed GenAI solutions that generate significant business value.",
    bio3: "I hold a Master's degree in Information and Computer Engineering from Chung Yuan Christian University, giving me a strong foundation in algorithms, distributed systems, and machine learning.",
    bio4: "Outside work, I'm passionate about the intersection of large language models and data infrastructure — particularly how RAG architectures can make enterprise knowledge more accessible.",
    stats: [
      { value: "5+", label: "Years Experience" },
      {
        value: "",
        label: "Industries Served",
        items: ["Semiconductor", "Cybersecurity", "SaaS", "Data / AI"],
      },
      { value: "NT$50M+", label: "Revenue Generated" },
      { value: "3+", label: "Led GenAI & Data Platform Projects" },
    ],
  },
  skills: {
    label: "Skills",
    heading: "Technologies & Expertise",
    categories: {
      backend: "Backend Engineering",
      data: "Data Engineering",
      cloud: "Cloud & AI",
      tools: "Tools & Methods",
    },
  },
  experience: {
    label: "Experience",
    heading: "Career & Education",
    work_label: "Work",
    edu_label: "Education",
  },
  projects: {
    label: "Projects",
    heading: "Featured Work",
    view_all: "View all projects →",
    category_map: {
      "Data Engineering": "Data Engineering",
      "AI / ML": "AI / ML",
      Backend: "Backend",
      Automation: "Automation",
    },
  },
  contact: {
    label: "Contact",
    heading: "Let's Connect",
    subtitle:
      "Open to senior data engineering roles, GenAI projects, and consulting opportunities.",
    available: "Currently available",
    links: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    footer: "Li-Yu Alex Lin · Senior Data Engineer · Taipei, Taiwan",
  },
};
