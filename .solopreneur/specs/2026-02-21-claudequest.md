# ClaudeQuest: Product Requirements Document

**Date:** 2026-02-21
**Status:** Draft — Pending CEO Approval
**Author:** Claude (Product Spec Agent)
**Validated by:** @engineer (technical feasibility), @designer (UI/UX)

---

## Overview

ClaudeQuest is a local web application that wraps the Claude Code CLI, making its powerful context management capabilities — skills, subagents, agent teams, hooks, and MCP servers — accessible to non-technical users through a visual, gamified interface. Instead of editing markdown files and typing CLI commands, users interact with a drag-and-drop canvas, one-click skill creation, and a chat interface to orchestrate AI agent workflows. The product features a toggleable "Game Mode" that renders agents as pixelated Pokemon Sapphire-style sprites navigating a pastel-colored workspace, making AI orchestration intuitive and delightful.

**Target users:** Non-technical stakeholders (founders, product managers, content creators, operators) who want Claude Code's power without the code editor.

**Core value proposition:** Claude helps users build reusable skills, subagents, and agent teams with as little or as much detail as the user wants — recommending improvements, asking for approval when appropriate, and making the entire workflow visual and approachable.

---

## User Stories

### US-1: Chat-First Interaction
**As a** non-technical user, **I want to** chat with Claude through a familiar chat interface with slash command autocomplete, **so that** I can get work done without learning CLI commands.

**Acceptance Criteria:**
- **Given** the user opens ClaudeQuest, **When** they type in the chat bar, **Then** messages are sent to Claude Code CLI and responses stream back in real-time.
- **Given** the user types "/" in the chat input, **When** available skills and slash commands appear, **Then** the user can fuzzy-search and select one, with built-in commands marked with an "official" badge.
- **Given** the user clicks a skill pill above the chat input, **When** it activates, **Then** it behaves identically to typing the slash command.

### US-2: Visual Agent Canvas
**As a** user orchestrating multiple agents, **I want to** see my agents, skills, agent teams, and MCP servers on a visual canvas with drag-and-drop, **so that** I can understand and control how my AI workforce is organized.

**Acceptance Criteria:**
- **Given** the canvas view is open, **When** agents appear as nodes (orange ghost icons with role-specific badges), **Then** the user can see each agent's name, state, assigned skills, and connected MCP servers at a glance.
- **Given** the user drags a skill from the library onto an agent node, **When** released, **Then** that skill is assigned to the agent and the config file is updated.
- **Given** the user drags an MCP server from the server directory onto an agent or team, **When** released, **Then** the agent/team gains access to that server's tools.
- **Given** the user draws a connection between two agents, **When** confirmed, **Then** the output of one feeds into the other, and the pipeline is visually represented.

### US-3: Agent Teams
**As a** user coordinating complex workflows, **I want to** group agents into named teams by dragging and dropping them into team containers on the canvas, **so that** I can manage multi-agent workflows as a single unit with shared instructions.

**Acceptance Criteria:**
- **Given** the canvas is open, **When** the user creates a team (via button or right-click menu), **Then** a team container appears on the canvas that agents can be dragged into.
- **Given** agents are in a team container, **When** the user writes team-level instructions, **Then** all agents in the team receive those instructions as shared context.
- **Given** a team is configured, **When** the user clicks "Run Team," **Then** all agents in the team execute in parallel according to their connections and the team instructions.
- **Given** an agent is in a team, **When** the user views the canvas, **Then** the team boundary, internal agent connections, and team-level instructions are all visible.

### US-4: MCP Server Directory & Management
**As a** user who wants to extend agent capabilities, **I want to** browse an official MCP server directory and drag-and-drop servers onto agents, skills, or teams, **so that** I can give my agents new tools without editing JSON files.

**Acceptance Criteria:**
- **Given** the user opens the MCP Server Directory (Library tab > MCP Servers), **When** servers are listed, **Then** each shows name, description, available tools, and an "official" badge for verified servers.
- **Given** the user drags an MCP server onto an agent node, **When** released, **Then** the agent's `.mcp.json` config is updated and the server's tools become available.
- **Given** the user drags an MCP server onto a team container, **When** released, **Then** all agents in that team gain access to the server.
- **Given** the user wants to add a custom MCP server, **When** they click "Add Custom Server" and provide the connection details, **Then** the server appears in their local directory.

### US-5: One-Click Skill & Subagent Creation
**As a** non-technical user, **I want to** create reusable skills and subagents by typing what I want in plain English and clicking save, **so that** I can build my AI toolkit without writing markdown or YAML.

**Acceptance Criteria:**
- **Given** the user clicks "New Skill" or "New Agent," **When** the creation wizard opens, **Then** they see a text area with placeholder text and suggested templates.
- **Given** the user types a description and clicks the magic wand button, **When** Claude processes it, **Then** a refined, optimized prompt is suggested with an explanation of improvements.
- **Given** the user saves, **When** the config is written, **Then** the skill/agent appears in the library, canvas, and sidebar immediately.
- **Given** the user wants to edit an existing skill/agent, **When** they click it, **Then** they can modify the prompt and re-refine with the magic wand.

### US-6: Real-Time Agent Monitoring & Control
**As a** user running multiple agents, **I want to** see each agent's state (working, finished, paused, needs input, error) with distinct visual indicators and control their permission mode independently, **so that** I stay in control of the entire workflow.

**Acceptance Criteria:**
- **Given** an agent is working, **When** viewed on canvas or sidebar, **Then** a spinner animates and a "Working..." label is visible.
- **Given** an agent needs input, **When** the state changes, **Then** a speech bubble with "?" appears, a notification fires, and the user can provide input from any view.
- **Given** the user clicks a working agent, **When** the detail panel opens, **Then** chain of thought streams in real-time with collapsible thinking sections.
- **Given** the user toggles an agent's mode (plan/ask/auto-approve), **When** changed, **Then** the agent immediately respects the new permission level.
- **Given** the user provides input to an agent, **When** submitted, **Then** the agent resumes from its paused state.

### US-7: Gamified Pokemon Mode
**As a** user who wants a delightful experience, **I want to** toggle "Game Mode" to see my agents as pixelated Pokemon Sapphire-style sprites on a pastel game world, **so that** AI orchestration feels fun and approachable while remaining fully functional.

**Acceptance Criteria:**
- **Given** the user toggles Game Mode on, **When** the canvas updates, **Then** agents become pixel sprites with role-specific hats on a grass-tiled world with workstations.
- **Given** a new agent is created in Game Mode, **When** it spawns, **Then** a pixel egg appears, wobbles, hatches, and the ghost sprite emerges with its hat dropping onto it.
- **Given** an agent is working in Game Mode, **When** viewed, **Then** the sprite faces its workstation and animates (hammering, painting, writing, etc.).
- **Given** one agent passes output to another in Game Mode, **When** the transfer happens, **Then** a pixel carrier pigeon carries a scroll along the connection path.
- **Given** the user wants to interact with an agent in Game Mode, **When** they click the sprite, **Then** a pixel chat bubble opens with the agent's chain of thought, and the user can respond via chat.
- **Given** agents are in a team in Game Mode, **When** viewed, **Then** they are grouped within a pixel "building" or fenced area representing the team, with a sign showing the team name.

---

## Technical Requirements

### Tech Stack (Validated by @engineer)

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Framework** | Next.js 15 (App Router) | Full-stack React, SSR for fast initial load, API routes for CLI communication |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid development, accessible components out of the box, easy pastel theming |
| **Canvas** | React Flow (@xyflow/react v12) | Industry standard for node-based editors (used by LangFlow, Flowise, n8n) |
| **Game Renderer** | PixiJS v8 | Lightweight rendering library that composes inside React (unlike Phaser which fights for DOM control) |
| **State** | Zustand | Lightweight, works seamlessly with both React Flow and PixiJS |
| **Real-time** | Server-Sent Events (SSE) | Server-to-client streaming; simpler than WebSockets for this use case |
| **Config Parsing** | gray-matter | Parses markdown files with YAML frontmatter (agents, skills) |
| **Package Manager** | npm or bun | Standard tooling |

### Architecture

```
+--------------------------------------------------+
|                    BROWSER                        |
|                                                   |
|  +---------------------------------------------+ |
|  |              Next.js Frontend                | |
|  |                                              | |
|  |  [Chat View]  [Canvas View]  [Library View]  | |
|  |       |            |              |          | |
|  |  React +    React Flow +    Browse/Create    | |
|  |  Streaming   PixiJS Game     Skills, MCP,    | |
|  |  Messages    Mode Overlay    Agent Templates | |
|  +---------------------------------------------+ |
|           |            |              |           |
|           +------+-----+--------------+           |
|                  | SSE + REST                     |
+--------------------------------------------------+
                   |
+--------------------------------------------------+
|              Next.js API Routes                   |
|                                                   |
|  /api/chat     -- Spawn/manage CLI processes      |
|  /api/agents   -- CRUD agent .md files            |
|  /api/skills   -- CRUD skill SKILL.md files       |
|  /api/teams    -- CRUD team configurations        |
|  /api/mcp      -- CRUD .mcp.json, browse registry |
|  /api/hooks    -- CRUD hooks.json                 |
|  /api/config   -- Read/write settings.json        |
|  /api/stream   -- SSE endpoint for agent events   |
+--------------------------------------------------+
                   |
+--------------------------------------------------+
|              Process Manager                      |
|                                                   |
|  Spawns `claude` CLI as child processes           |
|  Uses --output-format stream-json for real-time   |
|  Uses --input-format stream-json for messages     |
|  Tracks agent IDs from stream events              |
|  Routes events to correct SSE connections         |
|                                                   |
|  IMPORTANT: Must set CLAUDECODE='' in env         |
|  (CLI refuses to nest inside another session)     |
+--------------------------------------------------+
                   |
+--------------------------------------------------+
|              File System                          |
|                                                   |
|  .claude/                                         |
|    agents/{name}.md        -- Agent definitions   |
|    skills/{name}/SKILL.md  -- Skill definitions   |
|    teams/{name}.json       -- Team configurations |
|    .mcp.json               -- MCP server config   |
|    hooks/hooks.json        -- Hook definitions    |
|    settings.json           -- Global settings     |
+--------------------------------------------------+
```

### CLI Integration

The Claude Code CLI (v2.1.50+) supports bidirectional JSON streaming:
- `--output-format stream-json` — Newline-delimited JSON events from stdout
- `--input-format stream-json` — JSON messages piped to stdin
- Events include `agentId` fields for routing subagent output
- **Critical:** Set `CLAUDECODE=''` in spawned process env to avoid nested-session rejection

### Data Model

**Agent** (`agents/{name}.md`)
```yaml
---
name: string          # Display name
description: string   # One-line role description
tools: string[]       # Allowed Claude tools (Read, Write, Edit, Bash, Grep, Glob)
model: string         # opus | sonnet | haiku
---
# System prompt content (markdown)
```

**Skill** (`skills/{name}/SKILL.md`)
```yaml
---
name: string          # Display name
description: string   # One-line description
disable-model-invocation: boolean
---
# Process instructions (markdown)
```

**Team** (`teams/{name}.json`) — New entity
```json
{
  "name": "Discovery Sprint",
  "description": "Explore and validate ideas",
  "agents": ["researcher", "bizops", "engineer"],
  "instructions": "Team-level shared context and coordination rules",
  "connections": [
    { "from": "researcher", "to": "engineer", "description": "Findings feed into feasibility" }
  ],
  "mcpServers": ["github", "context7"]
}
```

**MCP Server Registry Entry**
```json
{
  "name": "github",
  "description": "GitHub integration — PRs, issues, code search",
  "type": "http | command",
  "official": true,
  "config": {
    "type": "http",
    "url": "https://api.githubcopilot.com/mcp/"
  },
  "tools": ["create_pr", "list_issues", "search_code"]
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to Claude CLI, returns SSE stream |
| GET | `/api/stream/:sessionId` | SSE endpoint for real-time agent events |
| GET/POST/PUT/DELETE | `/api/agents` | CRUD for agent definitions |
| GET/POST/PUT/DELETE | `/api/skills` | CRUD for skill definitions |
| GET/POST/PUT/DELETE | `/api/teams` | CRUD for team configurations |
| GET/POST/PUT/DELETE | `/api/mcp` | CRUD for MCP server configs |
| GET | `/api/mcp/directory` | Browse official MCP server registry |
| GET/PUT | `/api/hooks` | Read/update hooks configuration |
| GET/PUT | `/api/config` | Read/update global settings |
| POST | `/api/agents/:id/input` | Provide input to a paused agent |
| PUT | `/api/agents/:id/mode` | Toggle agent permission mode |

---

## UI/UX Specification (Validated by @designer)

### Information Architecture

```
+----------------------------------------------------------+
|                                                          |
| +----------+ +----------------------------------------+ |
| | SIDEBAR  | | MAIN CONTENT (Tab Bar at top)          | |
| |          | |                                        | |
| | [Logo]   | | [Chat]  [Canvas]  [Library]            | |
| |          | |                                        | |
| | -------- | | Content changes based on active tab.   | |
| | Agents   | | Chat is the default for new users.     | |
| |  > Eng   | |                                        | |
| |  > Des   | |                                        | |
| |  > QA    | |                           +---------+  | |
| | [+ New]  | |                           | DETAIL  |  | |
| |          | |                           | PANEL   |  | |
| | -------- | |                           | (slides |  | |
| | Teams    | |                           |  right) |  | |
| |  > Disc. | |                           |         |  | |
| |  > Build | |                           +---------+  | |
| | [+ New]  | |                                        | |
| |          | |                                        | |
| | -------- | |                                        | |
| | History  | |                                        | |
| |          | |                                        | |
| | [Gear]   | |                                        | |
| | [Game]   | |                                        | |
| +----------+ +----------------------------------------+ |
+----------------------------------------------------------+
```

**Rationale:** Sidebar provides persistent agent/team list. Tabs separate Chat (default, lowest learning curve), Canvas (visual orchestration), and Library (skills, MCP servers, templates). Detail Panel slides in from the right without losing canvas context.

### Screen Inventory

| ID | Screen | Type | Purpose |
|----|--------|------|---------|
| S1 | Main Chat Interface | Primary tab | Chat with Claude/agents, slash commands, skill pills |
| S2 | Canvas/Workspace | Primary tab | Drag-and-drop agent orchestration, team containers |
| S3 | Library | Primary tab | Browse/create skills, agents, MCP servers |
| S4 | Agent Detail Panel | Slide-in panel | Config, chain of thought, logs, mode toggle |
| S5 | Skill/Agent Creator | Modal wizard | 2-3 step creation with AI refinement |
| S6 | Team Creator | Modal | Name team, set instructions, select agents |
| S7 | MCP Server Directory | Library sub-tab | Browse official + custom servers |
| S8 | Settings | Sidebar page | Model defaults, theme, permissions |
| S9 | Game Mode Overlay | Canvas overlay | Pixel art layer on top of standard canvas |
| S10 | Slash Command Palette | Floating overlay | Autocomplete on "/" in chat input |
| S11 | Permission Request | Modal/inline | Agent asking for approval |
| S12 | Onboarding Tour | Tooltip overlay | First-run 3-4 step walkthrough |

### Agent States & Visual Indicators

Every state uses triple encoding (icon + label + animation) for accessibility:

| State | Icon | Color | Animation | Game Mode |
|-------|------|-------|-----------|-----------|
| Working | Spinner | `#7CB8E8` calm blue | Rotating | Sprite faces workstation, tool swings |
| Finished | Checkmark | `#8BC8A0` sage green | Static | Sprite jumps, bows, green sparkle |
| Paused | Pause bars | `#E8D47C` muted gold | Still | Sprite sits, "Zzz" bubbles float |
| Needs Input | Speech bubble "?" | `#D4A0D4` soft lavender | Pulsing | Sprite faces camera, "?" bubble bobs |
| Error | Exclamation "!" | `#E89B9B` soft coral | Shake | Sprite turns red, smoke puff |

### Agent Team Visualization

**Standard Mode:**
- Teams render as rounded rectangular containers on the canvas
- Team container has a header bar with team name, run button, and instructions icon
- Agents inside the team are connected with internal arrows
- Team has input/output ports for connecting to other teams or standalone agents
- Dragging an agent into a team container adds it; dragging out removes it
- Dragging an MCP server onto a team container gives all member agents access

**Game Mode:**
- Teams render as pixel "buildings" or fenced areas with a sign post showing the team name
- Agents inside walk around within the team boundary
- A pixel flag or banner on the building matches the team's assigned color
- When the team runs, all sprites inside activate simultaneously

### MCP Server Visualization

**Standard Mode:**
- MCP servers appear as hexagonal nodes (distinct from circular agent nodes)
- Color-coded by type: blue for HTTP, green for command-based
- Official servers have a shield/verified badge
- Dotted connection lines to agents/teams that use them
- Dragging from the library onto canvas adds the server

**Game Mode:**
- MCP servers appear as pixel "tool chests" or "treasure chests" on the map
- When an agent uses an MCP server's tool, the sprite walks to the chest, opens it, takes an item

### Design System

**Pastel Color Palette:**
```
Primary:    #7C9FE8 (soft periwinkle)    Hover: #6889D4
Secondary:  #E8A87C (warm peach)         Light: #F5DCC8
Background: #FAFAF7 (warm off-white)
Surface:    #FFFFFF (cards/panels)
Border:     #E5E2DB (soft warm gray)
Text:       #2D2D2A (near-black warm)

Agent roles: Engineer #7CB8E8, Designer #D4A0D4, QA #8BC8A0,
             Writer #E8D47C, Researcher #E8A87C
```

**Typography:**
- Standard: Inter (body), Inter Display (headings)
- Game Mode headings: Press Start 2P (pixel font)
- Monospace: JetBrains Mono (chain of thought, code)

**Game Mode Sprites (16x16 base, rendered at 48-64px):**
- Base: Orange ghost (Claude logo simplified to pixel art), 2-frame idle bob
- Engineer: Yellow hard hat, workstation = anvil + hammer
- Designer: Purple beret, workstation = easel + palette
- QA: Magnifying glass, workstation = desk + stamp
- Writer: Quill pen, workstation = writing desk + scrolls
- Researcher: Explorer hat, workstation = globe + book + candle
- Birth animation: Egg wobbles > cracks > ghost emerges > hat drops on > sparkle (~2s at 15fps)
- Data transfer: Carrier pigeon carries scroll along connection path

### Key User Flows

**Flow 1: First-Time User Creates First Agent**
```
Open app > Onboarding tour (3 tooltips) > Zero state ("No agents yet")
> Click "Create Your First Agent" > Creator wizard (type description >
magic wand refines > pick mode) > Agent appears on canvas + chat opens
```

**Flow 2: Canvas Orchestration**
```
Canvas view > Drag agents from sidebar onto canvas > Draw connections
> Create team container > Drag agents into team > Set team instructions
> Drag MCP server onto team > Click "Run Pipeline" > Watch execution
> Agents animate through states > Results appear in chat
```

**Flow 3: Browse & Add MCP Server**
```
Library tab > MCP Servers sub-tab > Browse official directory >
Click server card for details > Drag onto canvas agent/team OR
click "Add to Agent" > Config auto-updated > Agent gains new tools
```

---

## Non-Functional Requirements

### Performance
- **Initial load:** < 3 seconds on localhost
- **Chat response streaming:** First token visible within 500ms of CLI output
- **Canvas rendering:** 60fps with up to 50 agent nodes
- **Game mode rendering:** 30fps minimum with PixiJS sprite animations
- **File operations:** Config read/write < 100ms

### Security
- **Local only:** No data leaves the machine (except through Claude API which the CLI manages)
- **No credential storage:** Relies on existing Claude CLI authentication
- **File access:** Scoped to `.claude/` directory and project working directory
- **No remote server:** All processing happens locally via Next.js dev server

### Accessibility
- WCAG AA contrast compliance on all text/background combinations
- Keyboard navigation for all interactive elements (Tab, Enter, Escape, arrow keys)
- Screen reader support with ARIA landmarks, live regions, and descriptive labels
- `prefers-reduced-motion` support: disables all animations, shows static frames
- Game Mode is purely decorative — all functional info accessible via standard ARIA
- Agent states always triple-encoded: icon + label + animation

### Browser Support
- Chrome 120+, Edge 120+, Safari 17+, Firefox 120+
- Responsive down to 768px (tablet), with mobile adaptations for smaller screens

---

## Complexity & Risk Assessment (from @engineer)

| Feature | Complexity | Risk | Notes |
|---------|-----------|------|-------|
| Local web app + process management | Medium | Low | Standard Next.js + child processes |
| Chat interface + slash commands | Medium | Low | Well-understood patterns |
| Visual canvas (React Flow) | **High** | Medium | Canvas-to-CLI translation needs design |
| Agent teams on canvas | **High** | Medium | Group containers + shared context |
| MCP server directory + drag-drop | Medium | Low | JSON config + registry fetch |
| Real-time agent monitoring | **High** | Medium | Subagent event routing via agentId |
| One-click skill/agent creation | Medium | Low | gray-matter + AI refinement |
| Model selection + recommendations | Low | Low | Simple dropdown + heuristics |
| Permission mode toggle | Low | Low | Per-agent flag |
| Gamified Pokemon mode | **Very High** | **High** | Sprite assets are the bottleneck |

### Key Architecture Decisions Needed

1. **Agent team orchestration:** Spawn one CLI process with an orchestrator prompt that internally manages subagents (recommended for MVP), or spawn multiple CLI processes coordinated by the backend (more control, more complexity)?

2. **Canvas-to-CLI translation:** The visual canvas lets users wire agents together, but no CLI flag says "run this topology." The canvas must generate either an orchestrator prompt or multiple CLI invocations. This is the core design challenge.

3. **MCP server directory source:** Bundle a static official registry (simpler), or fetch from a remote registry like npmjs/GitHub (more up-to-date, adds network dependency)?

4. **Game mode MVP scope:** Ship game mode with the initial release (adds 7-10 days for sprite assets) or ship standard mode first and add game mode as v1.1?

---

## Out of Scope (v1)

- **Cloud deployment / multi-user** — This is a local-only tool
- **Custom MCP server development** — Users can add servers but not build them in-app
- **Agent memory / persistence across sessions** — Relies on Claude CLI's built-in context
- **Billing / usage tracking** — Relies on user's existing Anthropic API plan
- **Plugin marketplace publishing** — Users create skills/agents locally, no distribution
- **Mobile native app** — Web-only, responsive down to tablet
- **Voice interaction** — Text-only interface
- **Real-time collaboration** — Single user, local only

---

## Open Questions

1. **MCP server directory:** Should we bundle a curated list of ~20 official MCP servers, or connect to a live registry? A bundled list is simpler but requires manual updates.

2. **Team persistence format:** The proposed `teams/{name}.json` is a new file format not native to Claude Code. Should teams be persisted as generated orchestrator prompts in `skills/` instead, for better CLI compatibility?

3. **Game mode priority:** The pixel art sprites require significant asset creation (~60-100 frames). Should we use AI-generated pixel art for MVP, or commission hand-drawn assets? AI-generated can ship faster.

4. **Onboarding depth:** How much hand-holding for the first-time experience? Minimal (3 tooltips) or comprehensive (interactive tutorial that walks through creating an agent, running a skill, and building a team)?

5. **Model recommendation engine:** Simple heuristic (haiku for quick tasks, sonnet for moderate, opus for complex) or should Claude analyze the task description and recommend?

---

## Recommended MVP Scope

Based on engineering feasibility analysis, recommended phased approach:

**Phase 1 (MVP — ~2-3 weeks):**
- Chat interface with slash command autocomplete
- Sidebar with agent/team list
- Canvas with agent nodes and connections (React Flow)
- One-click skill/agent creation with magic wand refinement
- Agent state monitoring (working/finished/paused/needs-input)
- Permission mode toggle per agent
- File-based config CRUD (agents, skills, MCP, hooks)

**Phase 2 (~1-2 weeks):**
- Agent team containers on canvas
- MCP server directory (bundled) with drag-and-drop
- Team instructions and shared context
- Model selection with recommendations
- Onboarding tour

**Phase 3 (~1-2 weeks):**
- Game Mode with PixiJS overlay
- Pixel art sprites, birth animations, workstations
- Carrier pigeon data transfer animation
- Team buildings in game mode
- MCP treasure chests

---

*Spec generated by ClaudeQuest Product Agent. Validated by @engineer (technical feasibility) and @designer (UI/UX).*
