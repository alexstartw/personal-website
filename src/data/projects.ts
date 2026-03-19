import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "multi-cloud-data-platform",
    title: "Multi-Cloud Data Platform",
    titleZh: "多雲數據平台",
    description:
      "Enterprise-grade hybrid data platform spanning GCP, Azure, and on-premise environments for real-time analytics.",
    descriptionZh:
      "橫跨 GCP、Azure 與地端的企業級混合雲數據平台，支援即時分析需求。",
    longDescription:
      "Designed and built an enterprise-grade hybrid data platform that seamlessly spans GCP, Azure, and on-premise infrastructure. The platform handles TB-level data traffic daily, integrating PostgreSQL, Apache Airflow orchestration, and MLflow for experiment tracking. Optimized large-scale CSV data pipelines to Parquet format, reducing storage costs and query latency significantly.",
    longDescriptionZh:
      "設計並建構企業級混合雲數據平台，無縫整合 GCP、Azure 與地端基礎設施。平台每日處理 TB 級數據流量，整合 PostgreSQL、Apache Airflow 編排工具與 MLflow 實驗追蹤系統。將大規模 CSV 數據管線優化為 Parquet 格式，大幅降低儲存成本與查詢延遲。",
    tech: ["GCP", "Azure", "PostgreSQL", "Apache Airflow", "MLflow", "Parquet", "Docker"],
    category: "Data Engineering",
    image: "/images/projects/multi-cloud.jpg",
    links: {},
    featured: true,
    year: "2024",
  },
  {
    slug: "genai-rag-chatbot",
    title: "GenAI RAG Chatbot",
    titleZh: "GenAI RAG 智能問答系統",
    description:
      "Intelligent document Q&A system using LangChain, OpenAI, and Gemini with retrieval-augmented generation.",
    descriptionZh:
      "以 LangChain、OpenAI 與 Gemini 建構的智能文件問答系統，採用檢索增強生成技術。",
    longDescription:
      "Led the architecture and development of a production-ready GenAI chatbot using Retrieval-Augmented Generation (RAG). The system processes structured and unstructured data including voice transcripts and PDFs, providing accurate, context-aware answers. Built on LangChain with OpenAI and Google Gemini models, deployed via Docker with CI/CD pipelines.",
    longDescriptionZh:
      "主導生產就緒的 GenAI 聊天機器人架構設計與開發，採用 RAG 技術。系統可處理包含語音轉錄與 PDF 在內的結構與非結構化資料，提供精準的上下文感知回答。基於 LangChain 搭配 OpenAI 與 Google Gemini 模型，透過 Docker 與 CI/CD 管線部署。",
    tech: ["LangChain", "OpenAI", "Gemini", "Python", "RAG", "Docker", "CI/CD"],
    category: "AI / ML",
    image: "/images/projects/genai-rag.jpg",
    links: {},
    featured: true,
    year: "2024",
  },
  {
    slug: "crm-saas-platform",
    title: "CRM SaaS Platform",
    titleZh: "CRM SaaS 平台",
    description:
      "Full-featured CRM platform with B2B workflows, built on cloud-native architecture using C# and GCP.",
    descriptionZh:
      "功能完整的 CRM 平台，支援 B2B 業務流程，基於 C# 與 GCP 雲端原生架構開發。",
    longDescription:
      "Delivered core CRM features and B2B workflow APIs for a SaaS platform serving enterprise clients. Refactored legacy monolithic systems into a decoupled, cloud-native architecture on GCP. Implemented multi-SMTP email infrastructure, standardized Docker-based development environments, and improved system stability through comprehensive TDD-based testing.",
    longDescriptionZh:
      "為服務企業客戶的 SaaS 平台交付核心 CRM 功能與 B2B 業務 API。將遺留單體系統重構為 GCP 上的解耦雲端原生架構，實作多 SMTP 郵件基礎設施，標準化 Docker 開發環境，並透過 TDD 全面提升系統穩定性。",
    tech: ["C#", "GCP", "PostgreSQL", "Redis", "MS SQL Server", "Docker", "Scrum"],
    category: "Backend",
    image: "/images/projects/crm-saas.jpg",
    links: {},
    featured: true,
    year: "2023",
  },
  {
    slug: "mlops-pipeline",
    title: "MLOps Pipeline",
    titleZh: "MLOps 自動化管線",
    description:
      "End-to-end machine learning pipeline with automated training, evaluation, and deployment workflows.",
    descriptionZh:
      "端到端機器學習管線，涵蓋自動化訓練、評估與部署工作流程。",
    longDescription:
      "Designed and implemented a comprehensive MLOps pipeline that automates the full machine learning lifecycle — from data ingestion and feature engineering to model training, evaluation, and deployment. Integrated MLflow for experiment tracking, Airflow for orchestration, and Docker for containerized, reproducible environments.",
    longDescriptionZh:
      "設計並實作全面的 MLOps 管線，自動化完整的機器學習生命週期——從資料擷取、特徵工程到模型訓練、評估與部署。整合 MLflow 實驗追蹤、Airflow 編排調度，以及 Docker 容器化可重現環境。",
    tech: ["Python", "MLflow", "Apache Airflow", "Docker", "PostgreSQL", "GCP"],
    category: "AI / ML",
    image: "/images/projects/mlops.jpg",
    links: {},
    featured: false,
    year: "2024",
  },
  {
    slug: "rpa-automation",
    title: "Manufacturing RPA Automation",
    titleZh: "製造業 RPA 自動化",
    description:
      "RPA automation solutions for semiconductor manufacturing, reducing machine configuration time from hours to minutes.",
    descriptionZh:
      "半導體製造業的 RPA 自動化解決方案，將機台設定時間從數小時縮短至數分鐘。",
    longDescription:
      "Developed RPA automation solutions for production manufacturing systems at UMC, one of the world's leading semiconductor foundries. Created Shell and Python scripts that integrated cross-factory databases and automated repetitive configuration tasks. The solutions reduced machine setup time from several hours to just minutes, significantly increasing throughput.",
    longDescriptionZh:
      "為全球頂尖半導體晶圓廠聯華電子開發生產製造系統的 RPA 自動化解決方案。建立整合跨廠區資料庫的 Shell 與 Python 腳本，自動化重複性設定任務。解決方案將機台設定時間從數小時縮短至數分鐘，大幅提升產能。",
    tech: ["Python", "Shell Script", "RPA", "Database Integration", "Linux"],
    category: "Automation",
    image: "/images/projects/rpa.jpg",
    links: {},
    featured: false,
    year: "2022",
  },
  {
    slug: "data-warehouse-clickhouse",
    title: "ClickHouse Analytics Warehouse",
    titleZh: "ClickHouse 分析數據倉儲",
    description:
      "High-performance analytics data warehouse with real-time ingestion and sub-second query response.",
    descriptionZh:
      "高效能分析數據倉儲，支援即時資料擷取與亞秒級查詢回應。",
    longDescription:
      "Architected and implemented a high-performance analytics data warehouse using ClickHouse optimized for OLAP workloads. The system supports real-time data ingestion from multiple sources, with dbt for data transformation and GA4 integration for web analytics. Achieved sub-second query response times on billions of rows.",
    longDescriptionZh:
      "架構並實作以 ClickHouse 為核心的高效能 OLAP 分析數據倉儲。系統支援多來源即時資料擷取，整合 dbt 進行數據轉換，以及 GA4 網站分析整合。在數十億筆資料規模下實現亞秒級查詢回應時間。",
    tech: ["ClickHouse", "dbt", "Python", "GA4", "PostgreSQL", "Airflow"],
    category: "Data Engineering",
    image: "/images/projects/clickhouse.jpg",
    links: {},
    featured: false,
    year: "2023",
  },
];

export const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
