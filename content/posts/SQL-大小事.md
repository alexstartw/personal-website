---
title: SQL 大小事
date: "2024-07-22 14:08:05"
description: SQL 的觀念解說
categories:
  - 資料會遇到的大小事
tags:
  - SQL
cover: /images/posts/covers/sql.png
---
## 基本概念
- 全名為 Structured Query Language (結構化查詢語言)，為一種能針對資料庫的數據進行 *資料操作* 的語言
- 主要可以分成 CRUD
    - Create: 建立新資料
    - Read: 查詢既有資料
    - Update: 修改既有資料
    - Delete: 刪除資料

## ACID
- 在進行功能開發時，為了確保每筆交易 ( Transaction ) 都是正確可靠的，需要具備以下 4 種特性
    - Atomicity 原子性 - 每一筆交易中只能有兩種情境發生，一是全部完成 Commit，一是全部不完成 Rollback，在某環節若出錯，會將所有狀態恢復至尚未開始此 transaction 之前。
    - Consistency 一致性 - 在 transaction 中會產生資料或驗證狀態，當錯誤發生時，所有已被更改的資料或狀態將會被 rollback 至 transaction 之前。
    - Isolation 隔離性 - 資料庫允許多筆 transaction 同時進行，若 A transaction 尚未完成，則 A 的資料並不會被其他 transaction 使用，會直到 A transaction 完成後才能使用。
    - Durability 持續性 - transaction 完成後的資料修改是永久性的，不會因為系統重啟或是其他錯誤而造成資料的改變。

## Index
- 在進行資料搜尋的時候，資料庫會以不同方式來查詢符合條件的資料
    - Table Scan: 當資料表沒有設計 Index ，唯一選擇為讀取整個 table 進行逐筆比對。執行時間與查詢結果筆數無關。(最沒效率)
    - Index Scan: 會**逐筆**去尋找所有 Index Column 組成中，是否有符合條件的。執行時間與 Index 總數成正比，跟查詢結果筆數無關。
    - Index Seek: 會使用 b-tree 來尋找符合條件的。執行時間與查詢結果筆數成正比。
- 通常使用 Index Seek 會比 Index Scan 有效率，但若是 table 不大，或是查詢結果筆數占全部資料的比例偏高，資料庫會依情況選擇搜尋方式。

## 經常使用到的 Join
- Join 用來將多個表結合起來
  
![SQL大小事_image_1.png](/images/posts/SQL-大小事/SQL大小事_image_1.png)
- 範例資料:

  `students` 資料表：

| student_id | name  |
|------------|-------|
| 1          | Alice |
| 2          | Bob   |
| 3          | Carol |
| 4          | David |

  `courses` 資料表：

| course_id | student_id | course_name |
|-----------|------------|-------------|
| 101       | 1          | Math        |
| 102       | 2          | Science     |
| 103       | 1          | History     |
| 104       | 3          | Math        |
| 105       | 5          | Art         |

- INNER JOIN 內部連接
    - 為等值連接，必須指定等值連接的條件，查詢結果也只會回傳符合連接條件的資料
  ```sql
  SELECT students.name, courses.course_name 
  FROM students INNER 
  JOIN courses 
  ON students.student_id = courses.student_id;
  ```

  查詢結果:

| name  | course_name |
|-------|-------------|
| Alice | Math        |
| Alice | History     |
| Bob   | Science     |
| Carol | Math        |

- LEFT JOIN
    - 查詢的 SQL 敘述句 LEFT JOIN 左側資料表的所有紀錄都會加入到查詢結果中，即使右側資料表的連接欄位沒有符合的值
  ```sql 
  SELECT students.name, courses.course_name 
  FROM students 
  LEFT JOIN courses 
  ON students.student_id = courses.student_id;
  ```

  查詢結果:

| name  | course_name |
|-------|-------------|
| Alice | Math        |
| Alice | History     |
| Bob   | Science     |
| Carol | Math        |
| David | NULL        |

- RIGHT JOIN
    - 查詢的 SQL 敘述句 RIGHT JOIN 右側資料表的所有紀錄都會加入到查詢結果中，即使左側資料表的連接欄位沒有符合的值
  ```sql 
  SELECT students.name, courses.course_name 
  FROM students 
  RIGHT JOIN courses 
  ON students.student_id = courses.student_id;
  ```

  查詢結果:

| name  | course_name |
|-------|-------------|
| Alice | Math        |
| Alice | History     |
| Bob   | Science     |
| Carol | Math        |
| NULL  | Art         |

- FULL JOIN
    - 為 LEFT JOIN 和 RIGHT JOIN 的聯集，會回傳左右資料表中所有的紀錄，不論是否符合連接條件
  ```sql 
  SELECT students.name, courses.course_name 
  FROM students 
  FULL JOIN courses ON students.student_id = courses.student_id;
  ```

  查詢結果:

| name  | course_name | 
|-------|-------------| 
| Alice | Math        | 
| Alice | History     | 
| Bob   | Science     | 
| Carol | Math        | 
| David | NULL        | 
| NULL  | Art         |
