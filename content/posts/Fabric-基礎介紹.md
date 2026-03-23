---
title: Fabric 基礎介紹
date: "2025-11-25 14:27:40"
description: 針對 Fabric 的基礎介紹，並且相關內容進行簡述。
categories:
  - 資料會遇到的大小事
tags:
  - Fabric
  - datalake
  - warehousing
cover: /images/posts/covers/fabric.png
---

## Fabric 基本介紹

### 什麼是 Fabric？

[影片簡介](https://www.youtube.com/watch?v=NA9pQdRN3F4)

Microsoft Fabric 是 **一套完全整合的端到端 Data & Analytics 平台**，由 Azure Data/Analytics 全產品線（ADF、Synapse、Power BI、Lakehouse、Streaming、ML、Real-time Intelligence…）整合而成，形成 **單一 SaaS 資料平台**。

簡單說：

> **Fabric = Data Engineering + Data Integration + Data Warehouse + Data Lake + Real-Time + ML + BI（全部打包成一個 SaaS）**

它將 Microsoft 原本分散的產品統整成 *OneLake（Single Data Lake）* 與 *One Security Model（單一治理模型）*。



### **核心定位：OneLake + OnePlatform**

#### **OneLake（資料湖的 OneDrive）**

Fabric 最核心的概念是 **OneLake**：

- 所有資料以 **Delta Lake 格式** 儲存

- 所有服務共用同一個資料湖

- 支援 **shortcut**（資料不複製即可引用外部 S3/ADLS 的資料）

- 天然支援 ACID、time travel、open format

**OneLake ＝ 統一資料底座**。

##### What is Delta Lake?

> Delta Lake = 在 Data Lake 上加上一層「資料庫級」的 ACID 保證、Schema、版本管理、Time Travel，並且用 Parquet + Transaction Log 來實作。



- **配合 Delta Lake 讓「資料湖 = 資料庫」**

  一般 Data Lake（如 ADLS / S3）是這樣的：

    - 可以放多格式資料（CSV、Parquet、JSON）

    - 但缺乏：

        - ACID 交易

        - Schema 管控

        - 資料一致性

        - Time Travel

        - Update / Delete / Merge

        - 併發保證

  這就是所謂的 **"Data Lake is a data swamp"（變成沼澤）**。



##### Delta Lake 核心概念

1. 使用開放格式：**Parquet** + **Transaction Log**

2. ACID Transactions

3. Schema Enforcement （Schema 管控）

4. Time Travel（時間回朔）

5. Incremental Processing（增量處理）

6. Batch + Streaming 雙一致性（Unified）

###### What is Data Lake?

> 資料湖是一個能裝 *任何格式資料* 的大型存放區（object storage），強調成本低、彈性高，但本身沒有資料庫功能。

常用的資料湖：

- Amazon S3

- Azure Data Lake Storage (ADLS Gen2)

- Google Cloud Storage (GCS)

資料湖是「檔案系統」，不是資料庫。



###### 核心理念

1. Schema-on-read（讀取時定義 schema）

    1. 資料湖不會強迫你在寫入資料時定義 schema。\
       可以放：

        - CSV

        - JSON

        - Parquet

        - Avro

        - Images

        - Video

        - Raw logs

        - Sensor data

       只有在 **使用者讀取** 時，才會告訴系統 schema。

    2. 意義：

        - 並行團隊可以把資料丟進湖裡

        - 不需要先建表格

        - 適合 raw data 保存

2. **儲存成本非常低**

   資料湖一般使用 object storage，超便宜。

   例如：

    - S3、ADLS、GCS 比資料倉儲便宜 10\~30 倍

    - 適合存大量原始資料（raw logs、大量 IoT、影像、歷史資料）

   所以資料湖通常是企業所有數據的「原始底座」。

3. **放的是「檔案」，不是「表格」**

   資料湖的單位是：

    - 檔案（.parquet/.csv/...）

    - 資料夾

    - 物件儲存桶（bucket）

   不像資料庫：

    - 不是 row-based

    - 沒有 index

    - 沒有 metadata

    - 沒有 ACID

   所以資料湖比較像：

   > **一個能存任何資料的大型硬碟（超便宜 + 高擴展）。**



###### Data Lake 問題

資料湖是檔案系統，所以沒有資料庫的功能

1. 沒有 ACID 交易（更新、刪除困難）

2. 沒有 schema enforce （容易破壞資料污染）

3. 沒有 time travel（版本控管）

4. 沒有 concurrency control

5. 資料容易變成 data swamp

6. 很難進行 upsert、merge、incremental load


#### **OnePlatform：一個平台涵蓋所有工作負載**

Fabric 將原本 Azure 中的分散服務整合成統一體驗：

- **Data Factory（新版）**：Pipeline、Mapping Data Flow 全整合

- **Data Engineering**：Spark、Notebook、Job Scheduling

- **Lakehouse**：類 Databricks，以 Delta Lake 為核心

- **Data Warehouse**：T-SQL/Serverless based DW

- **Real-Time Intelligence**：流資料、觀測、事件處理

- **Semantic Model & Power BI**：直接在平台內建 BI 能力

無需切換服務、無需跨平台治理，全部在 Fabric 內運作。



### 統一的權限控管 OneSecurity

Warehouse、Lakehouse、Pipeline、Notebooks 全都吃同一套安全模型。

## ADF Pipeline VS Fabric Pipeline

### Fabric Pipeline

- 本質上是 **Orchestrator（編排工具）**，負責將 Fabric 環境串起來，把所有資料動作串成一個可重複、自動化的「ETL/ELT 工作流程」。

    - Dataflow Gen2（Power Query）

    - Notebook（Spark）

    - SQL Script / Stored Procedure

    - Copy Activity（資料搬移）

    - Mapping Data Flow

    - Data Validation

    - Event Trigger

    - Lakehouse Table 操作

    - Warehouse Table 操作

    - External API

    - Scheduling / Dependency

- Pipeline 不負責「算」，它負責「叫別人算」。

  這和 Airflow 一樣，不同的點在於 Fabric 只能控制軟體內部的東西。

- 可以用 Fabric 的 Pipeline 把整個資料流程從 ingest → 清洗 → Lakehouse → Warehouse → Power BI 報表串成一條完整的 Data Pipeline。Fabric 的 Pipeline 就是整個平台的 orchestrator。



### ADF Pipeline

ADF Pipeline 僅能控制：

- Copy data

- Mapping Data Flow

- Databricks / Synapse

- SQL 動作

- 外部 API

- 觸發 + 排程

其本質是 **純 ingestion/orchestration 工具**。\
無法直接控制相關的軟體服務如：

- Lakehouse

- Warehouse

- Dataflow Gen2

- Spark Engine

- Power BI