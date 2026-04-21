const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'core', 'static')));
app.use(express.static(path.join(__dirname, 'core', 'templates')));

// 导入 AI 服务
const aiService = require('./services/ai_service');

// 根路径，返回 index.html
app.get('/', (req, res) => {
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

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
