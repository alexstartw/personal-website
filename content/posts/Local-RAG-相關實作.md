---
title: Local RAG 相關實作
date: "2024-09-16 12:43:57"
description: 這篇文章主要是紀錄一下如何使用 Local RAG 來實作一個簡單的應用
categories:
  - 深度學習會遇到的大小事
tags:
  - Python
  - RAG
  - Streamlit
  - LLM
  - OpenAI
cover: /images/posts/covers/localrag.jpeg
---
## 實作
### 動機
配合公司專案，期望建立一個機器人的應用，透過 Local RAG 來實作一個簡單的問答機器人，並透過 Streamlit 來建立一個簡單的前端介面。
先以小型專案來測試 Local RAG 的效能，並且了解如何使用 Local RAG 來實作一個簡單的應用。

### 流程
1. 了解實作內容
2. 取得資料授權
3. 資料前處理
4. 實際開發
5. 後續測試

## 開發流程

### 資料內容取得
期望是以 `pdf` 的格式來取得資料，配合個人興趣，故選擇排球裁判規章來當作資料來源。
> 這邊使用的資料是來自 謝佶櫳學長的 [排球裁判規章](https://issuu.com/jilong1004/docs/_______________/1)

### 開發環境
- Python 3.9
- openai 0.28.0 (考慮到 ChatGPT 的應用，會需要注意版本)
- streamlit 1.37.1
- langchain 0.2.16

### 開發流程
1. 讀取資料

```Python
def read_pdf(file_path):
    with open(file_path, "rb") as file:
        # Create a PDF reader object
        reader = PyPDF2.PdfReader(file)
        text = ""

        # Iterate through each page in the PDF and extract text
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()  # Extract text from the page

        return text  # Return the extracted tex
```

2. 資料前處理

配合 langchain 進行資料前處理，主要是將資料切割成適合的 chunk 來進行問答。
尋找合適的 chunk 大小，避免語意斷裂。並降低 openai 的 API 使用次數。

```Python
# 設定 chunk 大小，例如每個 chunk 最多 10000 字元
def split_text_into_chunks(text, chunk_size=10000, chunk_overlap=2000):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,  # 每個 chunk 的最大字元數
        chunk_overlap=chunk_overlap  # 每個 chunk 間的重疊部分，避免語意斷裂
    )
    return text_splitter.split_text(text)
```

3. 針對建立的 chunk 建立 index

```Python
if 'faiss_index' not in st.session_state:

    # Read the content from a local PDF file and store it in a variable
    pdf_text = read_pdf(document_choice)
    chunks = split_text_into_chunks(pdf_text)

    embeddings = OpenAIEmbeddings(api_key=config['openai_api_key'])

    index_session_name = None
    # 建立索引並儲存到 session 中
    st.session_state['faiss_index'] = FAISS.from_texts(chunks, embeddings) 
```

4. 建立對話過往紀錄

```Python
# 從 session_state 中讀取索引
vector = st.session_state['faiss_index']

# 初始化對話歷史，如果還沒有則創建
if 'conversation_history' not in st.session_state:
    st.session_state['conversation_history'] = []
if 'conversation_history' in st.session_state:
    st.write("Previous conversations:")
    for chat in st.session_state['conversation_history']:
        if chat['role'] == "user":
            st.write(f"User: {chat['content']}")
        elif chat['role'] == "assistant":
            st.write(f"Assistant: {chat['content']}")
```

5. 設定 streamlit 的前端介面

```Python
# Streamlit UI: Set the title of the web interface
st.title( document_choice.split('.')[0] + " Query System")

# Input box for users to enter their query
prompt = st.text_input("Enter your query:")
```

6. 透過 Local RAG 進行問答

會先針對使用者的問題進行相似度搜尋，找出最相似的 chunk，再透過 OpenAI 的 API 進行問答。
如此可以減少 API 的使用次數，並且提高效能與降低 API Cost。

```Python
# Generate response button
if st.button("Generate"):
    if prompt:  # If the prompt is not empty
        # Perform similarity search with FAISS
        results = vector.similarity_search(prompt, k=5)  # Find the 5 most relevant chunks

        # Join these results into a single text to be used in the system
        relevant_content = "\n\n".join([result.page_content for result in results])

        # 構建對話歷史，包括之前的對話
        conversation = [
            {"role": "system", "content": "You are a helpful assistant. You can only answer based on the provided document. If the information is not in the document, state that it is not available in the document."},
            {"role": "system", "content": relevant_content}
        ]

        # 加入之前的對話記錄（可設定最大儲存量）
        conversation.extend(st.session_state['conversation_history'])

        # 使用最新的問題
        conversation.append({"role": "user", "content": prompt})

        # Call OpenAI API to generate a response based on the content of the PDF and conversation history
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",  # Specify the model to be used
            messages=conversation,
            max_tokens=10000  # Limit the number of tokens in the response to avoid exceeding API limits
        )

        # Extract the assistant's reply
        assistant_reply = response['choices'][0]['message']['content']

        # 將新的問題和回應加入歷史，只保留指定的數量
        st.session_state['conversation_history'].append({"role": "user", "content": prompt})
        st.session_state['conversation_history'].append({"role": "assistant", "content": assistant_reply})

        # 可設定保存的指定量（即一個問題和一個回應）
        if len(st.session_state['conversation_history']) > memory_chat_count:
            st.session_state['conversation_history'] = st.session_state['conversation_history'][-memory_chat_count:]

        # Display the generated response in the Streamlit interface
        st.write("Generated Response:")
        st.write(assistant_reply)  # Show the model's response
    else:
        # If no prompt was entered, display a message asking for input
        st.write("Please enter a prompt!")
```

### 實際執行畫面

![local_rag.png](/images/posts/Local-RAG-相關實作/local_rag.png)

### UI 介面修改

為了可以更接近 ChatGPT 的樣子，透過將 `st.write` 改為 `st.chat_message` 來進行修改。
再將原本 `prompt = st.text_input("Enter your query:")` 修改為 `prompt = st.chat_input(placeholder="請輸入您的問題")`
即可將頁面修改成如下形式。

![local_rag-1.png](/images/posts/Local-RAG-相關實作/local_rag-1.png)


## 後續優化項目

- 針對讀取大型文檔速度可能需要優化（已優化，僅在初次登入時進行向量化，並將內容存到 session 中）
  ```python
  if 'faiss_index' not in st.session_state:

    # Read the content from a local PDF file and store it in a variable
    pdf_text = read_pdf(file_name)
    chunks = split_text_into_chunks(pdf_text)
    embeddings = OpenAIEmbeddings(api_key=config['openai_api_key'])

    # 保存索引到 session_state
    st.session_state['faiss_index'] = FAISS.from_texts(chunks, embeddings)
  ```
- 目前選用之模型無法辨別圖片內容，期望未來更換模型來完成
- 將本系統整合到 LineBot ，嘗試更多元化的 UI 介面
- 針對 user 下的 prompt 進行更多的前處理，提高問答的準確性

## 參考資料
> [Streamlit UI 相關設定](https://blog.jiatool.com/posts/streamlit_2023/)
