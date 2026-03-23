---
title: LineBot-With-Python-基礎建設
date: "2024-09-20 09:35:36"
description: LineBot 的基礎建設，包含設定 Webhook url、接收訊息、回覆訊息、設定 LineBot 的功能
categories:
  - Coding 會遇到的大小事
tags:
  - Python
  - LineBot
cover: /images/posts/covers/linebot-py.png
---

## 前言

之前已分享過以 C# 完成的 LineBot，這次則是使用 Python 來完成 LineBot 的基礎建設，包含設定 Webhook url、接收訊息、回覆訊息、設定 LineBot 的功能。
額外配上 RAG 的功能，讓 LineBot 可以回覆使用者針對知識庫的相關提問。

### 所使用環境
- python 3.11.9
- line-bot-sdk 3.13.0
- langchain 0.3.0
- langchain-community 0.3.0
- openai 0.28.0
若有其他需要的套件，請自行安裝。

### 架構分析

#### LineBot 的 Endpoint

先建立能與 Linebot 通訊的 Endpoint 與 Handler，來當作與 Line 溝通的介面。

#### RAG 的 知識庫

會配合 LangChain 針對 pdf 進行資料的切分，針對每個 chunk 進行向量化，並進行 prompt 的優化，讓使用者能找到最貼近的答案。

## LineBot 的 Endpoint

採用 `Flask` 當作 Endpoint 的框架

並搭配 `configparser` 來取得相關需加密的資料

```python
app = Flask(__name__)

# LINE 聊天機器人的基本資料
config = configparser.ConfigParser()
config.read('config.ini')

line_bot_api = LineBotApi(config.get('line-bot', 'channel_access_token'))
handler = WebhookHandler(config.get('line-bot', 'channel_secret'))
```



建立相關 endpoint

```python
# 此 callback 用來接收從 line 打來的 request
@app.route("/callback", methods=['POST'])
def callback():
    signature = request.headers['X-Line-Signature']

    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)

    try:
        print(body, signature)
        handler.handle(body, signature)

    except InvalidSignatureError:
        abort(400)

    return 'OK'
```



建立 handler 來處理指定型別的 line message

```python
# 建立 prompt 路由
@handler.add(MessageEvent, message=TextMessage)
def handle_reply_message(event):
    response = rag_bot.chat_prompt(event.source.user_id, event.message.text)
    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text= response)
    )

@handler.add(MessageEvent, message=(ImageMessage, VideoMessage, AudioMessage, FileMessage, LocationMessage, StickerMessage))
def handle_message(event):
    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text="抱歉，我不支援這種訊息類型")
    )
```

## Rag 知識庫建立

由於不是以 `Streamlit` 建立 Rag 的使用介面，在需要使用到 session 儲存相關內容時，要找方法替代。

這邊以 Redis 來代替 session 的功能。

Redis 預設以 bytes 來回傳結果，故須加上 `decode_responses=True` 來做好 decode 的行為，以便我們看到的結果是字串。

### 建立 Redis

```python
import redis

r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
```

### PDF 相關處理

我們將以 pdf 作為知識庫的資料來源，考慮到資料的大小以及程式的執行效率，我們會先將其進行 chunk 的切分。

```python
import PyPDF2
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Function to read a PDF file and extract text from it
def read_pdf(file_path):
    print("Reading PDF file")
    with open(file_path, "rb") as file:
        # Create a PDF reader object
        reader = PyPDF2.PdfReader(file)
        text = ""

        # Iterate through each page in the PDF and extract text
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()  # Extract text from the page

        return text  # Return the extracted text


# 設定 chunk 大小，例如每個 chunk 最多 10000 字元
def split_text_into_chunks(text, chunk_size=10000, chunk_overlap=2000):
    print("Splitting text into chunks")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,  # 每個 chunk 的最大字元數
        chunk_overlap=chunk_overlap  # 每個 chunk 間的重疊部分，避免語意斷裂
    )
    return text_splitter.split_text(text)
```

### 知識庫的 Vector 建立

由於 pdf 過大的話，我們在每次讀取時會消耗大量時間在進行讀取、切分、建立向量檔，故我們會在初次建立的時候先寫成實體的向量檔，後續可以免去上述的前處理時間。

```python
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

embeddings = OpenAIEmbeddings(api_key=config.get('line-bot', 'openai_api_key'))

# 檢查是否已經建立索引
if os.path.exists('faiss_index/index.faiss'):
    print('Loading faiss index')
    faiss_index = FAISS.load_local('faiss_index', embeddings, allow_dangerous_deserialization=True)
    vector = faiss_index
else:
    print('Building faiss index')
    pdf_text = read_pdf(document_choice)
    chunks = split_text_into_chunks(pdf_text)
    faiss_index = FAISS.from_texts(chunks, embeddings)
    FAISS.save_local(faiss_index, 'faiss_index')
    vector = faiss_index
```

### 建立 function

建立一個實際的 function 來使用 rag 的功能，這裡會配合使用到 openai 的相關內容，要注意的點是 prompt 要下的精準，而且要注意記憶對話的處理。

```python
import openai

def chat_prompt(user_id, prompt):
  
    # find similar chunks
    results = vector.similarity_search(prompt, k=5)

    # Join these results into a single text to be used in the system
    relevant_content = "\n\n".join([result.page_content for result in results])

    # 構建對話歷史，包括之前的兩條對話
    conversation = [
        {"role": "system", "content": "想指定的 prompt"},
        {"role": "system", "content": relevant_content}
    ]

    conversation.append({"role": "user", "content": prompt})
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",  # Specify the model to be used
        messages=conversation,
        max_tokens=10000  # Limit the number of tokens in the response to avoid exceeding API limits
    )

    assistant_reply = response['choices'][0]['message']['content']

    return assistant_reply
```

#### 記憶對話的處理

會在每次對話結束後，將問答都存進 Redis ，以 line uid 作為 key 的資料格式，並且在啟動下一次對話時，將結果組合起來

```python
# save conversation

result_to_redis = [{"role": "user", "content": prompt}, {"role": "assistant", "content": assistant_reply}]
if previous_conversation:
    result_to_redis.extend(json.loads(previous_conversation))
    if len(result_to_redis) > memory_chat_count:
        result_to_redis = result_to_redis[:memory_chat_count]

r.set(user_id, json.dumps(result_to_redis))
```

```python
# get the previous conversation

previous_conversation = r.get(user_id)
if previous_conversation:
    conversation.extend(json.loads(previous_conversation))
```



如此便完成相關 rag 知識庫的功能，後續可針對 promtp 或是其他效能相關內容進行修改。


