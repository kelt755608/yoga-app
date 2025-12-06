// D:/qzq/yoga-app/api/chat.js

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const body = req.body || {};
  const question = body.question;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Missing question" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "OPENAI_API_KEY is not set on the server" });
  }

  try {
    // 调用 OpenAI Responses API
    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
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

    const answer =
      data.output?.[0]?.content?.[0]?.text ||
      "抱歉，我暂时没有生成出有效回答。";

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
