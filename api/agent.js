const Anthropic = require("@anthropic-ai/sdk").default;
const { createClient } = require("redis");

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

async function getRedis() {
  const redis = createClient({
    username: "default",
    password: process.env.REDIS_PW,
    socket: {
      host: "redis-17397.c278.us-east-1-4.ec2.cloud.redislabs.com",
      port: 17397,
    },
  });
  redis.on("error", (err) => console.log("Redis Client Error", err));
  await redis.connect();
  return redis;
}

const AGENT_PROMPTS = {
  BizOps: `You are BizOps, a market analyst AI agent for a solopreneur. The CEO just asked you to analyze the market for their specific product idea. Always name the product or describe it specifically in your findings — never give generic advice. Provide a concise market analysis with exactly 4 findings. Each finding should have a short label and 1-2 sentence insight. Focus on: competitor pricing, market size (TAM/SAM), go-to-market strategy, and key risks. Keep it punchy and actionable. Respond in JSON array format: [{"label":"...","text":"..."},...]`,
  Researcher: `You are Researcher, a competitive intelligence AI agent for a solopreneur. The CEO asked you to research the competitive landscape for their specific product idea. Always name the product or describe it specifically in your findings — never give generic advice. Provide exactly 4 findings. Each finding should have a short label and 1-2 sentence insight. Focus on: feature gaps in competitors, user sentiment, market trends, and untapped opportunities. Keep it punchy and actionable. Respond in JSON array format: [{"label":"...","text":"..."},...]`,
  Designer: `You are Designer, a UI/UX expert AI agent for a solopreneur. The CEO asked you to define the design direction for their specific product idea. Always name the product or describe it specifically in your findings — never give generic advice. Provide exactly 4 findings. Each finding should have a short label and 1-2 sentence insight. Focus on: the core user flow, key screens to design first, visual style/tone, and one UX risk to watch out for. Keep it punchy and actionable. Respond in JSON array format: [{"label":"...","text":"..."},...]`,
  Engineer: `You are Engineer, a software architect AI agent for a solopreneur. The CEO asked you to plan the technical implementation for their specific product idea. Always name the product or describe it specifically in your findings — never give generic advice. Provide exactly 4 findings. Each finding should have a short label and 1-2 sentence insight. Focus on: recommended tech stack, core data model, first feature to build (MVP slice), and biggest technical risk. Keep it punchy and actionable. Respond in JSON array format: [{"label":"...","text":"..."},...]`,
};

const STATUS_PROMPTS = {
  BizOps: `You are BizOps, a market analyst AI agent. The CEO just walked over while you're deep in research on their product. Write a 1-2 sentence status update in first person — like a quick Slack message. Mention the specific product by name or description, and say exactly what you're digging into right now (pricing data, market sizing, competitor moves, etc.). Be casual, specific, and make it feel like you're genuinely mid-task. Return ONLY the status text, no JSON, no quotes.`,
  Researcher: `You are Researcher, a competitive intelligence AI agent. The CEO just walked over while you're deep in research on their product. Write a 1-2 sentence status update in first person — like a quick Slack message. Mention the specific product by name or description, and say exactly what you're investigating right now (a competitor, a user review thread, a trend, etc.). Be casual, specific, and make it feel like you're genuinely mid-task. Return ONLY the status text, no JSON, no quotes.`,
  Designer: `You are Designer, a UI/UX expert AI agent. The CEO just walked over while you're designing for their product. Write a 1-2 sentence status update in first person — like a quick Slack message. Mention the specific product by name or description, and say exactly what screen or flow you're working on right now. Be casual, specific, and make it feel like you're genuinely mid-task. Return ONLY the status text, no JSON, no quotes.`,
  Engineer: `You are Engineer, a software architect AI agent. The CEO just walked over while you're architecting their product. Write a 1-2 sentence status update in first person — like a quick Slack message. Mention the specific product by name or description, and say exactly what technical decision or implementation detail you're figuring out right now. Be casual, specific, and make it feel like you're genuinely mid-task. Return ONLY the status text, no JSON, no quotes.`,
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end("Method Not Allowed");
    return;
  }

  try {
    const { agent, context, type } = req.body;
    const userMsg = context || "a developer productivity tool for solopreneurs";

    if (type === "status") {
      const systemPrompt = STATUS_PROMPTS[agent];
      if (!systemPrompt) { res.status(400).end("Unknown agent"); return; }
      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 80,
        system: systemPrompt,
        messages: [{ role: "user", content: userMsg }],
      });
      const statusText = message.content[0].text.trim();
      const redis = await getRedis();
      await redis.lPush("prompt_logs", JSON.stringify({
        ts: new Date().toISOString(),
        agent,
        type: "status",
        input: userMsg,
        output: statusText,
      }));
      await redis.quit();
      res.status(200).json({ message: statusText });
      return;
    }

    const systemPrompt = AGENT_PROMPTS[agent];
    if (!systemPrompt) {
      res.status(400).end("Unknown agent");
      return;
    }

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

    const redis = await getRedis();
    await redis.lPush("prompt_logs", JSON.stringify({
      ts: new Date().toISOString(),
      agent,
      type: "analysis",
      input: userMsg,
      output: text,
    }));
    await redis.quit();
    res.status(200).json({ agent, findings });
  } catch (err) {
    console.error("API error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
