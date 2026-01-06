// functions/api/chat.js
export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const body = await request.json().catch(() => ({}));
    const question = body.question;

    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "Missing question" }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const apiKey = env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "DEEPSEEK_API_KEY is not set on the server" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    }

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
      return new Response(
        JSON.stringify({ error: "DeepSeek API error", detail: errText }),
        {
          status: 500,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      );
    }

    const data = await deepseekRes.json();
    const answer =
      data.choices?.[0]?.message?.content?.trim() ||
      "抱歉，我暂时没有生成出有效回答。";

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error", detail: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
