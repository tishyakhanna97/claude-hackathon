const http = require("http");
const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk").default;
const { createClient } = require("redis");

const PORT = 3456;
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

async function logPrompt(data) {
  try {
    const redis = await getRedis();
    await redis.lPush("prompt_logs", JSON.stringify(data));
    await redis.quit();
    console.log("Redis logged:", data.type); // ← add this
  } catch (err) {
    console.error("Redis log error:", err.message); // already there, will now show
  }
}

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".json": "application/json" };

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

const server = http.createServer(async (req, res) => {
  // Title generation endpoint
  if (req.method === "POST" && req.url === "/api/title") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", async () => {
      try {
        const { context } = JSON.parse(body);
        const message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 100,
          system: `Give a creative, fun 2-4 word product title for the idea the user describes. Be playful, punchy, and memorable — think startup name energy. No generic words like "AI", "App", or "Pro". Respond with ONLY a JSON object: {"title":"...","tagline":"..."}. The tagline should be one sharp sentence under 10 words.`,
          messages: [{ role: "user", content: context }],
        });
        const text = message.content[0].text.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: "Your Product", tagline: "Built with your AI team." };
        await logPrompt({ ts: new Date().toISOString(), type: "title", input: context, output: parsed });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(parsed));
      } catch (err) {
        console.error("Title API error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Your Product", tagline: "Built with your AI team." }));
      }
    });
    return;
  }

  // Agent findings endpoint
  if (req.method === "POST" && req.url === "/api/agent") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", async () => {
      try {
        const { agent, context, type } = JSON.parse(body);
        const userMsg = context || "a developer productivity tool for solopreneurs";

        if (type === "status") {
          const systemPrompt = STATUS_PROMPTS[agent];
          if (!systemPrompt) { res.writeHead(400); res.end("Unknown agent"); return; }
          const message = await client.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 80,
            system: systemPrompt,
            messages: [{ role: "user", content: userMsg }],
          });
          const statusText = message.content[0].text.trim();
          await logPrompt({ ts: new Date().toISOString(), agent, type: "status", input: userMsg, output: statusText });
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: statusText }));
          return;
        }

        const systemPrompt = AGENT_PROMPTS[agent];
        if (!systemPrompt) { res.writeHead(400); res.end("Unknown agent"); return; }

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
        } catch { findings = [{ label: "Analysis", text }]; }

        await logPrompt({ ts: new Date().toISOString(), agent, type: "analysis", input: userMsg, output: text });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ agent, findings }));
      } catch (err) {
        console.error("API error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static file serving
  let filePath = req.url === "/" ? "/game-org-chart.html" : req.url;
  filePath = path.join(__dirname, filePath);
  const ext = path.extname(filePath);
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => console.log(`Game running at http://localhost:${PORT}`));
