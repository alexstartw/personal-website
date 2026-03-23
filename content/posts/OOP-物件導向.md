---
title: OOP 物件導向
date: "2024-07-29 17:55:14"
description: 針對物件導向的基本概念做一個簡單的介紹
categories:
  - [開發 Tips]
tags:
  - C#, OOP
cover: /images/posts/covers/solid.png
---
## Class and Object
### What is Object ?
Object 物件，其實就是 Class 類別的 Instance 實例。
可以從以下程式碼得到說明:

```csharp
class User{
	string name;
	string email;
	Datetime birthday;

	public void SetUserBirthday()
	{
		// some logic
	}
}
```

在 User 這個 class 中，name, email 這些欄位被稱做 *屬性 attribute* ，而 SetUserBirthday() 被稱為 *方法 method*，可以理解成屬性就是變數 Variable，而方法就是函式 function。
而我們實際在使用的時候，會利用抽象的 class 來產生出一個實例 Instance

```csharp
User alex = new User();  
```

## 四個特性
- 抽象 Abstraction
  把實際的需求，轉化成 class，而這個 class 可以包含 attribute 跟 method。

- 封裝 Encapsulation
  隱藏或保護內部的實作細節，可利用存取層級 ( public, private, protected 等 ) 進行控管，在使用 instance 的時候不能直接取得 class 內的所有東西，必須通過 public 的 attribute 跟 method 進行操作。

- 繼承 Inhertiance
  可以使建立的 class 被重複使用、擴充或修改 class 中的 method。

- 多型 Polymorphism
  當一個 class 繼承另一個 Parent class 時，這個 class 可以覆寫其 method。簡單來說， parent class 可以定義和實作 virtual 的 attribute 跟 method，child class 可以 override virtual 的 attribute 與 method

## 五大原則 SOLID
- S: Single Responsibility Principle 單一功能原則
  一個 class 應該只有一個職責
- O: Open Close Principle 開放封閉原則
  擴充時應該新增程式碼，而不是修改現有程式碼
- L: Liskov Substitution Principle 里氏替換原則
  物件應該要在不影響現有程式正確性的情況下被 subclass 實作替換
- I: Interface Segregation Principle 介面隔離原則
  大量的特定功能 interface 會比單一通用的一個 interface 還要好
- D: Dependency Inversion Principle 依賴反轉原則
  高階的 module 不應該依賴於低階的 module，項目越抽象，他的模組越高階。抽象的實體不應該依賴於實作，實作應該依賴於抽象實體。
