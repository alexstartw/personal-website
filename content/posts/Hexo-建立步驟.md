---
title: Hexo 建立步驟
date: "2024-07-23 21:53:07"
description: Hexo 的建立小知識
categories:
  - 開發 Tips
tags:
  - Hexo
cover: /images/posts/covers/hexo.jpg
---

## 安裝 Git
可從 [Git - Download](https://www.git-scm.com/download/) 安裝 Git，選擇默認選項安裝即可

## 安裝 Node.Js
可從 [Node.js — Run JavaScript Everywhere (nodejs.org)](https://nodejs.org/en/) 下載，推薦下載穩定版本，完成後可於 terminal 以 `node -v` 來確認安裝版本

## 安裝 Hexo 與 local 基本部屬

- 先在指定的位置建立好一個新的資料夾
```shell
cd Notes 
```
- 安裝 hexo 命令列工具
```shell
npm install hexo-cli -g 
```
- 將 hexo source code 下載
```shell
hexo init
```
- 安裝 npm 來使用相關套件
```shell
npm install
```
- 啟動 local server，即可預覽
```shell
hexo server
# 也可以 hexo s
```
- 若正常安裝，可以訪問 `http://localhost:4000/`，就可以看到在 local 運行的 hexo 了

## Hexo 相關操作指令與語法
- 新增文章 `hexo new post article-title`
- 產生靜態檔 `hexo g`
- 插入圖片
    - 在 `_config.yml` 內修改，可利用 `![picture1.jpg](/images/posts/Hexo-建立步驟/picture1.jpg)` 來加入圖片
```yaml
post_asset_folder: true
```


## 部屬至 Gitlab Pages 上
- 建立新專案
- 將 hexo 專案同步至新專案內
- 在專案的根目錄新增 `.gitlab-ci.yml`
  範例:
```yaml
image: node:22.2.0  
  
cache:  
  paths:  
    - node_modules/  
  
before_script:  
  - rm -rf node_modules/*/.git/  
  - npm install hexo-cli -g  
  - test -e package.json && npm install  
  - hexo clean  
  
pages:  
  script:  
    - hexo clean  
    - hexo g  
    - hexo deploy  
    - pwd  
  artifacts:  
    paths:  
      - public  
  only:  
    - master
```

- 將程式碼 push 上去後就會自動建置部署了