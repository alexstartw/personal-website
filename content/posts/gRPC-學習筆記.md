---
title: gRPC 學習筆記
date: "2024-06-07 13:35:42"
description: 介紹 gRPC 的基本概念與建立方式
categories:
  - Coding 會遇到的大小事
tags:
  - gRPC
  - C#
cover: /images/posts/covers/grpc.jpg
---
## What is gRPC?

* gRPC 是 Google 開發的 RPC 架構，利用 Protobuf 來進行序列化協定設計
* gRPC 是基於 HTTP/2 設計的
* 需要先行定義出 IDL ( Interface Definition Language ) 描述檔，一種副檔名為`.proto`的檔案

## 建立gRPC Demo
* Rider 建立新專案 - ASP.NET Core Web Application
* Nuget 安裝 - Google.Protobuf.Tools
* Type - gRPC Service

![gRPC-學習筆記1.png](/images/posts/gRPC-學習筆記/gRPC-學習筆記1.png)

* 安裝 Plugin
    * gRPC
![gRPC-學習筆記2.png](/images/posts/gRPC-學習筆記/gRPC-學習筆記2.png)
    * Protocol Buffers
![gRPC-學習筆記3.png](/images/posts/gRPC-學習筆記/gRPC-學習筆記3.png)

* Run 你所建立的 gRPC 專案

* 到 `.proto` 檔，可以模擬 gRPC Client 的行為
![gRPC-學習筆記4.png](/images/posts/gRPC-學習筆記/gRPC-學習筆記4.png)

* 將 localhost 的 port 修改為自己運行時的 port，可以修改大括號的內容，來設定 request 的內容
![gRPC-學習筆記5.png](/images/posts/gRPC-學習筆記/gRPC-學習筆記5.png)

* 運行後即可在下方看到運行結果
![gRPC-學習筆記6.png](/images/posts/gRPC-學習筆記/gRPC-學習筆記6.png)

## 需學習的知識
* proto 的版本差異及語法