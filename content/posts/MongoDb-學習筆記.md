---
title: MongoDb 學習筆記
date: "2024-06-06 14:57:50"
description: 紀錄一些 Mongo DB 的基本操作
categories:
  - 資料會遇到的大小事
cover: /images/posts/covers/mongodb.png
---

## 簡介

是一款高效能的開源 NoSQL 資料庫，採用 **文件型存儲（Document-Oriented Storage）**，以 **JSON-like BSON（Binary JSON）** 格式保存數據。MongoDB 提供高擴展性與靈活性，非常適合處理非結構化或半結構化數據。其架構無需固定的表結構，數據可輕鬆存儲、修改和擴展。

MongoDB 有以下優勢：

- 文件型結構

  MongoDB 在針對複雜的儲存資料有相對應的優勢，使用 JSON-like BSON 的資料格式，自然對應物件導向設計，並且可包含嵌套結構，能夠應付同時需儲存圖片與文字的需求。

- 高擴展性\
  支援水平分片 (Sharding) ，允許跨多個伺服器分散儲存數據，並且可以隨業務需求來動態新增節點，實現高可用性與高性能。

- 靈活的查詢能力\
  支援豐富的查詢操作，例如：條件查詢、篩選等，並且提供多層索引功能，包含單字段、複合字段、與全文檢索。

- 圖片儲存 (GridFS)\
  提供 GridFS 技術，能夠有效管理大型文件（如超過  16 MB 的圖片或影片）

- 無固定的 Schema\
  資料結構靈活，可以根據需求動態增減字段，適合應用在場景快速迭代與業務需求的變化。



## 相關基礎操作

### 架構分層
* MSSQL 的 *table* = MongoDB 的 *collection*
* MongoDB 的一筆資料叫做 *Document*
### 建立連線

```csharp
var string ConnectionString = "mongodb://localhost:27017"
var client = new MongoClient(ConnectionString);
```
### 選擇DB
```csharp
 var database = client.GetDatabase(DatabaseName);
```

### CreateCollection
```csharp
 database.CreateCollection(collectionName);
```

### GetCollection

```csharp
 database.GetCollection<Model>(collectionName);
```

### GetCollection 指定內容

```csharp
 var collection = database.CreateCollection(collectionName);
 var filter = Builders<Model>.Filter.Eq(x=>x.Name, targetName);
```

### 確認 Collection 是否存在

```csharp
 var filter = new BsonDocument("name", collectionName);
 var collection = database.ListCollections(new ListCollectionsOptions {Filter = filter});
 collection.Any();
```

### 刪除 Collection

```csharp
 database.DropCollection(collectionName);
```

### 更新 Collection 指定內容

```csharp
 var collection = database.GetCollection<Monster>("monsterList");
 var filter = Builders<Monster>.Filter.Eq(x=>x.Name, monsterName);
 var update = Builders<Monster>.Update.Set(x=>x.Level, newLevel);
 collection.UpdateOne(filter, update);
```