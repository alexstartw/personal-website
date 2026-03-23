---
title: Redis 簡介與基礎操作
date: "2024-12-18 14:06:02"
description: Redis 是一個開源的 NoSQL 資料庫，它是一個高性能的 key-value 資料庫，支援多種資料結構，如字串、列表、集合、有序集合等。本文將介紹 Redis 的基本概念和基礎操作。
categories:
  - 資料會遇到的大小事
tags:
  - Redis
  - NoSQL
cover: /images/posts/covers/redis.png
---

## 前言

是一種**記憶體內儲存**的資料庫，通常用於快取、工作階段管理等應用。以低於一毫秒的回應時間著稱，適合需要高效能的即時應用程式。

## 主要特點

- **資料結構**：Redis 支援多種資料類型，包括字串、清單、集合、有序集合、雜湊和地理空間資料等，這使得它比傳統的鍵值存放區更具彈性

- **高效能**：所有資料存放在記憶體中，避免了磁碟存取的延遲，通常可以在一毫秒內完成操作，並支援每秒數百萬次請求

- **持久化**：Redis 提供兩種持久化機制：快照（RDB）和附加檔案（AOF），可將記憶體中的資料保存到磁碟，以便在重啟後恢復

- **主從架構**：支援主從複寫，可以將資料複製到多個從屬伺服器，這不僅提升了讀取效能，也增加了系統的可靠性



## 常用的資料結構

會是以 key, value 的方式儲存，key 固定是字串，value 則可以多型態。

value 常用的資料結構：

- **字串 (String)**

   - **最大長度**：Redis 中的字串最大容量為 **512MB**，這使得它能夠儲存大量的數據，包括文字和二進位資料

   - **數值運算**：字串可以儲存數值，並且可以進行數學運算，這是 Redis 字串的一個重要特性

   - **格式**：字串可以是純文字、數值或其他二進位資料，並且是二進位安全的，這意味著它們可以儲存任何類型的數據，不受字符限制

- **列表 (List)**

   - **非同步隊列處理**：Redis 的列表類型支援兩種存取方式：

      - **Queue (先進先出)**：使用 **`LPUSH`** 和 **`RPOP`** 命令來實現。

      - **Stack (後進先出)**：使用 **`LPUSH`** 和 **`LPOP`** 命令來實現

   - 列表適合用於需要非同步處理的情境，如任務隊列。

- **雜湊 (Hash)**

   - 雜湊是一種鍵值對集合，適合用來儲存物件的屬性。每個雜湊可以包含多個鍵值對，這使其適合用於儲存結構化資料。

- **集合 (Set)**

   - 集合中的成員是無序且唯一的，這意味著同一個元素不會重複出現。這使得集合特別適合用於需要唯一性和隨機性的應用場景，例如抽獎活動

   - 當集合中的唯一成員被移除後，整個集合會自動刪除。

- **有序集合 (Zset)**

   - 有序集合中的成員是唯一且有序的，每個成員都有一個分數（score），根據分數進行排序。這使得有序集合非常適合用於排名和排序相關的應用，例如遊戲排行榜

   - 當有序集合中的唯一成員被移除後，整個有序集合也會自動刪除。

## 簡易建立方式

- Docker 安裝

   ```powershell
   docker pull redis
   docker run --name reids -d -p 6379:6379 redis
   ```

- 可配合其他 GUI 進行連線，MacOS 我是使用 `Another Redis Desktop Manager` 

- 若需要遠端連線

   - 至 container 內的 `/etc/redis.conf` 將 `bind 127.0.0.1` 註解

   - 重啟 redis 服務

## 基本操作

通常使用上會以程式碼來進行 CRUD，若想在 `redis-cli` 直接操作，參考官網。

這邊先以 Python 做範例，提供基本資料格式操作：

```powershell
# 建立連線
redis_conn = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# Create (新增資料)
def create_data():
    # 字串資料
    redis_conn.set("user:1", "Alice")
    
    # 雜湊資料
    redis_conn.hset("user:1:details", mapping={"age": 25, "email": "alice@example.com"})
    
    # 集合資料
    redis_conn.sadd("user:1:skills", "Python", "Django", "Redis")

# Read (讀取資料)
def read_data():
    # 讀取字串資料
    name = redis_conn.get("user:1")
    print(f"Name: {name}")
    
    # 讀取雜湊資料
    details = redis_conn.hgetall("user:1:details")
    print(f"Details: {details}")
    
    # 讀取集合資料
    skills = redis_conn.smembers("user:1:skills")

# Update (更新資料)
def update_data():
    # 更新字串資料
    redis_conn.set("user:1", "Bob")
    
    # 更新雜湊資料
    redis_conn.hset("user:1:details", "age", 30)
    
    # 新增技能至集合
    redis_conn.sadd("user:1:skills", "Flask")

# Delete (刪除資料)
def delete_data():
    # 刪除字串資料
    redis_conn.delete("user:1")
    
    # 刪除雜湊資料
    redis_conn.delete("user:1:details")
    
    # 刪除集合資料
    redis_conn.delete("user:1:skills")
```