---
title: Apache Spark 學習筆記
date: "2025-02-07 10:23:59"
description: 紀錄學習 Spark 的相關內容與基礎知識
categories:
  - 資料會遇到的大小事
tags:
  - Apache Spark
cover: /images/posts/covers/spark.png
---

## Apache Spark 簡介

是一個處理巨量資料集的高效工具，繼承了 Hadoop MapReduce 的核心概念，但將運算提升至記憶體層級，顯著減少磁碟 I/O 時間。研究表明，Spark 的運算性能比 Hadoop 快 10 倍以上，因此在資料工程領域廣受歡迎。

### 優點

- **速度快**：Spark 通過**內存(記憶體)計算**和**執行引擎優化**來降低數據處理的延遲，在處理速度上優於傳統的 MapReduce，官方說法是快了 10\~100 倍。此外，由於 Spark 將中間數據保留在內存當中，因此特別適合用在**迭代計算**上，如**機器學習**與**圖處理**。

- **簡化編程模型**：Spark 提供了高級 API，如 **Spark SQL**、**DataFrame** 和 **Structured Streaming**，使用者能更輕鬆地編寫程式，而不用手動編寫 Map 和 Reduce 函式。另外，Spark 也支援多種程式語言，包括 **Scala**、**Java**、**Python** 和 **R**，使用者可以選擇熟悉的程式語言進行開發。

- **高適用性**：除了批處理外，Spark 擁有豐富的生態系統，包括 **Spark Streaming** (實時處理)、**MLlib**（機器學習）和 **GraphX**（圖形處理），能適用在多種處理情境。

    

    <https://www.constellationr.com/blog-news/spark-fire-why-all-hype>

  ![Spark structure](https://dhenschen.wordpress.com/wp-content/uploads/2015/06/spark-2015-vision.jpg)


## Why Spark ?

首先必須先簡介 `MapReduce` ，MapReduce 是由 Google 提出的分布式計算框架，用於處理大規模數據集。其核心概念是將運算分為兩個階段：**Map** 和 **Reduce**，並通過分布式架構在多台機器上高效執行。

- **Map 階段**：將輸入數據分片，並以鍵值對的形式進行處理和轉換。

- **Shuffle 階段**：將 Map 階段生成的中間結果進行分組和排序，準備進入 Reduce 階段。

- **Reduce 階段**：對相同鍵值的數據進行聚合或其他計算，生成最終結果。

#### 特點

- **分散式架構**：支持大規模數據處理，分布在多個節點上執行。

- **高容錯性**：通過任務重啟和數據備份應對節點故障。

- **簡單易用**：使用者只需專注於 Map 和 Reduce 的邏輯，其餘由框架處理。

#### 使用場景

- 批量數據處理（如日誌分析、數據統計）。

- 構建大型數據管道。

- 訓練簡單的機器學習模型。

雖然 MapReduce 強大，但其基於磁碟的處理方式導致性能受限，後來被如 Spark 等記憶體優化框架取代。



MapReudce 的出現雖然解決了大數據離線計算的需求，但其有一些缺點存在，比如：

- **高延遲**：MapReudce 在計算時通常需要進行多次的硬碟 I/O，這大大降低了計算性能，也造成了較高的處理延遲。

- **編程模型複雜**：開發人員需要手動編寫 Map 與 Reduce 函式，同時還需要處理資料分發、排序以及錯誤處理等問題，這使得開發與維護 MapReduce 變得非常繁瑣。

- **適用性受限**：MapReduce 適合用於離線的批處理上，在實時數據流、迭代計算或是一些複雜的處理中表現較差。

Spark 的出現即是為了解決上述這些問題。

## RDD (Resilient Distributed Dataset)

RDD 分布式數據集是 Spark 中用來表達資料單元的概念，並且資料結構具有以下特點：

1. **並行運算**：RDD 將資料切分成多個單位，分布於多個運算資源上，實現並行處理。

2. **不可更動性**：RDD 資料不可修改，調整資料需透過操作生成新的 RDD。

3. **容錯性**：RDD 不使用副本（Replica）來實現容錯，而是依據血緣關係（lineage）記錄上游來源和運算過程。當節點失效時，RDD 可依相同步驟重建，完成運算。

4. **惰性運算**：RDD 的轉換（Transformation）只有在執行行動（Action）時才會真正計算。優點是可避免處理無用資料，提升運算效率；缺點是錯誤需等到執行 Action 時才顯示。



## RDD 與 HDFS 的差異

RDD 與 HDFS 都具有分散式結構，但它們的作用和概念根本不同：

1. **HDFS 的作用**：

    - HDFS 是分散式文件系統，用於存儲和管理大規模的文件。

    - 資料切分為「Block」，每個 Block 存放於不同節點，確保高可用性和容錯能力。

2. **RDD 的作用**：

    - RDD 是 Spark 中的分散式數據結構，用於處理數據。

    - 資料切分為「Partition」，每個 Partition 代表一個邏輯運算單位，支持並行運算。

3. **關係與差異**：

    - **HDFS 的 Block 與 RDD 的 Partition 無直接關聯**。儘管兩者都以分散方式存在，但 RDD 是在數據讀取進程中根據需求重新分配 Partition 數量的。

    - 例如：無論 HDFS 中的 Block 數量如何，Spark 在讀取資料時，會基於應用程式設定或計算需求重新劃分 Partition，提升運算效率。

#### 簡化說明

- **HDFS 的重點在「儲存」，目標是分散存放資料並支持容錯。**

- **RDD 的重點在「運算」，目標是分散運算資料並支持並行計算。**

- HDFS 的 Block 與 RDD 的 Partition 是獨立的概念，資料讀入 Spark 後會重新按照 Partition 分配，不受原始 Block 切分影響。


## Spark 架構

Spark Core 實現了 Spark 的基本功能，採用主從架構 ( Master / Slave ) ，主要有三個核心組件，分別是 Spark Driver、Cluster Manager、Spark Executor。

### Spark Driver

- 任務管理與調度中心：將作業分為小任務，分配給不同節點的 Executors 執行

- 邏輯處理：負責將使用者提交的程式轉換為 RDD DAG （有向無環圖）

- 任務監控：監控所有的 Executor 執行狀態

#### 工作流程

1. 接收用戶提交的 Spark 程式

2. 解析程式並生成 DAG

3. DAG Scheduler 將 DAG 分解為不同的 Stage

4. Task Scheduler 將每個 Stage 分配給 Executors

5. 監控執行進度，收集結果

### Cluster Manager

- 資源管理與分配：負責管理整個 Spark 的資源（ CPU、記憶體等）

- 協調 Driver 和 Executors：根據 Driver 的請求分配資源給 Executors

- 任務佇列管理：處理多個應用程式的資源需求，確保公平性與高效性

#### 工作流程

1. 接收 Driver 提出的資源請求

2. 分配 Executors 節點和資源

3. 監控資源使用狀態

4. 釋放執行完的資源並進行回收

### Spark Executor

- 實際執行任務：執行由 Driver 分配的 Tasks

- 數據儲存與計算：在每個節點儲存部分資料，進行分散式計算

- 回報結果：將執行結果返回給 Driver

- 資源管理：管理自己節點的記憶體和 CPU 資源

#### 工作流程

1. 接收 Manager 分配的資源

2. 從 Driver 接收 Tasks

3. 執行 Tasks，儲存中間結果

4. 將結果回傳給 Driver

5. 完成任務後，釋放資源