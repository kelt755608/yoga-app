// cloudfunctions/chat/index.js
exports.main = async (event, context) => {
  try {
    const body = event; // 事件中获取请求体
    const question = body.question;

    if (!question || typeof question !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing question" }),
      };
    }

    // 获取环境变量
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "DEEPSEEK_API_KEY is not set on the server",
        }),
      };
    }

    // 调用 DeepSeek API
    const deepseekRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "你是一个帮助瑜伽馆 / 健身房老板做运营规划的助手，用简洁、专业的中文回答问题。",
          },
          { role: "user", content: question },
        ],
        max_tokens: 512,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!deepseekRes.ok) {
      const errText = await deepseekRes.text();
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "DeepSeek API error", detail: errText }),
      };
    }

    const data = await deepseekRes.json();
    const answer =
      data.choices?.[0]?.message?.content?.trim() ||
      "抱歉，我暂时没有生成出有效回答。";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", detail: String(err) }),
    };
  }
};
