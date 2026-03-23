---
title: OLAP and OLTP
date: "2025-08-19 11:27:04"
description: 介紹 OLAP 和 OLTP 的概念、特點及其在數據庫系統中的應用。
categories:
  - 資料會遇到的大小事
tags:
  - OLAP
  - OLTP
cover: /images/posts/covers/olap-and-oltp.png
---
## OLTP v.s. OLAP

### 基本定義

#### OLTP (Online Transaction Processing) 線上交易處理

OLTP 系統專注於大量且高頻率的**即時交易操作**，例如新增、修改、刪除（INSERT/UPDATE/DELETE）。這類系統設計目標是確保資料一致性、完整性以及快速響應時間。

#### OLAP (Online Analytical Processing) 線上分析處理

OLAP 系統則偏重於對大量歷史資料進行**複雜查詢與多維度分析**，例如彙總、統計、趨勢分析。重點在於提供決策支援，而非單筆交易的即時性。



### 設計與特性比較

| 面向 | OLTP | OLAP | 
|---|---|---|
| **主要用途** | 處理日常交易，快速 CRUD | 分析大量資料，支持決策 | 
| **資料特性** | 最新、細粒度（記錄級別） | 歷史、彙總、多維度 | 
| **操作類型** | 大量簡單的讀寫操作 | 少量但複雜的查詢與聚合，寫入較少 | 
| **資料庫設計** | 高度正規化（避免重複，確保一致性） | 維度建模（星型、雪花型），利於查詢 | 
| **資料庫類型** | row-based database | column-based database | 
| **響應時間** | 低延遲，毫秒級 | 可以容忍秒級～分鐘級 | 
| 資料量級 | MB to GB | TB to PB | 
| 資料意涵 | 事務的最新狀態 | 資料的歷史變化、聚合後的指標 | 
| **一致性需求** | 強一致（ACID） | 一致性通常透過 ETL 週期維持，非即時 | 
| **範例技術** | MySQL、PostgreSQL、Oracle、Spanner、AlloyDB | BigQuery、Snowflake、Redshift、Presto/Trino | 

#### Row-based Database v.s. Column-based Database

##### 基本定義

- **Row-based Database（列式資料庫）**\
  資料以「**列為單位**」儲存，每一列包含該筆記錄的所有欄位值。傳統的關聯式資料庫（如 MySQL、PostgreSQL、Oracle）大多採用這種模式。

- **Column-based Database（欄式資料庫）**\
  資料以「**欄為單位**」儲存，將同一欄位的值集中存放。例如 BigQuery、Snowflake、Amazon Redshift 等分析型資料庫使用此模式。

##### 設計與特性比較

| 面向 | Row-based Database | Column-based Database | 
|---|---|---|
| **儲存方式** | 每一列（Row）為存放單位 | 每一欄（Column）為存放單位 | 
| **讀寫模式** | 適合大量單筆寫入與更新 | 適合大量讀取與彙總查詢 | 
| **最佳應用** | OLTP（即時交易處理） | OLAP（分析、報表處理） | 
| **查詢效能** | 單筆 CRUD 操作快 | 聚合、篩選、報表查詢快 | 
| **壓縮效率** | 較低，因為一列不同欄位異質性高 | 較高，因為同一欄位值類似度高 | 
| **索引需求** | 常需要額外索引提升查詢效能 | 天然適合 scan 與向量化運算，常搭配壓縮 | 
| **代表技術** | MySQL、PostgreSQL、Oracle、SQL Server | BigQuery、Snowflake、Redshift、ClickHouse | 

##### 應用場景

- Row-based Database 適合場景

    - **交易系統**：電商下單、銀行轉帳，需要快速的 INSERT/UPDATE。

    - **ERP/CRM 系統**：高頻率的即時操作，單筆資料完整性重要。

    - **需要強一致性的 OLTP 應用**。

- Column-based Database 適合場景

    - **商業智慧（BI）分析**：統計銷售額、分群分析、交叉比對。

    - **數據倉儲**：大規模歷史數據的查詢與聚合。

    - **機器學習資料準備**：快速 scan 大量欄位數據。

##### 小結論

**Row-based** = 適合「交易處理」：單筆寫入快、更新方便。

**Column-based** = 適合「分析處理」：大量歷史資料查詢快、聚合高效。

在真實架構中，常見做法是 **前台 OLTP 用 Row-based DB**，再透過 ETL/ELT 將數據導入 **後台 OLAP 的 Column-based DB**。

### 適合應用場景

#### OLTP 適合的場景

- **電商/零售交易系統**：下單、付款、庫存更新。

- **金融交易**：銀行轉帳、信用卡支付，要求強一致性與高併發。

- **ERP / CRM 系統**：日常營運資料（員工出勤、客戶訂單）。

- **IoT 即時寫入**：感測器數據的快速記錄（常與時序資料庫結合）。

#### OLAP 適合的場景

- **商業智慧（BI）報表**：跨部門 KPI 分析、銷售趨勢。

- **市場行為分析**：用戶點擊流、產品偏好分析。

- **預測模型 / 機器學習**：以歷史資料進行訓練與建模。

- **即席查詢（Ad-hoc Query）**：管理層提出臨時問題（例如「某區域 Q2 的銷售成長率？」）。

### 典型架構設計

- **OLTP → OLAP 分層**：\
  多數企業會將交易數據先落地於 OLTP 系統，透過 **ETL/ELT 工具**（如 Dataflow、dbt、Airflow）批次或串流搬運到 OLAP 平台，用於報表與分析。

- **舉例**：

    - OLTP 層：Cloud Spanner / AlloyDB 儲存即時交易

    - ETL/CDC：Datastream → Dataflow

    - OLAP 層：BigQuery / Snowflake 進行分析

### 結論

**OLTP** 適合即時交易、日常營運，追求**一致性與即時性**。

**OLAP** 適合長期決策支援、資料探索，追求**分析效能與多維度洞察**。

在企業架構中，兩者通常是 **互補** 的，而非互斥。