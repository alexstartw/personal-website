---
title: RESTful API 工具簡介
date: "2025-07-08 18:01:50"
description: RESTful API 工具簡介，介紹 Postman 和 Swagger 的使用方法。
categories:
  - 開發 Tips
tags:
  - RESTful API
  - Postman
  - Swagger
cover: /images/posts/covers/restful-api.png
---
## RESTful API 簡介

是一種能讓兩個電腦系統安全的透過網路交換資訊的介面。基於 HTTP 的風格設計與他人進行通信，數據通常以 JSON 或 XML 進行傳遞。

### 主要特點

- 無狀態：每次的 request 都是獨立的，server 不會保留 client 的狀態，每次 request 需包含完成操作所需的所有訊息。

- 資源導向：每個 URL 代表一個具體的資源，這些資源可以是 database 中的數據或是文件。

- 統一接口：針對 CRUD 的操作，都通過 HTTP 的方法來實現

### 主要優點

- 簡單易懂：可以透過 GET、POST、PUT、DELETE 等方法來操作資源，易於理解與使用。

- 靈活度高：可以跨設備進行通訊，如 Web 端、移動端、IoT設備。

- 無狀態交互：每個 request 都是無狀態，降低 server 的負擔。

- 兼容性好：可以用瀏覽器或是一些 Http 工具進行測試與開發

## FastAPI With Swagger

主要用意是建立一個簡單能運行的 endpoint 供測試 postman 與

swagger 的應用。

### 引用套件

```python
from fastapi import FastAPI
import uvicorn

from datetime import datetime
```

### 建立 Endpoint

利用 `uvicorn` 建立一個 asynicio 服務器，來建立接下來使用的 server。

Endpoint 分別以 `GET` `POST` `DELETE` 建立進行測試，有額外的一些簡單 function，這邊就不詳述 function 內容。

```python
app = FastAPI()

@app.get("/get_local_storage")
async def get_local_storage():
    return {"local_storage": calculator.get_local_storage()}

@app.post("/add/")
async def add(a: int, b: int):
    return {"result": calculator.add(a, b)}

@app.delete("/delete_local_storage")
async def delete_local_storage():
    calculator.delete_local_storage()
    return {"message": "Local storage is deleted"}

if __name__ == "__main__":
    uvicorn.run(app)
```

## 呼叫 API

### GET Method

#### By Postman

先行設置好 url 後，因為不需在 request 上帶任何 params，故可以直接啟動 server 即可呼叫。

![Restful-1.png](/images/posts/RESTful-API-工具簡介/Restful-1.png)

#### By Swagger

在本機運行的話，可以到 `http://localhost:<運行port>/docs` 即可進到 Swagger 的 UI 介面。

![Restful-2.png](/images/posts/RESTful-API-工具簡介/Restful-2.png)


### POST Method

#### By Postman

帶上所需的 params 進行加法運算。

![Restful-3.png](/images/posts/RESTful-API-工具簡介/Restful-3.png)

#### By Swagger

![Restful-4.png](/images/posts/RESTful-API-工具簡介/Restful-4.png)

## Postman 簡介

是一個可以模擬 Http Request 的工具，包含常見的 request 方式，如：GET、POST、PUT、DELETE，主要功能為測試自己開發的 API 是否能夠正常的運作，並且得到正確的結果。

進階功能包含可以針對 server 進行壓力測試，或是批次執行的 request。

### 基本操作

#### 新增一個新的 Request 頁籤

從左上角 `New` 的按鈕可新增，並選用 `HTTP` 。

![Restful-5.png](/images/posts/RESTful-API-工具簡介/Restful-5.png)

![Restful-6.png](/images/posts/RESTful-API-工具簡介/Restful-6.png)

#### Request 頁籤

在使用上我們先專注在 Request 頁籤

這三大區塊分別意義為

- URL：選擇 API 的方法、Request 的 URL

- Params：可以詳細的設定 API 的參數，如：Header、Body

- Response：檢視回應的資料

![Restful-7.png](/images/posts/RESTful-API-工具簡介/Restful-7.png)