---
title: LineBot With CSharp (二)功能開發
date: "2024-07-25 16:33:34"
description: LineBot 的功能開發，包含設定 Webhook url、接收訊息、回覆訊息、設定 LineBot 的功能
categories:
  - Coding 會遇到的大小事
tags:
  - LineBot
  - C#
cover: /images/posts/covers/linebot.png
---
## Webhook Event 的分類
- 從官方文件可以了解到 request 的資料結構與欄位說明，在 LineBot 收到訊息時，會依照設定將相關內容傳到 API 來 handle，這邊會建立不同的 class 結構來 binding request 內的相關欄位
- 建立 `WebhookEventDto.cs` 與 `WebhookRequestBodyDto.cs` 供使用，相關 event 介紹請參考原文 [[Day 5] 讓 C# 也可以很 Social -.NET 6 C# 與 Line Services API 開發 — Webhook events 介紹（一） | by APPX | appxtech | Medium](https://medium.com/appxtech/day-5-%E8%AE%93-c-%E4%B9%9F%E5%8F%AF%E4%BB%A5%E5%BE%88-social-net-6-c-%E8%88%87-line-services-api-%E9%96%8B%E7%99%BC-webhook-events-%E4%BB%8B%E7%B4%B9-%E4%B8%80-b9f5a26033d3)

```csharp
namespace VolleyBallSchedule.Models;  
  
public class WebhookEventDto  
{  
    // -------- 以下 common property --------    public string Type { get; set; } // 事件類型  
    public string Mode { get; set; } // Channel state : active | standby  
    public long Timestamp { get; set; } // 事件發生時間 : event occurred time in milliseconds    public SourceDto Source { get; set; } // 事件來源 : user | group chat | multi-person chat    public string WebhookEventId { get; set; } // webhook event id - ULID format  
  
    public DeliverycontextDto DeliveryContext { get; set; } // 是否為重新傳送之事件 DeliveryContext.IsRedelivery : true | false  
    // -------- 以下 event properties--------    public string? ReplyToken { get; set; } // 回覆此事件所使用的 token    public MessageEventDto? Message { get; set; } // 收到訊息的事件，可收到 text、sticker、image、file、video、audio、location 訊息  
    public UnsendEventDto? Unsend { get; set; } //使用者“收回”訊息事件  
}  
  
// -------- 以下 common property --------  
public class SourceDto  
{  
    public string Type { get; set; }  
    public string? UserId { get; set; }  
    public string? GroupId { get; set; }  
    public string? RoomId { get; set; }  
}  
  
public class DeliverycontextDto  
{  
    public bool IsRedelivery { get; set; }  
}  
  
// -------- 以下 message event --------  
public class MessageEventDto  
{  
    public string Id { get; set; }  
    public string Type { get; set; }  
  
    // Text Message Event  
    public string? Text { get; set; }  
    public List<TextMessageEventEmojiDto>? Emojis { get; set; }  
    public TextMessageEventMentionDto? Mention { get; set; }  
  
    // Image & Video & Audio Message Event  
    public ContentProviderDto? ContentProvider { get; set; }  
    public ImageMessageEventImageSetDto? ImageSet { get; set; }  
    public int? Duration { get; set; }  
  
    //File Message Event  
    public string? FileName { get; set; }  
    public int? FileSize { get; set; }  
  
    //Location Message Event  
    public string? Title { get; set; }  
    public string? Address { get; set; }  
    public double? Latitude { get; set; }  
    public double? Longitude { get; set; }  
  
    // Sticker Message Event  
    public string? PackageId { get; set; }  
    public string? StickerId { get; set; }  
    public string? StickerResourceType { get; set; }  
    public List<string>? Keywords { get; set; }  
}  
  
public class TextMessageEventEmojiDto  
{  
    public int Index { get; set; }  
    public int Length { get; set; }  
    public string ProductId { get; set; }  
    public string EmojiId { get; set; }  
}  
  
public class TextMessageEventMentionDto  
{  
    public List<TextMessageEventMentioneeDto> Mentionees { get; set; }  
}  
  
public class TextMessageEventMentioneeDto  
{  
    public int Index { get; set; }  
    public int Length { get; set; }  
    public string UserId { get; set; }  
}  
  
public class ContentProviderDto  
{  
    public string Type { get; set; }  
    public string? OriginalContentUrl { get; set; }  
    public string? PreviewImageUrl { get; set; }  
}  
  
public class ImageMessageEventImageSetDto  
{  
    public string Id { get; set; }  
    public string Index { get; set; }  
    public string Total { get; set; }  
}  
  
// -------- 以下 unsend event --------public class UnsendEventDto  
{  
    public string messageId { get; set; }  
}
```

```csharp
namespace VolleyBallSchedule.Models.Requests;  
  
public class WebhookRequestBodyDto  
{  
    public string? Destination { get; set; }  
    public List<WebhookEventDto> Events { get; set; } 
} 
```

### 處理事件的接收
- 因需要控制不同的 event，利用 Enum 來 handle

```csharp
public static class WebhookEventTypeEnum  
{  
    public const string Message = "message";  
    public const string Unsend = "unsend";  
    public const string Follow = "follow";  
    public const string Unfollow = "unfollow";  
    public const string Join = "join" ;  
    public const string Leave = "leave";  
}
```

- 在 service 的部分即可用來判斷訊息 type，並做出相對應的回應

```csharp
public class LineBotService  
{  
  
	// (將 LineBotController 裡宣告的 ChannelAccessToken & ChannelSecret 移到 LineBotService中) 
	// 貼上 messaging api channel 中的 accessToken & secret  
	private readonly string channelAccessToken = "Your Channel Access Token";  
	private readonly string channelSecret = "Your Channel Secret";  
  
	public LineBotService()  
	{  
	}  
  
	public void ReceiveWebhook(WebhookRequestBodyDto requestBody)  
	{  
		foreach(var eventObject in requestBody.Events)  
		{  
			switch (eventObject.Type)  
			{  
				case WebhookEventTypeEnum.Message:  
					Console.WriteLine("收到使用者傳送訊息！");  
					break;  
				case WebhookEventTypeEnum.Unsend:  
					Console.WriteLine($"使用者{eventObject.Source.UserId}在聊天室收回訊息！");  
					break;  
				case WebhookEventTypeEnum.Follow:  
					Console.WriteLine($"使用者{eventObject.Source.UserId}將我們新增為好友！");  
					break;  
				case WebhookEventTypeEnum.Unfollow:  
					Console.WriteLine($"使用者{eventObject.Source.UserId}封鎖了我們！");  
					break;  
				case WebhookEventTypeEnum.Join:  
					Console.WriteLine("我們被邀請進入聊天室了！");  
					break;  
				case WebhookEventTypeEnum.Leave:  
					Console.WriteLine("我們被聊天室踢出了");  
					break;  
			}  
		}  
	}  
} 
```

### 訊息的回覆
- 將單純以 text 的 Reply 來做回覆，本文不討論主動推播的部分
- 送出回覆訊息要注意的幾點
    - Http Method: Post
    - Request Uri : [https://api.line.me/v2/bot/message/reply](https://api.line.me/v2/bot/message/reply)
    - Headers: Content-Type, Authorization
    - Request Body 格式
#### 處理訊息格式問題
- Line 的接收格式變數名稱為小寫，但 C# 的命名規則為大寫開頭，不能利用原先的 JsonSerializer 來進行序列化的動作，故須建立一個 JsonProvider 來處理

```csharp
using System.Text.Json;  
using System.Text.Json.Serialization;  
  
namespace VolleyBallSchedule.Provider;  
  
public class JsonProvider  
{  
    private JsonSerializerOptions serializeOption = new JsonSerializerOptions()  
    {  
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,  
        PropertyNameCaseInsensitive = true,  
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,  
        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping  
    };  
  
    private static JsonSerializerOptions deserializeOptions = new JsonSerializerOptions  
    {  
        PropertyNameCaseInsensitive = true,  
    };  
  
    public string Serialize<T>(T obj)  
    {        return JsonSerializer.Serialize(obj, serializeOption);  
    }  
    public T Deserialize<T>(string str)  
    {        return JsonSerializer.Deserialize<T>(str, deserializeOptions);  
    }}
```
#### Request Body
- 建立 `ReplyMessageRequestDto.cs` 來進行資料 binding
```csharp
public class ReplyMessageRequestDto<T>  
{  
	public string ReplyToken { get; set; }  
	public List<T> Messages { get; set; }  
	public bool? NotificationDisabled { get;set; }  
}
```
- 在 service 加入變數與 function 來實作

```csharp
// 宣告變數  
private readonly string replyMessageUri = "https://api.line.me/v2/bot/message/reply";  
private readonly string broadcastMessageUri = "https://api.line.me/v2/bot/message/broadcast";  
private static HttpClient client = new HttpClient(); // 負責處理HttpRequest  
private readonly JsonProvider _jsonProvider = new JsonProvider();

/// <summary>  
/// 接收到回覆請求時，在將請求傳至 Line 前多一層處理(目前為預留)  
/// </summary>  
/// <param name="messageType"></param>  
/// <param name="requestBody"></param>  
public void ReplyMessageHandler<T>(string messageType, ReplyMessageRequestDto<T> requestBody)  
{  
    ReplyMessage(requestBody);  
}  
  
/// <summary>  
/// 將回覆訊息請求送到 Line/// </summary>  
/// <typeparam name="T"></typeparam>  
/// <param name="request"></param>    public async void ReplyMessage<T>(ReplyMessageRequestDto<T> request)  
{  
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));  
    client.DefaultRequestHeaders.Authorization =  
        new AuthenticationHeaderValue("Bearer", _configuration.GetValue<string>("LineBot:ChannelAccessToken")); //帶入 channel access token    var json = _jsonProvider.Serialize(request);  
    var requestMessage = new HttpRequestMessage  
    {  
        Method = HttpMethod.Post,  
        RequestUri = new Uri(replyMessageUri),  
        Content = new StringContent(json, Encoding.UTF8, "application/json")  
    };  
    var response = await client.SendAsync(requestMessage);  
    Console.WriteLine(await response.Content.ReadAsStringAsync());  
}
```

- 進行傳訊息測試

```csharp
var replyMessage = new ReplyMessageRequestDto<TextMessageDto>  
{  
    ReplyToken = obj.ReplyToken,  
    Messages = new List<TextMessageDto>  
    {        new TextMessageDto  
        {  
            Text = "Hello, this is your message" + obj.Message.Text  
        }  
    }};  
ReplyMessageHandler("text", replyMessage);
```