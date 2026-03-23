---
title: Text to SQL 簡易實作
date: "2024-11-14 10:24:29"
description: 介紹 Text to SQL 的基本概念與簡易實作
categories:
  - 深度學習會遇到的大小事
tags:
  - Text to SQL
  - SQL
  - Python
  - Data
  - NLP
cover: /images/posts/covers/text2sql.png
---

## Text to SQL 建立

### 建立原因

在建立 RAG 的知識庫時，會有部分需求是會針對個人或是自己的資訊，需要至 Database 進行資料的查詢，而一般的語句會要轉換成 SQL 語法後才能針對 Database 進行資料存取，故需要建立 Text to SQL 的流程。

### 主要流程

簡易版本的流程會如下圖，並分為幾個步驟

1. User 實際輸入問題

2. 問題經過 Text to SQL 的處理

3. 獲得可執行的 SQL Command

4. 回傳執行 Command 的結果到 LLM

5. LLM 回傳答案給 User


![text2sql_1.png](/images/posts/Text-to-SQL-簡易實作/text2sql_1.png)

## 可應用層面

### 1\. **商業分析與自助式 BI 工具**

未來的商業智能 (BI) 平台可以集成 Text-to-SQL 技術，使得非技術用戶能夠透過自然語言查詢資料庫，生成報告和分析結果。這將大幅降低對 SQL 語法的依賴，使得商業團隊能夠快速進行自助數據分析。

### 2\. **客戶服務與支持**

Text-to-SQL 可以集成在客戶服務的聊天機器人中，讓客戶可以使用自然語言查詢後台數據。例如，在電商平台上，客戶可以通過問句如「上個月最暢銷的產品是什麼？」來查詢訂單數據，系統會自動生成 SQL 查詢來檢索相關資料。

### 3\. **資料科學與數據分析**

資料科學家和數據分析師能夠利用 Text-to-SQL 技術直接以自然語言進行數據查詢與過濾，節省撰寫複雜 SQL 查詢的時間。這將加速數據分析過程，尤其是在探索性數據分析 (EDA) 階段。

### 4\. **數據驅動的決策系統**

在企業決策系統中，Text-to-SQL 可以幫助管理層使用自然語言查詢來獲取最新的關鍵業務數據，支持即時決策。未來，這類系統能夠自動生成報表和關鍵指標，使得高層管理者不再需要依賴技術人員進行數據查詢。


## Text to SQL 簡易做法

Text to SQL 產出 SQL Command 的方式跟平常使用 ChatGpt 其實是差不多概念，但差異在於，Text to SQL 是可以真的對自己的資料庫進行資料讀取的行為，而 ChatGpt 無法。

目前做法：User 輸入 → LLM 轉換 → 產出 SQL Command → 執行並回傳結果。

### 實際範例

這是示範的 table

![text2sql_2.png](/images/posts/Text-to-SQL-簡易實作/text2sql_2.png)

當實際問問題：公司有多少人

他可以回答：

![text2sql_3.png](/images/posts/Text-to-SQL-簡易實作/text2sql_3.png)


如此可搭配其他架構來完成配合 RAG 的問答機器人。

### 設計注意項目

在針對 Text to SQL 進行 prompt 的設計時，除了可以針對你想要他回答的方式，最重要的是給定 table info，不能單單只是直接取得欄位的名稱、型別等資訊，最好是以建立 table 的指令來提供，LLM 的回答才會準確。

範例如下：

```sql
create table public.employees (
  employeeid integer primary key not null default nextval('employees_employeeid_seq'::regclass),
  name character varying(50) not null,
  gender character varying(10),
  dateofbirth date,
  hiredate date not null,
  jobtitle character varying(100),
  department character varying(100),
  email character varying(100) not null,
  phonenumber character varying(20),
  address text,
  status character varying(20) default 'Active',
  createdat timestamp without time zone default CURRENT_TIMESTAMP,
  updatedat timestamp without time zone default CURRENT_TIMESTAMP
);
create unique index employees_email_key on employees using btree (email);
```

如此在進行**自然語言**轉換至 **SQL** 即可達到不錯的正確性。
