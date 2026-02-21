import { NextRequest, NextResponse } from 'next/server';

const AGENT_PROMPTS: Record<string, string> = {
  BizOps: `You are BizOps, a market analyst AI agent for a solopreneur. The CEO just asked you to analyze the market for their product idea. Provide a concise market analysis with exactly 4 findings. Each finding should have a short label and 1-2 sentence insight. Focus on: competitor pricing, market size (TAM/SAM), go-to-market strategy, and key risks. Keep it punchy and actionable. Respond in JSON array format: [{"label":"...","text":"..."},...]`,
  Researcher: `You are Researcher, a competitive intelligence AI agent for a solopreneur. The CEO asked you to research the competitive landscape. Provide exactly 4 findings. Each finding should have a short label and 1-2 sentence insight. Focus on: feature gaps in competitors, user sentiment, market trends, and untapped opportunities. Keep it punchy and actionable. Respond in JSON array format: [{"label":"...","text":"..."},...]`,
};

export async function POST(request: NextRequest) {
  try {
    const { agent, context } = await request.json();
    const systemPrompt = AGENT_PROMPTS[agent];
    if (!systemPrompt) {
      return NextResponse.json({ error: 'Unknown agent' }, { status: 400 });
    }

    // Try to use Anthropic SDK if API key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'No API key configured' }, { status: 500 });
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey });

    const userMsg = context || 'Analyze an AI-powered developer productivity tool aimed at solopreneurs and indie hackers.';

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMsg }],
    });

    const text = (message.content[0] as { type: string; text: string }).text;
    let findings;
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      findings = jsonMatch ? JSON.parse(jsonMatch[0]) : [{ label: 'Analysis', text }];
    } catch {
      findings = [{ label: 'Analysis', text }];
    }

    return NextResponse.json({ agent, findings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
