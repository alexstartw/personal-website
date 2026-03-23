---
title: ssh-key 連線 Gitlab
date: "2024-10-28 16:03:20"
description: 解決 ssh-key 連線 Gitlab 的問題
categories:
  - Coding 會遇到的大小事
tags:
  - ssh
  - Gitlab
cover: /images/posts/covers/ssh.png
---



## ssh-key 連線 Gitlab

常遇到新環境利用原先有的 ssh key 連線 Gitlab，但是卻遇到無法連線的問題，會被要求輸入 server 的密碼。
這邊將彙整到的資訊做個小紀錄，來解決這個問題。

## 步驟

1. 產生環境所需的 SSH Key

   ```shell
   ssh-keygen -t rsa -C "your-ssh-key-name"
   ```

2. 將公鑰加入 Gitlab

   ```shell
   cat ~/.ssh/your-ssh-key-name.pub
   ```

3. 測試連線是否正確

   ```shell
   ssh -T -i ~/.ssh/your-ssh-key-name git@your-host-url
   ```

   如果連線成功會顯示 `Welcome to GitLab, @your-username!`

4. 將 SSH 匯入管理

   ```shell
   ssh-add ~/.ssh/your-ssh-key-name
   ```

5. 即可 clone 專案

   ```shell
   git clone git@your-host-url:your-username/your-repo.git
   ```



### 後續補充

如果發現利用 IDE 依然無法正確連接的話

先利用以下指令檢查

```powershell
ssh-add -l
```

若出現 `The agent has no identities.` ，表示目前只有監控到預設的 `id_rsa` ，其他額外名稱的需要加入。

可以利用以下方式加入：

```powershell
//全部添加
ssh-add  

//指定添加（可以切换到.ssh下添加，也可以直接指定路径添加）
ssh-add id_rsa_test_github                   
Enter passphrase for id_rsa_test_github: 
Identity added: id_rsa_test_github (id_rsa_test_github)
```

如此便可正常使用。

## 參考
> https://ithelp.ithome.com.tw/articles/10305020

> https://www.cnblogs.com/xiaoxi-jinchen/p/15440255.html


