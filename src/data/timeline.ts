import type { TimelineEvent } from "@/types";

export const timeline: TimelineEvent[] = [
  {
    id: "datarget",
    year: "Aug 2024 – Present",
    title: "Senior Data Engineer",
    titleZh: "資深數據工程師",
    company: "Datarget",
    companyZh: "Datarget",
    logo: "/logos/datarget.png",
    type: "work",
    description: [
      "Designed enterprise-grade hybrid platforms across Multi-Cloud (GCP/Azure) and on-premise environments.",
      "Led GenAI & RAG architectures using OpenAI and Gemini; developed LangChain chatbots.",
      "Processed structured/unstructured data (Voice/PDF); optimized 30GB+ CSVs to Parquet format.",
      "Generated NT$50M+ project revenue; mentored junior engineers.",
    ],
    descriptionZh: [
      "設計橫跨 GCP/Azure 與地端的企業級混合雲平台。",
      "主導 GenAI & RAG 架構，以 OpenAI 及 Gemini 開發 LangChain 聊天機器人。",
      "處理語音、PDF 等結構與非結構化資料；將 30GB+ CSV 優化為 Parquet 格式。",
      "創造超過 NT$5,000 萬專案收益；指導初階工程師成長。",
    ],
    sectionsZh: [
      {
        heading: "多雲與地端數據基礎設施",
        items: [
          "GCP 雲端原生開發：運用 Google Cloud Platform (GCP) 構建資料解決方案。包含使用 Cloud Run 部署容器化服務、利用 BigQuery 進行大規模數據分析、以及 Cloud SQL 與 Memorystore (Redis) 的規劃與高可用架構建立。",
          "企業級 Data Pipeline 設計：於專案內配合 Microsoft Fabric 實作 Medallion Architecture (Bronze/Silver/Gold)，建立標準化的分層資料流，強化資料治理。",
          "混合雲與地端架構開發：具備地端 (On-premise) 架構建置經驗，能針對企業環境設計最符合的資料解決方案，並處理相關跨雲/地端資料整合。",
          "資料庫專長：精通 PostgreSQL、MS SQL Server、Redis 等相關資料庫，能針對不同的應用場景（關聯式儲存、高性能緩存、大數據處理）優化資料模型設計與查詢性能。",
          "分散式系統設計：擁有從零開始開發分散式資料庫系統（ClickHouse）的實戰經驗，掌握數據分片 (Sharding)、副本管理 (Replication) 與一致性設計的核心原理。",
          "高可用性工作流調度：運用 Apache Airflow 進行任務排程與依賴管理，確保數據管線在混合環境下的彈性與故障恢復能力。",
          "資料模型與報表優化：負責 Refine Data Model 與 ETL 流程，針對使用場景重新設計星狀架構 (Star Schema)，顯著提升 Power BI 報表的載入與運行速度，提高使用者體驗。",
        ],
      },
      {
        heading: "容器化基礎設施與 MLOps",
        items: [
          "精通 Docker 基礎設施：建立並維護一致性的開發與生產環境基礎設施。設計優化 Dockerfile 與 Docker Compose，降低環境部署衝突，並配合 Portainer 針對各服務進行監控。",
          "全生命週期 MLOps：整合 Git、Docker 與 CI/CD 流程，將機器學習模型從實驗到生產環境的部署自動化，確保系統穩定度與可擴展性。",
        ],
      },
      {
        heading: "生成式 AI (GenAI) 與資料產品開發",
        items: [
          "LLM 應用架構：主導開發基於 OpenAI / Gemini 的 RAG 架構，為客戶打造高效可擴展的知識檢索與問答系統。",
          "多維度數據應用：能夠整合各類型資料供各項命題使用，如行銷數據、地理資訊、氣象等內容。",
          "專業資料流：建置完善的資料處理流程，提供 DS 團隊開發各項模型與內容分析。",
        ],
      },
      {
        heading: "商業價值與團隊領導",
        items: [
          "營收與影響力：能夠參與各項外部會議，為客戶提供適切的方案，並透過資料流程自動化與智慧決策支援，專案累計貢獻營收超過 NT$5,000 萬。",
          "人才培育：帶領 Junior 工程師與實習生，採用 Agile/Scrum 框架管理進度，強化團隊協作效率與專案交付品質。",
        ],
      },
    ],
    tags: [
      "GCP",
      "Azure",
      "PostgreSQL",
      "Airflow",
      "MLflow",
      "LangChain",
      "Docker",
    ],
  },
  {
    id: "deepcoding",
    year: "Jun 2025 – Present",
    title: "Programming Instructor and Coach",
    titleZh: "程式設計講師與教練",
    company: "DeepCoding 鍵深坊",
    companyZh: "DeepCoding 鍵深坊",
    logo: "/logos/deepcoding.png",
    type: "work",
    freelance: true,
    description: [
      "Private tutor with data engineering and software development expertise, helping students build solid technical foundations.",
      "Coaching career-changers transitioning into data-related roles; topics include Python, SQL, data modeling, and data pipeline design.",
    ],
    descriptionZh: [
      "具備資料工程與程式開發經驗的私人家教，擅長協助學生打下技術基礎。",
      "輔導學生轉職進入資料相關職位，涵蓋主題包括 Python、SQL、資料建模與資料流程設計。",
    ],
    tags: ["Python", "SQL", "Data Modeling", "Freelance", "Remote"],
  },
  {
    id: "migo",
    year: "May 2023 – Jun 2024",
    title: "Backend Engineer",
    titleZh: "後端工程師",
    company: "Migo Corp",
    companyZh: "Migo Corp",
    logo: "/logos/migo.png",
    type: "work",
    description: [
      "Delivered CRM SaaS features; established Scrum methodology from scratch.",
      "Built RESTful APIs in C# for core products, SSO, and B2B workflows.",
      "Migrated monolithic systems to decoupled cloud architecture on GCP.",
      "Improved stability through TDD-based Unit and Integration Testing.",
    ],
    descriptionZh: [
      "主導開發 CRM SaaS 核心功能，並從零建立 Scrum 敏捷開發流程。",
      "以 C# 開發產品 RESTful API、SSO 系統及 B2B 功能模組。",
      "將現有系統重構為分離式雲端架構，降低機房運作成本。",
      "落實 TDD，透過 Unit Test 與 Integration Test 確保程式品質。",
    ],
    sectionsZh: [
      {
        heading: "敏捷開發與團隊協作",
        items: [
          "主要協助開發 CRM 相關的 SaaS 服務，與團隊夥伴執行 Scrum，快速迭代開發產品新功能。",
          "從 0 到 1 導入 Scrum：依照過往經驗協助將敏捷開發落地至團隊，建立 Sprint 規劃、Daily Standup 與 Retrospective 等完整流程。",
        ],
      },
      {
        heading: "後端 API 開發與系統架構",
        items: [
          "以 C# 開發產品所需之 RESTful API，並維護相關技術文件，確保介面規格清晰可追溯。",
          "參與規劃公司新產品的整體系統架構，評估技術選型與模組分拆策略。",
          "規劃並建立公司各產品間的 SSO（Single Sign-On）統一驗證系統。",
          "開發並維護 B2B 對接相關功能，支援多租戶企業客戶需求。",
          "將現有系統改造為分離式雲端架構（SMTP 位於 Local 端、後端 Server 遷移至 GCP），有效降低機房硬體維運成本。",
        ],
      },
      {
        heading: "容器化開發環境與基礎設施",
        items: [
          "配合 Docker 建立本地開發環境，統一管理 Database、SMTP Server 等依賴服務，消除環境差異。",
          "規劃並建立 Multi-SMTP Server 架構，分散寄信負載，減少機房維運開銷。",
          "利用 Docker Compose 快速還原完整開發所需環境，提升新成員 onboarding 效率。",
        ],
      },
      {
        heading: "資料庫與測試品質",
        items: [
          "依照不同應用情境選用合適的資料庫，熟練使用 MS SQL Server、PostgreSQL、Redis，分別對應關聯式儲存、高性能緩存等場景。",
          "以 TDD 觀念撰寫 Unit Test，確保各功能邏輯正確；以 Selenium 撰寫 Integration Test，驗證各模組間的交互行為。",
        ],
      },
      {
        heading: "重構、版控與知識分享",
        items: [
          "重構現有程式碼，修補潛在資安風險並優化執行效能。",
          "以 Git 進行程式碼與技術文件的版本控制，落實 Code Review 流程。",
          "固定於例會中分享新技術或最佳實踐，帶動團隊持續學習文化。",
        ],
      },
    ],
    tags: ["C#", "GCP", "PostgreSQL", "Redis", "Docker", "Scrum", "SSO", "TDD"],
  },
  {
    id: "titansoft",
    year: "Jan 2023 – Mar 2023",
    title: "Product Developer",
    titleZh: "產品開發工程師",
    company: "Titansoft",
    companyZh: "鈦坦科技",
    logo: "/logos/titansoft.png",
    type: "work",
    description: [
      "Developed internal and customer-facing web applications using C#, JavaScript, and SQL.",
      "Built RESTful APIs and deployed applications on Kubernetes.",
      "Maintained database using SSMS; wrote Unit Tests to ensure code quality.",
    ],
    descriptionZh: [
      "開發內部與對外的 Web 應用程式，使用 C#、JavaScript、SQL 建構 RESTful API。",
      "利用 Kubernetes 部署相關應用程式，並以 SSMS 管理資料庫。",
      "編寫 Unit Test 維護代碼品質，以 Git 進行版本控制。",
    ],
    sectionsZh: [
      {
        heading: "開發工具與流程管理",
        items: [
          "利用 Jira 規劃與追蹤開發任務，以 Confluence 管理技術文件，確保開發流程可視化與可追溯性。",
        ],
      },
      {
        heading: "Web 應用程式開發",
        items: [
          "設計、開發並維護公司內部使用及提供給客戶的 Web 應用程式。",
          "使用 C#、JavaScript、SQL 等技術開發 RESTful API，遵循清晰的介面規範。",
          "利用 Kubernetes (K8s) 部署與管理應用程式，確保服務的高可用性與彈性擴展。",
          "使用 SQL Server Management Studio (SSMS) 管理與維護資料庫。",
        ],
      },
      {
        heading: "測試與版本控制",
        items: [
          "編寫 Unit Test 以維護代碼的品質與穩定性，降低功能迴歸風險。",
          "使用 Git 進行版本控制，確保代碼變更有跡可循。",
        ],
      },
    ],
    tags: ["C#", "JavaScript", "Kubernetes", "SQL", "SSMS", "Jira"],
  },
  {
    id: "fortinet",
    year: "Aug 2022 – Nov 2022",
    title: "R&D Engineer",
    titleZh: "研發工程師",
    company: "Fortinet",
    companyZh: "Fortinet",
    logo: "/logos/fortinet.png",
    type: "work",
    description: [
      "Designed and executed test plans covering hardware and software functionality for multiple product lines.",
      "Assisted in validating feature correctness on new systems.",
    ],
    descriptionZh: [
      "針對不同產品，負責建立測試流程，測試軟硬體相關功能。",
      "協助驗證新系統的相對應功能，確保產品品質符合標準。",
    ],
    sectionsZh: [
      {
        heading: "研發與功能驗證",
        items: [
          "針對不同網路安全產品線，從零規劃並建立完整的測試流程，涵蓋軟體功能驗證與硬體行為測試。",
          "協助驗證新系統的功能正確性，提出缺陷回報並追蹤修復進度，確保產品品質符合發布標準。",
        ],
      },
    ],
    tags: ["R&D", "Testing", "Hardware", "Network Security", "Firmware"],
  },
  {
    id: "umc",
    year: "May 2021 – Jun 2022",
    title: "CIM Senior Engineer",
    titleZh: "CIM 資深工程師",
    company: "United Microelectronics Corporation",
    companyZh: "聯華電子（UMC）",
    logo: "/logos/umc.png",
    type: "work",
    description: [
      "Maintained and automated production manufacturing systems, improving machine throughput by 5–20%.",
      "Integrated cross-factory databases for OEM delivery systems.",
      "Developed RPA and Shell scripts to automate repetitive tasks, reducing setup time from 4 hours to under 2 minutes.",
    ],
    descriptionZh: [
      "維護並自動化生產製造系統，依需求提升不同機器產能 5%～20%。",
      "協助跨廠 OEM 交付系統開發及相關資料庫維護。",
      "建立 RPA 自動化與 Shell Script，將原需 4 小時的人工設定縮短至 2 分鐘內完成。",
    ],
    sectionsZh: [
      {
        heading: "機器自動化編程",
        items: [
          "接收使用者需求並修改機器程序，依不同需求可提高不同機器產能 5%～20%，直接影響晶圓廠整體產出效率。",
          "維護千行以上規模的機器程序，深入掌握底層功能應用，並依需求進行客製化調整。",
        ],
      },
      {
        heading: "跨廠協作與資料庫維護",
        items: [
          "協助跨廠 OEM 交付系統的開發，整合不同廠區的資料庫資料，確保跨廠資訊一致性與交付準確性。",
        ],
      },
      {
        heading: "自動化流程建立",
        items: [
          "建立 RPA（Robotic Process Automation）解決方案，將原本需人工反覆執行的 SOP 動作自動化，大幅釋放人力資源。",
          "建立相關 Shell Script 完成機器內容設定操作：原需耗費至少 4 小時的人工設定作業，縮短為 2 分鐘內自動化完成，效率提升超過 120 倍。",
        ],
      },
    ],
    tags: [
      "Python",
      "Shell",
      "RPA",
      "Database Integration",
      "Linux",
      "Automation",
    ],
  },
  {
    id: "cycu-master",
    year: "2018 – 2020",
    title: "Master's Degree",
    titleZh: "碩士學位",
    company: "Chung Yuan Christian University",
    companyZh: "中原大學",
    logo: "/logos/cycu.svg",
    type: "education",
    description: ["Department of Information and Computer Engineering."],
    descriptionZh: ["資訊工程學系"],
    tags: ["Computer Science", "Research"],
  },
  {
    id: "cycu-bachelor",
    year: "2014 – 2018",
    title: "Bachelor's Degree",
    titleZh: "學士學位",
    company: "Chung Yuan Christian University",
    companyZh: "中原大學",
    logo: "/logos/cycu.svg",
    type: "education",
    description: ["Department of Information and Computer Engineering."],
    descriptionZh: ["資訊工程學系"],
    tags: ["Computer Science"],
  },
];
