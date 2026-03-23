---
title: Jinja function 基礎介紹
date: "2025-11-24 11:57:46"
description: 針對 Jinja function 的基礎介紹，包含常用的函數與範例，並配合 dbt 的使用說明。
categories:
  - 資料會遇到的大小事
tags:
  - Jinja
  - dbt
cover: /images/posts/covers/Jinja.png
---

Jinja 是一個 **Python 的模板引擎**，常用在 **Flask、dbt、Ansible** 等框架裡。它的主要用途是把變數、邏輯和文字結合在一起，產生動態內容（例如 HTML、SQL、YAML）。



### 基本概念

在 Jinja 的 function 可以分成幾類：

1. 過濾器（Filters）

    1. 作用在變數後面，透過 `|` 來使用

       ```python
       {{ "hello world" | upper }}   {# 結果: HELLO WORLD #}
       {{ [1,2,3] | length }}       {# 結果: 3 #}
       ```

2. 測試（Tests）

    1. 利用 `is` 來判斷型態或是特性

       ```python
       {% if myvar is string %}
         myvar 是字串
       {% endif %}
       ```

3. 內建函式（Built-in Functions）

    1. 可以直接呼叫的函式

       ```python
       {{ range(5) }}        {# 結果: [0,1,2,3,4] #}
       {{ dict(a=1, b=2) }}  {# 結果: {'a':1,'b':2} #}
       ```

4. 自訂函式（Custom FUnctions / Macros）

    1. 可以自行定義 macro，簡單來說就是 Jinja 的函式

       ```python
       {% macro greet(name) %}
         Hello, {{ name }}!
       {% endmacro %}
       
       {{ greet("Lin") }}   {# 輸出: Hello, Lin! #}
       ```



### Jinja in dbt

以下介紹 dbt 內建的 function / macro，可以直接在 `{{  }}` 中進行使用

1. dbt 專用的 Jinja 函式

    - **ref()**\
      產生其他模型的依賴（協助管理 lineage）

       ```sql
       select * from {{ ref('stg_orders') }}
       ```

    - **source()**\
      指向資料來源（通常在 `schema.yml` 宣告過）

       ```sql
       select * from {{ source('raw', 'customers') }}
       ```

    - **config()**\
      在 model 裡設定 table 層級屬性

       ```sql
       {{ config(materialized='table', schema='analytics') }}
       ```

    - **var()**\
      使用 `dbt_project.yml` 或是 CLI 傳入的變數

       ```sql
       select * from {{ var('my_schema') }}.users
       ```

    - **this**\
      代表目前模型的完整名稱（包含 schema、table）

       ```sql
       select * from {{ this }}
       ```

2. 常用的 Jinja filters（在 SQL 內處理字串、清單）

    - 字串處理

       ```sql
       {{ 'customer_id' | upper }}   -- CUSTOMER_ID
       {{ 'customer id' | replace(' ', '_') }}   -- customer_id
       ```

    - 清單處理

       ```sql
       {% set cols = ['id','name','age'] %}
       
       select
       {% for col in cols %}
           {{ col }}{% if not loop.last %},{% endif %}
       {% endfor %}
       from users
       ```

    - 數字處理

       ```sql
       {{ 3.14159 | round(2) }}  -- 3.14
       ```

3. 條件與迴圈\
   這部分在 **產生 SQL 動態欄位** 時非常常見

    - if 判斷

       ```sql
       {% if target.name == 'prod' %}
         select * from analytics.users
       {% else %}
         select * from dev.users
       {% endif %}
       ```

    - for 迴圈

       ```sql
       {% for m in ['jan','feb','mar'] %}
         select '{{ m }}' as month
         {% if not loop.last %} union all {% endif %}
       {% endfor %}
       ```