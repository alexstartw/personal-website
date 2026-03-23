---
title: PgBouncer 安裝學習
date: "2024-06-11 11:56:58"
description: 安裝 PgBouncer 的基本操作
categories:
  - 資料會遇到的大小事
tags:
  - DataBase
  - PostgreSQL
  - C#
cover: /images/posts/covers/postgresql.png
---

## 簡介
-  PostgreSQL 對於一個連線的 Session ，會開一個 Unix Socket 來進行連線，如果頻繁連線斷線，對於 PostgreSQL 消耗過大
- 為了對應短暫交易的活動類型，我們會利用 Connection Pooling 程式，來 hold 住部分 PostgreSQL 的 Session ，來分配以應付外部連線。
- 公司專案選擇以 PgBouncer 來管理這部分
###  PgBouncer 連線控制
- 分為三種層級
    - Session Pooling - 對於連線請求，分一個 Session 直到連線結束 **( 預設模式 )**
    - Transaction Pooling - 一次 Transaction 結束，歸還連線
    - Satement Pooling - 一個 Query 結束，歸還連線
- 運作模式
    - 當收到連線請求，會先查看是否有空出來的 Pool 可以連接，若無，在沒有達到 max_connections 的情況，會建立一個連線到 Pool提供連線，否則會安排等待有空閒的連線被釋放回 Pool。
- 本身組成
    - 程式本身 (/usr/bin/pgbouncer)
    - 設定檔
        - pgbouncer.ini
        - userlist.txt
    - 預設 Port : 6432

## 安裝流程
- 先行安裝 PostgreSQL
- DockerFile 如下， 相關的密碼會放在 '.env' 內來做控管
```yaml
version: "3.7"  
  
services:
	postgres:  
	  image: postgres:16.2  
	  build:  
	    context: ./src/infra/postgres-sql/  
	    dockerfile: Dockerfile  
	  restart: always  
	  volumes:  
	    - postgres-data:/var/lib/postgresql/data  
	    - ./src/infra/postgres-sql:/docker-entrypoint-initdb.d  
	  environment:  
	    POSTGRES_USER: postgres  
	    POSTGRES_PASSWORD: ${ROOT_PWD}  
	    POSTGRES_PGBOUNCER_USERNAME: pgbouncer  
	    POSTGRES_PGBOUNCER_PASSWORD: ${PGBOUNCER_PWD}  
	    LANG: zh_TW.UTF-8  
	  networks:  
	    - default  
	  expose:  
	    - 5432  
	  ports:  
	    - 5432:5432
volumes:  
  postgres-data:  

networks:  
    default:  
      name: default
```
- 相同利用 DockerFile 來安裝PgBouncer
```yaml
version: "3.7"  
  
services:  
  pgbouncer:  
    image: pgbouncer:1.22.0-p0  
    build:  
      context: ./src/infra/pg-bouncer/  
      dockerfile: Dockerfile  
    volumes:  
      - pgbouncer-data:/data  
    environment:  
      PGBOUNCER_USERNAME: pgbouncer  
      PGBOUNCER_PASSWORD: ${PGBOUNCER_PWD}  
    expose:  
      - 6432  
    ports:  
      - 6432:6432  
    depends_on:  
      - postgres 
volumes:
  pgbouncer-data:
```

### 提醒
- 需自行至 pgbouncer 內設定 userlist.txt 的使用者與密碼
- 流程如下
    1. 先進入 PostgreSQL 的任意 script， 利用以下 SQL 來取得 `pgbouncer` 的 **SHA256** 密碼
  ```SQL
  SELECT rolpassword
  FROM pg_authid
  WHERE rolname = 'pgbouncer';
  ```
    2. 進入 PgBouncer 的 Container， 至 `/data/userlist.txt` 新增 `pgbouncer` 的密碼

  ```txt
   "pgbouncer" "SCRAM-SHA-256$4096:password"
  ```

- 如此便可正常以 pgbouncer 來管理 PostgreSQL 的 Connection Pool 了