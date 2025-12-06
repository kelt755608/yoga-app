// D:/qzq/yoga-app/api/chat.js

// 这个函数会被 Vercel 当作 Serverless Function 来运行
export default async function handler(req, res) {
  // 1. 只允许 POST 请求
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 2. 从请求体中拿到 question
  //    Vercel 会自动把 application/json 的 body 解析到 req.body 里:contentReference[oaicite:3]{index=3}
  const body = req.body || {};
  const question = body.question;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Missing question" });
  }

  // 3. 检查环境变量中是否设置了 OPENAI_API_KEY
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "OPENAI_API_KEY is not set on the server" });
  }

  try {
    // 4. 调用 OpenAI Responses API（官方推荐的新接口）:contentReference[oaicite:4]{index=4}
    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini", // 文本对话便宜又好用，可按需改成别的:contentReference[oaicite:5]{index=5}
        input: `你是一个帮助瑜伽馆 / 健身房老板做运营规划的助手，用简洁、专业的中文回答问题。\n\n用户的问题：${question}`,
        max_output_tokens: 512,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI API error:", errText);
      return res
        .status(500)
        .json({ error: "OpenAI API error", detail: errText });
    }

    const data = await openaiRes.json();

    // Responses API 的文本在 output[0].content[0].text 里:contentReference[oaicite:6]{index=6}
    const answer =
      data.output?.[0]?.content?.[0]?.text ||
      "抱歉，我暂时没有生成出有效回答。";

    // 5. 把 AI 的回答返回给前端
    return res.status(200).json({ answer });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
