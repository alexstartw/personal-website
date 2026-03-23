---
title: ElasticSearch 基礎概念與建立
date: "2025-02-20 15:35:29"
description: 嘗試建立 ElasticSearch 環境，並了解基礎概念
categories:
  - 資料會遇到的大小事
tags:
  - ElasticSearch
cover: /images/posts/covers/elasticSearch.png
---

## ElasticSearch 基礎介紹

### **What is ElasticSearch**

1. Elasticsearch 是什麼？

   Elasticsearch 是一個 **分散式、開源** 的全文搜尋與分析引擎，同時也是**資料庫**，基於 **Apache Lucene** 架構開發。它可以快速儲存、搜尋及分析大量的結構化與非結構化數據，並常用於 **日誌分析、全文搜尋、監控、商業情報 (BI)** 等應用。

2. Elasticsearch 的核心特點

    - **全文搜尋 (Full-text search)：** 使用倒排索引 (Inverted Index) 和類似 SQL 的查詢語言 (DSL) 進行高效能搜尋。

    - **分散式架構 (Distributed architecture)：** 可水平擴展 (scale-out)，處理大量數據。

    - **即時分析 (Real-time analytics)：** 能即時更新並檢索資料，適用於日誌監控與大數據分析。

    - **高可用性 (High availability)：** 透過自動分片 (Sharding) 和備份 (Replication) 確保數據安全。

    - **RESTful API：** 可透過 HTTP API 與 JSON 來存取和管理數據。

3. 初步概念比較



    | 概念 | 說明 | 
    |---|---|
    | **Index (索引)** | 類似於 **資料庫**，儲存某類型的文件 (Documents) | 
    | **Document (文件)** | 類似於 **資料表的一列 (Row)**，儲存 JSON 格式的數據 | 
    | **Field (欄位)** | 類似於 **資料表的一個欄位 (Column)**，包含具體數據 | 
    | **Shard (分片)** | 將索引拆成多個分片，提高搜尋效能和可擴展性 | 
    | **Replica (副本)** | 每個分片的備份，用於容錯和負載平衡 | 
    | **Cluster (叢集)** | 由多個 Elasticsearch 節點 (Node) 組成，提高擴展能力 | 


    在我們常用的資料庫中，稍微對應一下相關術語，主要會是 **index** 的部分較為不同。



    | **Elasticsearch** | **SQL (RDBMS)** | 
    |---|---|
    | index | database | 
    | type | table | 
    | document | row | 
    | field | column | 
    | Mapping | schema | 
    | Inverted index | index | 


### 資料結構各項範例

1. Index（索引）\
   類似關聯式資料庫中的「資料表」，用於存放同一種類型的文件

   ```sql
   -- 建立索引
   PUT /ship_index
   
   -- 查詢索引
   GET /ship_index
   
   -- 刪除索引
   DELETE /ship_index
   ```

2. Document（文件）\
   是 Elasticsearch 中最小的資料單位，類似於關聯式資料庫中的一列資料 (Row)，如此會在 `ship_index` 索引中新增一筆 `id=1` 的船舶資訊

   ```sql
   -- 建立文件
   POST /ship_index/_doc/1
   {
     "name": "Ever Given",
     "type": "Cargo",
     "length": 400,
     "status": "In Transit"
   }
   ```

3. Field（欄位）\
   欄位是文件內的屬性，例如上述範例中的 `name` , `type` 等

4. Shard（分片）\
   是 Elasticsearch 將索引拆分為多個部分來提升效能的機制

   ```sql
   PUT /ship_index
   {
     "setting": {
       "number_of_shards": 3
     }
   }
   ```

5. Replica（副本）\
   是分片的複製品，用於提升可用性與讀取效能

   ```sql
   PUT /ships_index
   {
     "settings": {
       "number_of_shards": 3,
       "number_of_replicas": 2
     }
   }
   ```

6. Cluster（叢集）\
   多個節點 (Node) 組成的運行單位，可於 `elasticsearch.yml` 設定叢集名稱

   ```sql
   cluster.name: "ship_tracking_cluster"
   ```



### 實際建立服務

與 Elasticsearch 之間操作大多透過 RESTful API 進行溝通，如果沒有 GUI 配合的話，開發上會很不方便，故這邊在實際建立的時候，會配合 Kibana 進行建立，當作操作的工具。

- 建立注意事項：要確認安裝的記憶體是否充足，因他預設有容量水位線，若目前使用的硬碟已達 80%，會無法進行分片的動作導致服務無法正常運行。

- 檢查 Elastivsearch 是否有正常運行：

   ```powershell
   curl -X GET "http://localhost:9200/_cluster/health?pretty"
   ```

  檢查 `status` 欄位，如果為 `red` ，則需要修復，若為 `yellow` 或 `green` ，則表示服務成功啟動。

- 下面提供建立的 yaml，可以依照所需進行相對應的參數調整。

   ```yaml
   version: '3.8'
   
   services:
     elasticsearch:
       image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
       container_name: elasticsearch
       environment:
         - discovery.type=single-node
         - xpack.security.enabled=false  # 取消安全驗證
         - ES_JAVA_OPTS=-Xms2g -Xmx2g    # 限制 Java 記憶體使用 2GB
       ports:
         - "9200:9200"
       volumes:
         - /opt/elasticsearch/data:/usr/share/elasticsearch/data  # ✅ 存放 Elasticsearch 資料
       ulimits:
         memlock:
           soft: -1
           hard: -1
       deploy:
         resources:
           limits:
             memory: 4G
       restart: always  # 服務失敗時自動重啟
   
     kibana:
       image: docker.elastic.co/kibana/kibana:8.11.0
       container_name: kibana
       depends_on:
         - elasticsearch
       environment:
         - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
       ports:
         - "5601:5601"
       restart: always  # 服務失敗時自動重啟
   
   ```


