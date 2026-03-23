---
title: Asp.Net Core DI 生命週期
date: "2024-06-12 12:40:00"
description: 紀錄 Asp.Net Core DI 的生命週期與適用情境
categories:
  - Coding 會遇到的大小事
tags:
  - C#
cover: /images/posts/covers/DI-LifeCycle.jpg
---
## 前言

.Net Core 有內建的 DI Framework，命名空間是 `Microsoft.Extensions.DependencyInjection` ，在使用 DI 容器前要先進行註冊的動作，通常會在 `startup.cs` 的 `ConfigureServices` 或是專案內 IoC 的部分進行註冊。

## 預設的三種方法

- Transient : 每次請求都會產生新的 Instance
- Scoped : 每個 http Request 都會產生新的 Instance
- Singleton : 整個 Application 只會有一個 Instance
!["DI-LifeCycle"](/images/posts/Asp-Net-Core-DI-生命週期/"DI-LifeCycle.jpg")

[Pic Ref]([ASP.NET Core Service Lifetimes (Infographic) (ezzylearning.net)](https://www.ezzylearning.net/tutorial/asp-net-core-service-lifetimes-infographic))

## 各方法適用的情境
- Transient : 適合存留時間短，輕量化、無狀態 ( Stateless ) 服務
- Scoped : 因存留時間和 Client 相同，故適合針對個別請求有不同狀態的服務，如 EF Core 的 DBContext 在未設定生命週期時，預設就為 Scoped
- Singleton : 存留時間和應用程式相同，適合需要在整個應用程式執行期間維持狀態的服務，如 SMTP Service 需要隨時寄信