---
title: Python MiniConda 設定
date: "2024-09-06 13:54:32"
description: 針對 Python 環境設定 MiniConda
categories:
  - Coding 會遇到的大小事
tags:
  - Python
  - MiniConda
cover: /images/posts/covers/miniconda.jpg
---

## 使用原因

MiniConda 可以依據自己需求建立 Python 環境，可以針對專案進行環境設定

## 使用環境

- JetBrain PyCharm

## 建立流程

### 開啟專案

- 設定專案相關基礎資訊
- 在 `Type` 選擇 `Conda`
- 若環境尚未安裝 `Conda` 的話，他會先行自動幫你安裝

![conda-1.png](/images/posts/Python-MiniConda-設定/conda-1.png)

### 確認 Conda 環境

可以利用以下指令確認目前擁有的虛擬環境

```shell
conda env list
```
![conda-2.png](/images/posts/Python-MiniConda-設定/conda-2.png)

### 切換 Conda 環境

可從 `setting` 針對 `Python Interpreter` 進行環境切換，期望設置為單一專案都是獨立的 `interpreter` ，方便後續進行環境維護與複製。

![conda-3.png](/images/posts/Python-MiniConda-設定/conda-3.png)

也可配合指令來切換當下的 conda environments
```shell
conda activate <env_name>
```

![conda-4.png](/images/posts/Python-MiniConda-設定/conda-4.png)

### 相關 package import

可利用 PyCharm 自動將所需的內容 import 到專案內