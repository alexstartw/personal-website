---
title: Neo4j 介紹與建立
date: "2024-11-01 16:03:20"
description: 介紹 Neo4j 的基本概念與建立
categories:
  - 資料會遇到的大小事
tags:
  - Neo4j
  - Graph RAG
  - Python
  - Data
  - jeiba
  - word2vec
cover: /images/posts/covers/neo4j.jpg
---

## 簡介

理解了 GraphRAG 的核心概念後，接下來要介紹的是 GraphRAG 常搭配使用的一個強大圖形資料庫管理系統——Neo4j。

大數據時代來臨，當數據量龐大且數據關係複雜時，若使用傳統的 SQL 資料庫儲存需要大量的表格，花費大量的時間寫程式描述數據間的關係。

因此若遇到複雜關聯、龐大的資料，可以使用 Neo4j 開源的圖形數據庫 ( Graph DB ) 不但可以靈活存取也可以達到快速查詢的功能。

是一種 NoSQL 非關聯性資料庫，相較於傳統的 SQL 以行、列、資料表格的方式儲存，Neo4j 是以 Graph DB ( 圖形數據庫 ) 的儲存方式藉由許多的 －`nodes` (節點)、`relations` (關係)、`properties` (屬性)、`label` (標籤) 所組合而成。



## 需了解的小技術

1. Bacon Path

2. Recommend Engine

3. Cypher 查詢語言

### Bacon Path

#### 什麼是 Bacon Path

源自於「六度分隔」的理論，主要計算兩個點之間的距離多遠。

#### Bacon Number

每個 Node 的 Bacon Number 是指跟指定 Node 的最短長度，自己與自己的 Bacon Number 是 0。

### Recommend Engine

#### 推薦系統的類型

- 協同過濾（ Collaborative Filtering ）

    - 基於用戶之間的行為相似性來做出推薦

- 內容過濾（ Content-Based Filtering ）

    - 基於用戶對特定類型或屬性的偏好進行推薦

#### Neo4j Keymaker

用來創建與管理 Recommend Engine。

### Cypher 自然語言

專門為 Graph DB 設計的查詢語言，特別使用於 Neo4j。

#### 基本概念

- 節點 Nodes：基本單位，表示實體。

   ```plain
   (person) // 一個簡單的節點
   (person:Person) // 帶有 Person 標籤的節點
   (person:Person {name: "Alex", age: 28}) // 帶有屬性的節點
   ```

- 關係 Relationships：用來連接節點，表示之間的關係，利用 `[]` 表示關係。

   ```plain
   // 簡單的關係
   (person1)-[knows]->(person2)
   
   // 帶有 KNOWS 類型的關係
   (person1)-[:KNOWS]->(person2)
   
   // 帶有屬性的關係
   (person1)-[:KNOWS {since: 2010}]->(person2)
   ```

- 模式 Patterns：節點與關係的組合，用來描述圖中的結構。

   ```plain
   (person:Person)-[:LIVES_IN]->(city:City)
   ```

### 基本查詢結構

#### MATCH

用於指定途中節點和關係的模式。

```plain
MATCH (person:Person)-[:LIVES_IN]->(city:City)
```

#### WHERE

用於過濾結果，根據特定䩞建篩選節點或關係。

```plain
MATCH (person:Person)-[:LIVES_IN]->(city:City)
WHERE city.name = "台北"
```

#### RETURN

用於指定回傳的資料內容。

```plain
MATCH (person:Person)-[:LIVES_IN]->(city:City)
WHERE city.name = "台北"
RETURN person.name, person.age
```

#### CREATE

用於創建圖中的節點和關係。

```plain
CREATE (p:Person {name: "John", age: 25})
CREATE (s:School {name: "Stanford University", location: "California"})
CREATE (p)-[:STUDIED_AT]->(s)
```

#### UPDATE

用於更新節點或關係的屬性。

```plain
MATCH (n:Person {name: 'Alex'})
SET n.age = 29
```

#### DELETE

用於刪除節點或關係。

```plain
MATCH (a)-[r:KNOWS]->(b)
DELETE r, b
```



#### SQL 與 Cypher 的等效交換

以下皆可查到相同的內容：

```sql
SELECT * FROM employees e
JOIN departments d ON e.department_id = d.department_id
JOIN locations l ON d.location_id = l.location_id
WHERE e.manager_id IS NULL;
```

```plain
MATCH (e:Employee)-[:MANAGES*0..]->(m:Employee)
WHERE m.manager_id IS NULL
RETURN e;
```

## Neo4j 建立教學

將以最簡單的方式建立，配合 docker-compose ，即可建立出可用的 Neo4j ，但要注意此方法不適合用於正式環境下，較適合用於小型實驗與 Local 端。

### Docker Compose

建立 `docker-compose.yml` 文件，先行將所需的 volumes mount 起來，方便後續操作。

```yaml
version: "3.3"
services:
  neo4j:
    image: neo4j:latest
    restart: unless-stopped
    ports:
      - 7474:7474
      - 7687:7687
    volumes:
      - /var/lib/docker/volumes/neo4j_volume/conf:/conf
      - /var/lib/docker/volumes/neo4j_volume/data:/data
      - /var/lib/docker/volumes/neo4j_volume/import:/import
      - /var/lib/docker/volumes/neo4j_volume/logs:/logs
      - /var/lib/docker/volumes/neo4j_volume/plugins:/plugins
    environment:
      - NEO4J_dbms_memory_pagecache_size=1G
      - NEO4J_dbms_memory_heap_initial__size=1G
      - NEO4J_dbms_memory_heap_max__size=1G
```

#### 內容解釋

- `NEO4J_dbms_memory_pagecache_size`：設定頁面快取大小

- `NEO4J_dbms_memory_heap_initial__size`：設定起始的 heap 大小

- `NEO4J_dbms_memory_heap_max__size`：設定最大 heap 大小

### 訪問建立的服務

- 網址：`http://localhost:7474`

- 預設帳密皆為：`neo4j`

### 實際畫面

![neo4j-1.png](/images/posts/Neo4j-介紹與建立/neo4j-1.png)

## Python 連線 Neo4j

要將資料放入 Neo4j 就跟一般資料庫類似，需先建立連線後再對資料進行存取。
以下會稍微提到建立 `Node` 與 `Relationship` 的方式，並一併提到 `word2vec` 的使用。

- 連線方式

   ```python
   from py2neo import Graph, Node, Relationship
   
   graph = Graph("bolt://localhost:7687", auth=("account", "password"))
   ```



- 建立 `Node` 並放入 `graph` ，`model` 目前先以自行建立起來的 `word2vec model` 暫代，詳細建立方法可以查看 Word2Vec model

   ```python
   for word in model.wv.index_to_key:
       vector = model.wv[word]
       node = Node("Word", name=word, vector=vector.tolist())
       graph.merge(node, "Word", "name")
   ```



- 建立 `Node` 之間的關聯性，可以依照自己所需，去加入不同的關聯，因為目前是文章上下文，所加入的 `Relationship` 先以 `“SIMILAR“` 進行設定。

   ```python
   for word1 in model.wv.index_to_key:
       for word2 in model.wv.index_to_key:
           if word1 != word2:
               similarity = cosine_similarity([model.wv[word1]], [model.wv[word2]])[0][0]
               if similarity >= 0.7:
                   word1_node = graph.nodes.match("Word", name=word1).first()
                   word2_node = graph.nodes.match("Word", name=word2).first()
                   graph.merge(Relationship(word1_node, "SIMILAR", word2_node, similarity=float(similarity)))
   ```


### Word2Vec model

可以分成**自行建立**與**讀取**的兩種方式。

#### 自行建立

先將前處理過後的文檔，利用 `word2vec` 進行句子切分， 並設定相關數據來訓練出自己的一個 word2vec model

```python
from gensim.models import word2vec


# Train word2vec model
sentence = word2vec.LineSentence('words.txt')
model = word2vec.Word2Vec(sentence, seed=666, vector_size=100, min_count=1, negative=10, sg=0,
                          window=10, workers=4, epochs=10, batch_words=10000)
model.save('word2vec.model')
```

#### 讀取 model

可以利用別人預先訓練好的模型，套用來使用。

```python
 # Load word2vec model
 model = word2vec.Word2Vec.load('word2vec.model')
```

#### Jieba 斷詞

初步先不考慮表格類型之內容，以一般文字進行斷詞，配合 Jieba ，並依照所需要的特殊字詞建立 `user_dict` ，以便後續利用 `word2vec` 建立向量。

```python
import jieba

def text_to_words(text):
    # Tokenize text
    jieba.load_userdict('user_dict.txt')
    # 先將整份文件利用句號切分句子
    sentences = re.split(r"[。！？]", text)

    for sentence in sentences:
        if sentence:
            words = jieba.lcut(sentence)

            print(words)
        with open('words.txt', 'a', encoding='utf-8') as f:
            f.write(' '.join(words) + '\n')
```





