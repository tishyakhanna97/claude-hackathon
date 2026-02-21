# ClaudeQuest Technical Feasibility Analysis

**Date**: 2026-02-21
**CLI Version Tested**: Claude Code 2.1.50
**Status**: Feasible with caveats

---

## 1. Architecture Overview

```
+---------------------------------------------------------------+
|                     ClaudeQuest Web App                        |
|                                                               |
|  +------------------+  +------------------+  +--------------+ |
|  |   Chat Panel     |  |  Visual Canvas   |  |  Game Mode   | |
|  |  (React + SSE)   |  |  (React Flow)    |  |  (PixiJS)    | |
|  |                  |  |                  |  |              | |
|  |  - Slash cmds    |  |  - Drag/drop     |  |  - Sprites   | |
|  |  - Autocomplete  |  |  - Agent nodes   |  |  - Hats      | |
|  |  - CoT display   |  |  - Skill nodes   |  |  - Bubbles   | |
|  |  - Spinners      |  |  - Edge wiring   |  |  - Anims     | |
|  +--------+---------+  +--------+---------+  +------+-------+ |
|           |                      |                    |        |
|  +--------+----------------------+--------------------+------+ |
|  |              Shared State (Zustand)                       | |
|  |  - Agent registry   - Process map   - Config cache        | |
|  +----------------------------+------------------------------+ |
|                               |                                |
+-------------------------------+--------------------------------+
                                |
                    WebSocket / SSE
                                |
+-------------------------------+--------------------------------+
|                    Node.js Backend                              |
|                    (Next.js API Routes)                         |
|                                                                |
|  +------------------+  +-------------------+  +--------------+ |
|  | Process Manager  |  |  Config Manager   |  |  SSE Broker  | |
|  |                  |  |                   |  |              | |
|  | - spawn claude   |  | - Read/write MD   |  | - Per-agent  | |
|  |   child procs    |  |   with YAML FM    |  |   event      | |
|  | - parse stream-  |  | - JSON configs    |  |   streams    | |
|  |   json stdout    |  | - File watchers   |  |              | |
|  | - manage session |  |                   |  |              | |
|  |   lifecycle      |  |                   |  |              | |
|  +--------+---------+  +-------------------+  +--------------+ |
|           |                                                    |
+-------------------------------+--------------------------------+
                                |
                    child_process.spawn
                    (CLAUDECODE= unset)
                                |
+-------------------------------+--------------------------------+
|              Claude Code CLI (per process)                      |
|                                                                |
|  claude -p "<prompt>"                                          |
|    --output-format stream-json                                 |
|    --agent <agent-name>                                        |
|    --model <model>                                             |
|    --permission-mode <mode>                                    |
|    --session-id <uuid>                                         |
|    --include-partial-messages                                  |
|                                                                |
|  Reads from project:                                           |
|    agents/*.md | skills/*/SKILL.md | hooks/hooks.json          |
|    .mcp.json   | .claude/settings.json                         |
+----------------------------------------------------------------+
```

---

## 2. Recommended Tech Stack

### Frontend
| Layer | Choice | Justification |
|-------|--------|---------------|
| Framework | **Next.js 15 (App Router)** | Unified frontend + API routes in one project. App Router gives server components for initial config loading, client components for interactive panels. Avoids needing a separate backend server. |
| State Management | **Zustand** | Lightweight, no boilerplate, works cleanly with React Flow and real-time updates. Redux would be overkill. |
| Visual Canvas | **React Flow (@xyflow/react v12)** | Purpose-built for node-based editors. Has drag-and-drop, custom nodes, edge types, minimap, controls. Used by LangFlow, Flowise, n8n -- exactly the same use case. |
| Chat UI | **Custom React components** | Chat UIs are simple enough that a library adds more constraints than value. Use Tailwind + shadcn/ui for consistent design. |
| Game Renderer | **PixiJS v8** (not Phaser) | See rationale below. |
| Styling | **Tailwind CSS + shadcn/ui** | Fast iteration, consistent design system, accessible components. |
| Real-time | **Server-Sent Events (SSE)** | Simpler than WebSockets for this use case (server-to-client streaming). The backend pushes agent state; user input goes via normal POST requests. |

### Backend (Next.js API Routes)
| Layer | Choice | Justification |
|-------|--------|---------------|
| Process Management | **Node.js child_process.spawn** | Spawns `claude` CLI processes. Parses `--output-format stream-json` stdout line-by-line. Must unset `CLAUDECODE` env var. |
| Config I/O | **gray-matter** (YAML frontmatter) + **fs/promises** | gray-matter is the standard library for parsing/serializing Markdown files with YAML frontmatter. Handles agents/*.md and skills/*/SKILL.md perfectly. |
| File Watching | **chokidar** | Watch config files for external changes (user edits via editor). |
| Session Storage | **In-memory Map + optional SQLite** | Track active CLI processes, session IDs, agent states. SQLite (via better-sqlite3) only if persistence across server restarts is needed. |

### Why PixiJS over Phaser for Game Mode

Phaser is a full game engine with its own game loop, scene management, physics, and input handling. It fights with React for DOM control. Embedding Phaser inside a React component is possible but awkward -- you end up with two rendering systems that don't share state cleanly.

PixiJS is a rendering library, not a game engine. It renders sprites and animations on a canvas, but leaves application logic to you. This means:
- It composes cleanly inside React components (mount a PixiJS Application to a ref)
- State flows from Zustand to PixiJS renderer, not the other way around
- No physics engine or scene manager overhead you don't need
- Smaller bundle (~200KB vs ~1MB for Phaser)
- @pixi/react exists for declarative usage, though imperative is fine too

For pixel art sprites with simple movement animations and chat bubbles, PixiJS is the right weight class.

---

## 3. CLI Communication Strategy

### How It Works

The Claude Code CLI supports three output formats with `--print` mode:

```
claude -p "<prompt>" --output-format stream-json
```

This emits newline-delimited JSON objects to stdout. Each line is a self-contained JSON message representing an event: assistant text chunks, tool use requests, tool results, etc.

**Critical flags for ClaudeQuest**:
- `--output-format stream-json`: Real-time JSON event stream
- `--include-partial-messages`: Get partial text as it's being generated (essential for "typing" effect)
- `--session-id <uuid>`: Track and resume sessions
- `--agent <name>`: Select which agent definition to use
- `--model <model>`: Override model (sonnet, opus, haiku)
- `--permission-mode <mode>`: Set permission level (plan, acceptEdits, bypassPermissions, default, dontAsk)
- `--input-format stream-json`: Bidirectional JSON streaming (send follow-up messages via stdin)

### Spawning a CLI Process

```
// Pseudocode -- NOT production code
const proc = spawn('claude', [
  '-p', prompt,
  '--output-format', 'stream-json',
  '--include-partial-messages',
  '--session-id', sessionId,
  '--agent', agentName,
  '--model', model,
  '--permission-mode', permissionMode,
], {
  cwd: projectDir,
  env: { ...process.env, CLAUDECODE: '' },  // MUST unset to avoid nesting error
});
```

### Critical Finding: CLAUDECODE Environment Variable

When running inside a Claude Code session, the CLI sets `CLAUDECODE=1` in the environment. Any child `claude` process will detect this and refuse to start with:

> "Error: Claude Code cannot be launched inside another Claude Code session."

**Mitigation**: Set `CLAUDECODE=''` (empty string) in the spawned process environment. This is documented behavior ("unset the CLAUDECODE environment variable"). When ClaudeQuest runs as a standalone web app (not inside Claude Code), this is not an issue. But during development, it matters.

### Bidirectional Streaming (Interactive Sessions)

For multi-turn conversations, use `--input-format stream-json` combined with `--output-format stream-json`. This allows:
1. Writing JSON messages to stdin to send user messages
2. Reading JSON events from stdout for agent responses
3. Maintaining a persistent session without re-spawning

This is the recommended approach for the chat interface. Each chat session maintains a long-running CLI process with bidirectional JSON streaming.

---

## 4. Feature-by-Feature Risk Assessment

### Feature 1: Local Web App with Process Management
**Complexity**: Medium
**Risk**: Low

| Aspect | Assessment |
|--------|-----------|
| Feasibility | Fully feasible. Next.js runs locally via `next dev` or `next start`. |
| Process spawning | Standard Node.js child_process. Well-understood pattern. |
| Key risk | Process cleanup on crash/exit. Must handle SIGTERM, uncaught exceptions. |
| Mitigation | Use a process registry with cleanup-on-exit hooks. Track PIDs. |

### Feature 2: Chat Interface with Slash Command Autocomplete
**Complexity**: Medium
**Risk**: Low

| Aspect | Assessment |
|--------|-----------|
| Feasibility | Fully feasible. Standard chat UI pattern. |
| Slash commands | Read skills from `skills/*/SKILL.md` at startup. Parse YAML frontmatter for name + description. Build autocomplete index. |
| Key risk | Keeping autocomplete in sync if skills are added/removed while app is running. |
| Mitigation | File watcher (chokidar) on skills/ directory. Debounced re-index on change. |

### Feature 3: Visual Canvas (Drag-and-Drop)
**Complexity**: High
**Risk**: Medium

| Aspect | Assessment |
|--------|-----------|
| Feasibility | Feasible. React Flow is designed for exactly this. |
| Custom nodes | Each agent = a custom React Flow node with name, model, status indicator, avatar. Each skill = another node type. Edges represent assignments. |
| Key risk | Translating canvas state to CLI invocations. The canvas is a visual representation of an agent team, but the CLI's `--agents` flag takes a JSON object, and agent teams are spawned via the Agent tool internally. There is no CLI flag to "launch an agent team from a topology file." |
| Mitigation | The canvas generates the equivalent CLI commands. When user clicks "Run Team," the backend spawns the lead agent with a system prompt that instructs it to spawn subagents matching the canvas topology. Alternatively, spawn each agent as a separate CLI process and coordinate them at the application level. |
| Architecture decision needed | **Option A**: Single CLI process with orchestrator prompt that spawns subagents internally (simpler, but less control). **Option B**: Multiple CLI processes managed by the backend (more control, but you're reimplementing team coordination). Recommend Option A for MVP. |

### Feature 4: Real-Time Agent Monitoring
**Complexity**: High
**Risk**: Medium

| Aspect | Assessment |
|--------|-----------|
| Feasibility | Feasible with stream-json output. Each CLI process emits events that can be parsed for state. |
| Agent state detection | Parse stream-json events: `assistant` messages = working, `tool_use` = executing tool, `result` = finished, absence of events + no exit = paused/waiting. |
| Chain of thought | Use `--include-partial-messages` to get text as it streams. Display in UI. |
| Key risk | **Subagent visibility**. When a lead agent spawns subagents via the Agent tool, those subagents run inside the same CLI process. The stream-json output includes their events, but distinguishing which subagent is emitting requires parsing agent IDs from the event data. |
| Multi-agent tracking | The `AgentOutput` type includes `agentId`. Background agents write to `outputFile`. Both mechanisms can be used to track state. |
| Mitigation | Build an event router that tags events by agent ID and fans them out to per-agent SSE streams. |

### Feature 5: One-Click Skill/Subagent Creation
**Complexity**: Medium
**Risk**: Low

| Aspect | Assessment |
|--------|-----------|
| Feasibility | Fully feasible. Creating an agent = writing a `.md` file with YAML frontmatter. Creating a skill = creating a directory with `SKILL.md`. |
| AI-assisted refinement | Use a separate Claude CLI call (`claude -p "refine this prompt..."`) to improve the user's description. |
| File format | Well-defined. YAML frontmatter with `name`, `description`, `tools`, optional `model`. Body is the system prompt markdown. |
| Key risk | Validation. If the user creates an agent with an invalid tool name or nonexistent model, the CLI will error at runtime. |
| Mitigation | Validate against known tool names (from sdk-tools.d.ts) and model names before writing the file. |

### Feature 6: Model Selection Per Agent
**Complexity**: Low
**Risk**: Low

| Aspect | Assessment |
|--------|-----------|
| Feasibility | Trivial. The `--model` CLI flag supports aliases (sonnet, opus, haiku) and full model names. Agent .md files can specify model in frontmatter. |
| Smart recommendations | Hardcoded heuristics: haiku for simple/fast tasks, sonnet for general work, opus for complex reasoning. Can be refined over time. |
| Key risk | Model availability depends on user's subscription/API plan. |
| Mitigation | Surface model errors clearly in the UI. |

### Feature 7: Permission Mode Toggle
**Complexity**: Low
**Risk**: Low

| Aspect | Assessment |
|--------|-----------|
| Feasibility | Trivial. `--permission-mode` CLI flag with choices: acceptEdits, bypassPermissions, default, dontAsk, plan. The Agent tool's `mode` field also supports this per-subagent. |
| Key risk | Security. `bypassPermissions` is dangerous. UI should warn users clearly. |
| Mitigation | Color-coded warning in UI. Require confirmation for dangerous modes. Default to `plan` for new agents. |

### Feature 8: Gamified "Pokemon Sapphire" Mode
**Complexity**: Very High
**Risk**: High

| Aspect | Assessment |
|--------|-----------|
| Feasibility | Feasible but substantial art + animation work. The rendering tech (PixiJS) is proven. The hard part is the content. |
| Sprite system | Need pixelated character sprites (idle, walking, working animations). Each agent type needs a base sprite + hat overlay system. Minimum viable: 4-6 base sprites, 5-8 hat types, 3 animation states each. That is 60-100 sprite frames. |
| Chat bubbles | PixiJS text rendering with 9-slice sprite backgrounds. Standard pattern. |
| Birth animations | Particle effects + scale/fade tweens. PixiJS has built-in tween support. |
| State mapping | Map agent states (working/finished/paused) to sprite animations (walking/idle/sleeping). Chain of thought text maps to chat bubble content. |
| Key risk | **Art asset production**. Unless you have a pixel artist or use AI-generated pixel art, this is the bottleneck. The code is straightforward; the art is not. |
| Performance | PixiJS handles hundreds of sprites at 60fps. With 5-20 agents, performance is a non-issue. |
| Mitigation | Start with placeholder sprites (colored rectangles with emoji). Layer in pixel art incrementally. Consider AI pixel art generators (e.g., generate sprite sheets with image models). |

### Feature 9: Read/Write Claude Code Config Files
**Complexity**: Low
**Risk**: Low

| Aspect | Assessment |
|--------|-----------|
| Feasibility | Trivial. All config files are standard formats (Markdown+YAML frontmatter, JSON). |
| File locations | All relative to project root. Well-defined paths. |
| Key risk | Race conditions if user edits files externally while ClaudeQuest is also writing. |
| Mitigation | Use file watchers to detect external changes. Implement optimistic locking (check mtime before write). |

---

## 5. Complexity Summary

| # | Feature | Complexity | Risk | Estimated Dev Effort |
|---|---------|-----------|------|---------------------|
| 1 | Local web app + process mgmt | Medium | Low | 2-3 days |
| 2 | Chat interface + slash commands | Medium | Low | 2-3 days |
| 3 | Visual canvas (drag-and-drop) | High | Medium | 4-5 days |
| 4 | Real-time agent monitoring | High | Medium | 3-4 days |
| 5 | One-click skill/agent creation | Medium | Low | 1-2 days |
| 6 | Model selection per agent | Low | Low | 0.5 day |
| 7 | Permission mode toggle | Low | Low | 0.5 day |
| 8 | Gamified Pokemon mode | Very High | High | 7-10 days |
| 9 | Config file read/write | Low | Low | 1 day |
| | **Total estimated MVP** | | | **~21-29 days** |

---

## 6. Key Architecture Decisions Required

### Decision 1: Agent Team Orchestration Strategy

**Option A -- Single-process orchestration (Recommended for MVP)**
Spawn one CLI process with an orchestrator prompt. The orchestrator uses the Agent tool internally to spawn subagents. ClaudeQuest monitors the single process's stream-json output for all agent events.

- Pros: Simpler. The CLI handles all subagent lifecycle internally.
- Cons: Less control over individual agents. If the orchestrator errors, all agents fail.

**Option B -- Multi-process orchestration**
ClaudeQuest spawns each agent as a separate CLI process and coordinates them at the application level (passing results between them via prompts).

- Pros: Full control. Independent failure domains. Easier to show per-agent state.
- Cons: You're reimplementing agent team coordination. More complex. Agents can't share context naturally.

**Recommendation**: Start with Option A. If visibility or control is insufficient, add Option B as an advanced mode.

### Decision 2: Session Persistence

The CLI supports `--session-id` and `--continue` for session resumption. ClaudeQuest needs to decide:
- Store session IDs in memory only (lost on server restart)?
- Persist to SQLite for resume-across-restarts?
- Rely on the CLI's own session storage (`~/.claude/sessions`)?

**Recommendation**: Start with in-memory. The CLI already persists sessions internally. Use `--resume <session-id>` to reconnect to previous sessions when needed.

### Decision 3: Game Mode Integration Pattern

- **Overlay approach**: PixiJS canvas renders on top of the standard UI. Agents appear as sprites that correspond 1:1 to agents in the canvas/chat.
- **Replacement approach**: Game mode replaces the canvas entirely with a 2D pixel world.
- **Side panel approach**: Game view lives in its own panel alongside chat.

**Recommendation**: Overlay approach for the "wow" factor, with a toggle to switch between standard canvas and game view.

---

## 7. Risks and Mitigations Summary

| Risk | Severity | Likelihood | Mitigation |
|------|----------|-----------|------------|
| CLI stream-json format changes between versions | Medium | Medium | Pin CLI version. Abstract parser behind interface. Test against multiple versions. |
| CLAUDECODE nesting prevention | Low | Certain (during dev) | Unset CLAUDECODE env var when spawning. Document clearly. |
| Subagent events lack clear agent identification in stream | Medium | Medium | Parse agentId from events. If insufficient, fall back to multi-process approach. |
| PixiJS + React state synchronization | Medium | Low | Use Zustand as single source of truth. PixiJS renders from state, never owns it. |
| Pixel art asset production bottleneck | High | High | Use AI-generated placeholder art. Hire pixel artist for polish. Define sprite spec early. |
| React Flow performance with many nodes | Low | Low | React Flow handles 100+ nodes well. Agent teams rarely exceed 20. |
| File write conflicts with external editors | Low | Medium | mtime-based optimistic locking + file watchers. |
| CLI process zombies on crash | Medium | Medium | PID tracking + cleanup hooks + periodic health checks. |

---

## 8. What NOT to Build (Scope Cuts for MVP)

1. **Skip multi-project support initially**. One project directory at a time.
2. **Skip MCP server management UI**. Read and display .mcp.json, but don't build an MCP server browser/installer. Use the CLI's `claude mcp add` command under the hood.
3. **Skip game mode for MVP**. Build the standard canvas first. Game mode is a delight feature, not core functionality.
4. **Skip plugin management UI**. Use the CLI's `claude plugin` commands.
5. **Skip collaborative multi-user support**. This is a local app for one user.

---

## 9. Verdict

**ClaudeQuest is technically feasible.** The Claude Code CLI provides all the necessary interfaces:

- `--output-format stream-json` gives real-time structured events
- `--input-format stream-json` enables bidirectional communication
- `--agent`, `--model`, `--permission-mode` flags give per-session control
- Agent/skill/hook/MCP config files are standard formats (Markdown+YAML, JSON)
- The Agent tool's schema shows agent teams are a first-class concept with `agentId`, `run_in_background`, `team_name`, and status tracking

The main engineering challenges are:
1. **Parsing and routing stream-json events** from multi-agent CLI processes (solvable, but needs careful implementation)
2. **Translating visual canvas topologies** into CLI invocations (architecture decision needed)
3. **Pixel art assets** for game mode (art problem, not engineering problem)

No feature in the spec is technically infeasible. The riskiest feature is the game mode, purely due to art asset production, not rendering technology.
