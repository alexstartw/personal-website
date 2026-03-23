---
title: Data Lake and Delta Lake
date: "2026-02-11 16:08:43"
description: 簡單介紹 Data Lake 和 Delta Lake 的概念、差異與優勢
categories:
  - 資料會遇到的大小事
tags:
  - Data Lake
  - Delta Lake
cover: /images/posts/covers/Delta-Lake.png
---
## What is Data Lake?

> 資料湖是一個能裝 *任何格式資料* 的大型存放區（object storage），強調成本低、彈性高，但本身沒有資料庫功能。

常用的資料湖：

- Amazon S3

- Azure Data Lake Storage (ADLS Gen2)

- Google Cloud Storage (GCS)

資料湖是「檔案系統」，不是資料庫。



### 核心理念

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



### Data Lake 問題

資料湖是檔案系統，所以沒有資料庫的功能

1. 沒有 ACID 交易（更新、刪除困難）

2. 沒有 schema enforce （容易破壞資料污染）

3. 沒有 time travel（版本控管）

4. 沒有 concurrency control

5. 資料容易變成 data swamp

6. 很難進行 upsert、merge、incremental load

## What is Delta Lake?

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



## Delta Lake 核心概念

1. 使用開放格式：**Parquet** + **Transaction Log**

2. ACID Transactions

3. Schema Enforcement （Schema 管控）

4. Time Travel（時間回朔）

5. Incremental Processing（增量處理）

6. Batch + Streaming 雙一致性（Unified）