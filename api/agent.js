const Anthropic = require("@anthropic-ai/sdk").default;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const AGENT_PROMPTS = {
  BizOps: `You are BizOps, a market analyst AI agent for a solopreneur. The CEO just asked you to analyze the market for their product idea. Provide a concise market analysis with exactly 4 findings. Each finding should have a short label and 1-2 sentence insight. Focus on: competitor pricing, market size (TAM/SAM), go-to-market strategy, and key risks. Keep it punchy and actionable. Respond in JSON array format: [{"label":"...","text":"..."},...]`,
  Researcher: `You are Researcher, a competitive intelligence AI agent for a solopreneur. The CEO asked you to research the competitive landscape. Provide exactly 4 findings. Each finding should have a short label and 1-2 sentence insight. Focus on: feature gaps in competitors, user sentiment, market trends, and untapped opportunities. Keep it punchy and actionable. Respond in JSON array format: [{"label":"...","text":"..."},...]`,
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  try {
    const { agent, context } = req.body;
    const systemPrompt = AGENT_PROMPTS[agent];
    if (!systemPrompt) {
      res.status(400).end("Unknown agent");
      return;
    }

    const userMsg = context || "Analyze an AI-powered developer productivity tool aimed at solopreneurs and indie hackers.";

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: "user", content: userMsg }],
    });

    const text = message.content[0].text;
    let findings;
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      findings = jsonMatch ? JSON.parse(jsonMatch[0]) : [{ label: "Analysis", text }];
    } catch {
      findings = [{ label: "Analysis", text }];
    }

    res.status(200).json({ agent, findings });
  } catch (err) {
    console.error("API error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
