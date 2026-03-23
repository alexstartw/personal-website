---
title: Git 基礎指令
date: "2024-11-01 16:19:31"
description: 紀錄一些 Git 基礎指令
categories:
  - Coding 會遇到的大小事
tags:
  - git
cover: /images/posts/covers/git.png
---

## Git 基本指令

### Repository 相關

- `git init` 建立新的 local repository

- `git clone [Repository URL]` 複製遠端的 repository 到 local

### Commit 相關

- `git status` 檢查目前 local 的檔案異動狀況

- `git add [file or dir]` 將指定的檔案加入版本控制中，利用 `git add . ` 可以加入全部

- `git commit` 提交目前的異動

    - `git commit -m “提交內容說明“` 提交目前的異動，並且附上說明文字

- `git log` 查看先前的 commit 紀錄

- `git push` 將 local repository 的 commit 發佈到遠端

    - `git push origin [BRANCH_NAME]` 發佈到指定的遠端分支

- `git checkout [HASH]` 切換到指定的 commit

- `git reset —hard [HASH]` 強制恢復到指定的 commit

### Branch 相關

- `git branch` 查看分支

    - `git branch [BRANCH_NAME]` 建立分支

    - `git branch -D [BRANCH_NAME]` 強制刪除指定分支（需先切換至別的分支）

    - `git branch -m <OLD_BRANCH_NAME> <NEW_BRANCH_NAME>` 修改分支名稱

- `git checkout [BRANCH_NAME]` 取出指定分支

    - `git checkout -b [BRANCH_NAME]` 建立並跳到該分支