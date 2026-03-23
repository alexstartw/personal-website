import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "autollm",
    title: "AutoLLM — No-Code RAG Chatbot",
    titleZh: "AutoLLM — 無程式碼 RAG 聊天機器人",
    description:
      "Production-ready RAG chatbot: upload files, configure retrieval, and chat with grounded citations — no code required.",
    descriptionZh:
      "生產就緒的 RAG 聊天機器人：上傳檔案、設定檢索參數，即可進行有來源引用的問答，無需撰寫程式碼。",
    longDescription:
      "AutoLLM is a full-stack, production-ready Retrieval-Augmented Generation chatbot built with FastAPI and Next.js. Users upload .txt/.pdf files which are parsed, chunked, embedded, and indexed into PostgreSQL with pgvector. The chat interface streams grounded answers with per-answer citations. Supports OpenAI, Gemini, and Claude as pluggable LLM providers. Features include JWT authentication, Redis-backed conversation cache (3-day TTL), streaming SSE responses, drag-and-drop multi-file upload, and per-user conversation isolation. Deployed via Docker Compose with a Make-based workflow.",
    longDescriptionZh:
      "AutoLLM 是以 FastAPI 與 Next.js 構建的全端生產就緒 RAG 聊天機器人。使用者上傳 .txt/.pdf 檔案後，系統自動進行解析、分塊、向量嵌入並索引至 PostgreSQL pgvector。聊天介面透過 SSE 串流輸出附引用來源的回答，支援 OpenAI、Gemini、Claude 等可插拔 LLM 提供者。功能涵蓋 JWT 驗證、Redis 對話快取（3 天 TTL）、串流回應、拖放多檔上傳及使用者對話隔離。透過 Docker Compose 與 Makefile 工作流程部署。",
    tech: ["FastAPI", "Next.js", "pgvector", "Redis", "OpenAI", "Docker"],
    category: "AI / ML",
    image: "/images/projects/autollm.jpg",
    links: { github: "https://github.com/chien-sheng-liu/AutoLLM" },
    featured: true,
    year: "2024",
  },
  {
    slug: "nine-nine-pos",
    title: "Nine-Nine POS & Inventory Platform",
    titleZh: "九九 POS 庫存管理系統",
    description:
      "Modular POS and inventory platform with member discounts, barcode auto-generation, Excel batch import, and real-time sales analytics.",
    descriptionZh:
      "模組化 POS 與庫存管理平台，支援會員折扣、條碼自動生成、Excel 批次匯入與即時銷售分析。",
    longDescription:
      "Built a full-stack custom POS and inventory management system for retail. The frontend (Next.js 14 + Tailwind) covers POS terminal, vendor/product/member CRUD, stock management, reservations, and a sales analytics dashboard. The FastAPI backend with SQLModel handles member discount tiers (95% regular / 88% birthday), barcode generation from product attributes, reservation-to-order workflow with automatic inventory sync, and paginated API endpoints. Deployed as a single Docker image with Nginx routing — delivered as a .tar + Makefile for customer self-service deployment.",
    longDescriptionZh:
      "為零售業打造的全端客製化 POS 與庫存管理系統。前端採用 Next.js 14 + Tailwind，涵蓋 POS 收銀終端、廠商/商品/會員 CRUD、庫存管理、預約訂單與銷售分析儀表板。FastAPI 後端搭配 SQLModel，實作會員折扣機制（一般 95 折 / 生日月 88 折）、條碼自動生成、預約轉訂單並自動同步庫存，以及分頁 API。以單一 Docker 映像搭配 Nginx 路由部署，交付 .tar + Makefile 供客戶自助部署。",
    tech: [
      "FastAPI",
      "Next.js",
      "SQLite",
      "SQLModel",
      "Docker",
      "Nginx",
      "TypeScript",
    ],
    category: "Backend",
    image: "/images/projects/nine-nine-pos.jpg",
    links: { github: "https://github.com/alexstartw/nine-nine-pos" },
    featured: true,
    year: "2025",
  },
  {
    slug: "data-warehouse-clickhouse",
    title: "ClickHouse Analytics Warehouse",
    titleZh: "ClickHouse 分析數據倉儲",
    description:
      "High-performance analytics data warehouse with real-time ingestion and sub-second query response.",
    descriptionZh: "高效能分析數據倉儲，支援即時資料擷取與亞秒級查詢回應。",
    longDescription:
      "Architected and implemented a high-performance analytics data warehouse using ClickHouse optimized for OLAP workloads. The system supports real-time data ingestion from multiple sources, with dbt for data transformation and GA4 integration for web analytics. Achieved sub-second query response times on billions of rows.",
    longDescriptionZh:
      "架構並實作以 ClickHouse 為核心的高效能 OLAP 分析數據倉儲。系統支援多來源即時資料擷取，整合 dbt 進行數據轉換，以及 GA4 網站分析整合。在數十億筆資料規模下實現亞秒級查詢回應時間。",
    tech: ["ClickHouse", "dbt", "Python", "GA4", "PostgreSQL", "Airflow"],
    category: "Data Engineering",
    image: "/images/projects/clickhouse.jpg",
    links: {},
    featured: true,
    year: "2023",
  },
];

export const categories = [
  "All",
  ...Array.from(new Set(projects.map((p) => p.category))),
];
