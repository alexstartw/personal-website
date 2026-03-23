---
title: Serilog & Seq 配合
date: "2024-06-06 13:09:17"
description: 介紹 Serilog 和 Seq 的安裝與使用
categories:
  - Coding 會遇到的大小事
cover: /images/posts/covers/seq.png
---

### Serilog
安裝Nuget: 
* Serilog
* Serilog.AspNetCore

用途: 與原先 Nlog 使用方法類似，可以寫到檔案內，資料庫， Seq Logserver 等位置

source : https://github.com/serilog/serilog

### Seq log server
安裝 Nuget:
* Serilog.Sinks.Seq

### 初始設定
在 `Program.cs` 註冊 `Log.logger` 的使用
```csharp=
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(new ConfigurationBuilder()
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .Build())
    .WriteTo.Console()
    .WriteTo.Seq("http://localhost:5341")
    .CreateLogger();
```

#### 相對應的屬性設定
* `.ReadFrom.Configuration`: 可以將設定寫在 json 內，以方便控制與修改
* `.WriteTo`
    * `WriteTo.Console`: 直接終端機輸出
    * `.WriteTo.File("log-.txt", rollingInterval: RollingInterval.Day)`: 輸出至檔案，並可以控制檔名與換檔案的區間
    * `WriteTo.Seq(serverUrl)`: 輸出至Seq log server
* `.Enrich.WithProperty`: 可以自定義屬性
    * 使用方法: 
```csharp=
Log.Logger = new LoggerConfiguration()
    .Enrich.WithProperty("API Version", "1.0.1")
    .WriteTo.Console(outputTemplate: "[{Timestamp:hh:mm:ss} {Level:u3}] {Message,-30:lj} {Properties:j} {NewLine}{Exception}")
    .CreateLogger();
```
```csharp=
[07:00:00 INF] message {API Version="1.0.1"}
```

* 若想要將所有設定都寫在 `appsetting.json` 內的話，在 `program.cs` 內只需寫
(可能需要安裝Nuget:  Serilog.Settings.Configuration )
```csharp=
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(new ConfigurationBuilder()
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .Build())
    .CreateLogger();
```
而在 `appsetting.json` 內則需記錄以下內容
```json=
  "Serilog": {
    "MinimumLevel": "Information",
    "WriteTo": [
      {
        "Name": "Seq",
        "Args": {
          "serverUrl": "http://localhost:5341"
        }
      },
      {
        "Name": "Console"
      }
    ], 
    "Properties": {
      "Site" : "tmLocalDev"
    }
  }
```

### 配合使用情境
當想要在某個 class 紀錄 log 時，則需宣告出一個 logger
```csharp=
private readonly ILogger _logger = Log.ForContext<XXXClass>();
```
如此紀錄後，在每筆log中會有一個屬性 `SourceContext` 紀錄此 log 的**專案 .class 資料夾 .className**

![Serilog-Seq-配合-1.png](/images/posts/Serilog-Seq-配合/Serilog-Seq-配合-1.png)

#### 一般使用情境:
可以使用以下六種不同等級來記錄 log
```csharp=
_logger.Verbose("test verbose");
_logger.Debug("test debug");
_logger.Information("test Info");
_logger.Warning("test warning");
_logger.Error("test error");
_logger.Fatal("test fatal");
```

一般會使用 `message template` 來作為初始模板並放入變數來記錄所需log

```csharp=
var MsgTemplate = "Message: {Info}";
_logger.Information(MsgTemplate, "Function called")
```

#### 資料型別 Formatting
* 小寫字母 - **:l**
```csharp=
_logger.Information("Message: {Value:l}", "Hello World"); 
// 輸出："Message: hello world"
```
* 大寫字母 - **:u**
```csharp=
_logger.Information("Message: {Value:u}", "Hello World"); 
// 輸出："Message: HELLO WORLD"
```
* 首字母大寫 - **:n**
```csharp=
_logger.Information("Message: {Value:n}", "hello world"); 
// 輸出："Message: Hello world"
```
* 日期格式 - **:D**
```csharp=
_logger.Information("Date: {Date:D}", DateTime.Now); 
// 輸出日期格式化後的日期字符串 example: Wednesday, 01 November 2023
```
* 自定義時間格式 - **:HH:mm:ss**
```csharp=
_logger.Information("Time: {Time:HH:mm:ss}", DateTime.Now); 
// 輸出時間的小時、分鐘和秒
``` 
* 數字格式 - **:000**
```csharp=
_logger.Information("Number: {Value:000}", 42); 
// 輸出："Number: 042"
```

#### 巢狀資料使用:
型別包含: **Array**, **Object**, **多層Object**, **List**, **Dictionary**
要在變數前加上'@'
否則搜尋時無法搜尋到巢狀資料下的內容
```csharp=
string MsgTemplate = "Site: {@Site}, msg: {Info}"
_logger.Information(MsgTemplate,new { Localhost = "localhost", Ip = "1.1.1.1"}, "Function called")
```

#### Exception 問題處理
可以安裝Nuget:`Serilog.Exceptions`
並加上相關設定
```csharp=
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(new ConfigurationBuilder()
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .Enrich.WithExceptionDetails()
        .Build())
    .CreateLogger();
```

#### Seq資料搜尋與分析

* 單純文字搜尋
可以直接搜尋想要的純文字內容來進行搜尋

![Serilog-Seq-配合-2.png](/images/posts/Serilog-Seq-配合/Serilog-Seq-配合-2.png)

* 利用屬性搜尋

![Serilog-Seq-配合-3.png](/images/posts/Serilog-Seq-配合/Serilog-Seq-配合-3.png)

* 搜尋有tag名稱的內容
搜尋巢狀內容可以利用'.'來往下一層搜尋

![Serilog-Seq-配合-4.png](/images/posts/Serilog-Seq-配合/Serilog-Seq-配合-4.png)

* 搜尋array內的資料

![Serilog-Seq-配合-5.png](/images/posts/Serilog-Seq-配合/Serilog-Seq-配合-5.png)

* 以最原始的SQL語法進行搜尋

![Serilog-Seq-配合-6.png](/images/posts/Serilog-Seq-配合/Serilog-Seq-配合-6.png)


* Source: https://docs.datalust.co/docs/query-syntax
* Source: https://blog.csdn.net/u010690818/article/details/125589711
* Source: https://medium.com/@niteshsinghal85/advance-logging-with-serilog-and-seq-in-net-9005a4a3d049

#### 利用模板整理所需 template

可利用此種方式，來整理出各場景所需 log 內容，也可提供客製化欄位
有了共同模板，可以方便未來 log 查找，並且易於維護
```csharp=
string MsgTemplate = "Site: {@Site}, msg: {Info}"
```

* tips: Rider 小套件 - Structured Logging
可以協助確認在使用 log template 時，是否有遺漏的參數項目
(未填寫所需參數會顯示空白)