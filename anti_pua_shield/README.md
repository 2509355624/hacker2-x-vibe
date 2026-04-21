# 反PUA护盾

拒绝精神内耗，一键生成你的边界护盾。

## 功能介绍

### 聊天模式
输入对方的PUA话术，AI为你生成多层次反击策略：
- 🔥 低情商（爽怼天花板）
- 💭 中情商
- ✨ 高情商
- 🌀 超高情商（摆烂终结）

### 游戏模式
反PUA大作战闯关游戏，4大场景关卡：
- 💼 职场PUA
- 👨‍👩‍👧 亲戚催婚
- 💰 甲方刁难
- 🪑 朋友攀比

每关10道AI生成的PUA攻击题目，怼赢BOSS获得分数成就感！

## 快速启动

```bash
cd anti_pua_shield
npm install
npm start
```

服务启动后访问：http://localhost:3000

## 目录结构

```
anti_pua_shield/
├── index.js              # Express服务器入口
├── services/
│   └── ai_service.js      # AI服务（豆包API）
├── core/
│   ├── static/
│   │   ├── css/main.css
│   │   └── js/main.js
│   └── templates/
│       ├── home.html     # 主页
│       ├── index.html     # 聊天模式
│       └── game.html      # 游戏模式
├── .env                  # 环境配置
└── .env.dist             # 环境配置模板
```

## 环境配置

复制 `.env.dist` 为 `.env` 并配置：

```env
PORT=3000
VOLCANO_API_KEY=你的豆包API密钥
BASE_URL=https://ark.cn-beijing.volces.com/api/v3
```

## API接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/generate/` | POST | 生成反PUA护盾内容 |
| `/api/game/questions/` | POST | 生成游戏题目 |
| `/api/game/analyze/` | POST | AI分析回复是否怼成功 |

## 页面路由

| 路径 | 页面 |
|------|------|
| `/` | 主页（双入口选择） |
| `/chat` | 聊天模式 |
| `/game` | 游戏模式 |

## 技术栈

- **后端**：Node.js + Express
- **前端**：HTML + TailwindCSS + Vanilla JS
- **AI**：豆包大模型（字节跳动火山引擎）
