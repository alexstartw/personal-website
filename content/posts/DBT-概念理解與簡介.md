---
title: DBT 概念理解與簡介
date: "2025-04-11 10:11:55"
description: DBT 是一個開源的數據轉換工具，專注於數據建模和轉換，幫助用戶將原始數據轉換為可用的分析數據集。
categories:
  - 資料會遇到的大小事
tags:
  - dbt
  - etl
cover: /images/posts/covers/dbt.png
---

## DBT 研究與簡介

### 什麼是 DBT？

DBT 是一個 **開源**（也有企業版）工具，主要用於管理與執行 SQL 查詢，並進行 **資料轉換（Transformation）**。它讓數據工程師和分析師能夠更容易地處理 **ELT（Extract, Load, Transform）** 流程中的「T」步驟，將原始數據轉換為更有價值的分析結果。



DBT 是寫 SQL 來做各種數據查詢，而 SQL 在不同資料庫中會有相容性問題，也會在數據轉換的過程中遇到要將底層原始數據轉換成業務數據的依賴關係維護，會有一定程度的成本。



配合 DBT 可以將原始數據加工成有用的數據模型，將工作聚焦在想要的數據內容、病疫怎麼樣的數據模型，剩餘的流程則交給 DBT 進行處理。

### 重要名詞

- dbt core：提供數據建模、轉換、管理的核心功能，可以定義及運行數據轉換模型，生成 SQL 查詢，並將數據寫入目標。

- dbt adapters：提供 user 使用相同的 SQL 語法來與不同的底層資料庫進行溝通。

### ETL v.s. ELT

主要差異在執行順序不同：

- ETL 的優勢：他是用在資料在放入系統前要先進行複雜的資料清洗跟轉換的情況。會將清洗與轉換的邏輯分離出來，來確保取得資料是有品質的。

- ELT 的優勢：他更適用於資料庫有強大的計算能力（e.g. BigQuery），可以在目標系統直接處理原始資料，可以減少流程的複雜度，適合用在大規模的數據處理。

### DBT 的角色

dbt 可以同時在 ELT 跟 ETL 下使用，取決於整體的架構設計。

- ELT 中，dbt 主要用於資料轉換與建模，通常會於存放好的原始資料上執行。

- ETL 中，dbt 可與其他 ETL 工具共同使用，來處理更複雜的資料轉換邏輯。

主要作用是來定義跟執行資料模型，提供一種好維護、並且可測試的方法來建立與管理分析模型。

#### 整體基礎流程：

1. ELT 流程：

    1. Extract：從各種資料來源取得資料

    2. Load：將資料存入 BigQuery 等高效能資料庫

    3. Transform：使用 **dbt** 在 BigQuery 中建立與維護分析模型

2. ETL 流程：

    1. Extract：從各種資料來源取得資料

    2. Transform：使用 dbt 或是其他的 ETL 工具進行資料的清整與轉換

    3. Load：將轉換好的資料存入資料庫中

### 📌 DBT 的核心功能

1. **資料清洗與轉換**

    - 將原始表（raw tables）轉換為乾淨、結構化、有意義的分析表（如 fact tables、dimension tables）。

    - 使用 SQL 撰寫轉換邏輯，支援 Jinja2 template 語法可提高模組化與重用性。

        - Jinja2 是一種 **Python 的樣板語言（template language）**，用來在文字檔案中（像 HTML、SQL、YAML 等）**插入變數、條件判斷、迴圈等邏輯**。\
          它本來是用在網頁開發（像 Flask）來生成 HTML，但 DBT 把它拿來用在 SQL 上，變成一種 **可以寫「動態 SQL」的工具**。

            - 用變數插入表名、欄位

            - 寫 if 判斷、for 迴圈

            - 把重複的邏輯包成 macro 重用

2. **資料建模（Data Modeling）**

    - 透過定義 model（= SQL 檔案）來構建資料的邏輯架構，例如 staging → intermediate → marts。

        - Staging Layer（暫存層）

            - 用途：

                - 將資料倉儲中從外部匯入的原始表（raw tables）轉成乾淨、有一致命名的格式。

                - 這層通常對應一個一個的原始資料表，例如來自 ERP、CRM、sensor 的表格。

            - 特點：

                - 資料不會做太多轉換（不計算 business logic），只是「清洗 + 重新命名 + 類型轉換」

        -  Intermediate Layer（中繼層）

            - 用途：

                - 把 staging 層的資料做「商業邏輯加工」，例如計算訂單狀態、計算客戶生命周期價值、整合多個資料表。

                - 通常這層的表會作為 marts 層的「零件」。

            - 特點：

                - 可以是 aggregate、join 多個 staging 表、加計算欄位

                - 通常加前綴 `int_`（例如：`int_order_status.sql`）

        - Marts Layer（資料集市層）

            - 用途：

                - 提供給分析師、BI 工具、dashboard 使用的最終資料表。

                - 這些是「分析師直接用」的資料，表結構清楚、無需再加工。

            - 特點：

                - 強調穩定性與可讀性

                - 有 business centric 的邏輯：如 `dim_customers`（維度表）和 `fct_orders`（事實表）

                - 常加前綴 `fct_`（fact）或 `dim_`（dimension）

3. **依賴追蹤與自動化建構**

    - 會自動建構模型之間的依賴圖，並根據依賴關係來決定執行順序。

4. **版本控制與可重現性**

    - 因為是以程式碼形式管理 ETL 邏輯，可以與 Git 等工具整合。

5. **測試與驗證（Testing & Documentation）**

    - 提供 schema.yml 檔案來定義欄位格式、唯一性、非空等驗證。

    - 可以產出自動化文件與 lineage graph。
