---
title: Terraform 基礎介紹
date: "2025-04-29 10:14:15"
description: Terraform 是一個開源的基礎設施即代碼（Infrastructure as Code）工具，允許用戶使用高級語言來定義和提供數據中心的基礎設施。
categories:
  - 資料會遇到的大小事
tags:
  - terraform
  - devops
cover: /images/posts/covers/terraform.png
---

## Terraform 基礎介紹

### 什麼是 Terraform？

**Terraform** 是由 [HashiCorp](https://www.hashicorp.com/) 開發的一個 **基礎設施即程式碼（Infrastructure as Code, IaC）** 工具。

它的主要用途是用程式碼來「定義」、「部署」、「管理」和「版本控制」雲端或本地的基礎設施資源，例如伺服器、資料庫、網路等等。透過 Terraform，我們不再需要手動到 Web 介面開啟一台機器，不再需要手動設定 VPC，只要撰寫好 Terraform 腳本，一個鍵就可以達到你想要做的事情，簡單來說幫助你透過程式碼去管理這些雲端資源。

### Terraform v.s. Kubernetes

簡單的白話意思：

- Terraform 用來建立環境

- Kubernetes 用來建立 service 相關

| 項目 | Terraform | Kubernetes | 
|---|---|---|
| 類型 | Infrastructure as Code 工具 | 容器協調平台（Container Orchestration） | 
| 功能 | 建立與管理**基礎設施資源** | 管理與協調**容器化應用程式** | 
| 用途 | 建立 VM、VPC、DB、Load Balancer、K8s Cluster 等 | 在已存在的 K8s Cluster 中部署應用程式與服務 | 

### 核心概念

- **Infrastructure as Code（IaC）**\
   你用類似程式語言的方式，寫下你想要的基礎設施（例如一台 EC2 機器），Terraform 幫你實際建立出來。

- **宣告式語法（Declarative）**\
   你只需告訴 Terraform 想要的「最終狀態」，它會自己計算出該如何「達成」這個狀態。

- **可重複與可版本控制**\
   像是 Git 可以追蹤你基礎設施的變更，每次改動都有歷史紀錄。

### Terraform 架構與語法

- 使用自己的語言：HCL（HashiCorp Configuration Language）。

- 通常寫在 `.tf` 檔案中，例如 `main.tf`。

   ```powershell
   provider "aws" {
     region = "us-west-2"
   }
   
   resource "aws_instance" "example" {
     ami           = "ami-0c55b159cbfafe1f0"
     instance_type = "t2.micro"
   }
   ```

### 支援哪些平台？

Terraform 支援多種「provider」，也就是它可以幫你控管的服務供應商，像是：

- AWS、Azure、GCP（Google Cloud Platform）

- Kubernetes

- GitHub

- 本地虛擬機（VMWare、VirtualBox）

- 甚至還可以自己寫自定義 provider

### Terraform 有什麼好處？

- 可移植：一樣的設定檔可以套用到不同環境

- 自動化：不用進入 AWS 網頁一個一個點

- 可預覽：任何更動前都可以先知道影響

- 減少人為錯誤：像程式一樣可重複使用與測試



### 常見的建立流程

1. 建立設定檔 → 建立架構給 Terraform 理解

   ```powershell
   # aws_instance -> 資源的種類，目前表示我要 AWS EC2 的虛擬機
   # my_server -> 我取的名稱
   # ami -> 代表 Amazon Machine Image，選擇 OS 的概念
   # instance_type -> 選擇 EC2 的規格，也就是機器的等級
   resource "aws_instance" "my_server" {
     ami           = "ami-abc123"
     instance_type = "t2.micro"
   }
   ```

2. 初始化 \
   第一次使用剛剛的設定檔的話，要先下載需要的 `provider` ，並建立 `.terraform` 的資料夾。

   ```powershell
   terraform init
   ```

3. 預覽\
   會列出要建立哪些資源，以及哪些東西會被更新或是刪除，可以理解成開工前的確認清單。

   ```powershell
   terraform plan
   ```

4. 實際建立\
   Terraform 會依照先前設定的內容，真實的建立相對應的資源。

   ```powershell
   terraform apply 
   ```

5. 拆除原先的內容\
   當想要把建立的東西都拆除，可以配合此指令，Terraform 會依據原版建立的 `.tfstate` 狀態紀錄，將建立的東西拆除。

   ```powershell
   terraform destroy
   ```
