const Anthropic = require("@anthropic-ai/sdk").default;

const client = new Anthropic();

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  try {
    const { context } = req.body;
    if (!context) { res.status(400).end("Missing context"); return; }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 100,
      system: `Give a creative, fun 2-4 word product title for the idea the user describes. Be playful, punchy, and memorable — think startup name energy. No generic words like "AI", "App", or "Pro". Respond with ONLY a JSON object: {"title":"...","tagline":"..."}. The tagline should be one sharp sentence under 10 words.`,
      messages: [{ role: "user", content: context }],
    });

    const text = message.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: "Your Product", tagline: "Built with your AI team." };

    res.status(200).json(parsed);
  } catch (err) {
    console.error("Title API error:", err.message);
    res.status(500).json({ title: "Your Product", tagline: "Built with your AI team." });
  }
};
