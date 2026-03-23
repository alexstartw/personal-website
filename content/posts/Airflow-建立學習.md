---
title: Airflow 建立學習
date: "2024-09-25 15:11:23"
description: Airflow 的相關知識與建立流程
categories:
  - 深度學習會遇到的大小事
tags:
  - Airflow
  - ETL
  - docker
  - docker-compose
cover: /images/posts/covers/airflow.png
---
## Airflow 基礎知識

### 什麼是 Airflow ?

Airflow 是一個以 Python 做為底層的工作流程管理系統 ( Workflow Management System )，在各種資料工程中是不可或缺的利器。可用來建構可靠的 ETL 與定期的批量處理資料的首選。


### Airflow 架構

![airflow-1.png](/images/posts/Airflow-建立學習/airflow-1.png)

> <https://airflow.apache.org/docs/apache-airflow/stable/concepts/overview.html>

主要分為以下幾種角色：

- Scheduler：排程器，負責安排任務給 Executor 執行。

- Executor：執行器，執行任務的個體，會根據不同需求選用。

- Webserver：建立前端介面的伺服器，可以檢視任務的執行狀況、環境變數與各種設定。

- DAG：有向無環圖（ Directed Acyclic Graph ），一個 DAG 就代表一個排程，Scheduler 會掃描此資料夾並將任務加入排程

- Metadata Database：用來存放登入資訊、環境變數、排程執行結果、log 等資料

## 建立 Airflow

這邊想配合 docker compose 的方法來建立，我們可以先從官方下載指定版本的 `yaml` 來進行安裝。

> <https://airflow.apache.org/docs/apache-airflow/stable/docker-compose.yaml>



可以先建立一個存放相關內容的資料夾再進行各項操作。

```powershell
mkdir airflow
cd airflow
```

這份 `yaml` 定義了以下的服務：

- airflow-init - 初始化所有所需 image 與 database

- airflow-webserver - Flask 為基底的 Airflow UI

- airflow-scheduler

- airflow-worker

- postgres - for metadata

- flower - for Celery 的監控工具

- redis - for Celery 的 queue 機制使用

所有服務都可以使用 `CeleryExecutor`

先利用 `docker-compose up airflow-init` 來建立映像檔

執行 `docker-compose` 後，會有部分資料夾以掛載的形式建立

- `./dag` ：存放寫好的 DAG 文件

- `./logs` ：存放相關的 log

- `./plugins` ：存放自定義的插件

如果有額外的內容需要安裝，則需要建立自己的 image。


+ 附上執行的 `yaml` 檔案

```yaml
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#

# Basic Airflow cluster configuration for CeleryExecutor with Redis and PostgreSQL.
#
# WARNING: This configuration is for local development. Do not use it in a production deployment.
#
# This configuration supports basic configuration using environment variables or an .env file
# The following variables are supported:
#
# AIRFLOW_IMAGE_NAME           - Docker image name used to run Airflow.
#                                Default: apache/airflow:2.10.2
# AIRFLOW_UID                  - User ID in Airflow containers
#                                Default: 50000
# AIRFLOW_PROJ_DIR             - Base path to which all the files will be volumed.
#                                Default: .
# Those configurations are useful mostly in case of standalone testing/running Airflow in test/try-out mode
#
# _AIRFLOW_WWW_USER_USERNAME   - Username for the administrator account (if requested).
#                                Default: airflow
# _AIRFLOW_WWW_USER_PASSWORD   - Password for the administrator account (if requested).
#                                Default: airflow
# _PIP_ADDITIONAL_REQUIREMENTS - Additional PIP requirements to add when starting all containers.
#                                Use this option ONLY for quick checks. Installing requirements at container
#                                startup is done EVERY TIME the service is started.
#                                A better way is to build a custom image or extend the official image
#                                as described in https://airflow.apache.org/docs/docker-stack/build.html.
#                                Default: ''
#
# Feel free to modify this file to suit your needs.
---
x-airflow-common:
  &airflow-common
  # In order to add custom dependencies or upgrade provider packages you can use your extended image.
  # Comment the image line, place your Dockerfile in the directory where you placed the docker-compose.yaml
  # and uncomment the "build" line below, Then run `docker-compose build` to build the images.
  image: ${AIRFLOW_IMAGE_NAME:-apache/airflow:2.10.2}
  # build: .
  environment:
    &airflow-common-env
    AIRFLOW__WEBSERVER__EXPOSE_CONFIG: True
    AIRFLOW__CORE__EXECUTOR: CeleryExecutor
    AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
    AIRFLOW__CELERY__RESULT_BACKEND: db+postgresql://airflow:airflow@postgres/airflow
    AIRFLOW__CELERY__BROKER_URL: redis://:@redis:6379/0
    AIRFLOW__CORE__FERNET_KEY: ''
    AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION: 'true'
    AIRFLOW__CORE__LOAD_EXAMPLES: 'true'
    AIRFLOW__API__AUTH_BACKENDS: 'airflow.api.auth.backend.basic_auth,airflow.api.auth.backend.session'
    # yamllint disable rule:line-length
    # Use simple http server on scheduler for health checks
    # See https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/check-health.html#scheduler-health-check-server
    # yamllint enable rule:line-length
    AIRFLOW__SCHEDULER__ENABLE_HEALTH_CHECK: 'true'
    # WARNING: Use _PIP_ADDITIONAL_REQUIREMENTS option ONLY for a quick checks
    # for other purpose (development, test and especially production usage) build/extend Airflow image.
    _PIP_ADDITIONAL_REQUIREMENTS: ${_PIP_ADDITIONAL_REQUIREMENTS:-}
    # The following line can be used to set a custom config file, stored in the local config folder
    # If you want to use it, outcomment it and replace airflow.cfg with the name of your config file
    # AIRFLOW_CONFIG: '/opt/airflow/config/airflow.cfg'
  volumes:
    - ${AIRFLOW_PROJ_DIR:-.}/dags:/opt/airflow/dags
    - ${AIRFLOW_PROJ_DIR:-.}/logs:/opt/airflow/logs
    - ${AIRFLOW_PROJ_DIR:-.}/config:/opt/airflow/config
    - ${AIRFLOW_PROJ_DIR:-.}/plugins:/opt/airflow/plugins
  user: "${AIRFLOW_UID:-50000}:0"
  depends_on:
    &airflow-common-depends-on
    redis:
      condition: service_healthy
    postgres:
      condition: service_healthy

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: airflow
      POSTGRES_PASSWORD: airflow
      POSTGRES_DB: airflow
    volumes:
      - postgres-db-volume:/var/lib/postgresql/data
    ports:
      - 5432:5432
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "airflow"]
      interval: 10s
      retries: 5
      start_period: 5s
    restart: always

  redis:
    # Redis is limited to 7.2-bookworm due to licencing change
    # https://redis.io/blog/redis-adopts-dual-source-available-licensing/
    image: redis:7.2-bookworm
    expose:
      - 6379
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 30s
      retries: 50
      start_period: 30s
    restart: always

  airflow-webserver:
    <<: *airflow-common
    command: webserver
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: always
    depends_on:
      <<: *airflow-common-depends-on
      airflow-init:
        condition: service_completed_successfully

  airflow-scheduler:
    <<: *airflow-common
    command: scheduler
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:8974/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: always
    depends_on:
      <<: *airflow-common-depends-on
      airflow-init:
        condition: service_completed_successfully

  airflow-worker:
    <<: *airflow-common
    command: celery worker
    healthcheck:
      # yamllint disable rule:line-length
      test:
        - "CMD-SHELL"
        - 'celery --app airflow.providers.celery.executors.celery_executor.app inspect ping -d "celery@$${HOSTNAME}" || celery --app airflow.executors.celery_executor.app inspect ping -d "celery@$${HOSTNAME}"'
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    environment:
      <<: *airflow-common-env
      # Required to handle warm shutdown of the celery workers properly
      # See https://airflow.apache.org/docs/docker-stack/entrypoint.html#signal-propagation
      DUMB_INIT_SETSID: "0"
    restart: always
    depends_on:
      <<: *airflow-common-depends-on
      airflow-init:
        condition: service_completed_successfully

  airflow-triggerer:
    <<: *airflow-common
    command: triggerer
    healthcheck:
      test: ["CMD-SHELL", 'airflow jobs check --job-type TriggererJob --hostname "$${HOSTNAME}"']
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: always
    depends_on:
      <<: *airflow-common-depends-on
      airflow-init:
        condition: service_completed_successfully

  airflow-init:
    <<: *airflow-common
    entrypoint: /bin/bash
    # yamllint disable rule:line-length
    command:
      - -c
      - |
        if [[ -z "${AIRFLOW_UID}" ]]; then
          echo
          echo -e "\033[1;33mWARNING!!!: AIRFLOW_UID not set!\e[0m"
          echo "If you are on Linux, you SHOULD follow the instructions below to set "
          echo "AIRFLOW_UID environment variable, otherwise files will be owned by root."
          echo "For other operating systems you can get rid of the warning with manually created .env file:"
          echo "    See: https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html#setting-the-right-airflow-user"
          echo
        fi
        one_meg=1048576
        mem_available=$$(($$(getconf _PHYS_PAGES) * $$(getconf PAGE_SIZE) / one_meg))
        cpus_available=$$(grep -cE 'cpu[0-9]+' /proc/stat)
        disk_available=$$(df / | tail -1 | awk '{print $$4}')
        warning_resources="false"
        if (( mem_available < 4000 )) ; then
          echo
          echo -e "\033[1;33mWARNING!!!: Not enough memory available for Docker.\e[0m"
          echo "At least 4GB of memory required. You have $$(numfmt --to iec $$((mem_available * one_meg)))"
          echo
          warning_resources="true"
        fi
        if (( cpus_available < 2 )); then
          echo
          echo -e "\033[1;33mWARNING!!!: Not enough CPUS available for Docker.\e[0m"
          echo "At least 2 CPUs recommended. You have $${cpus_available}"
          echo
          warning_resources="true"
        fi
        if (( disk_available < one_meg * 10 )); then
          echo
          echo -e "\033[1;33mWARNING!!!: Not enough Disk space available for Docker.\e[0m"
          echo "At least 10 GBs recommended. You have $$(numfmt --to iec $$((disk_available * 1024 )))"
          echo
          warning_resources="true"
        fi
        if [[ $${warning_resources} == "true" ]]; then
          echo
          echo -e "\033[1;33mWARNING!!!: You have not enough resources to run Airflow (see above)!\e[0m"
          echo "Please follow the instructions to increase amount of resources available:"
          echo "   https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html#before-you-begin"
          echo
        fi
        mkdir -p /sources/logs /sources/dags /sources/plugins
        chown -R "${AIRFLOW_UID}:0" /sources/{logs,dags,plugins}
        exec /entrypoint airflow version
    # yamllint enable rule:line-length
    environment:
      <<: *airflow-common-env
      _AIRFLOW_DB_MIGRATE: 'true'
      _AIRFLOW_WWW_USER_CREATE: 'true'
      _AIRFLOW_WWW_USER_USERNAME: ${_AIRFLOW_WWW_USER_USERNAME:-airflow}
      _AIRFLOW_WWW_USER_PASSWORD: ${_AIRFLOW_WWW_USER_PASSWORD:-airflow}
      _PIP_ADDITIONAL_REQUIREMENTS: ''
    user: "0:0"
    volumes:
      - ${AIRFLOW_PROJ_DIR:-.}:/sources

  airflow-cli:
    <<: *airflow-common
    profiles:
      - debug
    environment:
      <<: *airflow-common-env
      CONNECTION_CHECK_MAX_COUNT: "0"
    # Workaround for entrypoint issue. See: https://github.com/apache/airflow/issues/16252
    command:
      - bash
      - -c
      - airflow

  # You can enable flower by adding "--profile flower" option e.g. docker-compose --profile flower up
  # or by explicitly targeted on the command line e.g. docker-compose up flower.
  # See: https://docs.docker.com/compose/profiles/
  flower:
    <<: *airflow-common
    command: celery flower
    profiles:
      - flower
    ports:
      - "5555:5555"
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:5555/"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: always
    depends_on:
      <<: *airflow-common-depends-on
      airflow-init:
        condition: service_completed_successfully

volumes:
  postgres-db-volume:

```

### Docker 建立 Airflow

利用 Docker 建立 Airflow 十分簡單，在下載完成提供的範例 `yaml` 檔案後，可以針對自己需求進行修改。

下述連結可以搜尋所需功能

> <https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html>


1. 初始化 database，並建立使第一個使用者

   ```powershell
   docker-compose up airflow-init
   ```

   第一個用戶的名稱與密碼皆為 `airflow`

2. 運行 airflow

   ```powershell
   docker-compose up
   ```

3. 訪問 airflow，我們目前以 Web UI 來進行訪問

    1. CLI Commands

    2. Web UI：`http://localhost:8080`

    3. API

### 實際建立問題

在於 ubuntu 建立時，可能會遇到權限問題導致在操作 `docker-compose` 失敗，可以參考這篇文章來修改。



本次的做法是針對所需的資料夾進行權限的修改

```powershell
# 位置在跟 docker-compose.yml 同層
mkdir -p dags logs plugins
chown 50000:50000 dags logs plugins
```

> <https://github.com/helm/charts/issues/23589>

### Airflow Configuration

以 docker-compose 建立起來的 airflow webServer，預設為無法看到 airflow 的相關設定。

需在建立 container 的時候給定環境變數來進行設定：

`AIRFLOW__WEBSERVER__EXPOSE_CONFIG: True`

設定完成後再重新建立 airflow 的 image 檔案，並重新啟動即可，要注意環境變數的設定位置是在 `x-airflow-common` 的 `environment` 內，而不是 `services` 內的。

### 建立 Airflow 帳號

我們會利用 Airflow CLI 進行用戶的建立，首先要進入 Airflow Web Server 的 container

```powershell
docker exec -it <airflow-webserver-container-name> /bin/bash
```

並利用以下指令進行新增使用者與設定權限

```powershell
airflow users create \
  --username <username> \
  --password <password> \
  --firstname <firstname> \
  --lastname <lastname> \
  --role <role> \
  --email <email>
```

一般 Airflow 的預設角色會有

- Admin：所有權限都有

- User：可以查看與執行任務，但無法修改 DAG 或配置

- Op：可以查看與操作任務，但沒有編輯權限

- Viewer：只能查看 DAG 與任務狀態，不能修改與執行

#### 進階角色權限設定

若想要針對角色進行更進階的權限設定，可以從 airflow 的 database 進行設定。

後續再依照需求進行新增角色或修改。

以下紀錄相關內容的表格：

- `ab_role` ：紀錄角色的權限

- `ab_user` ：紀錄使用者資訊

- `ab_user_role` ：使用者與角色的對應表

- `ab_view_menu` ：所有在 airflow 能看到的頁面

- `ab_permission`：CRUD 的權限 key value

- `ab_permission_view` ：各頁面的權限對應表

- `ab_permission_view_role` ：設立各角色在各頁面的相關權限

### 各項細部介紹

#### Metadata Database

負責儲存與管理 Airflow 的工作流程與任務相關的數據

1. 儲存 DAG 定義與狀態：可以讓 Airflow 追蹤每個 DAG 的運行情況，方便監控與排查問題。

2. 任務調度與依賴管理：Scheduler 會從這邊讀取 DAG 的定義與任務依賴關係，依據設定決定何時執行任務。

3. 執行紀錄與審計：儲存了過去所有執行的任務歷史紀錄，不論成功與失敗的狀態、重試次數等，對於後續分析是必要的資料。

4. 存取 XCom 資料：Cross-Communication ，是一個任務間傳遞小數據的機制，因大部分會期望任務間要獨立，用此技術來解決例外狀況。

5. 工作池與佇列管理：會紀錄 worker pools 與任務佇列的訊息，來幫助分配資源

#### Scheduler + Executor

##### Scheduler

負責根據 DAG 的定義來決定什麼時候要觸發任務的執行。

主要具體功能項目：

1. 任務排程：會定期檢查 DAG 的定義，並依據定義的調度規則來判斷什麼時候該執行任務。

2. 處理依賴關係：會檢查各任務之間的依賴關係，確保只有當前任務的前置任務都完成，才會啟動任務。

3. 分配任務到 Executor

4. 監控 DAG 的健康狀態：會在任務發生錯誤或超時的情況觸發重試或警報

##### Executor

是一個 queue process，接收來自 Scheduler 分配的 Task，並將相關資訊存進 queue，再從 queue 中取出 Task 給閒置的 Worker 執行。



屬於實際執行任務的組件，控制多個 worker 執行，有多種 Executor 可以依照情境去選擇，下面列出兩種大方向：

- Local Executors：

    1. SequentialExecutor：最簡單的 Executor，一次僅允許執行一個任務。

    2. LocalExecutor：可以利用多處理器來執行多個任務。

- Remote Executors：

    1. CeleryExecutor：使用 Celery 和分散式 queue，來分配和調度任務，可以分配到多個 worker 節點進行分布式執行。

    2. KubernetesExecutor：會在 Kubernetes 集群運行，每個任務會在自己的隔離環境中執行。

##### Worker 介紹

###### 主要功能

- 執行任務：每個任務的執行結果會被回報給 Scheduler

- 處理併發任務：依照所選擇的 Executor，會有不同的處理任務能力

- 監控任務執行情況

###### 查看相關設定

- 不是以 docker-compose 安裝的：

    - 可以從 UI 介面找到，或是安裝目錄下 `~/airflow/airflow.cfg`

- 以 docker-compose 安裝的：

    - 進入建立的 container 並找到檔案

       ```powershell
       # get into container
       docker exec -it <airflow-webserver-container-name> /bin/bash
       
       # move to file path
       cd /opt/airflow
       ls
       cat airflow.cfg
       ```