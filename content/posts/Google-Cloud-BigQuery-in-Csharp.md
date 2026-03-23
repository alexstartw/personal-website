---
title: Google Cloud BigQuery in Csharp
date: "2024-06-10 10:22:50"
description: 紀錄學習 Google Cloud BigQuery 的操作過程與建立方式
categories:
  - Coding 會遇到的大小事
tags:
  - C#
  - Google Cloud
  - BigQuery
cover: /images/posts/covers/bigquery.png
---
## 環境設定
* Target framework : Net7.0
* IDE : JetBrain Rider
* 專案類型 : gRPC (gRPC Remote Procedure Calls)

## 需安裝的Nuget
* Grpc.AspNetCore - 版本2.49.0
* Google.Apis.Bigquery.V2 - 版本1.61.0.3145
* Google.Cloud.BigQuery.Storage.V1 - 版本3.10.0
* Google.Cloud.BigQuery.V2 - 版本3.4.0

## 前情提要
* Google Cloud 有提供兩種API模式 - gRPC跟Rest Api，本篇以gRPC為主
* 目的是為了將用戶行為相關資料送至BigQuery進行儲存與分析

## 預先建立與設定之資料
* 建立 [GCP BigQuery](https://cloud.google.com/bigquery?utm_source=google&utm_medium=cpc&utm_campaign=japac-TW-all-en-dr-BKWS-all-hv-trial-PHR-dr-1605216&utm_content=text-ad-none-none-DEV_c-CRE_622094083599-ADGP_Hybrid%20%7C%20BKWS%20-%20BRO%20%7C%20Txt%20~%20Data%20Analytics_BigQuery_google%20bigquery_main-KWID_43700076504731426-aud-1640178259900%3Akwd-305671271708&userloc_9040379-network_g&utm_term=KW_google%20cloud%20bigquery&gclid=Cj0KCQjwgNanBhDUARIsAAeIcAsJLfA5-j7k9TrAGzXiQtqeGXuBFKkoHm5SlV9bACf7kc34mkj-zF0aAieoEALw_wcB&gclsrc=aw.ds&hl=zh-tw)
* 金鑰取得
    * Google Cloud 控制欄 - API與服務 - 憑證
![Google-Cloud-BigQuery-in-Csharp-1.png](/images/posts/Google-Cloud-BigQuery-in-Csharp/Google-Cloud-BigQuery-in-Csharp-1.png)
    * 選擇-建立憑證 - 服務項目
![Google-Cloud-BigQuery-in-Csharp-2.png](/images/posts/Google-Cloud-BigQuery-in-Csharp/Google-Cloud-BigQuery-in-Csharp-2.png)
    * 設定服務帳戶名稱與服務帳戶說明，服務帳戶ID會自動產生
![Google-Cloud-BigQuery-in-Csharp-3.png](/images/posts/Google-Cloud-BigQuery-in-Csharp/Google-Cloud-BigQuery-in-Csharp-3.png)
    * 授予存取權 - BigQuery - BigQuery管理員
![Google-Cloud-BigQuery-in-Csharp-4.png](/images/posts/Google-Cloud-BigQuery-in-Csharp/Google-Cloud-BigQuery-in-Csharp-4.png)
    * 點擊 - 完成
    * 選取剛剛建立的服務帳戶
    * 選擇金鑰 - 建立新的金鑰
![Google-Cloud-BigQuery-in-Csharp-5.png](/images/posts/Google-Cloud-BigQuery-in-Csharp/Google-Cloud-BigQuery-in-Csharp-5.png)
  * 選擇JSON
![Google-Cloud-BigQuery-in-Csharp-6.png](/images/posts/Google-Cloud-BigQuery-in-Csharp/Google-Cloud-BigQuery-in-Csharp-6.png)
  * 將金鑰檔案的名稱記錄起來，並將其放到專案執行目錄 (以此例來說，應該放到專案下 /bin/Debug/net7.0)
## Insert 資料 -- 程式碼範例
* 憑證
  * 建立金鑰路徑
  * 取得憑證
```csharp=
    var credentialsPath = $"{your-file-path}your-key-name.json";
    var credential = GoogleCredential.FromFile(credentialsPath);
```

* client端
  * 建立 [client](https://cloud.google.com/dotnet/docs/reference/Google.Cloud.BigQuery.V2/latest/Google.Cloud.BigQuery.V2.BigQueryClient)
  * 建立/讀取現存dataset
  * 建立/讀取現存table

```csharp=
    var client = BigQueryClient.Create(ProjectId,credential);
    var dataset = client.GetOrCreateDataset(request.DataSet);
    var table = dataset.GetOrCreateTable(request.TableName, new TableSchemaBuilder
    {
        { "id", BigQueryDbType.Int64 },
        { "name", BigQueryDbType.String },
        { "phone", BigQueryDbType.Int64 }
    }.Build());
```

* 資料型態
  * 是以`BigQueryInsertRow`來進行一列一列資料的insert
  * 可以整理成一個list來準備要insert的資料集
  * 藉由回傳的內容來確定insert的筆數以及錯誤的筆數

```csharp=
    var insertResults = table.InsertRows(insertRows);
    effectRows = insertResults.InsertAttemptRowCount;
    errorRows = insertResults.OriginalRowsWithErrors;
```
* 實際執行InsertRows
```csharp=
    var insertResults = table.InsertRows(insertRows, _insertOptions);
```
* 檢驗執行結果
```csharp=
    switch (insertResults.Status)
    {
        case BigQueryInsertStatus.AllRowsInserted:
            effectedRows += insertResults.InsertAttemptRowCount;
            break;
        case BigQueryInsertStatus.SomeRowsInserted:
            effectedRows += insertResults.InsertAttemptRowCount;
            errorRows += insertResults.OriginalRowsWithErrors;
            errorMessages = insertResults.Errors.ToList();
            break;
        case BigQueryInsertStatus.NoRowsInserted:
            errorRows += insertResults.OriginalRowsWithErrors;
            errorMessages = insertResults.Errors.ToList();
            break;
    }           
```

* 可以利用[InsertOptions](https://cloud.google.com/dotnet/docs/reference/Google.Cloud.BigQuery.V2/latest/Google.Cloud.BigQuery.V2.InsertOptions)來選擇相關設定
```csharp=
    private readonly InsertOptions _insertOptions = new()
    {
        SkipInvalidRows = true, 
        // 預設false，設定成true可以跳過有錯誤的Row，並將同batch的其他正確資料進行insert
        SuppressInsertErrors = true
        // 預設false，設定成true可以避免錯誤的Row Throw Exception，讓程式持續運行
    };
```
* 利用[[BigQueryInsertRowErrors](https://cloud.google.com/dotnet/docs/reference/Google.Cloud.BigQuery.V2/latest/Google.Cloud.BigQuery.V2.BigQueryInsertRowErrors)]來取得錯誤相關的資料
```csharp=
    var errorMsgs = insertResults.Errors.ToList(); 
    // 取得errorList，利用GetEnumerator()將詳細理由列出
    var errorCounts = insertResults.OriginalRowsWithErrors
```


## 查詢 -- 程式碼範例
* Insert資料會使用上述table方式來insert，若要查詢的話，會以`BigqueryService`來進行操作
* 新增一個service
```csharp=
    var service = new BigqueryService(new BaseClientService.Initializer
    {
        HttpClientInitializer = credential,
        ApplicationName = "BigQuery API Sample"
    });
```
* 利用此service可以查看指定dataset的table列表
```csharp=
service.Tables.List(projectDatasetId.Split(':')[0]
                    , projectDatasetId.Split(':')[1]).Execute().Tables;
```
* 也可以指定table的內容來做查詢
```csharp=
service.Tabledata.List(ProjectId, dataSet, tableName).Execute().Rows.Take(10);
```

* 若同樣要以client的方法來查詢也可以
```csharp=
var rows = client.ListRows(ProjectId, DataSet, TableName).Take(10);
```



## 相關資料連結
* [Google.Cloud.BigQuery.V2](https://cloud.google.com/dotnet/docs/reference/Google.Cloud.BigQuery.V2/latest)