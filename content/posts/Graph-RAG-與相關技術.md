---
title: Graph RAG 與相關技術
date: "2024-11-01 15:50:28"
description: 介紹 Graph RAG 的建立與相關技術
categories:
  - 資料會遇到的大小事
tags:
  - Graph RAG
  - RAG
  - Python
  - Data
cover: /images/posts/covers/graphrag.png
---

## 什麼是 GraphRAG

GraphRAG（基於圖的檢索增強生成）是對傳統的檢索增強生成（RAG）技術的一種創新和升級。它通過結合知識圖譜技術，顯著提高了信息檢索和回答生成的準確性和相關性。



## 運作原理

### 查詢重寫和預檢索

- 通過理解用戶查詢的意圖，轉化成更準確的查詢格式，需要強大的自然語言處理與語意理解能力。

- 利用知識圖譜索引來取得和查詢相關的文件，使檢索過程更精確匹配查詢意圖。

### 檢索和重新排序

- 捕捉與上下文相關的子圖，會比傳統的 RAG 包含更多實體之間的關係，以便進行更複雜的推理。

- 會進行重新排序來優化選取的內容，並考慮文件的相關性與對回答的貢獻度。

### 後檢索階段

- 根據圖譜的結構來決定哪些訊息對於答案是重要的，並且能夠回答得更加人性化。

## 優點

### 準確度與完整性

相較於傳統的 RAG 方法，在回答複雜問題時提供了更完整且準確的答案，他能捕捉並利用不同信息片段的關係，提供更豐富的上下文。

### 開發與維護

一旦建立好知識圖譜，後續的建構與維護都會相對容易。

### 可解釋性與可追朔性

GraphRAG 在可解釋性、可追溯性和存取控制方面都更好。它能夠提供每個回答的出處信息，使得用戶能夠快速且準確地審核 LLM 的輸出，直接對照原始來源材料。

## MicroSoft GraphRAG 範例

### 環境設定

1. 利用 Conda 建立虛擬環境，版本要求 `Python 3.10 - 3.12`

   ```powershell
   conda create -n GraphRAG python=3.10
   conda activate GraphRAG
   ```



2. 安裝 GraphRAG

   ```powershell
   pip install graphrag
   ```

### 準備資料夾與文件

文件資料夾的位置需放在指定目錄 `/{dir_name}/input` ，目前只支援 `.txt` ，`.pdf` 會被忽略，故需要的話，需先進行轉換。

```powershell
mkdir -p ./ragtest/input
curl https://www.gutenberg.org/cache/epub/24022/pg24022.txt > ./ragtest/input/book.txt
# 此目錄為範例文件，可以利用自己想測試的文件來測試
```



### Workspace 初始化

利用指令進行簡單的初始化

```powershell
python -m graphrag.index --init --root ./{dri_name}
```

執行後會發現指令協助建立出所需的文件

![graphrag-1.png](/images/posts/Graph-RAG-與相關技術/graphrag-1.png)

### 設定檔修改

1. `.env` ：需要新增要使用的 OpenAI API Key

2. `setting.yml` ：可以客製化整個 pipline，主要可以修改使用的模型等，預設的 embedding model 是 text-embedding-3-small，LLM 是 gpt-4-turbo-preview。

### 執行 Indexing pipeline

利用以下指令進行 indexing

```powershell
python -m graphrag.index --root ./{dir_name}
```

### 進行問答

GraphRAG 的 Query Engine 有分三種，Local Search、Global Search、Question Generation，指令的使用方法如下：

```powershell
python -m graphrag.query \
--root ./ragtest \
--method global \
"想問的問題"
```








