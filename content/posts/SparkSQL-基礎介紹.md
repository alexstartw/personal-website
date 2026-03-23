---
title: SparkSQL 基礎介紹
date: "2025-06-16 13:44:45"
description: SparkSQL 是 Apache Spark 的一個模組，用於處理結構化數據，提供 SQL 查詢功能，並可與 DataFrame API 無縫整合。
categories:
  - 資料會遇到的大小事
tags:
  - sparksql
  - spark
cover: /images/posts/covers/sparksql.png
---
## ✅ 什麼是 SparkSQL？

SparkSQL 是 Apache Spark 的一個模組，用於處理結構化數據（Structured Data）。它提供 SQL 查詢功能，並可與 Spark 的 DataFrame API 無縫整合。你可以用 SQL 語句查詢資料，或使用 Python、Scala、Java 等語言操作 DataFrame。

### 相關核心特點

| 功能 | 說明 |
| --- | --- |
| SQL 查詢 | 支援 ANSI SQL-2003 標準語法 |
| DataFrame API | 提供類似 R / pandas 的資料操作接口 |
| 整合多種資料來源 | 支援 Hive、Parquet、Avro、JSON、CSV 等 |
| Catalyst Optimizer | 自動優化查詢效能的 query optimizer |
| Tungsten Engine | 記憶體與執行最佳化的計算引擎 |

### 🧱 基本元件

* **SparkSession**：使用 SparkSQL 的入口。
* **DataFrame**：以表格形式呈現的資料集合。
* **Temporary View**：可以用來將 DataFrame 當作 SQL 表來查詢。
* **SQL Context**：舊版 Spark（\< 2.0）使用，但現在建議使用 `SparkSession`。

### 📈 為什麼 SparkSQL 的運算比傳統查詢快？

#### ✅ 一句話總結：

> SparkSQL 的查詢效能來自於 Catalyst Optimizer 和 Tungsten Engine，搭配記憶體內運算模型，使其遠優於傳統 MapReduce 或磁碟為主的查詢方式。



#### 底層執行原理

配合圖示，大致上執行順序如下：
![sparksql-1.png](/images/posts/SparkSQL-基礎介紹/sparksql-1.png)

* **Catalyst Optimizer**
    * SparkSQL 的查詢優化器，負責將 SQL 語句解析並優化為執行計劃。
    * Catalyst 做的事情包含：
        * 將 SQL 轉換成 **邏輯查詢計劃（Logical Plan）**
        * 進行 **查詢優化**（例如條件下推、投影裁剪、join 重排序）
        * 將邏輯計劃轉換為 **物理計劃（Physical Plan）**
    * 優點在於：它是可擴充、可組合的（用 Scala 實作 AST 操作）
* **RDD（Resilient Distributed Dataset）**
    * 優化後的物理計劃會被轉譯成底層的 **RDD 操作**。
    * RDD 是 Spark 最基本的分散式資料結構，具備：
        * 可容錯（根據 lineage 重算）
        * 可分割（可分布於多節點）
        * 可平行處理（可 map、filter、join 等）
    * 雖然 DataFrame 是使用者常用的介面，但實際執行時，仍會轉成 RDD 操作。
* **Cluster（叢集）**
    * RDD 操作被分配到叢集中的不同節點（executors）上並行執行。
    * 這是 Spark 強大運算效能的來源：
        * 多節點計算
        * 執行計劃分段（Stage）、任務分割（Task）
        * 任務調度、資源分配由 Spark Driver 與 Cluster Manager 管理

✳️ 一、整體設計思維（高層）

1. 記憶體內運算（In-Memory Computing）

    * Spark 將中間資料暫存在記憶體（不像 Hadoop MapReduce 每步都寫磁碟）
    * 減少 I/O 次數，大幅提速

2. 批次與互動式查詢並行支援

    * SparkSQL 可用 SQL 查詢，也可程式操作 DataFrame
    * 適合 ETL 與分析作業整合流程，不需來回轉換資料格式

#### 🧠 二、底層關鍵技術（技術面）

1. Catalyst Optimizer（查詢優化器）

* 使用 **抽象語法樹（AST）** 解析 SQL
* 自動做多層優化：
    * 範圍下推（Predicate Pushdown）
    * 合併過濾條件
    * 重寫 join 順序（Join Reordering）
    * 常數折疊（Constant Folding）
* 跨語言可用（Scala、Python、SQL 都能經過相同優化流程）

2. Tungsten Engine（執行引擎）

* 採用低階記憶體管理（Unsafe Row 格式）
* 自動產生位元碼（code generation）
* 減少 JVM 開銷與 GC 效果
* 執行效率大幅提升，接近原生 C 程式效能

3. Columnar 格式支援（如 Parquet、ORC）

* 與傳統 row-based 格式（CSV）相比，columnar 更適合做分析查詢
* 可只讀取需要的欄位（資料掃描更少）

#### 🔍 三、對比傳統查詢流程（比較面）

| 比較項目 | SparkSQL | Hive / MapReduce / RDBMS |
| --- | --- | --- |
| 運算位置 | 記憶體為主 | 磁碟為主 |
| 優化方式 | Catalyst 編譯與邏輯轉換 | 基本語法轉換（Hive）或固定 query planner |
| 執行速度 | 快 10–100 倍 | 慢，尤其是複雜 join |
| 資料格式 | 可原生支援 Parquet、ORC | 需額外轉換 |
| 語言整合 | SQL + 程式 API 無縫轉換 | 語言綁定不靈活 |

### 📌 結論

> SparkSQL 結合 Catalyst Optimizer 和 Tungsten Engine，能自動進行邏輯與物理層的查詢優化，並透過記憶體內資料處理、位元碼生成、低階記憶體控制來提升查詢效率。此外，原生支援 columnar 格式與 predicate pushdown 等技術，使得 SparkSQL 在進行大數據分析與 ETL 查詢時，具有遠優於傳統 SQL 查詢系統的效能表現。



* 相關資料來源

  <https://www.cnblogs.com/itlz/p/16174068.html>




## Demo-建立分散式架構

### 建立分散式架構

配合 `docker-compose` 建立一個 Spark-Master 跟一個 Spark-worker

```yaml
services:
  spark-master:
    image: apache/spark:3.5.0
    container_name: spark-master
    command: bash -c "/opt/spark/bin/spark-class org.apache.spark.deploy.master.Master"
    ports:
      - "7077:7077"
      - "8080:8080"
    volumes:
      - ./spark-data:/opt/data
    environment:
      - SPARK_LOCAL_DIRS=/tmp
      - SPARK_SUBMIT_OPTS=-Dspark.jars.ivy=/tmp/ivy2

  spark-worker:
    image: apache/spark:3.5.0
    container_name: spark-worker
    depends_on:
      - spark-master
    command: bash -c "/opt/spark/bin/spark-class org.apache.spark.deploy.worker.Worker spark://spark-master:7077"
    ports:
      - "8081:8081"
    environment:
      - SPARK_LOCAL_DIRS=/tmp
      - SPARK_SUBMIT_OPTS=-Dspark.jars.ivy=/tmp/ivy2
```

### 放入資料

* 將資料準備在掛載好的資料夾

## Demo-實際資料查詢操作

* 建立 SparkSQL 表格

  ```sql
  CREATE TABLE people (
    name STRING,
    age INT
  )
  USING CSV
  OPTIONS (
    path '/opt/data/people.csv',
    header 'true',
    inferSchema 'true'
  );
  ```

  📌 說明：
    * `USING CSV`：使用 CSV 格式
    * `header 'true'`：第一列作為欄位名稱
    * `inferSchema 'true'`：自動判斷欄位型別（不建議用於大型檔案）
* 基本查詢

  ```sql
  SELECT * FROM people LIMIT 10;
  SELECT COUNT(*) FROM people;
  SELECT name, age FROM people WHERE age > 40 ORDER BY age DESC;
  ```