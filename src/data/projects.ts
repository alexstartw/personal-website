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
    slug: "fabric-data-pipeline",
    title: "Enterprise Data Pipeline Redesign",
    titleZh: "菸酒商全公司 Data Pipeline 重構",
    description:
      "Full-company data pipeline redesign for a tobacco & liquor distributor using Microsoft Fabric, OneLake, dbt, and Power BI.",
    descriptionZh:
      "協助菸酒商完成全公司資料管線重構，整合 Microsoft Fabric、OneLake、dbt 與 Power BI，建立可擴充的現代化資料架構。",
    longDescription:
      "Led the full-company data pipeline redesign for a tobacco and liquor distributor. Designed a modern lakehouse architecture on Microsoft Fabric with OneLake Shortcuts to Azure Blob — zero data movement, full traceability. Implemented dual-track orchestration (Fabric Pipeline + Managed Airflow) for both fast delivery and long-term extensibility. Built centralized monitoring via Monitor Hub and Data Activator for proactive alerting and auto-remediation. Used Fabric Notebooks with dbt for transformation and inline debugging. Closed the loop by writing ML predictions (forecast, churn, anomaly) back into the warehouse for Power BI consumption.",
    longDescriptionZh:
      "主導一家菸酒商的全公司資料管線重構專案。在 Microsoft Fabric 上設計現代化 Lakehouse 架構，透過 OneLake Shortcut 直連 Azure Blob，無需搬移資料，同時保留完整原始歷史與稽核可追溯性。採用雙軌調度策略（Fabric Pipeline 原生管線 + Managed Airflow），短期快速交付、中長期可橫向擴充。建立集中式監控（Monitor Hub + Data Activator）實現主動告警與自動修復。以 Fabric Notebook 搭配 dbt 執行轉換與即時除錯，最終將 ML 預測結果回寫至 Warehouse，形成「分析→回寫→再分析」閉環。",
    sections: [
      {
        heading: "OneLake Shortcut — Zero Data Movement",
        items: [
          "Connected Azure Blob to Fabric via OneLake Shortcuts — logical links, no data copy",
          "Raw files remain in Blob as long-term storage and audit trail",
          "Data available to Fabric immediately on arrival — no ETL lag",
        ],
        benefits: [
          "Faster time-to-value: data queryable the moment it lands",
          "Full traceability: raw files available for audit and compliance review",
        ],
      },
      {
        heading: "Dual-Track Orchestration",
        items: [
          "Fabric Pipeline (native): ETL/ELT, Dataflow, Copy, scheduled refreshes — fast delivery, easy handover",
          "Managed Airflow (built-in): complex DAG dependencies, multi-job wait, backfill support",
          "Airflow triggers Fabric Pipelines and manages cross-job dependencies",
          "Built-in data health checks and backfill capability for historical data",
        ],
        benefits: [
          "Short-term: stable delivery with native tooling the client can maintain",
          "Long-term: extensible to external systems and multi-cloud without a rebuild",
        ],
      },
      {
        heading: "Monitoring & Auto-Remediation",
        items: [
          "Monitor Hub: centralized view of all Pipeline, Notebook, Dataflow job states",
          "Data Activator: detects anomalies, triggers alerts and retry/remediation flows",
          "Automated fix rules turn recurring issues into repeatable standard procedures",
        ],
        benefits: [
          "Observability shift: from reactive (find out after failure) to proactive (real-time awareness)",
          "Automation: common failure patterns handled without manual intervention",
        ],
      },
      {
        heading: "Fabric Notebook + dbt Development & Debugging",
        items: [
          "Run dbt inside Fabric Notebook — transformation and data inspection in the same environment",
          "When dbt run --select fails, next cell queries the data directly in Python for instant diagnosis",
          "Temporary validation done inline — no tool switching required",
        ],
        benefits: [
          "Faster debugging: pinpoint issues without leaving the workspace",
          "Higher delivery quality: visual validation replaces trial-and-error blind fixes",
        ],
      },
      {
        heading: "Semantic Model & Data Loop",
        items: [
          "Notebook predictions written back to Warehouse / OneLake: Sales Forecast, Churn Score, Product Ranking, Anomaly Flag",
          "Power BI reports consume predictions via a single unified Semantic Model",
          "Same model serves multiple reports and departments — consistent definitions across the org",
        ],
        benefits: [
          "Business questions answered: when will revenue dip, which stores have anomalies, who is at churn risk",
          "AI/ML results visible to business users — not stuck in a notebook",
        ],
      },
      {
        heading: "AI / ML Feedback Loop",
        items: [
          "Bronze → Raw landing; Silver → Cleaned; Gold → Direct-to-report",
          "Notebook ML outputs (insights/predictions) written back to Gold / Warehouse / OneLake",
          "Power BI consumes via Semantic Model → visualization + decision + re-iteration cycle",
        ],
        benefits: [
          "AI beyond POC: results land in BI, tracked against KPIs",
          "Closed loop: Data → Model → Decision — extensible to Copilot, Forecast, Optimization",
        ],
      },
    ],
    sectionsZh: [
      {
        heading: "OneLake Shortcut 直接取用（毋需搬資料）",
        items: [
          "使用 OneLake Shortcut 連 Azure Blob，不搬資料、用邏輯連結直接取用",
          "保留原始資料長期存於 Blob：作為原始落地與歷史留存位置",
          "資料一到 Blob 就可被 Fabric 取用，無需額外 ETL 等待",
        ],
        benefits: [
          "縮短上線時間：資料一到 Blob 就可被 Fabric 取用",
          "保留可追溯性：原始檔可回溯、稽核更完整（尤其投標加分）",
        ],
      },
      {
        heading: "Orchestration 雙軌調度",
        items: [
          "Fabric Pipeline（原生）：ETL/ELT、Dataflow/Copy、定時更新，上手快、交付快",
          "Managed Airflow（Fabric 內建）：複雜依賴 DAG、多 job 等待、支援回填歷史資料",
          "Airflow 協助觸發 Fabric Pipeline、管理依賴關係",
          "內建資料健康度檢查，支援 Backfill",
        ],
        benefits: [
          "短期快速交付：先用 Fabric Native 穩定落地",
          "中長期可擴充：未來接外部系統 / 多雲 / 地端不需要推倒重來",
        ],
      },
      {
        heading: "監控與自動化應對",
        items: [
          "Monitoring Hub：集中監看 Pipeline、Notebook、Dataflow 即時狀況與成敗",
          "Data Activator：偵測異常，發訊息、觸發 retry / 補救流程",
          "Monitor Hub 自動修復，Data Activator 主動通知並自動處理",
        ],
        benefits: [
          "可觀測性提升：從「出事才知道」→「即時掌握」",
          "自動化處置：用規則把常見問題變成可重複處理的標準流程",
        ],
      },
      {
        heading: "Fabric Notebook + dbt 開發與除錯",
        items: [
          "用 Fabric Notebook 跑 dbt，轉換與資料檢查在同一環境完成",
          "若 dbt run --select 失敗，下一個 cell 直接用 Python 抓資料檢查",
          "需要臨時驗證時，可用 Notebook 直接寫 Python 做快檢",
        ],
        benefits: [
          "縮短除錯時間：問題發生時快速定位",
          "降低跨工具切換成本：同一工作區完成轉換、驗證與分析",
        ],
      },
      {
        heading: "語意模型建立 Data Loop",
        items: [
          "Notebook 產出預測回填至 Warehouse / OneLake：銷量 Forecast、流失 Churn Score、商品推薦 Ranking、異常偵測 Anomaly Flag",
          "Power BI 報表透過單一 Semantic Model 呈現預測結果",
          "同一套 Semantic Model 服務多報表、多部門，口徑一致",
        ],
        benefits: [
          "回答業務問題：什麼時候會掉業績、哪店有異常、誰會流失",
          "AI/ML 落地：預測結果回寫後能被業務直接看見與採用",
        ],
      },
      {
        heading: "AI / ML 回饋閉環",
        items: [
          "Bronze → Raw 落地；Silver → 清洗；Gold → 直接供報表使用",
          "AI/ML（Notebook）產出洞察 / 預測 → 回填 Gold / Warehouse / OneLake",
          "BI 端透過 Semantic Model 直接製表，形成「資料→模型→決策」循環",
        ],
        benefits: [
          "AI 不只停在 POC：結果直接進 BI，被看見、被追 KPI",
          "形成閉環：更容易擴到 Copilot / Forecast / Optimization",
        ],
      },
    ],
    images: [
      "/images/projects/fabric-data-pipeline-infra.png",
      "/images/projects/fabric-data-pipeline-structure.png",
    ],
    tech: [
      "Microsoft Fabric",
      "OneLake",
      "Azure Blob",
      "dbt",
      "Power BI",
      "Apache Airflow",
      "Python",
    ],
    category: "Data Engineering",
    image: "/images/projects/fabric-data-pipeline-infra.png",
    links: {},
    featured: true,
    year: "2025",
  },
];

export const categories = [
  "All",
  ...Array.from(new Set(projects.map((p) => p.category))),
];
