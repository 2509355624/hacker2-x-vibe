const { OpenAI } = require('openai');

// 从环境变量中获取 API key
const apiKey = process.env.VOLCANO_API_KEY;
const baseUrl = process.env.BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';

// 创建 OpenAI 客户端
const client = new OpenAI({
  apiKey: apiKey,
  baseURL: baseUrl
});

async function generate_pua_shield_content(scene, user_input) {
  const prompt = `⚠️ 【最高优先级强制执行：抖音爆款反向情商规则】
本次情商分级为反向设定，绝对禁止按常规情商逻辑生成，必须100%遵守以下定义：
1. 【低情商】：实际是全网爆火的超高情商爽怼话术，直白有梗、戳中痛点、解气好笑，一句话怼得对方哑口无言，是用户最想复制的核心内容，风格犀利不刻薄、有网感不低俗。
2. 【中情商】：常规不卑不亢的回怼，礼貌中立，不绕弯也不撕破脸，中规中矩不出错。
3. 【高情商】：温柔体面的回怼，给对方留足台阶，顾全双方面子，不引发冲突。
4. 【超高情商】：实际是摆烂式降维打击话术，直接跳出对方的PUA逻辑，终结话题，佛系又有绝对杀伤力，让对方完全无法接话。

你是专业的反PUA护盾助手，用户当前场景：【${scene}】
对方原话：${user_input}

请严格按以下要求生成内容，所有话术必须口语化、有网感、贴合场景，不生硬、不书面、不低俗：
1. 分情商层级的回怼话术：每个层级生成2条，严格对应上面的反向规则
2. 心态建设解药：2段短文案，帮用户快速稳住情绪、建立心理边界，摆脱精神内耗
3. 边界拒绝话术：2条，清晰干脆拒绝对方的无理要求，不拖泥带水

输出必须是标准JSON格式，仅返回以下结构，不要任何多余文字、解释、备注、markdown：
{
  "backtalk": {
    "低情商": ["话术1", "话术2"],
    "中情商": ["话术1", "话术2"],
    "高情商": ["话术1", "话术2"],
    "超高情商": ["话术1", "话术2"]
  },
  "mind_help": ["段落1", "段落2"],
  "refuse_words": ["话术1", "话术2"]
}`;

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-r1-250528',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (e) {
    console.error('AI 生成失败:', e);
    return { error: `生成失败：${e.message}` };
  }
}

async function generate_game_questions(scene, level, count = 5) {
  const levelPrompt = {
    easy: "简单 - 常见的、比较直白的PUA话术，反击难度低，成功率高的怼法明显",
    medium: "中等 - 比较隐蔽的、拐弯抹角的PUA话术，需要一定技巧才能怼成功",
    hard: "困难 - 非常隐蔽、高级的PUA技巧，话术看似合理但实则道德绑架，反击难度高"
  };

  const prompt = `你是反PUA大作战游戏的设计师。请为"${scene}"场景生成${count}道游戏题目。

难度要求：${levelPrompt[level]}

每道题目必须包含：
1. pua_line: 一句BOSS（攻击者）说的PUA话术，要符合场景，真实感强
2. options: 4个反击选项，每个选项包含：
   - text: 具体的回怼话术（口语化、有网感）
   - is_correct: true表示这是能成功怼回去的选项，false表示会被反怼

题目设计要点：
- 正确答案要有爽感，能真正怼得对方哑口无言
- 错误答案要看起来像那么回事，但仔细想会发现力度不够或容易被反驳
- 答案顺序要随机打乱，不要让正确答案总在同一个位置

输出必须是标准JSON数组格式：
[
  {
    "pua_line": "PUA话术内容",
    "options": [
      {"text": "选项A话术", "is_correct": false},
      {"text": "选项B话术", "is_correct": true},
      {"text": "选项C话术", "is_correct": false},
      {"text": "选项D话术", "is_correct": false}
    ]
  }
]

注意：严格输出JSON，不要任何解释、备注、markdown标记`;

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-r1-250528',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (e) {
    console.error('AI 生成题目失败:', e);
    return { error: `题目生成失败：${e.message}` };
  }
}

async function analyze_reply(pua_line, your_reply) {
  const prompt = `你是反PUA大作战的AI裁判。请分析用户在面对PUA攻击时的回复质量。

【BOSS攻击】：${pua_line}
【用户回复】：${your_reply}

请从以下几个维度评估（每项0-100分）：
1. 反击力度：能否让对方哑口无言？
2. 情商水平：是否既怼了人又不失体面？
3. 心理影响：能否有效摆脱对方的精神控制？

请输出标准JSON格式：
{
  "score": 综合分数(0-100),
  "breakthrough": 反击力度分数(0-100),
  "emotion_q": 情商水平分数(0-100),
  "mental_health": 心理影响分数(0-100),
  "reason": "一段简短的评价，30字以内",
  "best_reply": "一个更好的怼法建议（如果没有则不返回）"
}

评分标准：
- 90分以上：完美怼回，有爽感，能让对方完全无法反驳
- 70-89分：怼得不错，有一定杀伤力
- 50-69分：勉强能怼，但不够爽或容易被反驳
- 50分以下：被反怼了，回复太软或中了对方圈套

注意：只输出JSON，不要任何其他文字`;

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-r1-250528',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (e) {
    console.error('AI 分析失败:', e);
    return { error: `分析失败：${e.message}` };
  }
}

module.exports = {
  generate_pua_shield_content,
  generate_game_questions,
  analyze_reply
};
