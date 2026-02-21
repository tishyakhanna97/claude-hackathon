const http = require("http");
const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk").default;

const PORT = 3456;
const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".png":"image/png",".jpeg":"image/jpeg",".jpg":"image/jpeg",".json":"application/json" };

const AGENT_PROMPTS = {
  BizOps: `You are BizOps, a market analyst AI agent for a solopreneur. The CEO just asked you to analyze the market for their product idea. Provide a concise market analysis with exactly 4 findings. Each finding should have a short label and 1-2 sentence insight. Focus on: competitor pricing, market size (TAM/SAM), go-to-market strategy, and key risks. Keep it punchy and actionable. Respond in JSON array format: [{"label":"...","text":"..."},...]`,
  Researcher: `You are Researcher, a competitive intelligence AI agent for a solopreneur. The CEO asked you to research the competitive landscape. Provide exactly 4 findings. Each finding should have a short label and 1-2 sentence insight. Focus on: feature gaps in competitors, user sentiment, market trends, and untapped opportunities. Keep it punchy and actionable. Respond in JSON array format: [{"label":"...","text":"..."},...]`,
};

const server = http.createServer(async (req, res) => {
  // API endpoint
  if (req.method === "POST" && req.url === "/api/agent") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", async () => {
      try {
        const { agent, context } = JSON.parse(body);
        const systemPrompt = AGENT_PROMPTS[agent];
        if (!systemPrompt) { res.writeHead(400); res.end("Unknown agent"); return; }

        const userMsg = context || "Analyze an AI-powered developer productivity tool aimed at solopreneurs and indie hackers.";

        const message = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: systemPrompt,
          messages: [{ role: "user", content: userMsg }],
        });

        const text = message.content[0].text;
        // Try to parse JSON from response
        let findings;
        try {
          const jsonMatch = text.match(/\[[\s\S]*\]/);
          findings = jsonMatch ? JSON.parse(jsonMatch[0]) : [{ label: "Analysis", text }];
        } catch { findings = [{ label: "Analysis", text }]; }

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
