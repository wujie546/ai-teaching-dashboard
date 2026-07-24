# 好讚教學工具箱 - 專案藍圖

## 專案概述
一個整合式教學工具平台，包含多個實用功能，部署到 Netlify 供教學使用。

## 資料夾結構
```
├── index.html              # 整合版主頁面（所有功能合併）
├── 01_Card/               # 數位名片
│   ├── index.html
│   ├── avatar.png
│   └── style.css
├── 02_Timer/              # 課堂倒數計時器
│   └── index.html
├── 03_Score/              # 小組計分板
│   └── index.html
├── 04_Lottery/            # 隨機點名抽籤
│   └── index.html
├── 05_Whiteboard/         # 隨堂電子白板
│   └── index.html
├── 06_Flashcard/          # 知識閃卡
│   └── index.html
└── 07_Dashboard/          # 功能卡牌傳送門
    └── index.html
```

## 功能清單
- [x] 01_Card：數位名片（可點擊 Email/官網連結）
- [x] 02_Timer：課堂倒數計時器（含快速時間選擇）
- [x] 03_Score：小組計分板（最高分紅色顯示）
- [x] 04_Lottery：隨機點名抽籤（含不重複抽籤）
- [x] 05_Whiteboard：隨堂電子白板（含保存版書）
- [x] 06_Flashcard：知識閃卡（100個中學英文單字+朗讀）
- [x] 07_Dashboard：功能卡牌傳送門
- [x] 整合版主頁面（所有功能合併，手機響應式）
- [x] LINE 瀏覽器檢測提示

## 部署資訊
- 平台：Netlify
- 網址：https://ai-teaching-dashboard.netlify.app
- 部署方式：Netlify CLI

## Obsidian 設定
- Vault 路徑：D:\Obsidian
- 專案資料夾：115.07.23舟神好讚教學工具箱

## 下一步
- [ ] 根據使用者需求調整功能
- [ ] 考慮加入更多教學工具
