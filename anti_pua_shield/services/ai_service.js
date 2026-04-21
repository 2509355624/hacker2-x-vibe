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

module.exports = {
  generate_pua_shield_content
};
