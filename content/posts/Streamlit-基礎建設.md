---
title: Streamlit 基礎建設
date: "2024-09-06 15:23:51"
description: 資料科學的應用程式開發工具
categories:
  - 資料會遇到的大小事
tags:
  - Streamlit
  - Python
  - Data
cover: /images/posts/covers/streamlit.png
---
## 什麼是 Streamlit

Streamlit 是一個 Python 的函式庫，可以幫助 user 輕鬆建立出互動式的網頁。可以理解成一般後端開發在使用的 `swagger` 。

對於資料科學領域來說，可以省去很多 coding 的功夫。

## 使用 Streamlit

### 建立 conda 虛擬環境

利用指令建立一個 for Streamlit 使用的虛擬環境並切換過去

```shell
conda create --name myenv python=3.9
```

並將環境切換成指定的虛擬環境

```shell
conda activate myenv
```

### 以 py 檔建立

因為是使用 `PyChram` 作為 IDE，故我可以利用 Coding 直接完成相關 package 的 import，當然也可以利用 command 完成安裝的動作。

```python
import openai
import streamlit as st

# Streamlit 介面  
st.title("OpenAI GPT with Streamlit")  

# 設定 openai key
openai.api_key = "yourkey"
  
# 輸入框  
prompt = st.text_input("Enter your prompt:")  
  
# 按鈕來生成回覆  
if st.button("Generate"):  
    if prompt:  
        response = openai.completions.create(  
            model="gpt-4o-mini",  
            prompt=prompt,  
            max_tokens=100  
        )  
  
        # 顯示回覆  
        st.write("Generated Response:")  
        st.write(response['choices'][0]['message']['content'])  
    else:  
        st.write("Please enter a prompt!")
```

### 實際執行

完成程式撰寫後，可以下指令讓 streamlit 實際運作起來

```python
streamlit run demo.py
```

### 實際運行畫面

![streamlit-1.png](/images/posts/Streamlit-基礎建設/streamlit-1.png)