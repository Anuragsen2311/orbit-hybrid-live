export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow Framer to access

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OpenAI API key");
    return res.status(500).json({ reply: "API key missing." });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: message }]
      })
    });

    const result = await openaiRes.json();
    const reply = result?.choices?.[0]?.message?.content || "Orbit's thinking...";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ reply: "Orbit is offline. Try again later." });
  }
}
