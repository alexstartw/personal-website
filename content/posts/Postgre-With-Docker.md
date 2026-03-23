---
title: PostgreSQL With Docker
date: "2024-06-11 12:19:34"
description: 安裝 PostgreSQL 的基本操作, 並安裝 GUI 工具 pgAdmin4
categories:
  - 資料會遇到的大小事
tags:
  - DataBase
  - PostgreSQL
  - C#
cover: /images/posts/covers/postgresql.png
---

## Docker Version:
`24.0.5, build ced0996`
### 安裝流程
* 拉取最新的 Postgres Image 檔案 : 
```shell
docker pull postgres:latest
```
* 建立 container 並設定密碼 :
```shell
docker run --name my-postgres -p 5432:5432 -e POSTGRES_PASSWORD=admin postgres
```
## Postgres GUI
* PgAdmin4
### 安裝流程
* 拉取最新的 PgAdmin4 Image 檔案 : 
```shell
docker pull dpage/pgadmin4
```
* 建立 container 並設定相關環境變數 : 
```shell
docker run -p 5433:80 -e "PGADMIN_DEFAULT_EMAIL=youremail@gmail.com" -e "PGADMIN_DEFAULT_PASSWORD=yourPwd" -d dpage/pgadmin4
```

* 利用 Browser 就可以從`localhost:5433`登入

### 注意事項
* 如果是用 docker 建立的 postgres container 要注意 ip 的部分，建立 container 的時候若無指定固定 ip ，重開機後 container 的 ip 會被重新分配
