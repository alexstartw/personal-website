---
title: SQL 語法小筆記
date: "2023-08-24 15:52:29"
description: 紀錄能夠提升效能的 SQL 語法
categories:
  - 資料會遇到的大小事
tags:
  - SQL
cover: /images/posts/covers/sql.png
---

### SQL語法小筆記
***
#### 增加效能的語法
1. SELECT子句中避免使用 `SELECT *` 
2. 以 `TRUNCATE TABLE` 取代 `DELETE FROM`
3. 計算記錄比數時，以 `COUNT(*)` 取代 `COUNT(1)`
4. 以 `EXISTS` 取代 `IN`
5. 以 `EXISTS` 取代 `DISTINCT`
