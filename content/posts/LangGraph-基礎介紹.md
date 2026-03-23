---
title: LangGraph 基礎介紹
date: "2025-02-03 14:37:46"
description: 針對 LangGraph 的基礎介紹，為了配合 LangChain 實作做準備
categories:
  - 資料會遇到的大小事
tags:
  - LangGraph
cover: /images/posts/covers/langchain.jpeg
---

## LangGraph 介紹

### 什麼是 LangGraph？

LangGraph 是一個基於 LangChain 和 NetworkX 構建的 Python 庫，旨在幫助開發者設計和管理圖形（Graph-based）LLM（大型語言模型）應用。它提供了一種模組化的方法來構建複雜的 LLM 工作流程，允許開發者以**節點（nodes）和邊（edges）**的方式定義和執行 AI 任務。



### **LangGraph 的核心概念**

1. **圖（Graph）結構**：

    - LangGraph 允許使用者構建**有向圖（DAG）** 來表示 LLM 的推理流程。

    - 透過 **NetworkX**，LangGraph 可以處理複雜的任務流，例如決策樹、多步驟推理、自訂對話機制等。

2. **狀態管理（State Management）**：

    - LangGraph 支援**持續的狀態管理**，讓 LLM 在對話或流程中保持記憶並動態更新狀態。

    - 這使得開發者能夠建立更**上下文感知（Context-aware）**的 AI 應用。

3. **並行與條件執行**：

    - 可以在不同的節點中**並行**運行多個 LLM 任務，提升處理效率。

    - 允許根據條件改變路徑（如使用者輸入內容決定不同的應對策略）。

4. **與 LangChain 整合**：

    - LangGraph **擴展 LangChain 的 Agent 與 Chains**，提供更靈活的 AI 應用架構。

    - 例如，可以用於建構具有**多輪對話（multi-turn conversations）、複雜決策流**的系統。



### **為什麼要 LangGraph？**

當你的產品需要一些流程、步驟，用 **LangGraph** 搭配 LangChain 能夠

- 實作出流程的運作

- 輕易把 LLM 引入每個步驟當中

- 把「流程」抽象出來，好維護。把每一個步驟複雜的實作封裝起來



### 三個重要組件

把握這三個組件，即可搭建出最粗略的一個 LangGraph 架構。

- State：可以理解成變數表

- Node：實際做事情的地方

- Edge：流程控制

### 實際操作

#### 安裝套件

以最簡易實作來說，以 `pip` 安裝即可。

```python
pip install langgraph
```

#### 猜密碼遊戲

這邊會先行個別介紹上述的三個重要組件的寫法，後續再將整體組合。



- State：代表著當前的處理狀態，包含**目前的輸入、計算中的數據、狀態的變更**

   ```python
   # 定義狀態結構
   class PasswordState(TypedDict):
       """
       紀錄密碼狀態的結構
       """
       password: str
       correct_position: int
       wrong_position: int
   ```

  `TypedDict` 是在 Python 中的一種型態宣告，使用上來說跟 `dict` 一樣，只是他會預告會有哪些 `key` 與對應的型態。在實際執行時，少了 `key` 或是多了 `key` 都**不會報錯**。

- Node：是一個單獨處理單元，負責接收輸入的 `state` ，並依照邏輯處理，最後回傳新的 `state`

   ```python
   ## 宣告這個 node 該做什麼事情
   def feedback_message(state: PasswordState) -> PasswordState:
       """
       顯示回饋訊息，並讓使用者重新輸入密碼
       :param state: 
       :return: 
       """
       print(f"✅ {state['correct_position']} 個數字正確且位置正確")
       print(f"⚠️ {state['wrong_position']} 個數字正確但位置錯誤")
       new_password = input("🔑 請再輸入密碼：")  # 讓使用者重新輸入
       return {"password": new_password, "correct_position": 0, 
               "wrong_position": 0}
   
   ## 給定 node 的名稱，與哪個 function 是這個 node 該執行的
   graph.add_node("feedback", feedback_message)
   ```

- Edge：代表 `node` 之間的關係與流程，可以以條件性來決定要怎麼連接 `node`

   ```python
   # 透過 `add_conditional_edges` 來動態選擇下一步
   def next_step(state: PasswordState):
       if state["correct_position"] == len(CORRECT_PASSWORD):
           return "unlocked"
       else:
           return "feedback"
   
   graph.add_conditional_edges("check", next_step) # 參數：起點; 下一步該怎麼走的判斷
   graph.add_edge("feedback", "check")  # 讓使用者重新輸入後再次驗證
   
   # 設定起始節點
   graph.set_entry_point("check")
   ```

- 運行程式

   ```python
   # 建立可執行 Graph
   app = graph.compile()
   ```



配合以上相關技能，就可以完成一個很基礎 `LangGraph` 的 Demo。



### 進階相關內容

這邊會針對一些特點進行介紹

- State Reduce

- Super Step & Branching

- Checkpointer

- Human-in-the-loop

以下內容參考 <https://ywctech.net/ml-ai/langchain-langgraph-agent-part2/>

#### State Reduce

`State Reduce` 是 **LangGraph** 用來**合併多個節點輸出的狀態**的機制。在 **分支（branching）後**，不同的路徑可能會產生不同的狀態，而 **State Reduce 負責將這些結果合併**，確保下一個節點能接收完整的狀態。

若依照原先的方式，`Node` 回傳的 `partial state` 會將 key 值覆蓋，這邊可以配合 Python 本身的 `Annotated` 來實作。

#### Annotated

Python 的 `typing.Annotated` 只是對於「型態」的一種「註釋」，執行時預設並無影響。在 LangGraph 可搭配這個做法來外掛自己所需要的 function。

後面的 function 可以將原本的 `state` 與 `node 回傳值` 揉合在一起，並且記錄成自己期望的紀錄型態。

實際操作如下：

```python
def concat_lists(original: list, new: list) -> list:
    return original + new

class MyState(TypedDict):
    # messages: list, Annotated 第一個參數為宣告型態，第二個是註釋
    messages: Annotated[list, concat_lists]

def fn1(state: MyState):
    return {"messages": [4]}

r = graph.invoke({"messages": [1, 2, 3]})
print(r)
# 結果是 {'messages': [1, 2, 3, 4]}
```

#### State 是 call-by-reference OR call-by-value？

`state` 的傳遞方式是 **Call-by-Value（值傳遞）與 Call-by-Reference（引用傳遞）的混合**，但主要偏向 **Call-by-Value。**

- 優點

  ✅ **確保狀態的可追蹤性**（每個步驟都有完整的 `state` 副本）\
  ✅ **避免 race condition（競態條件）**（當並行運行時，不同節點不會相互影響）\
  ✅ **提高可擴展性與 Debug 容易度**（每個 `state` 變更都是獨立的）



#### Superstep

一個 step 可以執行多個 node，故稱為 superstep 。節點中的連結可以一對多，也可以多對一，流程解書如下。會需要有 `Annotated`  reducer 才能讓 node 一對多，reduce 合併兩個 node 回傳的結果，不會有誰先誰後的問題（因 State 的更新順序理論上不能預期）。

![langchain-1.png](/images/posts/LangGraph-基礎介紹/langchain-1.png)



多對一的流程則會是依照順序下來，若想要等待兩邊都完成後再執行，則須將 L1 與 R3 變成一個整體，merge 成共同上游。

```python
  graph.add_edge("start", "left_1")
  graph.add_edge("start", "right_1")
  graph.add_edge("right_1", "right_2")
  graph.add_edge("right_2", "right_3")
  graph.add_edge(["left_1", "right_3"], "merge")  # 合成 list
  graph.add_edge("merge", END)
```

![langchain-2.png](/images/posts/LangGraph-基礎介紹/langchain-2.png)



最後，官方文件 **[Branching](https://langchain-ai.github.io/langgraph/how-tos/branching/?h=superstep#parallel-node-fan-out-and-fan-in)** 有更多厲害的模式

關於 super step, 有興趣追原始碼的可看 **[langgraph pregel 實作](https://github.com/langchain-ai/langgraph/blob/500a1abfeb3fcbdac18580f1c24ff774f077c686/langgraph/pregel/\__init_\_.py#L871)**。





#### Checkpointer & Human-in-the-loop

這部分目前不一定會使用到，可以等後續再將實際使用的內容補上～