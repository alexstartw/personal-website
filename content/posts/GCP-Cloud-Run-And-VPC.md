---
title: GCP Cloud Run 與 Comput Engine 比較與部署流程
date: "2025-07-31 11:17:55"
description: GCP Cloud Run 是 Google Cloud 提供的全代管無伺服器容器執行環境，本文介紹其特點、部署流程及與 Compute Engine 的比較。
categories:
  - Coding 會遇到的大小事
tags:
  - Google Cloud
  - Cloud Run
cover: /images/posts/covers/cloudrun.png
---

## GCP Cloud Run：無伺服器容器執行環境

**Cloud Run** 是 Google Cloud 提供的全代管（fully managed）無伺服器平台，用於執行容器化應用。它支援以任何語言或框架寫成的應用程式，只要包成容器即可部署。

- **部署簡單：** 只需提供容器映像，系統自動處理基礎設施。

- **自動擴縮：** 根據請求量自動調整實例數量（甚至可降至 0）。

- **無伺服器計價：** 只在實際請求時計費，適合突發性流量。

- **整合 IAM、日誌、監控等 GCP 原生服務。**

**適用場景：**

- REST API、Webhook

- 事件觸發的服務

- 部署快速、彈性需求高的應用

## Compute Engine：自管虛擬機（VM）

**Compute Engine** 提供高效能、可客製化的虛擬機（VM），讓使用者可完全控制作業系統與軟體環境。

- **完整控制：** 支援 SSH 登入、安裝任何軟體、管理作業系統。

- **彈性設定：** 可調整 CPU、記憶體、磁碟空間等硬體資源。

- **穩定性強：** 適合長期執行的工作負載與資料儲存。

- **支援內部連線、固定 IP、容錯機制等企業級功能。**

**適用場景：**

- 長時間執行的後端系統（e.g., Redis、Postgres）

- 需安裝特定依賴或需 root 權限的應用

- 複雜資料處理工作或內網整合任務

## 兩者比較


| 項目 | **Cloud Run** | **Compute Engine** | 
|---|---|---|
| 管理模式 | 無伺服器（Fully Managed） | 自行管理 VM | 
| 部署方式 | 容器映像（Container Image） | 自行安裝系統與應用 | 
| 擴展能力 | 自動擴縮（到 0） | 手動設定或透過 Instance Group 管理 | 
| 維運負擔 | 幾乎無（GCP 管理底層資源） | 需自行維運作業系統、更新、監控等 | 
| 成本結構 | 按請求時間與數量計費 | 按實例運行時間計費（不論是否處理請求） | 
| 適用場景 | 短時請求、高並發、API、Webhook 等 | 長時間執行、具狀態性服務、資料庫等 | 
| 網路存取 | 支援 VPC 設定與私網連線 | 預設支援內外網連線 | 

### 小結建議

- 若你需要**快速部署、擴縮彈性且維護成本低**的服務，選擇 **Cloud Run**。

- 若你的服務需要**持續運行、特定軟體控制、內部整合**或是類似傳統伺服器的操作，則使用 **Compute Engine** 較為適合。


## Cloud Run 部署流程

當你要將一個應用程式部署到 **Cloud Run** 時，整體流程會包含將你的程式碼打包為 Docker 映像檔（image），上傳到 Container Registry（或 Artifact Registry），然後部署到 Cloud Run。以下是完整流程整理：

1. 準備專案

2. 撰寫 Dockerfile 並測試

    1. 要注意 build 出來的 image 要有正確的 tag

       ```bash
       # 類似如下
       docker build -t gcr.io/[PROJECT_ID]/my-app .
       ```

3. 建立 image 與上傳到 GCP Artifact Registry，在上面可以管理各項版本的 Image

    ![cloudrun-1.png](/images/posts/GCP-Cloud-Run-And-VPC/cloudrun-1.png)

    1. 在 Artifact Registry 建立 repo，可以配合 `gcloud` 指令或是 `docker` 手動推送

       ```bash
       # gcloud command
       gcloud builds submit --tag [REGION]-docker.pkg.dev/[PROJECT_ID]/[REPO_NAME]/my-app
       
       # local docker command
       docker build -t gcr.io/[PROJECT_ID]/my-app .
       docker push gcr.io/[PROJECT_ID]/my-app
       ```

4. 部署到 Cloud Run

5. 環境變數設定：原先在 `.env` 的相關環境變數，要在編輯容器中進行相關環境變數設定，如下圖。
    ![cloudrun-2.png](/images/posts/GCP-Cloud-Run-And-VPC/cloudrun-2.png)

## VPC 內網設定

有時候利用外網連線會相對慢，所以會考慮相關流量走內網。當你想讓 **Cloud Run 與 Compute Engine（VM）之間走 VPC 內網** 通訊（例如讓 Cloud Run 存取 VM 裡的 Redis/PostgreSQL），你需要建立與設定 **虛擬私有雲（VPC）**，並透過 **VPC 連線器（VPC connector）** 讓 Cloud Run 流量導向內部網路。

### 一、什麼是 VPC？

VPC（Virtual Private Cloud）是 Google Cloud 中的虛擬網路，提供：

- IP 範圍（CIDR）

- 子網路（Subnets）

- 防火牆控制

- 內部通訊（私有 IP）

### 二、你會用到哪些服務？

| 名稱 | 用途 | 
|---|---|
| **VPC 網路** | 提供 VM 和 Cloud Run 共用的內部網路 | 
| **VPC 連線器** | 讓 Cloud Run 可以進入 VPC | 
| **Cloud Run 網路設定** | 指定 Cloud Run 要使用哪個連線器 | 
| **防火牆規則** | 控制 VM 是否接受來自 Cloud Run 的內部流量 | 

### 三、設定流程概要

1. 建立 VPC 連線器

    1. `range` 是連線器的 IP 池（不能和現有子網重疊）

    2. 建立後會看到一個自己命名好的資源
        ![cloudrun-3.png](/images/posts/GCP-Cloud-Run-And-VPC/cloudrun-3.png)

2. 設定 Cloud Run 使用該 VPC 連線器

    1. 透過 GCP Console 設定「連線至虛擬私有雲，以傳出流量」，然後指定連線器

### 四、設定環境變數

1. 在 `Cloud Run` 選用 VPC 連線器

2. 將所有所需的服務在環境變數內利用內網的 url 進行設定
