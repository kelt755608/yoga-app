// D:/qzq/yoga-app/api/chat.js

// 这个函数会被 Vercel 当作 Serverless Function 来运行
export default async function handler(req, res) {
  // 1. 只允许 POST 请求
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 2. 从请求体中拿到 question
  const body = req.body || {};
  const question = body.question;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Missing question" });
  }

  // 3. 检查环境变量中是否设置了 DEEPSEEK_API_KEY
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "DEEPSEEK_API_KEY is not set on the server" });
  }

  try {
    // 4. 调用 DeepSeek API
    const deepseekRes = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat", // 使用 DeepSeek 的对话模型
        messages: [
          {
            role: "system",
            content: "你是一个帮助瑜伽馆 / 健身房老板做运营规划的助手，用简洁、专业的中文回答问题。"
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 512,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!deepseekRes.ok) {
      const errText = await deepseekRes.text();
      console.error("DeepSeek API error:", errText);
      return res
        .status(500)
        .json({ error: "DeepSeek API error", detail: errText });
    }

    const data = await deepseekRes.json();

    // DeepSeek API 的响应格式：data.choices[0].message.content
    const answer = data.choices?.[0]?.message?.content ||
      "抱歉，我暂时没有生成出有效回答。";

    // 5. 把 AI 的回答返回给前端
    return res.status(200).json({ answer });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
