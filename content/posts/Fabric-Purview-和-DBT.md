---
title: Fabric Purview 和 DBT
date: "2025-11-25 14:40:30"
description: 簡單介紹 Fabric 中的 Purview 功能，並跟 dbt 進行比較說明。
categories:
  - 資料會遇到的大小事
tags:
  - Fabric
  - Purview
  - dbt
cover: /images/posts/covers/fabric.png
---

## Fabric 內建治理（Governance）與血緣分析（Lineage, Purview）簡介

Microsoft Fabric 內建 **Microsoft Purview** 的治理與血緣功能。\
Purview 是微軟的 **資料治理（Data Governance）平台**，在 Fabric 中被整合成：

> **「平台級」的資料治理、血緣、目錄、權限控管系統。**

Fabric 內的所有服務（Lakehouse、Warehouse、Pipeline、Dataflow、Notebook、Power BI）\
都會自動將 metadata 與血緣資訊送到 Purview。

### **Fabric Purview 提供的核心能力**

#### **1\. 資料目錄（Data Catalog）**

自動掃描並登錄：

- OneLake 內所有表格（Delta tables）

- Lakehouse / Warehouse

- Dataflow / Pipeline 產物

- Power BI 資料集

使用者能搜尋整個平台的資料。

#### **2\. 權限治理（OneSecurity）**

統一管理：

- table-level ACL

- column-level access

- workspace security

- Power BI dataset RLS

Purview 整合 **Entra ID（Azure AD）**，實現：

> 一個地方控整個 Fabric 平台的資料權限。



#### **3\. 數據分類與敏感性標籤（Data Classification）**

支援：

- PII（身分資料）

- 金融資料

- GDPR / HIPAA

- 自動偵測敏感欄位

#### **4\. 自動血緣（Lineage）**

Purview 在 Fabric 中會自動追蹤：

- Pipeline → Lakehouse

- Dataflow → Table

- Notebook → Delta Table

- Warehouse → Power BI

- SQL Scripts → Tables

- Power BI calculation lineage

Purview 血緣最擅長：

> **「平台層級」的資料流向（誰讀誰寫、誰轉換誰）。**

### **Purview 的血緣能顯示：**

✔ 哪個 Pipeline 更新了哪個 Lakehouse table\
✔ 哪個 Dataflow 消費哪些來源\
✔ 哪個 Notebook 產生哪些 Delta 資料\
✔ 哪個 Warehouse table 被哪些 Reports 使用\
✔ Power BI 報表 → Semantic model → Table\
✔ Workspace 內所有 artifacts 的上下游關係

Purview = **Fabric 整個平台的 data flow map**

## Purview vs dbt

**Purview = 管平台（infrastructure governance）**\
**dbt = 管模型（data modeling governance）**



### 功能比較表

| 能力 | **Fabric Purview（Governance & Lineage）** | **dbt（Data Modeling Framework）** | 
|---|---|---|
| **主要用途** | 平台治理、權限、平台血緣 | 資料模型管理、資料品質、ELT 工程 | 
| **血緣層級** | Platform-level（誰讀誰寫） | Model-level（欄位與邏輯） | 
| **欄位級血緣（column lineage）** | ❌ 無 | ✔ 有（欄位來源、轉換邏輯） | 
| **資料轉換邏輯（SQL logic）** | ❌ 無法顯示 | ✔ 完整顯示 | 
| **模型依賴（model DAG）** | ❌ 無 | ✔ 自動生成 DAG | 
| **資料品質測試（data tests）** | ❌ 無 | ✔ not_null, unique, relationships, accepted_values | 
| **增量模型（incremental models）** | ❌ 不支援 | ✔ 原生支援 | 
| **schema 契約（schema contract）** | 部分（policy-based） | ✔ 原生 schema.yml | 
| **版本管理** | ❌ 無資料模型版本 | ✔ Git + Model Versioning | 
| **CI/CD 整合** | ❌ 無 | ✔ 自動 test、build、validate | 
| **文件生成（documentation）** | ✔ 部分 | ✔ 完整（dbt docs） | 
| **資料分類 / 敏感性標籤** | ✔ 有 | ❌ 無 | 
| **權限管理** | ✔ OneSecurity | ❌ 不管權限 | 
| **Platform metadata（Notebook, Pipeline, Power BI）** | ✔ 全都有 | ❌ 無 | 



兩者關注的資料血緣面向不同



#### **Purview 管的是「資料在哪、怎麼流動」**

#### **dbt 管的是「資料裡面的邏輯是什麼、怎麼轉換」**
