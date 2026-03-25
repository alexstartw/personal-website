---
title: 好用的terminal工具
date: "2026-03-24 17:22:07"
description: 推薦一些好用的 terminal plugins
tags:
  - terminal
  - cli
  - wezterm
cover: /images/posts/covers/wezterm.png
---

  ## 前言
  近期因為 `claude code` 開始大量使用 terminal，並且從 `iterms2` 搬家搬到 `WezTerm`，整理出一些可以加快開發的小 Plugin。
  
  ## WezTerm

  ### 分割視窗

  | 快捷鍵 | 動作 |
  |--------|------|
  | `CMD+D` | 水平分割（左右） |
  | `CMD+SHIFT+D` | 垂直分割（上下） |
  | `CMD+SHIFT+Z` | 放大/還原目前 Pane |

  ### Pane 導覽

  | 快捷鍵 | 動作 |
  |--------|------|
  | `CTRL+H` | 移到左側 Pane |
  | `CTRL+L` | 移到右側 Pane |
  | `CTRL+K` | 移到上方 Pane |
  | `CTRL+J` | 移到下方 Pane |
  | `CTRL+Tab` | 移到下一個 Pane |

  ### 語意導覽（Shell Integration）

  | 快捷鍵 | 動作 |
  |--------|------|
  | `CMD+SHIFT+↑` | 跳到上一個命令的 prompt |
  | `CMD+SHIFT+↓` | 跳到下一個命令的 prompt |

  > Shell Integration 啟用後，WezTerm 可感知每個命令的邊界，
  > 新分割視窗會自動繼承當前目錄。

  ### Quick Select 模式（快速複製）

  | 快捷鍵 | 動作 |
  |--------|------|
  | `CMD+SHIFT+Q` | 進入 Quick Select 模式 |

  Quick Select 自動標記可複製：git commit hash、UUID、IP 位址、檔案路徑

  ### 其他

  | 快捷鍵 | 動作 |
  |--------|------|
  | `CMD+P` | Command Palette |
  | `SHIFT+Enter` | 換行（不執行命令） |
  | `CMD+Click` | 開啟超連結（URL、GitHub PR、檔案路徑） |

  ---

  ## Shell（Zsh）

  ### fzf 模糊搜尋

  | 快捷鍵 | 動作 |
  |--------|------|
  | `CTRL+T` | 搜尋檔案並插入路徑（fd，尊重 .gitignore） |
  | `CTRL+R` | 搜尋歷史紀錄（Atuin 接管） |
  | `ALT+C` | 搜尋目錄並跳入（eza tree 預覽） |
  | `f` | 直接叫出 fzf |

  **fzf 內部操作：**

  | 按鍵 | 動作 |
  |------|------|
  | `CTRL+/` | 切換預覽視窗 |
  | `CTRL+U` | 預覽向上半頁 |
  | `CTRL+D` | 預覽向下半頁 |
  | `Enter` | 確認 |
  | `ESC` | 取消 |

  ### Atuin 歷史搜尋

  | 快捷鍵 | 動作 |
  |--------|------|
  | `CTRL+R` | 開啟 Atuin 歷史搜尋 UI |
  | `CTRL+A` | 切換搜尋範圍（global/local） |

  > Atuin 記錄每個命令的執行時間、退出碼、工作目錄。

  ### 目錄跳轉

  | 指令 | 動作 |
  |------|------|
  | `z <keyword>` | 智慧跳轉（zoxide） |
  | `zi` | 互動式選擇（zoxide + fzf） |
  | `ALT+C` | fzf 選目錄跳轉 |

  ### 常用 Alias

  | Alias | 實際指令 | 說明 |
  |-------|---------|------|
  | `ls` | `eza` | 列出目錄 |
  | `ll` | `eza -al --icons --git` | 詳細列表（含 git 狀態） |
  | `lt` | `eza --tree --level=2` | 樹狀結構 |
  | `cat` | `bat` | 語法高亮 |
  | `top` | `btop` | 資源監控 |
  | `lg` | `lazygit` | TUI git |
  | `yy` | `yazi` | 檔案管理器 |
  | `cc` | `claude` | Claude Code |
  | `zz` | `zellij -l two-pane` | Zellij 雙視窗 |
  | `f` | `fzf` | 模糊搜尋 |

  ---

  ## Lazygit

  | 快捷鍵 | 動作 |
  |--------|------|
  | `Space` | Stage/Unstage 檔案 |
  | `c` | Commit |
  | `p` | Push |
  | `P` | Pull |
  | `b` | 切換分支 |
  | `n` | 新建分支 |
  | `d` | 查看 diff（delta 美化） |
  | `?` | 顯示所有快捷鍵 |
  | `q` | 離開 |

  > Delta 已設為全域 git pager，`git diff`、`git log -p`、lazygit diff 自動美化。

  ### Delta 操作（在 diff 輸出中）

  | 快捷鍵 | 動作 |
  |--------|------|
  | `n` | 下一個改動區塊 |
  | `N` | 上一個改動區塊 |

  ---

  ## Yazi 檔案管理器

  ### 導覽

  | 快捷鍵 | 動作 |
  |--------|------|
  | `h/j/k/l` | 左/下/上/右（vim 風格） |
  | `gg` | 跳到頂部 |
  | `G` | 跳到底部 |
  | `Enter` | 進入目錄 / 開啟檔案 |

  ### 操作

  | 快捷鍵 | 動作 |
  |--------|------|
  | `a` | 新建檔案/目錄 |
  | `r` | 重新命名 |
  | `d` | 刪除（移入垃圾桶） |
  | `y` | 複製 |
  | `x` | 剪下 |
  | `p` | 貼上 |
  | `Space` | 選取 |
  | `f` | 搜尋（當前目錄） |
  | `/` | 全域搜尋（fd） |
  | `z` | 跳轉（zoxide） |
  | `~` | 回到 Home |

  ### 預覽支援

  | 檔案類型 | 預覽方式 |
  |---------|---------|
  | `.md` | Glow（渲染 Markdown） |
  | 圖片 | WezTerm image protocol |
  | 程式碼 | bat（語法高亮） |
  | 影片/音樂 | 系統預設 |

  ---

  ## 工具鏈總覽

  | 工具 | 用途 | 替代 |
  |------|------|------|
  | `eza` | 列目錄 | `ls` |
  | `bat` | 查看檔案 | `cat` |
  | `fd` | 搜尋檔案 | `find` |
  | `ripgrep (rg)` | 搜尋內容 | `grep` |
  | `fzf` | 模糊搜尋 | — |
  | `zoxide` | 智慧跳轉 | `cd` |
  | `atuin` | 歷史搜尋 | `CTRL+R` |
  | `delta` | Git diff 美化 | — |
  | `lazygit` | Git TUI | `git` |
  | `glow` | Markdown 渲染 | — |
  | `btop` | 資源監控 | `top` |
  | `starship` | Prompt | — |
  | `yazi` | 檔案管理 | `ranger` |
  | `zellij` | 終端多工 | `tmux` |

  ---

  ## 套用設定

  ```bash
  # 重新載入 shell 設定
  source ~/.zshrc

  # 測試 fzf 整合
  CTRL+T    # 搜尋檔案
  CTRL+R    # 搜尋歷史（Atuin）
  ALT+C     # 跳轉目錄

  # 測試 delta
  git diff  # 應看到美化的 diff 輸出

  # 測試 WezTerm Quick Select
  CMD+SHIFT+Q  # 進入快速複製模式

  ---
