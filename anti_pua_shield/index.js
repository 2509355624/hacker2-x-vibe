const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（只服务static目录）
app.use(express.static(path.join(__dirname, 'core', 'static')));

// 导入 AI 服务
const aiService = require('./services/ai_service');

// 根路径，返回主页（必须在静态文件服务之后）
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'core', 'templates', 'home.html'));
});

// 聊天模式页面
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'core', 'templates', 'index.html'));
});

// API 路由
app.post('/api/generate/', async (req, res) => {
    try {
        const { scene, user_input } = req.body;

        const valid_scenes = ["职场PUA", "亲戚催婚", "甲方刁难", "朋友攀比"];
        if (!valid_scenes.includes(scene)) {
            return res.status(400).json({ code: 400, msg: "请选择有效的场景" });
        }

        if (!user_input || user_input.trim() === '') {
            return res.status(400).json({ code: 400, msg: "请输入对方的刁难话术" });
        }

        const result = await aiService.generate_pua_shield_content(scene, user_input);
        if (result.error) {
            return res.status(500).json({ code: 500, msg: result.error });
        }

        return res.status(200).json({ code: 200, data: result, msg: "生成成功" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ code: 500, msg: `系统异常：${e.message}` });
    }
});

// 游戏题目生成 API
app.post('/api/game/questions/', async (req, res) => {
    try {
        const { scene, level, count = 5 } = req.body;

        const valid_scenes = ["职场PUA", "亲戚催婚", "甲方刁难", "朋友攀比"];
        if (!valid_scenes.includes(scene)) {
            return res.status(400).json({ code: 400, msg: "请选择有效的场景" });
        }

        const valid_levels = ["easy", "medium", "hard"];
        if (!valid_levels.includes(level)) {
            return res.status(400).json({ code: 400, msg: "请选择有效的难度" });
        }

        const questions = await aiService.generate_game_questions(scene, level, count);
        if (questions.error) {
            return res.status(500).json({ code: 500, msg: questions.error });
        }

        return res.status(200).json({ code: 200, data: questions, msg: "生成成功" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ code: 500, msg: `系统异常：${e.message}` });
    }
});

// AI 分析回复 API
app.post('/api/game/analyze/', async (req, res) => {
    try {
        const { pua_line, your_reply } = req.body;

        if (!pua_line || pua_line.trim() === '') {
            return res.status(400).json({ code: 400, msg: "请输入PUA话术" });
        }

        if (!your_reply || your_reply.trim() === '') {
            return res.status(400).json({ code: 400, msg: "请输入你的回复" });
        }

        const result = await aiService.analyze_reply(pua_line, your_reply);
        if (result.error) {
            return res.status(500).json({ code: 500, msg: result.error });
        }

        return res.status(200).json({ code: 200, data: result, msg: "分析成功" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ code: 500, msg: `系统异常：${e.message}` });
    }
});

// 游戏页面路由
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'core', 'templates', 'game.html'));
});

// 聊天页面静态资源（CSS/JS）
app.use('/css', express.static(path.join(__dirname, 'core', 'static', 'css')));
app.use('/js', express.static(path.join(__dirname, 'core', 'static', 'js')));

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
