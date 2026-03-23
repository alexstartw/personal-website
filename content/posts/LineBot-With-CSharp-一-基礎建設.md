---
title: LineBot With CSharp (一)基礎建設
date: "2024-07-25 16:00:47"
description: LineBot 的基礎建設，包含註冊 Line Developer、建立 Net 新專案、建立 Controller、ngrok 的安裝與使用、設定 Webhook url
categories:
  - Coding 會遇到的大小事
tags:
  - LineBot
  - C#
  - ngrok
cover: /images/posts/covers/linebot.png
---
部分流程參考 [APPX – Medium](https://blog.appx.com.tw/) 的文章，將自己的實際做法記錄起來
## 註冊 Line Developer
### 到 [LINE Developers](https://developers.line.biz/en/) 進行註冊

- 可以直接選用 Line 帳號登入
- 若第一次登入會需要填寫相關資料
### 建立 Provider 和 Message API
- 進入 Console 頁面需創建新的 Provider，點選畫面中的 "Create a new provider"
- 建立好 Provider 後，可以看到有多種 Channel 可以進行選擇，本次以  "Messaging API" 為主
- 新增後會需要設定部分設置，自行填寫即可
- 建立後便可看到以下畫面

![With CSharp_image_1.png" "LineBot"](/images/posts/LineBot-With-CSharp-一-基礎建設/"LineBot)

### Messaging API Channel 功能介紹
- 在 Messaging API 的 Tab 可以利用 `Bot basic ID` 或 QR code 來新增好友
- 使用 Messaging API 的兩個重要資訊 `Channel Access Token` 和 `Channel Secret`，在後續的操作，都會需要利用到這些資訊
    - Channel Secret 在 Basic Setting 可以找到，是一串已產生的固定字串
    - Channel Access Token 在 Messaging API 可找到，需要手動按下 `issue` 來產生

## 建立 .Net 新專案
- 需要一個使用 Controller 的 ASP .NetCore Web api 專案
### 建立 Controller
- 在 `Controllers` 資料夾新增一個 Controller ，命名為 `LineBotController.cs`，內容如下
```csharp
using Microsoft.AspNetCore.Mvc;  
  
namespace VolleyBallSchedule.Controller;  
  
[ApiController]  
[Route("api/[controller]")]  
public class LineBotController : ControllerBase  
{  
    private readonly string channelAccessToken = "token";  
    private readonly string channelSecret = "secret";  
  
    public LineBotController(){}  
  
    [HttpPost("webhook")]  
    public IActionResult Webhook()  
    {        
	    return Ok();  
    }
}
```
- 為了後續使用 Ngrok 的部分，還需要針對服務的 Listening Port 進行變更，修改 `luanchSettings.json` 的內容
```json
{  
	"profiles": {  
		"VolleyBallSchedule": {  
			"commandName": "Project",  
			"dotnetRunMessages": true,  
			"launchBrowser": true,  
			"launchUrl": "swagger",  
			// listening port 改為如下 分別 https -> 8080, http -> 8081  
			"applicationUrl": "https://localhost:8080;http://localhost:8081",  
			"environmentVariables": {  
				"ASPNETCORE_ENVIRONMENT": "Development"  
			}  
		}  
	}  
} 
```

### ngrok 的安裝與使用
- 至 [Download (ngrok.com)](https://ngrok.com/download) 可以選擇自己 OS 適用的版本並進行安裝
- 本次使用 `Chocolatey` 來協助安裝
    - 在 terminal 利用 `choco install ngrok` 即可安裝完成
- 連接 ngrok 帳號進行使用
    - 到 ngrok 後台登入
    - 輸入後台提供的 Connect your account 指令，應該就可以使用 ngrok 了
- 建立連線
    - 利用指令 `ngrok http 80` 即可呼叫 ngrok 建立一個連線至 localhost:80 的位置
    - 所有的 Request 都會被記錄在 terminal 的畫面中
    - ngrok 的 Web Interface (http://127.0.0.1:4040) 有更詳細的資料
### 設定 Webhook url
- 利用 ngrok 連線至剛剛設定的 8080 port
```shell
ngrok http https://localhost:8080
```
- 連線後將 route 組合剛剛設定的 api route，並設定到 messaging api
    - `Forwarding` 的 url 加上 `api/LineBot/Webhook`

![With CSharp_image_2.png" "LineBot"](/images/posts/LineBot-With-CSharp-一-基礎建設/"LineBot)

	- 利用 `Verify` 來測試連線結果，出現 Success 表示連線成功
- 可以傳送一段文字來測試機器人
- 從 [ngrok - Inspect](http://127.0.0.1:4040/inspect/http) 可以看到細部的資料

![With CSharp_image_3.png" "LineBot"](/images/posts/LineBot-With-CSharp-一-基礎建設/"LineBot)