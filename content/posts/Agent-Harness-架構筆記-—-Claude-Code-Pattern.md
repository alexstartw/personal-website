---
title: Agent Harness 架構筆記 — Claude Code Pattern
date: "2026-04-01"
description: 針對 Agent Harness 的整體架構進行理解與紀錄
categories:
  - 深度學習會遇到的大小事
tags:
  - Agent Harness
  - Claude Code
cover: /images/posts/covers/Agent-Harness.png
---

# 專案背景


**claw-code**（instructkr/claw-code）是一個在 2026 年 3 月 31 日因 Claude Code 原始碼外洩事件而誕生的開源專案。作者 Sigrid Jin 在凌晨 4 點，以 clean-room rewrite（從頭重寫）的方式，將 Claude Code 的 agent harness 架構用 Python 還原，後續正在用 Rust 重寫以提升性能。

> ⚠️ 此專案與 Anthropic 無任何官方關聯，也不包含原始洩漏程式碼。

---


# 核心設計哲學


## The Model IS the Agent


**最重要的洞見**：Agent 永遠是模型本身，不是周圍的程式碼。你寫的所有程式碼都是 **Harness**（套具）——一個讓模型得以感知、行動、記憶的環境。


```javascript
Harness = Tools + Knowledge + Observation + Action Interfaces + Permissions
```

- **Model 決策**：何時呼叫工具、何時停止、需要什麼知識
- **Harness 執行**：提供環境，不干涉決策
- **常見錯誤**：用 if-else / node graph 幫 model 做決策 → 這是 Rube Goldberg Machine，不是真正的 Agent

## Claude Code 完整公式


```javascript
Claude Code = one agent loop
            + tools (bash, read, write, edit, glob, grep, browser...)
            + on-demand skill loading
            + context compression
            + subagent spawning
            + task system with dependency graph
            + team coordination with async mailboxes
            + worktree isolation for parallel execution
            + permission governance
```


---


# 架構六層


## ① Agent Loop（核心）


最小可運行的 Agent 就是一個 while 迴圈。**這個 loop 本身永遠不變，所有 harness 機制圍繞它擴展**。


```python
def agent_loop(messages):
    while True:
        response = client.messages.create(
            model=MODEL, system=SYSTEM,
            messages=messages, tools=TOOLS,
        )
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason != "tool_use":
            return  # Model 決定停止

        results = []
        for block in response.content:
            if block.type == "tool_use":
                output = TOOL_HANDLERS[block.name](**block.input)
                results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })
        messages.append({"role": "user", "content": results})
```


## ② Tools — 給 Agent 手腳


| 工具                | 說明                                   |
| ----------------- | ------------------------------------ |
| Bash / Shell      | 執行任意系統命令、腳本                          |
| File I/O          | read / write / edit / glob / grep    |
| Browser / API     | 網路請求、爬蟲、外部 API                       |
| Tool Dispatch Map | `name → handler` 映射，新增工具只加一個 handler |


**設計原則**：工具要 atomic（原子性）、composable（可組合）、well-described（清楚描述）。


## ③ Knowledge & Context — 給 Agent 記憶


### 記憶的三種形態


| 類型                       | 存在位置             | 生命週期          | 管理方式                             |
| ------------------------ | ---------------- | ------------- | -------------------------------- |
| Working Memory（運作記憶）     | messages[] array | Session 結束即消失 | Compression + Subagent Isolation |
| Persistent Memory（持久記憶）  | 磁碟（JSON/JSONL）   | 明確刪除前永久保留     | Task System（s07）                 |
| On-demand Knowledge（知識庫） | 靜態檔案，按需注入        | 靜態存在          | Skill Loading（s05）               |

> 核心原則：大多數 Agent 框架犯的錯誤是把所有東西塞進 system prompt。Claude Code 的做法相反——只在需要的時候，把需要的東西放進 context。

### Context 生命週期


**Step 1 — 初始化**


Session 開始時 `messages[]` 是空的。system prompt 只放最核心、最穩定的指令（通常 < 60 行）。知識和工具描述不在這裡。


```python
messages = []
system = "你是一個 coding agent，謹慎行事..."  # 精簡，<60行
# ❌ 不要：system 塞入全部文件、schema、工具描述
```


**Step 2 — Tool 呼叫 → Context 累積**


每次 tool 執行結果都被 append 進 `messages[]`。file read、bash output、API response 全部留在 context 裡。這是 Working Memory 增長的主要來源。


```python
# 每一輪 loop 後
messages.append({"role": "assistant", "content": response.content})
messages.append({"role": "user", "content": tool_results})
# messages 持續增長 → 接近 token 上限
```


**Step 3 — 當 context 接近上限：三層壓縮（Context Compact, s06）**


不是截斷，而是有策略地摘要。三層由輕到重，逐層執行。


```python
# Layer 1：摘要尾部（最近的保留，遠的摘要）
summary = llm("請摘要這段對話的關鍵結論", old_messages)
messages = [summary_msg] + recent_messages

# Layer 2：滑動窗口（只保留最後 N 輪）
messages = messages[-20:]

# Layer 3：強制截斷（最後手段）
messages = messages[:5] + messages[-10:]
```


**Step 4（預防勝於治療）— Subagent Isolation（子任務隔離, s04）**


把「高噪音」的子任務交給獨立 subagent 執行，只把最終結論帶回主 context。子任務可能產生 30+ 輪 tool call，全部丟棄。


```python
# 主 agent
result = run_subagent("分析這 50 個檔案，告訴我依賴關係")
messages.append({"role": "user", "content": result})  # 只加摘要

# subagent 內部（獨立 messages[]，執行完整丟棄）
def run_subagent(prompt):
    sub_msgs = [{"role": "user", "content": prompt}]
    # ...執行完整 agent loop...
    return final_text_only  # 子 context 完整丟棄
```


**Step 5 — Task Graph 跨越 Session 邊界（s07）**


Session 結束後，已完成的工作不會消失——因為目標和狀態被持久化到磁碟。下一個 session 啟動時，agent 讀取任務圖，繼續未完成的工作。這是解決 Context Amnesia（失憶症）的根本手段。


```json
// tasks.json（磁碟上，Session 無關）
// 新 Session 啟動 → 讀檔 → 知道從 t2 繼續
{
  "tasks": [
    {"id": "t1", "status": "done"},
    {"id": "t2", "status": "in_progress", "deps": ["t1"]},
    {"id": "t3", "status": "pending", "deps": ["t2"]}
  ]
}
```


## ④ Planning & Task System — 給 Agent 計劃能力

- **TodoWrite（s03）**：先列計劃再執行。沒有計劃的 agent 會飄移，有計劃完成率翻倍
- **Task Graph（s07）**：檔案式持久化任務圖，含依賴關係（DAG），目標跨 session 保存
- **Background Tasks（s08）**：慢操作用 daemon thread 背景執行，完成時注入通知

```json
// tasks.json（磁碟上，Session 無關）
{
  "tasks": [
    {"id": "t1", "status": "done"},
    {"id": "t2", "status": "in_progress", "deps": ["t1"]},
    {"id": "t3", "status": "pending", "deps": ["t2"]}
  ]
}
```


## ⑤ Multi-Agent Team — 給 Agent 協作夥伴


| 機制                       | 說明                                              |
| ------------------------ | ----------------------------------------------- |
| Agent Teams（s09）         | lead agent + 多個 teammate，JSONL mailbox 非同步溝通    |
| Team Protocols（s10）      | 統一 request-response FSM，shutdown/approval 有共同協議 |
| Autonomous Claiming（s11） | Teammate 主動掃描任務板、自動認領，不需 lead 逐一分配              |
| Worktree Isolation（s12）  | 每個 agent 在獨立 directory，task ID 綁定，零干擾平行執行       |


## ⑥ Permission Governance — 給 Agent 邊界

- **Sandbox**：限制 file access 範圍
- **Human-in-the-loop**：破壞性操作（delete/deploy）需人工 approval
- **Data Flywheel**：每次執行的 perception→reasoning→action trace 是訓練下一代模型的資料

---


# 記憶保留的四種策略


## 策略一：Subagent Context Isolation（最優雅）


把「高噪音」子任務交給獨立 subagent，子 context 完整丟棄，只把最終結論帶回主 context。


```python
def run_subagent(prompt: str) -> str:
    sub_messages = [{"role": "user", "content": prompt}]
    for _ in range(30):  # safety limit
        response = client.messages.create(
            model=MODEL, system=SUBAGENT_SYSTEM,
            messages=sub_messages, tools=CHILD_TOOLS, max_tokens=8000,
        )
        sub_messages.append({"role": "assistant", "content": response.content})
        if response.stop_reason != "tool_use":
            break
        # ... execute tools ...
    return final_text_only  # 子 context 完整丟棄

# 主 agent 只加一筆摘要
result = run_subagent("分析這 50 個檔案，告訴我依賴關係")
messages.append({"role": "user", "content": result})
```


**適用場景**：跑測試、掃文件、處理 log 等高噪音操作；獨立調查任務


## 策略二：On-demand Skill Injection


知識不放 system prompt，透過 tool_result 在需要時注入。

- [SKILL.md](http://skill.md/) 放在固定目錄
- Agent 知道「有哪些技能可以用」
- 需要時呼叫 `load_skill("deploy")`，結果注入當前 context
- **與 RAG 的差異**：不需要 embedding 基礎設施，Agent 主動判斷需要什麼

## 策略三：Task Graph Persistence（解決失憶症）


Context Amnesia（失憶症）的根本解法——把狀態寫進磁碟，不依賴 model 的記憶。

- 任務圖以 JSONL 格式持久化（有向無環圖 DAG）
- 每個 task 有 id、status、dependencies、output_summary
- Session 結束後，下個 Session 讀檔繼續

## 策略四：Three-Layer Context Compression


當 context 接近上限時，三層由輕到重：


| 層次      | 策略    | 說明                    |
| ------- | ----- | --------------------- |
| Layer 1 | 摘要舊訊息 | 用 LLM 摘要遠期對話，保留近期完整內容 |
| Layer 2 | 滑動窗口  | 只保留最後 N 輪             |
| Layer 3 | 強制截斷  | 最後手段，保頭保尾丟中間          |


**核心原則**：重要的結論比過程細節有更長的保留週期。近期比遠期重要。


---


# 設計原則對照表


| ❌ 常見錯誤                   | ✅ Claude Code 做法                |
| ------------------------ | ------------------------------- |
| 所有文件塞進 system prompt     | System prompt 精簡（< 60 行），知識按需注入 |
| 期待 model 記住所有事情          | 任務狀態持久化到磁碟                      |
| 用 if-else 控制 agent 流程    | 讓 model 自己做決策                   |
| 每個 session 從頭開始（失憶）      | Task Graph 跨越 session 邊界        |
| Subagent 結果全部傳回主 context | Subagent 只傳回摘要，主 context 保持乾淨   |


---


# 對 DE/DA 架構的啟發


這套設計理念完全可以遷移到 Data Pipeline Agent：

- **Skill Injection**：把 dbt schema、資料品質規則、pipeline 文件當作 Skill files，按需注入而非預載
- **Task Graph**：把 pipeline 執行狀態、資料品質報告持久化，支援中斷後繼續
- **Subagent**：把「跑完整資料品質檢查」這種高噪音操作交給 Subagent，只把異常摘要傳回主 agent
- **Worktree Isolation**：不同 pipeline 在獨立工作目錄平行執行

---


# 參考資源

- [claw-code repo](https://github.com/instructkr/claw-code) — 原始專案
- [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) — 最完整的 harness 教學，12 個漸進式 session
- [Claude Code 官方文件 - Subagents](https://code.claude.com/docs/en/sub-agents)
- 

[agent_memory_design_philosophy.html](https://prod-files-secure.s3.us-west-2.amazonaws.com/59d2f675-7dda-436b-b2b2-c358473b3a09/4ca49910-5419-462e-af6c-fbc2c9ba1d52/agent_memory_design_philosophy.html?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QC2N2O2P%2F20260407%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260407T055206Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBUaCXVzLXdlc3QtMiJGMEQCIErT3fvGEhZ6KrPE9JZSHn6nsbSuiR1PiMPmrfIJm%2BHEAiAPtmrJeJBPf66%2FDAOh5xuyKkFPDLEVvR%2BbLQQ3jagRWSqIBAje%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMocQX8GCpwkcE1b13KtwDjMaYIeXYiedXa%2Bcq1bM9A7UAm%2B02mJSuNhRcdus9wOixS0wJAoZKYaCG5eJ480QbAuCvSSvYgdteOuw5mMrrFa%2FRyq%2BvsmOY%2BejBDoxApA7Iiw5x86wYQlIFiz7fsvfCNGBx8p0lxN%2Bp1VA5dTBH7JRlJuMn3rJdSOWWuP%2FABnKfbCMH%2Bb5YO3ReNY6%2ByiKVLtTYqw9yOwNXY42e2WBO4rjTmKAVuttQNq12zHLMGJBR2PSC6H4cXtxMQH2fFHJ1OBOq3CoGuuq9wJyY74E7ZayouciW72GWgId0%2BULXT62ljn11OEek4rNFOV3brul10k%2BxGA7sWC64NF5csGBAQqAkuY85NKHud7SEotdyEIw4reyi2jZTz3hKoaKg%2Bg1UKPfMDA5wXSUUS%2BrNaBt632WnyYoFqwI5iQ0hk085OVbbKWMnHEEh6NLAEU9JC9MgH77USiUlb1aGXF56TcMZ%2F1YdrxrPP4RWqTopNf7HwQ9CIty6AtgvFPJFfES66Is3x%2FMaXTsUizVHWnf0J27975i6L%2FzxNVl8wTuvibCZ0Pemvgb4wM1Tlx8x%2Bbeox2Xv1wThR1ainhGHnVmNEhE06oeJLg2aRQhiNlc4W3dNkahmXlSuXzwvgS%2FlTrsw15LSzgY6pgHRklIARtllM35XPjAyMT%2FtnjsEoCycquvFuGi3XxTjdoJyhQhkJwRSMT1weZAQd7jAFPRTo0VMqf%2FGpG1NDcm1CDsCVeO3kDGpU%2F8Cr9pgoJaBJ0r5dA5wmt3UtYgmyor0tT35X6nTLiI98ccVf3Q5Z7YZYTEsAoUpu4QEm2ujRrJNWBm6E%2BB6KAutA7xKPxYIBItVI%2BS1%2Be5sVhOfs8uV6rhsNAW8&X-Amz-Signature=ae227f44461bd6faadc75ac06441211516a6fcaf9d79fd8202e109feaadc16fc&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)
