---
title: dlthub 簡介與小型範例
date: "2024-12-12 13:32:39"
description: 嘗試使用近期新出的 dlthub 來進行資料的 ETL，並且透過 Python 來實現。
categories:
  - 資料會遇到的大小事
tags:
  - dlthub
  - etl
  - data
  - python
cover: /images/posts/covers/dlthub.png
---

## 簡介

dltHub 提供多種功能，專注於簡化數據加載和處理的流程，特別是針對 Python 開發者。他提供一個開源的 Python 程式庫，稱為 dlt（Data Load Tool），旨在幫助用戶輕鬆地從各種數據來源（如 API、文件和數據庫）加載數據，用戶無需設置傳統的 ETL 平台，只需使用簡單的 Python 代碼即可快速構建自定義數據管道，這使得數據處理變得更加高效。

![dlthub workflow](https://dlthub.com/docs/assets/images/architecture-diagram-d146374c28081499d93f856effdab734.png)

## 範例

此範例參照 <https://github.com/dlt-hub> 中的 Colab Demo 來運行。



1. 安裝 `dlt` 與所需的 database 套件，這邊使用 `duckdb` 進行嘗試

   ```powershell
   pip install "dlt[duckdb]"
   ```

2. 引用 `dlt` 並且建立出資料的 pipeline

   ```python
   import dlt
   
   pipeline = dlt.pipeline(
       pipeline_name="pokemon_pipeline",
       destination="duckdb",
       dataset_name="pokemon_data_1",
   )
   ```

3. 取得資料，這邊資料會要以 `list` 的格式方便後續使用

   ```python
   from dlt.sources.helpers import requests
   
   POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/"
   data = requests.get(POKEMON_URL).json()["results"]
   ```

4. 執行 pipeline，可獲得以下輸出

   ```python
   load_info = pipeline.run(data, table_name="pokemon")
   print(load_info)
   ```
    ![dlthub-1.png](/images/posts/dlthub-簡介與小型範例/dlthub-1.png)

5. 可以到 `duckdb` 檢視輸入的資料，這邊使用 `dbeaver` 來看資料，注意 `duckdb` 只能同時有一個連線，所以**檢視資料**跟**寫入資料**只能二擇一。

    ![dlthub-2.png](/images/posts/dlthub-簡介與小型範例/dlthub-2.png)

## 各項目解說

### Source & Resource

- Source

  整理資料來源時，可以使用 `dlt.resource` 來進行各種資料的收集，注意要加上裝飾器 `dlt.source` ，以及用 `yield` 進行回傳，否則後續針對 `source` 的部分 function 會無法使用。

   ```python
   # Fetch the data
   @dlt.source
   def pokemon_data(num_pokemon: int = 151):
       POKEMON_URL = f"https://pokeapi.co/api/v2/pokemon?limit={num_pokemon}"
       data = requests.get(POKEMON_URL).json()["results"]
       yield dlt.resource(data, name="pokemon_data")
   
   # Collect resources
   source = dlt.resource(data, name="pokemon_data")
   
   # Print names od all resources
   print(source.resources.keys())
   
   # Get target data
   source.with_resources("pokemon_data")
   ```

  更多相關使用可以到 <https://dlthub.com/docs/general-usage/source> 進行搜尋。

- Resource\
  在取得資料後，要針對資料進行整理，可以配合以下方式，針對 `schema` 等相關內容進行處理

   ```python
   @dlt.resource(name='pokemon_list', write_disposition='replace')
   def generate_rows():
       for i, poke in enumerate(source.with_resources("pokemon_data")):
           yield {'id': i+1, 'name': poke['name']}
   
   for row in generate_rows():
       print(row)
   
   @dlt.source
   def source_name():
       return generate_rows
   
   for row in source_name().resources.get('pokemon_list'):
       print(row)
   ```

    - `@dlt.resource`

        - 用來定義一個資源，可以生成數據，這些資源通常用於將數據寫入目標的資料庫或是表之中。

        - `name` 可以指定 table 名稱、`write_disposition` 指定數據在目標位置的加載方式，如 `append` 、`replace` 、`merge`

    - `@dlt.source`

        - 用來定義一個數據源，通常用於外部系統或資料庫中提取數據，數據源可以是 API、文件系統或其他資料庫，主要用於提取與處理原始數據，以便後續使用。

  更多更詳細的設定，可以參考 <https://dlthub.com/docs/general-usage/resource>



### Pipeline

建立 Pipeline 來將資料從 code 中實際放到目的地，可以接收 `resource` 也可以 `source` 。Pipeline 會自動協助建立相關 columns ，若要進行更細緻的建立也可以，



```python
# Create a pipeline
pipeline = dlt.pipeline(
    pipeline_name="pokemon_pipeline", # set pipeline name
    destination="duckdb",             # 也可以在 run 的時候再提供
    dataset_name="pokemon_data", 
    progress="log"                    # 可以設定是否顯示過程
)

load_info = pipeline.run(pokemon_rows, table_name="pokemon_list")
print(load_info)
```