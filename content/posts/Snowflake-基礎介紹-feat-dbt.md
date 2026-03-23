---
title: Snowflake 基礎介紹 feat.dbt
date: "2025-08-25 13:37:07"
description: 針對 Snowflake 的基礎介紹，並結合 dbt 進行數據轉換與管理。
categories:
  - 資料會遇到的大小事
tags:
  - Snowflake
  - dbt
cover: /images/posts/covers/snowflake.png
---

## Snowflake 基本介紹

### ❄️ Snowflake 是什麼？

Snowflake 是一個雲端資料平台，主要用途是儲存、查詢與分析大量資料。

- 它是一種資料倉儲（Data Warehouse），但比傳統的資料倉儲更靈活、更容易擴展，能在雲上進行彈性調整，資料的來源格式也更加廣泛。

- 它是 SaaS（Software as a Service），你不需要自己架設伺服器，只要開通帳號就能使用。

### 📦 核心特色

- 雲原生設計：底層可以配合 AWS、Azure、GCP，不需要管理底層硬體

- 儲存與計算分離：儲存空間跟查詢運算可以獨立擴充，互不干擾

- 自動擴展與 snapshot：可以根據工作負載動態擴展，也可以定期備份

- 多租戶架構：適合多部門共用，資料可以依照**角色權限**切分存取

- 支援 SQL：使用 SQL 作為查詢語言，易於上手跟整合



### 🧱 架構簡介

Snowflake 採用的是一種 **multi-cluster（多集群）**、**shared data** 的架構。

- multi-cluster：允許同時存在多個「計算集群（Virtual Warehouses）」，可以分別給 ETL、分析、BI 等功能使用，不會互相搶資源。

- shared data：計算集群都能共用**同一份資料**，資料存在儲存層，不需要分散儲存在每個計算節點。

優點為不同工作負載可以獨立執行，也不需要重複搬資料，提高效率跟節省成本。



而 Snowflake 是傳統 shared-disk 和 shared-nothing 架構的混合體。

- shared-disk：多個節點共用同一份磁碟資料，擁有資料的一致性、整合方便的優點。

- shared-nothing：每個節點有自己的儲存與計算資源，適合擴展，但是同步資料麻煩。

Snowflake 兩者兼具，資料共用，但運算獨立，故保持擴展彈性外，也避免了資料同步的問題。



實現儲存與計算的分離：資料存放在儲存層，當運算任務需要的時候再啟動 warehouse 來執行，互相不會干擾。同時克服儲存與計算綁在一起的問題。



Snowflake 是一個面向服務（Service-Oriented）的架構，三層（Storage、Compute、Service）各自獨立，像微服務一樣，各司其職。各層之間不是硬綁在一起，而是用 RESTful API 來交換訊息，這讓它更容易擴展、維護、雲端部署。



Snowflake 是**完全雲原生（cloud-native）**，沒有地端版本。使用者可以選擇部署在哪個雲平台上（例如 AWS、GCP、Azure），甚至選特定的地區（例如東京、台北等區域）。



#### 雲端運作的分層介紹

- Storage Layer（儲存層）：可想像成自動管理、可 snapshot 回朔的雲端硬碟

    - 儲存所有資料，包括結構化（ SQL 表格）跟半結構化資料（JSON, Parquet）

    - 會進行自動壓縮與加密，並且自動管理檔案格式與分片

    - 提供 Time Travel 與 Fail-safe 的功能

- Compute Layer（計算層 / Virtual Warehouse）：可想像成依需求啟動的 SQL 計算引擎

    - 執行查詢時，Snowflake 會分配一到多個 **Virtual Warehouse** 來進行計算。

    - 每個 Virtual Warehouse 是可以獨立擴展，互不干擾。

    - 沒有查詢的時候可以讓 warehouse 休眠來減少費用。

- Could Services Layer（雲端服務層）：用來控管整個環境的運作

    - 管理登入、授權、帳號設定、資源調度等

    - 提供 SQL 解析、查詢最佳化、Metadata 管理

    - 處理 Data Sharing、Caching、權限、監控與帳務計費

## 建立環境

### 基本操作

1. 設定角色

2. 設定 warehouse

3. 設定 database

4. 設定 schema

5. 建立所需 Table



### 連結資料源頭

1. 連線至 Blob Storage

### 資料查詢

資料查詢部分，跟基本 SQL 查詢九成像。

比較特別是可以針對半結構化的欄位進行資料讀取：

```sql
-- 半結構化資料
{
  "menu_item_health_metrics": [
    {
      "ingredients": [
        "Lemons",
        "Sugar",
        "Water"
      ],
      "is_dairy_free_flag": "Y",
      "is_gluten_free_flag": "Y",
      "is_healthy_flag": "N",
      "is_nut_free_flag": "Y"
    }
  ],
  "menu_item_id": 10
}
```

```sql
---> to finish, let's extract the Mango Sticky Rice ingredients from the semi-structured column
SELECT
    m.menu_item_name,
    obj.value:"ingredients"::ARRAY AS ingredients
FROM menu m,
    LATERAL FLATTEN (input => m.menu_item_health_metrics_obj:menu_item_health_metrics) obj
WHERE TRUE
AND truck_brand_name = 'Freezing Point'
AND menu_item_name = 'Mango Sticky Rice';

```

## 外部資料源頭連線

### Create External State

這邊先以 `AWS S3` 來作為範例，可以替換 URL 成期望使用的空間。

```sql
CREATE OR REPLACE STAGE blob_stage
url = 's3://sfquickstarts/tastybytes/'
file_format = (type = csv);

---> query the Stage to find the Menu CSV file
LIST @blob_stage/raw_pos/menu/;
```



### 匯入資料

配合 `COPY` 的時候，資料不會被清整或是任何內容處理，僅依序放入。

```sql

-- COPY INTO <table>: https://docs.snowflake.com/en/sql-reference/sql/copy-into-table

---> copy the Menu file into the Menu table
COPY INTO menu
FROM @blob_stage/raw_pos/menu/;
```

## 相關架構建立指令

### Set the Role

```sql
USE ROLE SNOWFLAKE_LEARNING_ROLE;
```



### Set the Warehouse

```sql
USE WAREHOUSE SNOWFLAKE_LEARNING_WH;
```



### Set the Database

```sql
Use DATABASE SNOWFLAKE_LEARNING_DB;
```



### Set the Schema

```sql
-- 動態的組合出 schema_name
SET schema_name = CONCAT(current_user(), '_LOAD_SAMPLE_DATA_FROM_S3');
USE SCHEMA IDENTIFIER($schema_name);
```



### Create Table

```sql
-- CREATE TABLE: https://docs.snowflake.com/en/sql-reference/sql/create-table
CREATE OR REPLACE TABLE MENU
(
    menu_id NUMBER(19,0),
    menu_type_id NUMBER(38,0),
    menu_type VARCHAR(16777216),
    truck_brand_name VARCHAR(16777216),
    menu_item_id NUMBER(38,0),
    menu_item_name VARCHAR(16777216),
    item_category VARCHAR(16777216),
    item_subcategory VARCHAR(16777216),
    cost_of_goods_usd NUMBER(38,4),
    sale_price_usd NUMBER(38,4),
    menu_item_health_metrics_obj VARIANT
);
```

## DBT 與 Snowflake 連線

### 建立基礎連線

1. 建立新連線
    ![snowflake_1.png](/images/posts/Snowflake-基礎介紹-feat-dbt/snowflake_1.png)

2. 選擇 Data Source ，並且設定相關參數，主要注意設定 Warehouse 與 帳號密碼設定要正確，可以測試連線是否正常。
    ![snowflake_2.png](/images/posts/Snowflake-基礎介紹-feat-dbt/snowflake_2.png)


### 環境建立

各環境會分別綁定相對應分支，以維護 CI 穩定性。
![snowflake_3.png](/images/posts/Snowflake-基礎介紹-feat-dbt/snowflake_3.png)

## dbt 專案分支架構

### Git 分支策略

| 分支名稱 | 用途說明 | 
|---|---|
| `main` | 正式上線版本（Production） | 
| `staging` | 中繼測試分支，用於整合多個功能後驗證 | 
| `feature/xxx` | 功能開發用的分支（依功能命名） | 

> ❗ 無需建立 dev 分支，直接以 `feature/xxx` 為開發分支即可。

---

### dbt Cloud Job 規劃

| Job 名稱 | 指向分支 | dbt CLI 命令 | 備註 | 
|---|---|---|---|
| `Build - Feature` | feature/\* | `dbt run --select tag:dev` | 開發人員本地 CLI 執行 | 
| `Build - Staging` | staging | `dbt run --select tag:staging` | 整合測試使用 | 
| `Build - Prod` | main | `dbt run --select tag:prod` | 正式上線部署 | 

> ✅ 建議配合 `tags` 定義模型的階段與執行範圍。

> 開發時可配合以下，放在 model 的最上方。
>
> ```sql
> {{ config(materialized='view', tags=["dev"]) }}
> ```


## 開發時測試

在進行開發的時候，可以先配合以下指令來測試內容：

```bash
# 只編譯，不動資料庫（語法健檢）
dbt compile --select <model_name>

# 只跑這個 model（會在當前環境的 schema 建表/檢視）
dbt run --select <model_name>

# 同時建表 + 跑測試（推薦一次驗證）
dbt build --select <model_name>+

# 針對加了 dev tag 的一批
dbt run --select tag:dev
dbt build --select tag:dev
```



小技巧：

- `<model_name>+` 會連同下游一起跑；`+<model_name>` 會把上游也一起跑。

- 先 `dbt ls --select <pattern>` 看會選到哪些模型。



### dbt Commands

#### dbt run

先把 model compile 成 SQL 語法，再依照對弈的 materialization（ view, table 等等)，打進目標資料庫。

加上 `—-select` 可以只跑指定 model。

```sql
dbt run --select customers
```



#### dbt seed

把 dbt seeds 的 CSV 內容打到目標資料庫（table）。

有時候遇到狀況為目標資料庫的 table 已存在，但 seed 欄位有變動，執行 `dbt seed` 會發生錯誤，此時可以配合 `—-full-refresh` 來執行看看。

```sql
dbt seed --full-refresh
```



#### dbt test

執行 models 相關的 test。

可以加上 `—-select` 只跑指定的 model

```sql
dbt test --select coutomers
```



#### dbt build

build 就是一次做好幾件事情的懶人包

- run models

- test tests

- snapshot snapshots

- seed seeds：如果上游物件 test 失敗，下游物件會跳過，不會被錯誤的資料污染。

一樣可以配合 `—-select` 只跑指定物件

```sql
dbt build --select customers
```



#### dbt docs generate

更新 documentation 背後所需的檔案，包括

- index.html

- manifest.json

- catalog.json

其中 manifest 包含了 compile 後的語法，如不需要重新 compile，可以加上 `—-no-compile` 參數

```sql
dbt docs generate --no-compile
```



> 參考內容：<https://ithelp.ithome.com.tw/articles/10314528>


## DBT 內容指引

### 專案結構設計

```bash
models/
  staging/       # 清理後的原始資料 (一對一對應 source)
  marts/
    dim/         # 維度表
    fact/        # 事實表
  intermediate/  # 中間處理 (可選)
seeds/           # 靜態字典表 (csv)
snapshots/       # 維度快照 (SCD)
tests/           # 自訂測試
macros/          # 共用 SQL 腳本
```

- staging：把 raw 表「乾淨化、型別統一、命名一致」

- marts：面向商業的 fact/dim

- intermediate：若邏輯複雜，可用中間表拆解

- seeds：小型 lookup table（幣別、地區）



### 模型與描述檔對應

- 核心觀念：SQL = How，YAML = What + Quality + Docs

  - **SQL 檔（`*.sql`）**：資料邏輯、物化、依賴（`ref()`/`source()`）、少量與執行相關的 `config`。

  - **YAML 檔（`*.yml`）**：模型/欄位說明、測試（generic tests）、sources 宣告、exposures、meta/owner 等治理資訊。



- 該如何放置與配置：

  - 一個資料夾放一份 `YAML` 是常見做法

    - `models/staging/stg_*.sql` 對應 `models/staging/staging.yml`

    - `models/marts/fact/fct_*.sql` 對應 `models/marts/marts.yml`

  - 好處：減少碎片檔；仍能在同一 `YAML` 內逐一描述每個 model。

### 開發工作流程

1. 建立 `*.sql` ：寫 `SELECT`、`ref()`、必要 `config()`（物化/增量）

2. 在對應目錄的 `*.yml`：

  - 加入 `models: - name: <model>` 區塊

  - 寫 `description`、每個欄位 `description`

  - 主鍵加 `not_null + unique`；外鍵加 `relationships`；狀態加 `accepted_values`

  - 需要的話加 `meta.owner/domain/SLA`

3. 若是來源表：在同個 `yml` 的 `sources:` 區塊宣告

4. 執行：`dbt build`（= run + test + docs）

5. 開 `dbt docs serve` 看 lineage 與欄位字典；讓 reviewer 從文件檢視你的模型是否清楚



### 相關重要特點

#### 物化策略與選用原則

在 dbt 裡，**物化方式 (Materialization)** 會決定模型在 Snowflake（或其他 DWH）最終的落地型態，也影響執行效能、成本，以及查詢體驗。這是開發者最常需要調整的設定。

- 四種常見的物化方式

  1. **View**

    - 特性：只是一個 SQL 視圖，每次查詢會重新計算。

    - 適合：staging 層（清理轉換，更新頻繁，但不需持久化）。

    - 優點：無存儲成本，永遠最新。

    - 缺點：大表會查很慢，因為每次都重算。

  2. **Table**

    - 特性：在建模時把結果寫入一個實體表。

    - 適合：中間層或 marts 層，數據量適中，查詢多。

    - 優點：查詢快。

    - 缺點：每次重新 `dbt run` 都會整張重建 → 成本高。

  3. **Incremental**

    - 特性：僅處理新增或變更的資料，透過 `unique_key` 來 upsert。

    - 適合：事實表（如交易、事件流），數據量大，更新頻率高。

    - 優點：效率高，避免重建全表。

    - 缺點：需謹慎設計邏輯，否則容易漏或重複。

     ```sql
     {{ config(
       materialized='incremental',
       unique_key='order_id',
       incremental_strategy='merge'
     ) }}
     
     select * from {{ ref('stg_orders') }}
     {% if is_incremental() %}
       where order_at > (select max(order_at) from {{ this }})
     {% endif %}
     ```

  4. **Ephemeral**

    - 特性：不建立實體表，會被 inline 成 CTE。

    - 適合：中間邏輯拆分（例如一段複雜 join 先整理）。

    - 優點：避免資料庫裡出現太多中繼表。

    - 缺點：重複被引用時，每次都會 inline → 重算成本。

- 使用時機整理：

  - staging → 用 **View**

    > 永遠最新且不佔存儲；只做清理與型別統一，不加入商業彙總。

  - 資料量不大、查詢很頻繁 → 用 **Table**：

    > 報表/下游反覆查詢同一層且成本可接受；或上游來源不穩、希望鎖定某次快照結果。

  - 要拆中繼邏輯但不想落地 → **Ephemeral**：

    > 好處：資料庫不會多一堆中繼表；壞處：多處引用時會重算。

  - 大量資料、持續追加的事實表 → **Incremental**：

    > 通常 **incremental** 不用在 staging，而是用在 marts（fact）。

