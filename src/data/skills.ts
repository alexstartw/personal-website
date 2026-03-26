import type { Skill } from "@/types";

export const skills: Skill[] = [
  // Backend
  { name: "Python", category: "backend" },
  { name: "C#", category: "backend" },
  { name: "RESTful API", category: "backend" },
  { name: "Linux / Unix", category: "backend" },
  { name: "Docker", category: "backend" },
  { name: "Git", category: "backend" },

  // Data Engineering
  { name: "PostgreSQL", category: "data" },
  { name: "MS SQL Server", category: "data" },
  { name: "Redis", category: "data" },
  { name: "ClickHouse", category: "data" },
  { name: "Apache Airflow", category: "data" },
  { name: "Microsoft Fabric", category: "data" },
  { name: "dbt", category: "data" },
  { name: "MLflow", category: "data" },

  // Cloud & AI
  { name: "GCP", category: "cloud" },
  { name: "Microsoft Azure", category: "cloud" },
  { name: "LangChain", category: "cloud" },
  { name: "OpenAI API", category: "cloud" },
  { name: "RAG Architecture", category: "cloud" },
  { name: "Deep Learning", category: "cloud" },

  // Tools
  { name: "Scrum / Agile", category: "tools" },
  { name: "CI/CD", category: "tools" },
  { name: "Unit Testing / TDD", category: "tools" },
  { name: "GA4", category: "tools" },
];

export const categoryLabels: Record<Skill["category"], string> = {
  backend: "Backend Engineering",
  data: "Data Engineering",
  cloud: "Cloud & AI",
  tools: "Tools & Methods",
};
