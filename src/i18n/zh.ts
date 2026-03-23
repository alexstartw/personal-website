import type { Locale } from "./en";

export const zh: Locale = {
  nav: {
    home: "首頁",
    about: "關於我",
    skills: "技能",
    experience: "經歷",
    projects: "專案",
    contact: "聯絡",
    blog: "部落格",
  },
  hero: {
    badge: "積極尋求工作機會",
    name: "林力宇 Alex Lin",
    title: "資深數據工程師",
    subtitle:
      "5 年以上經驗，專注於事件驅動架構與雲端原生環境中的數據密集型系統開發，擅長可擴展的數據解決方案與 GenAI 應用。",
    cta_projects: "查看專案",
    cta_contact: "與我聯繫",
    scroll: "向下滾動",
  },
  about: {
    label: "關於我",
    heading: "構建驅動現代數據產品的底層基礎設施。",
    bio1: "我是林力宇（Alex），台灣台北的資深數據工程師。擁有超過 5 年的經驗，專注於事件驅動架構與雲端原生環境中的數據密集型系統開發。",
    bio2: "我的職涯歷程橫跨聯華電子的半導體製造自動化、Migo Corp 的後端 API 開發，以及現在在 Datarget 主導企業級數據平台建設。這一路上，我建構了每日處理 TB 級數據流量的系統，並開發出創造顯著商業價值的 GenAI 解決方案。",
    bio3: "我擁有中原大學資訊工程學系碩士學位，這為我打下了演算法、分散式系統與機器學習的堅實基礎。",
    bio4: "工作之外，我對大型語言模型與數據基礎設施的交匯充滿熱情——特別是 RAG 架構如何讓企業知識更易取得與行動化。",
    stats: [
      { value: "5+", label: "年工作經驗" },
      {
        value: "",
        label: "跨產業經驗",
        items: ["半導體製造", "網路資安", "SaaS 軟體", "數據 / AI"],
      },
      { value: "NT$5000萬+", label: "創造專案收益" },
      { value: "3+", label: "主導 GenAI 應用落地與資料平台規劃" },
    ],
  },
  skills: {
    label: "技能",
    heading: "技術與專業能力",
    categories: {
      backend: "後端工程",
      data: "數據工程",
      cloud: "雲端與人工智慧",
      tools: "工具與方法論",
    },
  },
  experience: {
    label: "經歷",
    heading: "工作與學習歷程",
    work_label: "工作",
    edu_label: "學歷",
  },
  projects: {
    label: "專案",
    heading: "精選作品",
    view_all: "查看所有專案 →",
    category_map: {
      "Data Engineering": "數據工程",
      "AI / ML": "AI / 機器學習",
      Backend: "後端",
      Automation: "自動化",
    },
  },
  contact: {
    label: "聯絡",
    heading: "與我聯繫",
    subtitle: "歡迎洽談資深數據工程職位、GenAI 專案及顧問合作機會。",
    available: "目前可接洽",
    links: {
      email: "電子郵件",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    footer: "林力宇 Alex Lin · 資深數據工程師 · 台灣台北",
  },
};
