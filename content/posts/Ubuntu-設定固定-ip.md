---
title: Ubuntu 設定固定 ip
date: "2024-06-13 17:40:01"
description: 新舊版 ubuntu image 設定固定 ip 的方式
categories:
  - System 維運遇到的大小事
tags:
  - Ubuntu
cover: /images/posts/covers/ubuntu.jpg
---
## 舊版
### 若可以找到 '/etc/dhcpcd.conf'，則是用此方法

- 利用編輯器修改此文件
```shell
sudo nano /etc/dhcpcd.conf 
```
- 加入以下內容
```shell
interface eth0  **#有線網路**  
static ip_address=192.168.1.35  
static routers=192.168.1.1  
static domain_name_servers=192.168.1.1interface wlan0 **#無線網路**  
static ip_address=192.168.1.35         #想改成的ip地址，可自訂  
static routers=192.168.0.1             #無線基地台地址  
static domain_name_servers=192.168.0.1 #無線基地台地址**#Ctrl+O 存檔，Ctrl+X 跳出 nano** 
```
- 重新開機
```shell
sudo reboot
```

## 新版
### 若無法找到，可使用 nmcli Command
- 利用指令進行設定
```shell
`sudo` `nmcli con mod` `"Your Connection Name"` `ipv4.addresses` `"192.168.1.100/24"` `ipv4.gateway` `"192.168.1.1"` `ipv4.dns` `"8.8.8.8"` `ipv4.method manual` 
```
- 重新啟動 NetworkManager
```shell
sudo systemctl restart NetworkManager
```

ref: [# How to Set Up a Static IP Address on Debian 12 Linux]([How to Set Up a Static IP Address on Debian 12 Linux – Its Linux FOSS](https://itslinuxfoss.com/set-up-static-ip-address-debian-12-linux/))