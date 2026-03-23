---
title: Ubuntu Server 建立 Docker Container For multi-postfix
date: "2024-06-10 10:08:18"
description: 透過 Docker Compose 安裝多個 SMTP 服務，並且配置多個 ip，並設置 DKIM
categories:
  - System 維運遇到的大小事
tags:
  - Docker
  - SMTP
  - Postfix
  - Docker Compose
  - Ubuntu
cover: /images/posts/covers/ubuntu.jpg
---

### 環境版本

- Ubuntu 22.04
- Docker 24.0.7
- Postfix image : boky/postfix

### 注意事項

- 多個ip會需要有一個ip作為主ip，For server 連線
### 設定流程
#### 配ip至網卡上

```shell
sudo nano /etc/netplan/00-installer-config.yaml
## 網卡的addresses新增需要的多個ip
sudo cat /etc/netplan/00-installer-config.yaml
network:
  ethernets:
    ens160:
      addresses:
        - 10.1.11.40/24
        - 10.1.11.41/24
        - 10.1.11.42/24
      nameservers:
        addresses:
          - 8.8.8.8
        search: []
      routes:
      - to: default
        via: 10.1.11.254
  version: 2
```


#### 建立docker network的ipvlan for container使用

##### 注意點 : 因涉及更深層的網路設定，要加強Network Layer 2的相關知識

```shell
sudo docker network create -d ipvlan 
--subnet=10.1.11.0/24 
--gateway=10.1.11.254
-o ipvlan_mode=l2 
-o parent=ens160 
my_ipvlan_network
```

#### 建立container的方式

- 指令建立
    - `sudo docker run -d --name postfix-41 --network my_ipvlan_network --ip 10.1.11.41 postfix-with-nano`
- docker compose建立
    - 可以利用docker compose來建立多個container

##### 檢查docker network與container的網路是否設定正確


```Shell
sudo docker network inspect my_ipvlan
sudo docker inspect postfix_41
```

##### 注意各postfix中的main.cf與master.cf的設定

- Opendkim
  - 於main.cf最後面加入相關內容
```shell
# DKIM
milter_default_action = accept

milter_protocol = 6

smtpd_milters = inet:localhost:8891

non_smtpd_milters = inet:localhost:8891 
```