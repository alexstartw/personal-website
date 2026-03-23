---
title: Airflow + MLflow 建立
date: "2024-10-01 15:04:58"
description: Airflow + MLflow 建立，並使用同一個 Postgres 資料庫
categories:
  - 深度學習會遇到的大小事
tags:
  - Airflow
  - MLflow
  - docker
  - docker-compose
cover: /images/posts/covers/mlflow.jpg
---
## PostgreSQL 建立

由於 Airflow 與 MLflow 都需要使用 PostgreSQL 作為資料庫，因此可以減少資源，將其合併，並使用 Docker Compose 來管理。
先建立 Airflow 與 MLflow 共用的 PostgreSQL Container，兩個分開使用不同資料庫即可。

```powershell
docker-compose -f postgres.yml up -d
```

```yaml
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: USERNAME
      POSTGRES_PASSWORD: PASSWORD
      POSTGRES_DB: DBNAME
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./initdb.sh:/docker-entrypoint-initdb.d/initdb.sh  # 新增初始化腳本

volumes:
  postgres_data:
```

再配合腳本，建立兩個服務分別需要的 database，方便後續使用。

```bash
#!/bin/bash
set -e

# 使用 PostgreSQL 的 psql 命令創建兩個新的資料庫
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE airflow;
  CREATE DATABASE mlflow;
EOSQL
```

## Airflow 建立
可以參考原先的 [Airflow 建立](https://alexliyu.gitlab.io/Notes/2024/09/25/Airflow-%E5%BB%BA%E7%AB%8B%E5%AD%B8%E7%BF%92/?highlight=air)
需要注意的點在於 `postgres` 的連線字串要設定正確，否則在 Airflow initdb 時會出現錯誤。

## MLflow 建立

MLflow 建立會需要配合 `Dockerflie` 建立出所需之 image 後，才進行 `docker-compose` 。

### Dockerfile

```dockerfile
# 使用 Python 3.8 slim 基礎映像
FROM python:3.8-slim

# 安裝必要的系統依賴
RUN apt-get update && apt-get install -y \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# 安裝 MLflow 和 PostgreSQL 驅動
RUN pip install mlflow psycopg2-binary

# 創建工作目錄
WORKDIR /mlflow

# 暴露 MLflow 伺服器默認端口
EXPOSE 5000

# 定義 MLflow 伺服器啟動命令
CMD mlflow server \
    --backend-store-uri postgresql://postgres_admin:54290414@postgres/mlflow \
    --default-artifact-root /mlflow/artifacts \
    --host 0.0.0.0 \
    --port 5000
```

### YAML 設定

運行以下指令，即可建立起 MLflow

```powershell
docker-compose -f mlflow.yml up -d
```

```yaml
version: '3'
services:
  mlflow:
    build: .  # 使用 Dockerfile 來構建自定義映像
    environment:
      BACKEND_STORE_URI: postgresql://USERNAME:PASSWORD@localhost:5432/mlflow
      ARTIFACT_STORE_URI: /mlflow/artifacts
      MLFLOW_TRACKING_URI: http://0.0.0.0:5000
    volumes:
      - ./mlruns:/mlflow/mlruns
      - ./artifacts:/mlflow/artifacts
    ports:
      - "5000:5000"

volumes:
  postgres_data:

```
