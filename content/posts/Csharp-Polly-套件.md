---
title: Csharp Polly 套件
date: "2024-06-10 10:13:02"
description: 介紹 Polly 的基本概念與使用方法
categories:
  - Coding 會遇到的大小事
tags:
  - C#
cover: /images/posts/covers/Csharp-Polly.png
---
![Csharp-Polly-套件-1.png](/images/posts/Csharp-Polly-套件/Csharp-Polly-套件-1.png)

## Polly安裝步驟
安裝Nuget

`Install-Package Polly`

## Polly主要結構
主要分成三大部分
* Handle<T> : 指定要處理甚麼類型的異常
* Retry : 重試的機制，定義發生異常時要重試的次數或指定行為
* Execute : 需執行的行為

## Handle
可以根據需求來定義要處理的Exception

```csharp=
// Single exception type
    
Policy.Handle<HttpRequestException>
    
// Multiple exception type

Policy.Handle<HttpRequestException>()
      .Or<OperationCanceledException>()
```

也可以依照API回傳的內容(return result)來決定

```csharp=
Policy.HandleResult<HttpResponseMessage>(r => r.StatusCode == HttpStatusCode.NotFound)
      .OrResult(r => r.StatusCode == HttpStatusCode.BadGateway)
```

### Retry
重試策略提供了**Retry**跟**Wait and Retry**

```csharp=
// 重試一次
Policy.Handle<Exception>().Retry()
    
// 重試多次
Policy.Handle<Exception>().Retry(7)
    
// 重試要做的處理
Policy.Handle<Exception>().Retry(3, onRetry: (exception, retryCount) =>
    { 
        // do something 
    })
    
// 重試無數次
Policy.Handle<Exception>().RetryForever(onRetry: (exception, context) =>
    {
        // do something
    })
```

### Wait and Retry

可以自行定義重試的頻率與時間(預設重試頻率是立即重試，最多兩次)
```csharp=
Policy.Handle<Exception>()
    .WaitAndRetry(new[]{
        TimeSpan.FromSecond(1),
        TimeSpan.FromSecond(3),
        TimeSpan.FromSecond(5)
    })
```

## Polly Retry Flow
![Csharp-Polly-套件-2.png](/images/posts/Csharp-Polly-套件/Csharp-Polly-套件-2.png)

## Polly 7種策略
* 重試 (Retry)

* 斷路 (Circuit-breaker)
    * 遇到重要錯誤，快速回饋失敗比起讓User等待還好，限制系統出錯的量，能避免更多問題的發生
    * 兩次異常，等待一分鐘後再繼續
      `Policy.Handle<Exception>().CircuitBreaker(2, TimeSpan.FromMinutes(1));`
* 超時 (Timeout)
    * 當系統超過一定的等待時間，可以合理判斷操作會失敗，故要避免系統長時間的等待
    ```csharp=
    Policy.Timeout(30, onTimeout: (context, timespan, task) =>
    {
        // do something
    });
    ```
* 隔離 (Bulkhead Isolation)
    * 將操作限制在一個固定大小的資源池，隔離潛在可能互相影響的操作
    * 最多允許12個threads執行
    ```csharp=
    Policy.Bulkhead(12, context =>
    {
        // do something
    });
    ```
* 回退 (Fallback)
    * 當無法避免的錯誤發生時，需要有一個合理的Response來代替失敗
    ```csharp=
    Policy.Handle<Whatever>()
   .Fallback<UserAvatar>(() => UserAvatar.GetRandomAvatar())
    ```
* 緩存 (Cache)
* 策略 (Policy Wrap)