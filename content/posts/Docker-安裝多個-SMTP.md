---
title: Docker Compose 安裝多個 SMTP
date: "2024-06-09 11:27:07"
description: 透過 Docker Compose 安裝多個 SMTP 服務，並且透過 Postfix 來實現。
categories:
  - System 維運遇到的大小事
tags:
  - Docker
  - SMTP
  - Postfix
  - Docker Compose
cover: /images/posts/covers/docker-compose.jpeg
---
## 期望達成的目標 : 一個 container 安裝一個 SMTP

### Docker network 模式

1. None : 網路功能關閉，無法連線Container
2. Host : Container 擁有跟實體主機相同的網路設定
3. Bridge : 類似於 NAT 的網路模式，啟動 docker 時會有一個 docker0 的網卡來做網路的橋接

### Docker Network Bridge Mode V.S. Ubuntu Bridge Mode

1. 隔離性與用途
    1. Docker Network : 為容器提供網路隔離
    2. Ubuntu : 提供虛擬機或主機網路設備的連接
2. IP Address 的分配
    1. Docker Network : Container 可以共享相同的 IP Address 範圍
    2. Ubuntu : 每個橋接的設備通常會有獨立的 IP Address


### 注意事項
* 不需要設定 host 的網路 ( 只需先將多個 ip 配置完成 )
* Ubuntu 的 **net-tools** 開發者已不維護，改為使用 **netplan**


### 使用指令 :

* 利用 Port Publish 來分配 host 的網路給 Container

`docker run -d --name=smtp40 --network=bridge -p 10.1.11.40:25:25 -e "ALLOW_EMPTY_SENDER_DOMAINS=true" boky/postfix`

### 查詢目前 Container 的 ip
`docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq)`


### Docker compose

#### 一次部屬多台

```yaml
version: "3.8"

name: "popo_multi"

services:

  smtp01:

    image: postfix-with-nano

    container_name: smtp01

    networks:

      - bridge

    ports:

      - "10.1.11.40:25:25"

    environment:

      ALLOW_EMPTY_SENDER_DOMAINS: "true"

  smtp02:

    image: postfix-with-nano

    container_name: smtp02

    networks:

      - bridge

    ports:

      - "10.1.11.41:25:25"

    environment:

      ALLOW_EMPTY_SENDER_DOMAINS: "true"

  smtp03:

    image: postfix-with-nano

    container_name: smtp03

    networks:

      - bridge

    ports:

      - "10.1.11.42:25:25"

    environment:

      ALLOW_EMPTY_SENDER_DOMAINS: "true"

  

networks:

  bridge:

    driver: bridge 
```
