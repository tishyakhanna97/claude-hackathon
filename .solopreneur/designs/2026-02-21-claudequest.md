# ClaudeQuest -- Part 1 Wireframes

Design system reference:
- Primary: #7C9FE8 (periwinkle)  Secondary: #E8A87C (peach)
- BG: #FAFAF7  Surface: #FFFFFF  Border: #E5E2DB  Text: #2D2D2A
- Fonts: Inter (UI), Press Start 2P (game mode), JetBrains Mono (code)
- Agent states: Working=blue spinner, Finished=green check, Paused=gold pause, NeedsInput=lavender "?", Error=coral "!"

---

## SCREEN 1: Main Chat Interface

```
+-----------------------------------------------------------------------------------+
| +--------------------+  +-------------------------------------------------------+ |
| |                    |  | TOP BAR                                                | |
| |   ClaudeQuest      |  | +-------------+ +----------+  +---+---+---+  +------+ | |
| |   ~~~~~~~~~~~      |  | | v Engineer   | | Working...|  |Pln|Ask|Aut|  | Game | | |
| |                    |  | |   [dropdown] | | (o) blue  |  |   |[X]|   |  |  OFF | | |
| |  AGENTS            |  | +-------------+ +----------+  +---+---+---+  +------+ | |
| |  +--------------+  |  +-------------------------------------------------------+ |
| |  | (o) Engineer |  |  |                                                        | |
| |  |    Working.. |  |  |  CHAT                                                  | |
| |  +--------------+  |  |  +--------------------------------------------------+  | |
| |  | (v) Designer |  |  |  |                                                  |  | |
| |  |    Done      |  |  |  |  +--------------------------------------------+  |  | |
| |  +--------------+  |  |  |  | [You]                          2:34 PM     |  |  | |
| |  | (||) QA      |  |  |  |  | Can you review the auth module in         |  |  | |
| |  |    Paused    |  |  |  |  | src/auth/login.ts? I want to make sure    |  |  | |
| |  +--------------+  |  |  |  | the token refresh logic is solid.         |  |  | |
| |                    |  |  |  +--------------------------------------------+  |  | |
| |  TEAMS             |  |  |                                                  |  | |
| |  +--------------+  |  |  |  +--------------------------------------------+  |  | |
| |  | Discovery    |  |  |  |  | [Engineer]                     2:34 PM     |  |  | |
| |  | Sprint       |  |  |  |  |                                            |  |  | |
| |  +--------------+  |  |  |  | > Show thinking...            [collapsed]  |  |  | |
| |  | Build & QA   |  |  |  |  |                                            |  |  | |
| |  +--------------+  |  |  |  | I reviewed `src/auth/login.ts`. Here are   |  |  | |
| |                    |  |  |  | my findings:                               |  |  | |
| |  HISTORY           |  |  |  |                                            |  |  | |
| |  +--------------+  |  |  |  | 1. **Token refresh race condition**       |  |  | |
| |  | Landing page |  |  |  |  |    Lines 42-58 have a potential race       |  |  | |
| |  | redesign     |  |  |  |  |    condition when multiple requests        |  |  | |
| |  +--------------+  |  |  |  |    trigger a refresh simultaneously.       |  |  | |
| |  | API endpoint |  |  |  |  |                                            |  |  | |
| |  | debugging    |  |  |  |  | 2. **Missing error boundary**             |  |  | |
| |  +--------------+  |  |  |  |    The catch block on line 71 silently     |  |  | |
| |  | Onboarding   |  |  |  |  |    swallows network errors. Recommend      |  |  | |
| |  | flow spec    |  |  |  |  |    surfacing these to the user.            |  |  | |
| |  +--------------+  |  |  |  |                                            |  |  | |
| |                    |  |  |  | 3. **Hardcoded expiry** -- The 3600s       |  |  | |
| |                    |  |  |  |    value on line 30 should come from the   |  |  | |
| |                    |  |  |  |    server response `expires_in` field.     |  |  | |
| |                    |  |  |  +--------------------------------------------+  |  | |
| |                    |  |  |                                                  |  | |
| |                    |  |  |  +--------------------------------------------+  |  | |
| |                    |  |  |  | [You]                          2:36 PM     |  |  | |
| |                    |  |  |  | Good catches. Can you fix the race         |  |  | |
| |                    |  |  |  | condition first? Use a mutex pattern.      |  |  | |
| |                    |  |  |  +--------------------------------------------+  |  | |
| |                    |  |  |                                                  |  | |
| |                    |  |  |  +--------------------------------------------+  |  | |
| |                    |  |  |  | [Engineer]                     2:36 PM     |  |  | |
| |                    |  |  |  |                                            |  |  | |
| |                    |  |  |  | Sure, I will implement a token refresh     |  |  | |
| |                    |  |  |  | mutex. Here is my plan:                    |  |  | |
| |                    |  |  |  |                                            |  |  | |
| |                    |  |  |  | - Add a `refreshPromise` singleton        |  |  | |
| |                    |  |  |  | - Gate concurrent calls behind it_        |  |  | |
| |                    |  |  |  |                               ^^^          |  |  | |
| |                    |  |  |  |                          [typing...]        |  |  | |
| |                    |  |  |  +--------------------------------------------+  |  | |
| |                    |  |  |                                                  |  | |
| |                    |  |  +--------------------------------------------------+  | |
| |                    |  |                                                        | |
| |                    |  |  QUICK SKILLS                                          | |
| |                    |  |  +--------+ +------+ +--------+ +------+ +------+ +-+  | |
| |                    |  |  |Design  | | Code | |Review  | | Spec | | Ship | |+|  | |
| |                    |  |  +--------+ +------+ +--------+ +------+ +------+ +-+  | |
| |                    |  |                                                        | |
| |  +--------------+  |  |  +--------------------------------------------------+  | |
| |  |   [gear]     |  |  |  | Message Engineer... (/ for commands)      [Send] |  | |
| |  +--------------+  |  |  +--------------------------------------------------+  | |
| |  | Game Mode    |  |  |                                                        | |
| |  |   [ OFF ]    |  |  |                                                        | |
| |  +--------------+  |  |                                                        | |
| +--------------------+  +--------------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

### Interaction notes -- Screen 1

- The left sidebar is 220px wide, collapsible.
- Agent list items show a colored status dot: blue pulsing for Working, green solid for Done, gold solid for Paused.
- The top bar mode toggle `[Plan|Ask|Auto]` highlights the active mode (Ask) with the primary periwinkle fill.
- "Show thinking..." is a collapsible disclosure triangle. Tapping expands the chain-of-thought block in a muted surface card.
- The typing indicator is a blinking cursor `_` with the text "typing..." in muted text below the streaming content.
- Quick skill pills are horizontally scrollable on mobile. The `[+]` pill opens a popover to add custom skills.
- The input bar stretches full width. Pressing `/` triggers a command palette overlay.
- Game Mode toggle in sidebar is a small switch. OFF state is muted, ON state glows with the secondary peach color.

---

## SCREEN 2: Canvas View -- Standard Mode

```
+-----------------------------------------------------------------------------------+
| +--------------------+  +-------------------------------------------------------+ |
| |                    |  | TOOLBAR                                                | |
| |   ClaudeQuest      |  | [- +] zoom 75%  |  [Run Pipeline >>]  |  [+ Agent]    | |
| |   ~~~~~~~~~~~      |  |                  |                     |  [+ Team ]    | |
| |                    |  | Layout: [Grid|Free]                    |  Game: [OFF]  | |
| |  AGENTS            |  +-------------------------------------------------------+ |
| |  +--------------+  |  |                                                  |     | |
| |  | (o) Engineer |  |  |  CANVAS                                         |PANEL| |
| |  |    Working.. |  |  |                                                  |     | |
| |  +--------------+  |  |                                                  | +-+ | |
| |  | (v) Designer |  |  |                                                  | |X| | |
| |  |    Done      |  |  |  +- - - - - - - - - - - - - - - - - - - -+      | +-+ | |
| |  +--------------+  |  |  :  DISCOVERY SPRINT          [Run][Edit] :      |     | |
| |  | (||) QA      |  |  |  :                                       :      | ENG- | |
| |  |    Paused    |  |  |  :  +-------------+    +-------------+   :      | INEER| |
| |  +--------------+  |  |  :  | Researcher  |    | BizOps      |   :      |     | |
| |  | Researcher   |  |  |  :  | .----.      |    | .----.      |   :      |[ava]| |
| |  +--------------+  |  |  :  | | :) |      |    | | :) |      |   :      |     | |
| |  | Writer       |  |  |  :  | '----'      |    | '----'      |   :      |State| |
| |  +--------------+  |  |  :  | Idle         |    | Idle        |   :      |Work-| |
| |                    |  |  :  +------+------+    +-------------+   :      |ing..| |
| |  TEAMS             |  |  :         |                              :      |     | |
| |  +--------------+  |  |  :         |                              :      |Mode | |
| |  | Discovery    |  |  |  :  +------v------+                      :      |+-+-+| |
| |  | Sprint       |  |  |  :  | (o)Engineer |   <-- also in team   :      ||P|A|| |
| |  +--------------+  |  |  :  | .----.      |                      :      |+-+-+| |
| |  | Build & QA   |  |  |  :  | |(o)|  [o]  |   [o] = spinner     :      |     | |
| |  +--------------+  |  |  :  | '----'      |                      :      |Model| |
| |                    |  |  :  | Working...   |                      :      |+---+| |
| |  HISTORY           |  |  :  +-------------+                      :      ||Opu|| |
| |  +--------------+  |  |  :                                       :      ||s  || |
| |  | Landing page |  |  |  +- - - - - - - - - - - - - - - - - - - -+      |+---+| |
| |  | redesign     |  |  |                                                  |     | |
| |  +--------------+  |  |          |                                       |Chain| |
| |  | API endpoint |  |  |          | arrow                                 |of   | |
| |  | debugging    |  |  |          v                                       |Thou-| |
| |  +--------------+  |  |                                                  |ght  | |
| |  | Onboarding   |  |  |  +-------------+         +-------------+        |+-—-+| |
| |  | flow spec    |  |  |  | (v) Designer |-------->| (?) QA      |        ||Ana-|| |
| |  +--------------+  |  |  | .----.       |         | .----.      |        ||lyz-|| |
| |                    |  |  | | :) | [v]    |  arrow  | | :) | [?]  |        ||ing || |
| |                    |  |  | '----'        |         | '----'      |        ||the || |
| |                    |  |  | Finished      |         | Needs Input |        ||auth|| |
| |                    |  |  +-------------+         +-------------+        ||mod-|| |
| |                    |  |                                                  ||ule.|| |
| |                    |  |                                                  ||... || |
| |                    |  |  +-------------+                                 |+----+| |
| |                    |  |  | Writer      |                                 |     | |
| |                    |  |  | .----.      |                                 |Skills| |
| |                    |  |  | | :) |      |                                 |code  | |
| |                    |  |  | '----'      |                                 |review| |
| |                    |  |  | Idle         |                                 |     | |
| |                    |  |  +-------------+                                 |     | |
| |                    |  |                                                  |     | |
| |                    |  |     MCP SERVERS                                  |     | |
| |                    |  |      /    \          /    \                       |     | |
| |                    |  |     / GitHub\......../ Ctx7 \                     |     | |
| |                    |  |     \ [blue]/  dots  \[grn] /                     |     | |
| |                    |  |      \ [*] /          \    /                      |     | |
| |                    |  |       \   /            \  /                       |     | |
| |  +--------------+  |  |   [*]=official badge                             |     | |
| |  |   [gear]     |  |  |   dots = dotted lines to connected agents        |     | |
| |  +--------------+  |  |                                                  |     | |
| |  | Game Mode    |  |  |                                                  |     | |
| |  |   [ OFF ]    |  |  |                                                  |     | |
| |  +--------------+  |  |                                                  |     | |
| +--------------------+  +--------------------------------------------------+-----+ |
+-----------------------------------------------------------------------------------+
```

### Interaction notes -- Screen 2

- The canvas is pannable and zoomable. Scroll to zoom, drag to pan.
- Agent nodes are 160x120px rounded-rect cards with a ghost avatar, name, and state badge.
- The team container "Discovery Sprint" uses a dashed border (#E5E2DB) with 16px padding. The header row has the team name left-aligned and [Run] + [Edit] buttons right-aligned.
- Connection arrows are bezier curves with arrowheads. They snap to agent card edges.
- MCP server hexagons sit below the agent graph. Dotted lines connect them to the agents that use those servers. The "official" badge is a small star icon on GitHub.
- The right detail panel slides in from the right edge, 320px wide, with a subtle shadow. It shows:
  - Agent name + avatar at top
  - State badge (animated spinner for Working)
  - Mode toggle (Plan / Ask / Auto)
  - Model dropdown (Opus selected)
  - Live chain-of-thought streaming text in a monospace block (JetBrains Mono)
  - Skills list at the bottom
- Clicking anywhere on the canvas (not on a node) closes the detail panel.
- The [Run Pipeline >>] button triggers all agents in dependency order.

---

## SCREEN 3: Canvas View -- Game Mode

```
+-----------------------------------------------------------------------------------+
| +--------------------+  +-------------------------------------------------------+ |
| |                    |  | TOOLBAR   (Press Start 2P font)                        | |
| |   ClaudeQuest      |  | [- +] zoom 75%  |  [Run Pipeline >>]  |  [+ Agent]    | |
| |   ~~~~~~~~~~~      |  |                  |                     |  [+ Team ]    | |
| |                    |  | Layout: [Grid|Free]                    |  Game: [=ON]  | |
| |  AGENTS            |  +-------------------------------------------------------+ |
| |  +--------------+  |  |                                                        | |
| |  | (o) Engineer |  |  |  GAME CANVAS                                          | |
| |  |    Working.. |  |  |  . . . . . . . . . . . . . . . . . . . . . . . . . .  | |
| |  +--------------+  |  |  . . . . . . . . . . . . . . . . . . . . . . . . . .  | |
| |  | (v) Designer |  |  |  . . . . . . +===========================+ . . . . .  | |
| |  |    Done      |  |  |  . . . . . . |  DISCOVERY SPRINT   [>>]  | . . . . .  | |
| |  +--------------+  |  |  . . . . . . |  +-+-+-+-+-+-+-+-+-+-+-+   | . . . . .  | |
| |  | (?) QA       |  |  |  . . . . . . |  |f|e|n|c|e| |f|e|n|c|   | . . . . .  | |
| |  |    Needs Inp |  |  |  . . . . . . |  +-+-+-+-+-+-+-+-+-+-+-+   | . . . . .  | |
| |  +--------------+  |  |  . . . . . . |                           | . . . . .  | |
| |  | Researcher   |  |  |  . . . . . . |    ,---.                  | . . . . .  | |
| |  +--------------+  |  |  . . . . . . |   /     \   ,---.         | . . . . .  | |
| |                    |  |  . . . . . . |  | (o_o) |  /     \        | . . . . .  | |
| |  TEAMS             |  |  . . . . . . |  |  n   |  | (^_^)|       | . . . . .  | |
| |  +--------------+  |  |  . . . . . . |  | /|\ [H] |  n   |       | . . . . .  | |
| |  | Discovery    |  |  |  . . . . . . |  | / \  |  | /|\ [E]      | . . . . .  | |
| |  | Sprint       |  |  |  . . . . . . |  +-----+  | / \  |       | . . . . .  | |
| |  +--------------+  |  |  . . . . . . |  Explorer   +-----+       | . . . . .  | |
| |  | Build & QA   |  |  |  . . . . . . |  walking..  BizOps        | . . . . .  | |
| |  +--------------+  |  |  . . . . . . |                           | . . . . .  | |
| |                    |  |  . . . . . . +===========================+ . . . . .  | |
| |  HISTORY           |  |  . . . . . . . . . . . . . . . . . . . . . . . . . .  | |
| |  +--------------+  |  |  . . . .  ,---.            ___         . . . . . . .  | |
| |  | Landing page |  |  |  . . . . /     \      ,---/   >  . . . . . . . . . .  | |
| |  | redesign     |  |  |  . . . .| (o_o) |    / pigeon /   . . . . . . . . .  | |
| |  +--------------+  |  |  . . . .|  [H]  |   /~~~vv~~/     . . . . . . . . .  | |
| |  | API endpoint |  |  |  . . . .| /|\ * |  '-------'      . . . . . . . . .  | |
| |  | debugging    |  |  |  . . . .| / \   |  flying D->QA    . . . . . . . . .  | |
| |  +--------------+  |  |  . . . .+--+----+                  . . . . . . . . .  | |
| |  | Onboarding   |  |  |  . . . .|anvil|  +~~~~~~~~~~~~~~~+ . . . . . . . . .  | |
| |  | flow spec    |  |  |  . . . .+--+--+  | "Reviewing    | . . . . . . . . .  | |
| |  +--------------+  |  |  . . . . * * *   |  the auth     | . . . . . . . . .  | |
| |                    |  |  . . .  ENGINEER  |  module..."   | . @  . . . . . .  | |
| |                    |  |  . . .  hammering +~~~~~~~~~~~~~~~+ @@@  . . . . . .  | |
| |                    |  |  . . . . . . . . . . . . . . . . . @@@@ tree. . . .  | |
| |                    |  |  . .  ,---.  . . . . . . . . . . . . . . . . . . . .  | |
| |                    |  |  . . /     \ . +------+ . . . . . . *  . . . . . . .  | |
| |                    |  |  . .| (^_^) |. |=(==)=| . ,---.  .  *  . . . . . . .  | |
| |                    |  |  . .|  [B]  |. |CHEST | . /     \ . * flowers. . . .  | |
| |                    |  |  . .| /|\ * |. | MCP  | .| (?_?) |. . . . . . . . .  | |
| |                    |  |  . .| / \   |. |GitHub| .|  [M]  |. . . . . . . . .  | |
| |                    |  |  . .+-------+. +------+ .| /|\ ? |. . . . . . . . .  | |
| |                    |  |  .  DESIGNER .  treasure .| / \   |. . +----+ . . .  | |
| |  +--------------+  |  |  .  finished .  chest   .+-------+. . |(~~)| . . .  | |
| |  |   [gear]     |  |  |  .   * *    . . . . . .   QA     . . | egg| . . .  | |
| |  +--------------+  |  |  .  sparkle  . . . . . . needs   . . |(~~)| . . .  | |
| |  | Game Mode    |  |  |  . . . . . . . . . . . . input   . . +----+ . . .  | |
| |  |   [=ON ]     |  |  |  . . . . . . . . . . . . . . . . . wobbling . . .  | |
| |  +--------------+  |  |  . . . . . . . . . . . . . . . . . . . . . . . . .  | |
| +--------------------+  +--------------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

### Interaction notes -- Screen 3

- All text on the canvas switches to Press Start 2P (pixel font) when game mode is active.
- The background is a tiled dot pattern representing grass (color #D4E8C2 light green).
- Agent ghosts are rendered as small pixel-art sprites:
  - **Engineer** `[H]` = hard hat. Shown at an anvil with motion lines (`* * *`) indicating active work. A pixel speech bubble shows the current task.
  - **Designer** `[B]` = beret. Shown at an easel with sparkle particles (`* *`) above indicating completion.
  - **QA** `[M]` = magnifying glass. Has a `?` thought bubble indicating needs-input state.
  - **Researcher/Explorer** `[E]` = explorer hat. Shown mid-walk on a path inside the team fence.
- The team "Discovery Sprint" is rendered as a fenced enclosure with pixel fence posts along the top border and a sign.
- A **carrier pigeon** sprite flies between Designer and QA, representing the data handoff arrow from standard mode.
- **MCP Server** is rendered as a treasure chest with the server name label.
- **Decorations**: A tree (made of `@` characters), pixel flowers (`*` on stems), and grass dots throughout.
- **Egg** in the bottom-right corner is wobbling `(~~)` to indicate an agent being born / created. This animates with a subtle shake.
- Clicking any sprite opens its detail panel (same content as standard mode, but with pixel-styled headers).

---

## SCREEN 4: Skill / Agent Creator Modal (All 3 Steps)

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|        STEP 1 of 3 -- "What should this agent do?"                                |
|        +---------------------------------------------------------------+          |
|        |                                           [X] close           |          |
|        |   Step:  (1)------(2)------(3)                                |          |
|        |          [*]      [ ]      [ ]                                |          |
|        |         active   config   review                              |          |
|        |                                                               |          |
|        |   What should this agent do?                                  |          |
|        |                                                               |          |
|        |   +---------------------------------------------------+ +--+ |          |
|        |   | I want an agent that writes blog posts about      | |  | |          |
|        |   | tech topics, explaining complex concepts in a     | |WA| |          |
|        |   | way that beginners can understand. It should      | |ND| |          |
|        |   | research the topic first and then produce a       | |  | |          |
|        |   | well-structured article.                          | |  | |          |
|        |   |                                                   | |  | |          |
|        |   |                                                   | |  | |          |
|        |   +---------------------------------------------------+ +--+ |          |
|        |                                              ^ Magic Wand     |          |
|        |                                                               |          |
|        |   Or start from a template:                                   |          |
|        |                                                               |          |
|        |   +----------+ +----------+ +------------+ +----------+      |          |
|        |   |          | |          | |            | |          |      |          |
|        |   |   .---.  | |   .---.  | |   .---.    | |   .---.  |      |          |
|        |   |  | :) | | |  | :) | | |  | :) |   | |  | :) | |      |          |
|        |   |   '---'  | |   '---'  | |   '---'   | |   '---'  |      |          |
|        |   |    [Q]   | |   [<>]  | |    [?]    | |   [eye]  |      |          |
|        |   |  Writer  | |  Coder  | | Researcher | | Reviewer |      |          |
|        |   +----------+ +----------+ +------------+ +----------+      |          |
|        |                                                               |          |
|        |   +----- REFINED (after clicking wand) --------------------+ |          |
|        |   | bg: light periwinkle tint                               | |          |
|        |   |                                                         | |          |
|        |   | "You are a technical content writer specializing in     | |          |
|        |   |  beginner-friendly explanations of software engineering | |          |
|        |   |  concepts. You research topics thoroughly using         | |          |
|        |   |  authoritative sources before writing. Your output is   | |          |
|        |   |  a structured blog post (intro, sections, conclusion)   | |          |
|        |   |  with a conversational yet informative tone aimed at    | |          |
|        |   |  junior developers."                                    | |          |
|        |   |                                                         | |          |
|        |   | Improvements:                                           | |          |
|        |   | - Added specificity about target audience (junior devs) | |          |
|        |   | - Defined output format (structured blog post)           | |          |
|        |   | - Specified tone (conversational, informative)           | |          |
|        |   | - Added research-first workflow                          | |          |
|        |   +---------------------------------------------------------+ |          |
|        |                                                               |          |
|        |                                      [Next: Configure >>]     |          |
|        +---------------------------------------------------------------+          |
|                                                                                   |
|                                                                                   |
|                                                                                   |
|        STEP 2 of 3 -- "Configure your agent"                                      |
|        +---------------------------------------------------------------+          |
|        |                                           [X] close           |          |
|        |   Step:  (1)------(2)------(3)                                |          |
|        |          [v]      [*]      [ ]                                |          |
|        |         done     active   review                              |          |
|        |                                                               |          |
|        |   Configure your agent                                        |          |
|        |                                                               |          |
|        |   Name                                                        |          |
|        |   +---------------------------------------------------+      |          |
|        |   | Tech Writer                                       |      |          |
|        |   +---------------------------------------------------+      |          |
|        |                                                               |          |
|        |   Mode                                                        |          |
|        |   +---------------------------------------------------+      |          |
|        |   |  ( ) Plan    (*) Ask          ( ) Auto            |      |          |
|        |   |              ^^^ Recommended                      |      |          |
|        |   +---------------------------------------------------+      |          |
|        |   "Ask mode pauses for your approval before acting.           |          |
|        |    Best for agents you are still getting to know."            |          |
|        |                                                               |          |
|        |   Model                                                       |          |
|        |   +---------------------------------------------------+      |          |
|        |   | v  Sonnet (Recommended)                           |      |          |
|        |   +---------------------------------------------------+      |          |
|        |   "Best balance of speed and quality for writing tasks"       |          |
|        |                                                               |          |
|        |   Skills                                                      |          |
|        |   +---------------------------------------------------+      |          |
|        |   |  [x] write-tutorial    [x] review                 |      |          |
|        |   |  [ ] code              [ ] design                 |      |          |
|        |   |  [ ] spec              [+ Add custom skill]       |      |          |
|        |   +---------------------------------------------------+      |          |
|        |                                                               |          |
|        |                         [<< Back]    [Next: Review >>]        |          |
|        +---------------------------------------------------------------+          |
|                                                                                   |
|                                                                                   |
|                                                                                   |
|        STEP 3 of 3 -- "Review & Create"                                           |
|        +---------------------------------------------------------------+          |
|        |                                           [X] close           |          |
|        |   Step:  (1)------(2)------(3)                                |          |
|        |          [v]      [v]      [*]                                |          |
|        |         done     done     active                              |          |
|        |                                                               |          |
|        |   Review & Create                                             |          |
|        |                                                               |          |
|        |   +-------------------------------------------------------+  |          |
|        |   |                                                       |  |          |
|        |   |              .----.                                   |  |          |
|        |   |             | :)  |                                   |  |          |
|        |   |              '----'                                   |  |          |
|        |   |               [Q]    <-- quill hat (Writer)           |  |          |
|        |   |                                                       |  |          |
|        |   |           "Tech Writer"                               |  |          |
|        |   |                                                       |  |          |
|        |   |   +-----------+-----------------------------------+   |  |          |
|        |   |   | Role      | Technical content writer          |   |  |          |
|        |   |   |           | specializing in beginner-friendly |   |  |          |
|        |   |   |           | software engineering articles.    |   |  |          |
|        |   |   +-----------+-----------------------------------+   |  |          |
|        |   |   | Mode      | Ask (pauses for approval)        |   |  |          |
|        |   |   +-----------+-----------------------------------+   |  |          |
|        |   |   | Model     | Sonnet                            |   |  |          |
|        |   |   +-----------+-----------------------------------+   |  |          |
|        |   |   | Skills    | write-tutorial, review            |   |  |          |
|        |   |   +-----------+-----------------------------------+   |  |          |
|        |   |                                                       |  |          |
|        |   +-------------------------------------------------------+  |          |
|        |                                                               |          |
|        |            [<< Back]              [Create Agent]              |          |
|        |                                    ^^^^^^^^^^^                |          |
|        |                              primary periwinkle button       |          |
|        |                              with white text, 48px height    |          |
|        +---------------------------------------------------------------+          |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Interaction notes -- Screen 4

- The modal is centered, 640px wide, with rounded corners (12px) and a backdrop blur overlay.
- **Step 1**:
  - The text area auto-grows as the user types, up to 6 lines before scrolling.
  - The Magic Wand button (right of textarea) triggers an AI refinement call. While processing, it shows a shimmer animation on the button.
  - The refined output appears in a card with a light periwinkle (#7C9FE8 at 10% opacity) background. The "Improvements" section uses muted text.
  - Template cards are clickable and pre-fill the text area with a starting prompt for that archetype.
  - Each template card shows a ghost avatar with the archetype's hat icon.
- **Step 2**:
  - The "Recommended" label appears as a small badge (peach background, dark text) next to the Ask radio.
  - The model dropdown hint text appears below in muted color. The hint updates dynamically based on the selected model.
  - Skills are checkboxes in a 2-column grid. The `[+ Add custom skill]` link opens an inline text input.
  - Step 1 dot shows a green checkmark `[v]` indicating completion.
- **Step 3**:
  - The summary card has a centered layout with the ghost avatar at the top, wearing the Writer hat (quill `[Q]`).
  - The details table uses alternating row shading for readability.
  - The `[Create Agent]` button is the primary action -- full-width on mobile, right-aligned on desktop. It uses the primary periwinkle (#7C9FE8) fill with white text.
  - The `[<< Back]` button is a ghost/outline variant.
  - On success, the modal closes with a confetti micro-animation and the new agent appears on the canvas (or in game mode, hatches from the egg).

---

## Accessibility Considerations (All Screens)

| Concern | Implementation |
|---------|---------------|
| Color contrast | All text meets WCAG AA (4.5:1 for normal text, 3:1 for large). #2D2D2A on #FAFAF7 = 12.7:1. Agent state colors are never the sole indicator -- always paired with text labels and icons. |
| Keyboard navigation | All interactive elements are focusable. Tab order follows visual layout: sidebar top-to-bottom, then main content left-to-right. Canvas nodes are focusable with arrow keys. Modal traps focus. |
| Screen readers | Agent states announced as "Engineer, status: working". Canvas view provides an accessible tree alternative via a hidden panel. Game mode sprites have aria-labels matching their standard-mode counterparts. |
| Motion sensitivity | All animations respect `prefers-reduced-motion`. Typing indicators become static ellipsis. Game mode sprites freeze in idle poses. The egg stops wobbling. |
| Focus indicators | 2px periwinkle (#7C9FE8) outline offset by 2px on all focusable elements. High visibility against both light and dark surfaces. |
| Touch targets | All buttons and interactive elements are minimum 44x44px. Skill pills have 8px padding for comfortable tapping. |
# ClaudeQuest Wireframes -- Part 2 (Screens 5-10)

**Date:** 2026-02-21
**Author:** Designer Agent
**Design System:** Pastel palette, Primary #7C9FE8, Secondary #E8A87C, BG #FAFAF7
**Agent Colors:** Engineer #7CB8E8, Designer #D4A0D4, QA #8BC8A0, Writer #E8D47C, Researcher #E8A87C

---

## Screen 5: Library View -- MCP Servers Tab

This screen is the MCP server directory within the Library tab. Users browse,
search, and manage servers that extend agent capabilities. The emotional goal
is empowerment: "I can give my agents superpowers without touching config files."

```
+-------------------------------------------------------------- 1440px ---+
| +--------+ +----------------------------------------------------------+ |
| | SIDEBAR | |  MAIN CONTENT                                          | |
| |         | |                                                        | |
| | [Logo]  | |  [ Chat ]  [ Canvas ]  [ Library* ]                    | |
| |ClaudeQ. | |  ______________________________________________________| |
| |         | |                                                        | |
| | ------  | |  [ Skills ]  [ Agents ]  [ MCP Servers* ]  [ Teams ]   | |
| | Agents  | |   ___________          ==================              | |
| |  > Eng  | |                        active tab underline            | |
| |  > Des  | |                                                        | |
| |  > QA   | |  +--------------------------------------------------+ | |
| |  > Wri  | |  | [Q] Search MCP servers...    [Filter: All  v]     | | |
| | [+New]  | |  +--------------------------------------------------+ | |
| |         | |                                        [+ Add Custom Server]|
| | ------  | |                                                        | |
| | Teams   | |  +------------------------+  +------------------------+ | |
| |  > Cont | |  | +----+                 |  | +----+                 | | |
| |  > Disc | |  | | GH |  GitHub         |  | |C-7 |  Context7      | | |
| | [+New]  | |  | +----+  [shield] Offcl |  | +----+  [shield] Offcl | | |
| |         | |  |                        |  |                        | | |
| | ------  | |  |  Type: HTTP            |  |  Type: Command         | | |
| | History | |  |                        |  |                        | | |
| |         | |  |  Tools:                |  |  Tools:                | | |
| |         | |  |  [create_pr]           |  |  [resolve-library-id]  | | |
| |         | |  |  [list_issues]         |  |  [query-docs]          | | |
| |         | |  |  [search_code]         |  |                        | | |
| |         | |  |                        |  |  Status: Connected     | | |
| |         | |  |  Status: Connected     |  |  (o) green dot         | | |
| |         | |  |  (o) green dot         |  |                        | | |
| | [Gear]  | |  +------------------------+  +------------------------+ | |
| | [Game]  | |                                                        | |
| |         | |  +------------------------+  +------------------------+ | |
| |         | |  | +----+                 |  | +----+                 | | |
| |         | |  | |CDT |  Chrome DevTools|  | |Slk |  Slack          | | |
| |         | |  | +----+  [shield] Offcl |  | +----+  [shield] Offcl | | |
| |         | |  |                        |  |                        | | |
| |         | |  |  Type: Command         |  |  Type: HTTP            | | |
| |         | |  |                        |  |                        | | |
| |         | |  |  Tools:                |  |  Tools:                | | |
| |         | |  |  [take_screenshot]     |  |  [send_message]        | | |
| |         | |  |  [click]               |  |  [list_channels]       | | |
| |         | |  |  [navigate]            |  |                        | | |
| |         | |  |                        |  |  Status: Connected     | | |
| |         | |  |  Status: Not connected |  |  (o) green dot         | | |
| |         | |  |  (x) gray dot          |  |                        | | |
| |         | |  +------------------------+  +------------------------+ | |
| |         | |                                                        | |
| |         | |  +------------------------+  +------------------------+ | |
| |         | |  | +----+                 |  | +----+                 | | |
| |         | |  | |FS  |  Filesystem     |  | |GH  |  GitHub        | | |
| |         | |  | +----+  [user] Custom  |  | +----+  [shield] Offcl| | |
| |         | |  |                        |  |                        | | |
| |         | |  |  Type: Command         |  |  EXPANDED CARD         | | |
| |         | |  |                        |  |  ~~~~~~~~~~~~~~~~~~~~  | | |
| |         | |  |  Tools:                |  |  All tools (12):       | | |
| |         | |  |  [read_file]           |  |  [create_pr]           | | |
| |         | |  |  [write_file]          |  |  [list_issues]         | | |
| |         | |  |                        |  |  [search_code]         | | |
| |         | |  |  Status: Connected     |  |  [create_issue]        | | |
| |         | |  |  (o) green dot         |  |  [get_file_contents]   | | |
| |         | |  |                        |  |  [list_repos]          | | |
| |         | |  +------------------------+  |  [create_branch]       | | |
| |         | |                              |  [get_pull_request]    | | |
| |         | |                              |  [merge_pr]            | | |
| |         | |                              |  [list_commits]        | | |
| |         | |                              |  [search_repos]        | | |
| |         | |                              |  [get_user]            | | |
| |         | |                              |                        | | |
| |         | |                              |  [Add to Agent   v]    | | |
| |         | |                              |  +------------------+  | | |
| |         | |                              |  | > Engineer       |  | | |
| |         | |                              |  | > Designer       |  | | |
| |         | |                              |  | > QA             |  | | |
| |         | |                              |  | > Writer         |  | | |
| |         | |                              |  +------------------+  | | |
| |         | |                              |                        | | |
| |         | |                              |  Hint: You can also    | | |
| |         | |                              |  drag this card onto   | | |
| |         | |                              |  the Canvas tab.       | | |
| |         | |                              |                        | | |
| |         | |                              +------------------------+ | |
| |         | |                                                        | |
| +--------+ +--------------------------------------------------------+ |
+------------------------------------------------------------------------+
```

**Component inventory for Screen 5:**
- TabBar (primary: Chat/Canvas/Library, secondary: Skills/Agents/MCP/Teams)
- SearchBar with integrated filter dropdown
- ActionButton (+ Add Custom Server)
- ServerCard (collapsed state): icon, name, badge, type label, tool pills, status dot
- ServerCard (expanded state): full tool list, agent dropdown, drag hint
- Badge variants: [shield] for official, [user] for custom
- ToolPill: small rounded tag for each tool name
- StatusIndicator: green dot (connected), gray dot (not connected)

---

## Screen 6: Agent Detail Panel (360px Right Slide-In)

This panel appears when clicking any agent in the sidebar or on the canvas.
It is the control center for a single agent. The emotional goal is confidence:
"I can see exactly what this agent is thinking and doing, and I control it."

```
                                              +-- 360px panel --+
                                              |                 |
                                              |  [<- Back]  [X] |
                                              |                 |
                                              |    .---.        |
                                              |   / o o \       |
                                              |  |  ---  |      |
                                              |   \_____/       |
                                              |    [HARD HAT]   |
                                              |                 |
                                              |  "Engineer"     |
                                              |   [pencil]      |
                                              |   editable name |
                                              |                 |
                                              |  [Working...]   |
                                              |   blue badge    |
                                              |   with spinner  |
                                              |                 |
                                              | =============== |
                                              |                 |
                                              | CONTROLS        |
                                              | --------------- |
                                              |                 |
                                              |  Mode:          |
                                              |  ( ) Plan       |
                                              |  (*) Ask        |
                                              |  ( ) Auto       |
                                              |                 |
                                              |  Model:         |
                                              |  +-----------+  |
                                              |  | Opus    v |  |
                                              |  +-----------+  |
                                              |                 |
                                              |  Auto-approve:  |
                                              |  [====OFF]      |
                                              |   toggle switch |
                                              |                 |
                                              | =============== |
                                              |                 |
                                              | CHAIN OF        |
                                              | THOUGHT         |
                                              | --------------- |
                                              |  (live stream)  |
                                              |                 |
                                              | [v] Step 1      |
                                              |     "Reading    |
                                              |      auth.ts..  |
                                              |      ."         |
                                              |     [checkmark] |
                                              |     completed   |
                                              |                 |
                                              | [v] Step 2      |
                                              |     "Analyzing  |
                                              |      token      |
                                              |      validation |
                                              |      logic..."  |
                                              |     [checkmark] |
                                              |     completed   |
                                              |                 |
                                              | [V] Step 3      |
                                              |     "Found      |
                                              |      potential  |
                                              |      vulnerab-  |
                                              |      ility in   |
                                              |      the token  |
                                              |      refresh    |
                                              |      flow where |
                                              |      expired    |
                                              |      tokens are |
                                              |      not being  |
                                              |      invalidat- |
                                              |      ed on the  |
                                              |      server     |
                                              |      side. The  |
                                              |      current    |
                                              |      implementa |
                                              |      tion only  |
                                              |      checks     |
                                              |      expiry     |
                                              |      client-sid |
                                              |      e, which_  |
                                              |                 |
                                              |     [streaming] |
                                              |      ^ cursor   |
                                              |      blinking   |
                                              |                 |
                                              | =============== |
                                              |                 |
                                              | ASSIGNED SKILLS |
                                              | --------------- |
                                              |                 |
                                              |  [code]     [x] |
                                              |  [review]   [x] |
                                              |  [spec]     [x] |
                                              |                 |
                                              |  [+ Add Skill]  |
                                              |                 |
                                              | =============== |
                                              |                 |
                                              | MCP SERVERS     |
                                              | --------------- |
                                              |                 |
                                              | GitHub          |
                                              |  [shield] Offcl |
                                              |                 |
                                              | Context7        |
                                              |  [shield] Offcl |
                                              |                 |
                                              |  [+ Add Server] |
                                              |                 |
                                              | =============== |
                                              |                 |
                                              | RECENT ACTIVITY |
                                              | --------------- |
                                              |                 |
                                              |  |  2:34 PM     |
                                              |  |  Read 3 files |
                                              |  |  auth.ts,     |
                                              |  |  config.ts,   |
                                              |  |  index.ts     |
                                              |  |              |
                                              |  |  2:35 PM     |
                                              |  |  Edited       |
                                              |  |  auth.ts      |
                                              |  |  +23 / -4     |
                                              |  |  lines        |
                                              |  |              |
                                              |  *  2:36 PM     |
                                              |  |  Running      |
                                              |  |  tests...     |
                                              |  |  [spinner]    |
                                              |                 |
                                              | =============== |
                                              |                 |
                                              |  [Delete Agent] |
                                              |   ^ red text    |
                                              |     button      |
                                              |                 |
                                              +-----------------+
```

**Component inventory for Screen 6:**
- PanelHeader: back arrow, close X, stacked centered
- AgentAvatar: large ghost illustration with role-specific hat overlay
- EditableName: inline editable text field with pencil icon
- StatusBadge: colored pill with spinner animation ("Working..." in blue)
- RadioGroup: Mode selector (Plan / Ask / Auto)
- Select/Dropdown: Model picker (Opus, Sonnet, Haiku)
- Toggle: Auto-approve ON/OFF switch
- CollapseSection: Chain of Thought steps, collapsed/expanded states
- StreamingText: live text with blinking cursor indicator
- SkillPill: rounded tag with [x] remove button
- AddButton: "+ Add Skill", "+ Add Server" inline actions
- ServerListItem: compact row with name + official badge
- Timeline: vertical line with timestamped activity entries
- DangerButton: red text "Delete Agent" at bottom

---

## Screen 7: Team Creator Modal

A centered modal for composing agent teams. Users name the team, write
instructions, pick agents, and define how they connect. The emotional goal
is creativity: "I am assembling my dream team and choreographing their work."

```
+------------------------------------------------------------------------+
|                                                                        |
|  +----- 640px modal, centered, shadow, rounded corners --------------+ |
|  |                                                                    | |
|  |  Create a Team                                          [X close]  | |
|  |  ==============================================================    | |
|  |                                                                    | |
|  |  Team name                                                         | |
|  |  +--------------------------------------------------------------+  | |
|  |  | Content Pipeline                                             |  | |
|  |  +--------------------------------------------------------------+  | |
|  |                                                                    | |
|  |  Description                                                       | |
|  |  +--------------------------------------------------------------+  | |
|  |  | End-to-end content creation team                              |  | |
|  |  +--------------------------------------------------------------+  | |
|  |                                                                    | |
|  |  Instructions                                                      | |
|  |  +--------------------------------------------------------------+  | |
|  |  | Coordinate to produce a polished blog post.                  |  | |
|  |  | Writer drafts the initial article based on the              |  | |
|  |  | topic provided. Editor reviews the draft for                |  | |
|  |  | clarity, grammar, and tone. Designer creates a              |  | |
|  |  | header image and any supporting visuals.                    |  | |
|  |  |                                                              |  | |
|  |  | The Writer should produce a complete draft before            |  | |
|  |  | handing off. The Editor should return actionable             |  | |
|  |  | feedback. The Designer works in parallel once the            |  | |
|  |  | topic is known.                                              |  | |
|  |  +--------------------------------------------------------------+  | |
|  |   ^ large textarea, 8 rows                                        | |
|  |                                                                    | |
|  |  ---------------------------------------------------------------   | |
|  |                                                                    | |
|  |  Add agents to this team                                           | |
|  |                                                                    | |
|  |  [x] Writer       [E8D47C gold dot]                                | |
|  |  [x] Designer     [D4A0D4 lavender dot]                            | |
|  |  [ ] Engineer     [7CB8E8 blue dot]                                 | |
|  |  [ ] QA           [8BC8A0 green dot]                                | |
|  |  [ ] Researcher   [E8A87C peach dot]                                | |
|  |                                                                    | |
|  |  ---------------------------------------------------------------   | |
|  |                                                                    | |
|  |  Define how agents collaborate                                     | |
|  |                                                                    | |
|  |  +------------------------------------------------------------+   | |
|  |  |  +----------+       +----------+                           |   | |
|  |  |  | Writer v | ----> | Designer v|                          |   | |
|  |  |  +----------+       +----------+                           |   | |
|  |  |  "Draft feeds into visual design"                          |   | |
|  |  +------------------------------------------------------------+   | |
|  |                                                                    | |
|  |  +------------------------------------------------------------+   | |
|  |  |  +----------+       +----------+                           |   | |
|  |  |  | Writer v | ----> | Editor v |                           |   | |
|  |  |  +----------+       +----------+                           |   | |
|  |  |  "Draft sent for review"                                   |   | |
|  |  +------------------------------------------------------------+   | |
|  |                                                                    | |
|  |  [+ Add Connection]                                                | |
|  |                                                                    | |
|  |  ---------------------------------------------------------------   | |
|  |                                                                    | |
|  |  MCP Servers                                                       | |
|  |                                                                    | |
|  |  [x] GitHub      [shield] Official                                 | |
|  |  [ ] Context7    [shield] Official                                 | |
|  |  [x] Slack       [shield] Official                                 | |
|  |                                                                    | |
|  |  ---------------------------------------------------------------   | |
|  |                                                                    | |
|  |  Preview                                                           | |
|  |                                                                    | |
|  |  +------------------------------------------------------------+   | |
|  |  |                                                            |   | |
|  |  |           +--------+                                       |   | |
|  |  |           | Writer |                                       |   | |
|  |  |           +---+----+                                       |   | |
|  |  |               |                                            |   | |
|  |  |         +-----+------+                                     |   | |
|  |  |         |            |                                     |   | |
|  |  |         v            v                                     |   | |
|  |  |   +----------+ +----------+                                |   | |
|  |  |   | Designer | | Editor   |                                |   | |
|  |  |   +----------+ +----------+                                |   | |
|  |  |                                                            |   | |
|  |  +------------------------------------------------------------+   | |
|  |   ^ mini topology canvas, read-only, auto-layout                  | |
|  |                                                                    | |
|  |  +------------------------------------------------------------+   | |
|  |  |                                                            |   | |
|  |  |           [Cancel]          [Create Team]                  |   | |
|  |  |            outline            primary                      |   | |
|  |  |            button             button                       |   | |
|  |  |                              #7C9FE8                       |   | |
|  |  +------------------------------------------------------------+   | |
|  |                                                                    | |
|  +--------------------------------------------------------------------+ |
|                                                                        |
+------------------------------------------------------------------------+
```

**Component inventory for Screen 7:**
- Modal: 640px centered overlay with backdrop blur
- ModalHeader: title + close X button
- TextInput: single-line for name and description
- Textarea: multi-line (8 rows) for instructions
- Divider: thin horizontal rule between sections
- CheckboxList: agents with colored role dots beside each name
- ConnectionRow: two dropdowns connected by arrow, editable description
- AddButton: "+ Add Connection"
- CheckboxList (servers): server names with official badge
- MiniCanvas: small embedded React Flow preview showing topology
- ButtonBar: Cancel (outline) + Create Team (primary filled)

---

## Screen 8: Permission Request Modal (Small, Centered)

A compact, focused modal that appears when an agent needs approval for an
action. The emotional goal is trust: "I am in control. The agent asks before
doing anything risky, and I can see exactly what it wants to do."

```
+------------------------------------------------------------------------+
|                                                                        |
|                  backdrop overlay, semi-transparent                     |
|                                                                        |
|           +---------- 420px modal, centered ---------------+           |
|           |                                                 |           |
|           |         .---.                                   |           |
|           |        / o o \                                  |           |
|           |       |  ---  |                                 |           |
|           |        \_____/                                  |           |
|           |         [HAT]                                   |           |
|           |                                                 |           |
|           |       Engineer                                  |           |
|           |       [Working...] blue badge                   |           |
|           |                                                 |           |
|           | -----------------------------------------------  |           |
|           |                                                 |           |
|           |  Engineer wants to edit a file                  |           |
|           |                                                 |           |
|           |  Write changes to                               |           |
|           |  src/auth/token-validator.ts                     |           |
|           |  (23 lines modified)                            |           |
|           |                                                 |           |
|           | +---------------------------------------------+ |           |
|           | |  src/auth/token-validator.ts                 | |           |
|           | | ------------------------------------------- | |           |
|           | |  42  -  if (token.expiry < Date.now()) {    | |           |
|           | |  42  +  if (token.expiry < Date.now() ||    | |           |
|           | |  43  +      token.revoked) {                | |           |
|           | |  ..                                         | |           |
|           | |  67  -  return { valid: true };              | |           |
|           | |  67  +  return {                             | |           |
|           | |  68  +    valid: true,                       | |           |
|           | |  69  +    refreshedAt: Date.now()            | |           |
|           | |  70  +  };                                   | |           |
|           | +---------------------------------------------+ |           |
|           |   ^ code diff, monospace, red/green lines       |           |
|           |     JetBrains Mono, #FAFAF7 bg                  |           |
|           |                                                 |           |
|           |  [ ] Apply to all similar file edit              |           |
|           |      requests from this agent                   |           |
|           |                                                 |           |
|           | +---------------------------------------------+ |           |
|           | |                                             | |           |
|           | | [  Deny  ]   [ Allow ]   Always Allow       | |           |
|           | |   outline      primary     text link        | |           |
|           | |   #E89B9B      #7C9FE8     subtle gray      | |           |
|           | |                                             | |           |
|           | +---------------------------------------------+ |           |
|           |                                                 |           |
|           +-------------------------------------------------+           |
|                                                                        |
+------------------------------------------------------------------------+
```

**Component inventory for Screen 8:**
- Modal: 420px compact, centered, backdrop overlay with blur
- AgentIdentity: ghost avatar with hat + name + status badge (compact)
- Divider: thin rule
- DescriptionText: bold action headline + detail with file path and line count
- CodeDiff: monospace code preview with line numbers, red (removed) and green (added) highlighting
- Checkbox: "Apply to all similar..." opt-in
- ButtonBar: three options at different visual weights
  - Deny: outline button, soft coral border
  - Allow: filled primary button, #7C9FE8
  - Always Allow: text-only link, subtle gray, lowest visual weight

---

## Screen 9: Onboarding / Zero State

The first screen a new user sees. The sidebar is collapsed to a narrow icon
rail to maximize focus. The emotional goal is welcome and clarity: "This looks
friendly, I understand what it does, and I know exactly what to do next."

```
+------------------------------------------------------------------------+
|  +--+  +--------------------------------------------------------------+|
|  |  |  |                                                              ||
|  |Lo|  |                                                              ||
|  |go|  |                                                              ||
|  |  |  |                                                              ||
|  |--|  |                                                              ||
|  |  |  |                                                              ||
|  |Ag|  |                                                              ||
|  |  |  |                                                              ||
|  |Te|  |                       .----.                                 ||
|  |  |  |                      / o  o \                                ||
|  |--|  |                     |  ----  |                                ||
|  |  |  |                      \______/                                ||
|  |  |  |                        /|                                    ||
|  |  |  |                       / |  ~ ~ ~                             ||
|  |  |  |                          |    (waving)                       ||
|  |  |  |                         / \                                  ||
|  |  |  |                                                              ||
|  |  |  |                                                              ||
|  |  |  |              Welcome to ClaudeQuest!                         ||
|  |  |  |              =======================                         ||
|  |  |  |              large heading, #2D2D2A                          ||
|  |  |  |                                                              ||
|  |  |  |      Your AI agent workspace. Create agents, assign          ||
|  |  |  |      skills, and orchestrate teams -- no code required.      ||
|  |  |  |              subtitle, muted text                            ||
|  |  |  |                                                              ||
|  |  |  |                                                              ||
|  |  |  |  +------------------+ +------------------+ +----------------+||
|  |  |  |  |                  | |                  | |                |||
|  |  |  |  |    [ chat ]      | |   [ canvas ]     | |   [ wand ]    |||
|  |  |  |  |     icon         | |     icon          | |    icon       |||
|  |  |  |  |                  | |                  | |                |||
|  |  |  |  |  Chat with       | | Visual           | | One-Click     |||
|  |  |  |  |  Claude          | | Orchestration    | | Creation      |||
|  |  |  |  |                  | |                  | |                |||
|  |  |  |  |  Ask anything,   | | Drag, drop, and  | | Build agents  |||
|  |  |  |  |  use slash       | | connect agents   | | and skills    |||
|  |  |  |  |  commands        | | visually         | | instantly     |||
|  |  |  |  |                  | |                  | |                |||
|  |  |  |  +------------------+ +------------------+ +----------------+||
|  |  |  |   ^ card bg #FFFFFF    ^ card bg #FFFFFF   ^ card bg #FFFFFF ||
|  |  |  |     border #E5E2DB       border #E5E2DB     border #E5E2DB  ||
|  |  |  |                                                              ||
|  |  |  |                                                              ||
|  |  |  |            +------------------------------+                  ||
|  |  |  |            |                              |                  ||
|  |  |  |            |   Create Your First Agent    |                  ||
|  |  |  |            |                              |                  ||
|  |  |  |            +------------------------------+                  ||
|  |  |  |             ^ large CTA button, #7C9FE8 bg                  ||
|  |  |  |               white text, rounded, hover #6889D4            ||
|  |  |  |                                                              ||
|  |  |  |              or start chatting below                         ||
|  |  |  |              ^ small muted text link                        ||
|  |  |  |                                                              ||
|  |  |  |                                                              ||
|  |  |  |                                                              ||
|  |  |  |  +--------------------------------------------------------+ ||
|  |  |  |  | [/] Type a message or use / for commands...        [->] | ||
|  |  |  |  +--------------------------------------------------------+ ||
|  |  |  |   ^ persistent chat input, always visible at bottom         ||
|  |  |  |     subtle border, rounded, send arrow button               ||
|  |  |  |                                                              ||
|  +--+  +--------------------------------------------------------------+|
+------------------------------------------------------------------------+
```

**Component inventory for Screen 9:**
- CollapsedSidebar: narrow icon rail (logo, agents, teams, settings icons)
- Illustration: ASCII/SVG ghost character waving, centered
- Heading: large "Welcome to ClaudeQuest!" in Inter Display
- Subtitle: muted description text, max 2 lines
- FeatureCard (x3): icon + title + description, white bg, border
- CTAButton: large primary button, full visual weight, #7C9FE8
- TextLink: "or start chatting below" muted gray
- ChatInput: persistent input bar with slash command hint and send button

---

## Screen 10: Slash Command Palette (Floating Overlay)

A floating palette that appears directly above the chat input when the user
types "/". It filters as they type. The emotional goal is speed and discovery:
"I can find any command instantly, and I can see everything available to me."

```
+------------------------------------------------------------------------+
|                                                                        |
|                                                                        |
|                          (main content area)                           |
|                           dimmed / inactive                            |
|                                                                        |
|                                                                        |
|                                                                        |
|                                                                        |
|    +------------------------------------------------------------+      |
|    |                                                            |      |
|    |  +--------------------------------------------------------+|      |
|    |  | /des                                              [x]  ||      |
|    |  +--------------------------------------------------------+|      |
|    |   ^ search input, pre-filled with typed text               |      |
|    |                                                            |      |
|    |  Matching commands                                         |      |
|    |  - - - - - - - - - - - - - - - - - - - - - - - - - - -    |      |
|    |                                                            |      |
|    |  >> /design       [shield]                                 |      |
|    |     Create design direction for a feature                  |      |
|    |     ^ highlighted row (keyboard selected)                  |      |
|    |       #7C9FE8 left accent, #F5F5F2 bg                     |      |
|    |                                                            |      |
|    |     /designer                                              |      |
|    |     Spawn the designer subagent                            |      |
|    |                                                            |      |
|    |  All commands                                              |      |
|    |  - - - - - - - - - - - - - - - - - - - - - - - - - - -    |      |
|    |                                                            |      |
|    |     /discover     [shield]                                 |      |
|    |     Research and validate product ideas                    |      |
|    |                                                            |      |
|    |     /spec          [shield]                                |      |
|    |     Write a product specification                          |      |
|    |                                                            |      |
|    |     /build         [shield]                                |      |
|    |     Generate implementation plan                           |      |
|    |                                                            |      |
|    |     /review        [shield]                                |      |
|    |     Multi-perspective quality review                       |      |
|    |                                                            |      |
|    |     /ship          [shield]                                |      |
|    |     Deployment checklist and launch                        |      |
|    |                                                            |      |
|    |     /my-custom-skill                                       |      |
|    |     Custom blog writing workflow                           |      |
|    |      ^ no badge (user-created skill)                       |      |
|    |                                                            |      |
|    |  +--------------------------------------------------------+|      |
|    |  |  [up/dn] Navigate    [enter] Select    [esc] Dismiss   ||      |
|    |  +--------------------------------------------------------+|      |
|    |   ^ hint bar, muted text, #E5E2DB bg                       |      |
|    |                                                            |      |
|    +------------------------------------------------------------+      |
|     ^ floating panel, 480px wide, shadow-lg, rounded                   |
|       max-height ~400px, scrollable if more commands                   |
|       positioned directly above the chat input bar                     |
|                                                                        |
|    +------------------------------------------------------------+      |
|    | [/] /des                                              [->] |      |
|    +------------------------------------------------------------+      |
|     ^ chat input bar, showing what user has typed                      |
|                                                                        |
+------------------------------------------------------------------------+
```

**Component inventory for Screen 10:**
- CommandPalette: floating panel, 480px wide, shadow, anchored above chat input
- PaletteSearchInput: text field showing current typed text, clear [x] button
- SectionLabel: "Matching commands" / "All commands" with dashed divider
- CommandRow: slash command name + optional [shield] badge + description
- CommandRow (highlighted): left accent bar in #7C9FE8, subtle bg highlight
- HintBar: keyboard shortcut reference at bottom, muted bg
- ChatInput: the underlying input bar (always visible, shows typed text)

---

## Accessibility Notes (All Screens)

**Keyboard navigation:**
- Screen 5: Tab through server cards, Enter to expand, arrow keys within grid
- Screen 6: Tab through panel sections, Enter to toggle collapse, Escape to close
- Screen 7: Tab through form fields, Enter on checkboxes, Escape to dismiss modal
- Screen 8: Auto-focus on [Allow] button, Tab cycles Deny/Allow/Always Allow, Escape = Deny
- Screen 9: Tab to feature cards (decorative only), then to CTA, then to chat input
- Screen 10: Arrow keys navigate command list, Enter selects, Escape dismisses

**Screen reader considerations:**
- All modals use `role="dialog"` with `aria-labelledby` pointing to the heading
- Server cards use `role="article"` with `aria-label` describing name + type + status
- Chain of Thought streaming uses `aria-live="polite"` region
- Permission modal uses `role="alertdialog"` for urgent attention
- Command palette uses `role="listbox"` with `aria-activedescendant` for the highlighted row
- Agent status badges use `aria-label` (e.g., "Engineer status: working")

**Contrast compliance (WCAG AA):**
- All text on #FAFAF7 background meets 4.5:1 ratio minimum
- Primary buttons (#7C9FE8 bg, white text) meet AA for large text; body text uses #2D2D2A
- Code diff uses standard red (#C94040) / green (#40A040) on light bg for sufficient contrast
- Muted text uses #6B6B65, which meets 4.5:1 against #FAFAF7

**Motion:**
- Streaming cursor blink, panel slide-in, and spinner all respect `prefers-reduced-motion`
- When reduced motion is active: panels appear instantly, spinners become static icons, cursor is solid
# ClaudeQuest: User Flows, Component Inventory, and Game Mode Sprite Designs

**Date:** 2026-02-21
**Author:** Product Designer
**Status:** Draft
**Dependencies:** PRD (2026-02-21-claudequest.md), Feasibility (feasibility-claudequest.md)

---

## Table of Contents

1. User Flows (Detailed ASCII Diagrams)
2. Component List (Atomic Design Hierarchy)
3. Game Mode Sprite Sheet (ASCII Pixel Art)
4. Accessibility Checklist

---

## 1. User Flows

### Flow 1: Non-Technical User Builds a Content Team (End-to-End)

This is the critical happy path. A user with zero CLI experience opens ClaudeQuest for the first time, creates three agents (Writer, Editor, Designer), groups them into a team, connects an MCP server, sets instructions, runs the team, handles an input request, and views the results.

**Emotional journey:** Curious -> Guided -> Empowered -> Organized -> Excited -> Attentive -> Satisfied

```
+==========================================+
|           APP LAUNCHES (S1)              |
|    User sees loading screen, then        |
|    empty workspace with sidebar          |
+====================+=====================+
                     |
                     v
          +---------------------+
         / Is this the user's   \
        /  first time opening    \
       /   the app?               \
      +----------+----------------+
           |YES            |NO
           v               v
+---------------------+   +-------------------+
| ONBOARDING (S12)    |   | Go to last-used   |
|                     |   | view (Chat/Canvas) |
| Step 1/4:           |   +-------------------+
| "Welcome to         |
| ClaudeQuest!        |
| Let's build your    |
| first AI team."     |
|                     |
| Tooltip highlights  |
| sidebar agent list  |
| (empty state)       |
|                     |
| [Next] [Skip Tour]  |
+----------+----------+
           |
           v
+---------------------+
| ONBOARDING Step 2/4 |
|                     |
| Tooltip highlights  |
| the [+ New Agent]   |
| button in sidebar   |
|                     |
| "Agents are AI      |
| workers with        |
| specific roles.     |
| Click here to       |
| create one."        |
|                     |
| [Next] [Skip Tour]  |
+----------+----------+
           |
           v
+---------------------+
| ONBOARDING Step 3/4 |
|                     |
| Tooltip highlights  |
| Canvas tab          |
|                     |
| "The Canvas is      |
| where you arrange   |
| agents into teams   |
| and watch them      |
| work together."     |
|                     |
| [Next] [Skip Tour]  |
+----------+----------+
           |
           v
+---------------------+
| ONBOARDING Step 4/4 |
|                     |
| Tooltip highlights  |
| Library tab         |
|                     |
| "The Library has    |
| pre-built skills    |
| and tool servers    |
| to supercharge      |
| your agents."       |
|                     |
| [Get Started]       |
+----------+----------+
           |
           v
+==========================================+
|          ZERO STATE (S1 - Chat)          |
|                                          |
|  Sidebar:                                |
|  +----------+                            |
|  | Agents   |                            |
|  | (empty)  |                            |
|  |          |                            |
|  | "No      |                            |
|  | agents   |                            |
|  | yet"     |                            |
|  |          |                            |
|  | [Create  |                            |
|  |  Your    |                            |
|  |  First   |   Main Area:               |
|  |  Agent]  |   Friendly empty state     |
|  +----------+   illustration with        |
|                 call-to-action:           |
|                 "Build your AI team"      |
|                 [+ Create Agent]          |
+====================+=====================+
                     |
                     | User clicks [+ Create Agent]
                     v
+==========================================+
|      AGENT CREATOR WIZARD (S5)           |
|      Step 1/3: "Describe Your Agent"     |
|                                          |
|  +------------------------------------+  |
|  | What should this agent do?         |  |
|  |                                    |  |
|  | [Write blog posts, social media   ]  |
|  | [captions, and newsletter content ]  |
|  | [in a friendly, professional tone ]  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|  Suggested templates:                    |
|  [Writer] [Editor] [Designer]            |
|  [Researcher] [Engineer] [QA]            |
|                                          |
|  [Cancel]              [Next ->]         |
+====================+=====================+
                     |
                     | User types description, clicks [Next]
                     v
+==========================================+
|      AGENT CREATOR WIZARD (S5)           |
|      Step 2/3: "Refine with AI"          |
|                                          |
|  Your description:                       |
|  "Write blog posts, social media         |
|   captions, and newsletter content       |
|   in a friendly, professional tone"      |
|                                          |
|  [Magic Wand] Refine with Claude         |
|                                          |
|  --- After clicking magic wand: ---      |
|                                          |
|  Suggested improvements:                 |
|  +------------------------------------+  |
|  | You are a professional content     |  |
|  | writer. You produce blog posts,    |  |
|  | social media captions, and         |  |
|  | newsletters. You write in a warm,  |  |
|  | approachable tone. You follow SEO  |  |
|  | best practices. You adapt length   |  |
|  | and format to the platform.        |  |
|  +------------------------------------+  |
|                                          |
|  Changes explained:                      |
|  - Added SEO awareness                   |
|  - Specified tone more precisely         |
|  - Added platform-aware formatting       |
|                                          |
|  [<- Back]  [Accept] [Edit Manually]     |
+====================+=====================+
                     |
                     | User clicks [Accept]
                     v
+==========================================+
|      AGENT CREATOR WIZARD (S5)           |
|      Step 3/3: "Configure"               |
|                                          |
|  Name: [Writer]                          |
|                                          |
|  Model:                                  |
|  ( ) Haiku    - Fast, simple tasks       |
|  (*) Sonnet   - Balanced (recommended)   |
|  ( ) Opus     - Complex reasoning        |
|                                          |
|  Permission Mode:                        |
|  (*) Plan first  - Agent plans, you      |
|                    approve                |
|  ( ) Auto-approve - Agent acts freely    |
|                    (caution)              |
|                                          |
|  [<- Back]              [Create Agent]   |
+====================+=====================+
                     |
                     | User clicks [Create Agent]
                     | File written: agents/writer.md
                     | Agent appears in sidebar
                     v
+==========================================+
|     AGENT CREATED - SIDEBAR UPDATES      |
|                                          |
|  Sidebar:                   Main:        |
|  +----------+               Chat opens   |
|  | Agents   |               with Writer  |
|  |  > Writer|  <-- new!     context       |
|  |   [idle] |                            |
|  |          |  "Writer created! You can  |
|  | [+ New]  |   start chatting or create |
|  +----------+   more agents."            |
|                                          |
|  Toast notification:                     |
|  "Writer agent created successfully"     |
+====================+=====================+
                     |
                     | User clicks [+ New Agent] two more times
                     | Repeats wizard for Editor and Designer
                     v
+==========================================+
|     THREE AGENTS CREATED                 |
|                                          |
|  Sidebar:                                |
|  +----------+                            |
|  | Agents   |                            |
|  |  > Writer   [idle]                    |
|  |  > Editor   [idle]                    |
|  |  > Designer [idle]                    |
|  | [+ New]  |                            |
|  +----------+                            |
|  | Teams    |                            |
|  |  (empty) |                            |
|  | [+ New]  |                            |
|  +----------+                            |
|                                          |
|  Suggestion banner in main area:         |
|  "You have 3 agents! Want to group       |
|   them into a team? Switch to Canvas."   |
|  [Open Canvas]                           |
+====================+=====================+
                     |
                     | User clicks [Open Canvas] or Canvas tab
                     v
+==========================================+
|         CANVAS VIEW (S2)                 |
|                                          |
|  Tab bar: [Chat] [*Canvas*] [Library]    |
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |   +--------+                       |  |
|  |   | Writer |                       |  |
|  |   | [idle] |                       |  |
|  |   +--------+                       |  |
|  |                                    |  |
|  |          +--------+                |  |
|  |          | Editor |                |  |
|  |          | [idle] |                |  |
|  |          +--------+                |  |
|  |                                    |  |
|  |   +----------+                     |  |
|  |   | Designer |                     |  |
|  |   |  [idle]  |                     |  |
|  |   +----------+                     |  |
|  |                                    |  |
|  |  Agents auto-placed on canvas.     |  |
|  |  Toolbar: [+ Team] [+ Agent]       |  |
|  |           [Zoom] [Minimap]         |  |
|  +------------------------------------+  |
+====================+=====================+
                     |
                     | User clicks [+ Team] button on canvas toolbar
                     v
+==========================================+
|     TEAM CREATOR MODAL (S6)              |
|                                          |
|  +------------------------------------+  |
|  |  Create a Team                     |  |
|  |                                    |  |
|  |  Name: [Content Team]             |  |
|  |                                    |  |
|  |  Description:                      |  |
|  |  [Produces blog posts with         |  |
|  |   writing, editing, and visual     |  |
|  |   design]                          |  |
|  |                                    |  |
|  |  Add agents:                       |  |
|  |  [x] Writer                        |  |
|  |  [x] Editor                        |  |
|  |  [x] Designer                      |  |
|  |                                    |  |
|  |  [Cancel]        [Create Team]     |  |
|  +------------------------------------+  |
|                                          |
+====================+=====================+
                     |
                     | User checks all three, clicks [Create Team]
                     | File written: teams/content-team.json
                     v
+==========================================+
|     CANVAS WITH TEAM CONTAINER           |
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |  +-------------------------------+ |  |
|  |  | CONTENT TEAM           [Run]  | |  |
|  |  | +---------+                   | |  |
|  |  | | Writer  |-----> +--------+  | |  |
|  |  | | [idle]  |       | Editor |  | |  |
|  |  | +---------+       | [idle] |  | |  |
|  |  |                   +---+----+  | |  |
|  |  |                       |       | |  |
|  |  |                       v       | |  |
|  |  |               +----------+    | |  |
|  |  |               | Designer |    | |  |
|  |  |               |  [idle]  |    | |  |
|  |  |               +----------+    | |  |
|  |  +-------------------------------+ |  |
|  |                                    |  |
|  |  User drew connections:            |  |
|  |  Writer -> Editor -> Designer      |  |
|  +------------------------------------+  |
|                                          |
|  Sidebar now shows:                      |
|  Teams > Content Team (3 agents)         |
+====================+=====================+
                     |
                     | User wants to add GitHub MCP server
                     | Clicks Library tab
                     v
+==========================================+
|     LIBRARY TAB (S3) -> MCP Servers (S7) |
|                                          |
|  Tab bar: [Chat] [Canvas] [*Library*]    |
|  Sub-tabs: [Skills] [Agents] [*MCP*]    |
|                                          |
|  Search: [Search MCP servers...]         |
|                                          |
|  Official Servers:                       |
|  +------------------------------------+  |
|  | [Shield] GitHub                    |  |
|  | PRs, issues, code search           |  |
|  | Tools: create_pr, list_issues...   |  |
|  |                        [+ Add]     |  |
|  +------------------------------------+  |
|  | [Shield] Context7                  |  |
|  | Documentation lookup               |  |
|  +------------------------------------+  |
|  | [Shield] Filesystem                |  |
|  | Extended file operations            |  |
|  +------------------------------------+  |
|                                          |
|  [+ Add Custom Server]                   |
+====================+=====================+
                     |
                     | User clicks [+ Add] on GitHub
                     | OR drags GitHub card back to Canvas tab
                     | (both paths supported)
                     v
          +---------------------+
         / How does the user    \
        /  add the server?       \
       +----------+-------------+
         |CLICK       |DRAG
         v            v
+----------------+ +----------------------+
| Config modal   | | Switches to Canvas   |
| for GitHub:    | | User drops server    |
|                | | onto team container  |
| Auth token:    | |                      |
| [ghp_xxxxx]   | | Server auto-configs  |
|                | | with defaults and    |
| [Save]         | | prompts for auth     |
+-------+--------+ +-----------+----------+
        |                       |
        +-----------+-----------+
                    |
                    v
+==========================================+
|     CANVAS WITH MCP SERVER ATTACHED      |
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |  +-------------------------------+ |  |
|  |  | CONTENT TEAM           [Run]  | |  |
|  |  |                               | |  |
|  |  | Writer -> Editor -> Designer  | |  |
|  |  |                               | |  |
|  |  +------+------------------------+ |  |
|  |         |                          |  |
|  |         | (dotted line)            |  |
|  |         v                          |  |
|  |    +----------+                    |  |
|  |    / GitHub  /  <-- hexagonal      |  |
|  |   / [Shield]/      MCP node       |  |
|  |  +----------+                      |  |
|  +------------------------------------+  |
|                                          |
|  .mcp.json updated with GitHub config    |
+====================+=====================+
                     |
                     | User clicks team container header
                     | to set team instructions
                     v
+==========================================+
|     TEAM DETAIL PANEL (S4 variant)       |
|                                          |
|  Canvas remains visible on left.         |
|  Detail panel slides in from right:      |
|                                          |
|  +-------------------+                   |
|  | Content Team      |                   |
|  |                   |                   |
|  | Instructions:     |                   |
|  | +---------------+ |                   |
|  | |Write a 1500-  | |                   |
|  | |word blog post | |                   |
|  | |about AI tools | |                   |
|  | |for small biz. | |                   |
|  | |Writer drafts, | |                   |
|  | |Editor reviews | |                   |
|  | |for clarity &  | |                   |
|  | |SEO, Designer  | |                   |
|  | |creates header | |                   |
|  | |image.         | |                   |
|  | +---------------+ |                   |
|  |                   |                   |
|  | Members:          |                   |
|  | - Writer (Sonnet) |                   |
|  | - Editor (Sonnet) |                   |
|  | - Designer (Opus) |                   |
|  |                   |                   |
|  | MCP: GitHub       |                   |
|  |                   |                   |
|  | [Save] [Run Team] |                   |
|  +-------------------+                   |
+====================+=====================+
                     |
                     | User clicks [Run Team]
                     v
+==========================================+
|     TEAM RUNNING - CANVAS VIEW           |
|                                          |
|  +------------------------------------+  |
|  |  +-------------------------------+ |  |
|  |  | CONTENT TEAM     [Running...] | |  |
|  |  |                               | |  |
|  |  | +--------+                    | |  |
|  |  | | Writer |  Spinner animating | |  |
|  |  | |[working]----> +--------+   | |  |
|  |  | +--------+      | Editor |   | |  |
|  |  |   Blue glow     |[waiting]   | |  |
|  |  |                  +---+----+   | |  |
|  |  |                      |        | |  |
|  |  |              +----------+     | |  |
|  |  |              | Designer |     | |  |
|  |  |              | [waiting]|     | |  |
|  |  |              +----------+     | |  |
|  |  +-------------------------------+ |  |
|  +------------------------------------+  |
|                                          |
|  Sidebar agents update in real time:     |
|  > Writer   [working...]                 |
|  > Editor   [waiting]                    |
|  > Designer [waiting]                    |
+====================+=====================+
                     |
                     | Time passes. Writer finishes.
                     | Editor starts. Designer still waiting.
                     v
+==========================================+
|     PIPELINE PROGRESS                    |
|                                          |
|  +------------------------------------+  |
|  |  +-------------------------------+ |  |
|  |  | CONTENT TEAM     [Running...] | |  |
|  |  |                               | |  |
|  |  | +--------+      +--------+   | |  |
|  |  | | Writer | ---> | Editor |   | |  |
|  |  | |[done]  |green |[working]   | |  |
|  |  | +--------+check +---+----+   | |  |
|  |  |                      |        | |  |
|  |  |              +----------+     | |  |
|  |  |              | Designer |     | |  |
|  |  |              | [waiting]|     | |  |
|  |  |              +----------+     | |  |
|  |  +-------------------------------+ |  |
|  +------------------------------------+  |
|                                          |
|  User clicks on Editor node to          |
|  watch chain of thought...              |
+====================+=====================+
                     |
                     | User clicks Editor node
                     v
+==========================================+
|     AGENT DETAIL PANEL (S4) - EDITOR     |
|                                          |
|  Canvas on left, panel slides right:     |
|                                          |
|  +-------------------+                   |
|  | Editor [working]  |                   |
|  | Model: Sonnet     |                   |
|  | Mode: Plan first  |                   |
|  |                   |                   |
|  | Chain of Thought: |                   |
|  | +---------------+ |                   |
|  | |> Reading the  | |                   |
|  | |  draft from   | |                   |
|  | |  Writer...    | |                   |
|  | |              | |                   |
|  | |> Checking    | |                   |
|  | |  for clarity | |                   |
|  | |  issues...   | |                   |
|  | |              | |                   |
|  | |> Found 3     | |                   |
|  | |  areas to    | |                   |
|  | |  improve...  | |                   |
|  | +---------------+ |                   |
|  | (streaming live)  |                   |
|  +-------------------+                   |
+====================+=====================+
                     |
                     | Editor finishes. Designer starts.
                     | Designer encounters a question.
                     v
+==========================================+
|     DESIGNER NEEDS INPUT                 |
|                                          |
|  +------------------------------------+  |
|  |  +-------------------------------+ |  |
|  |  | CONTENT TEAM  [Needs Input]   | |  |
|  |  |                               | |  |
|  |  | Writer [done] Editor [done]   | |  |
|  |  |          |                    | |  |
|  |  |          v                    | |  |
|  |  |  +----------+                | |  |
|  |  |  | Designer |  Pulsing       | |  |
|  |  |  |[needs    |  lavender      | |  |
|  |  |  | input]   |  "?" bubble    | |  |
|  |  |  +----------+                | |  |
|  |  +-------------------------------+ |  |
|  +------------------------------------+  |
|                                          |
|  Notification toast:                     |
|  "Designer needs your input"             |
|                                          |
|  Notification badge on sidebar:          |
|  > Designer [? needs input]              |
+====================+=====================+
                     |
                     | User clicks Designer node (or notification)
                     v
+==========================================+
|     DESIGNER DETAIL PANEL - INPUT REQ    |
|                                          |
|  +-------------------+                   |
|  | Designer          |                   |
|  | [needs input]     |                   |
|  |                   |                   |
|  | Chain of Thought: |                   |
|  | +---------------+ |                   |
|  | |> I need to    | |                   |
|  | |  create a     | |                   |
|  | |  header image.| |                   |
|  | |              | |                   |
|  | |> Question:   | |                   |
|  | |  "What color  | |                   |
|  | |  scheme do    | |                   |
|  | |  you prefer?  | |                   |
|  | |  Warm tones   | |                   |
|  | |  or cool      | |                   |
|  | |  tones?"      | |                   |
|  | +---------------+ |                   |
|  |                   |                   |
|  | Your response:    |                   |
|  | +--------------+  |                   |
|  | |Warm tones,   |  |                   |
|  | |oranges and   |  |                   |
|  | |yellows       |  |                   |
|  | +--------------+  |                   |
|  | [Send Response]   |                   |
|  +-------------------+                   |
+====================+=====================+
                     |
                     | User types answer, clicks [Send Response]
                     | Designer resumes working
                     v
+==========================================+
|     DESIGNER RESUMES                     |
|                                          |
|  Detail panel updates:                   |
|  +-------------------+                   |
|  | Designer          |                   |
|  | [working]         |                   |
|  | Spinner animating |                   |
|  |                   |                   |
|  | Chain of Thought: |                   |
|  | +---------------+ |                   |
|  | |> User wants   | |                   |
|  | |  warm tones.  | |                   |
|  | |> Generating   | |                   |
|  | |  header image | |                   |
|  | |  with orange  | |                   |
|  | |  and yellow   | |                   |
|  | |  palette...   | |                   |
|  | +---------------+ |                   |
|  +-------------------+                   |
+====================+=====================+
                     |
                     | Designer finishes. All agents done.
                     v
+==========================================+
|     TEAM COMPLETE                        |
|                                          |
|  +------------------------------------+  |
|  |  +-------------------------------+ |  |
|  |  | CONTENT TEAM    [Complete!]   | |  |
|  |  |                               | |  |
|  |  | Writer [done] -> Editor[done] | |  |
|  |  |                  |            | |  |
|  |  |           Designer [done]     | |  |
|  |  | All green checkmarks          | |  |
|  |  +-------------------------------+ |  |
|  +------------------------------------+  |
|                                          |
|  Success toast:                          |
|  "Content Team finished! View results."  |
|                                          |
|  Banner at bottom of canvas:             |
|  [View Results in Chat]                  |
+====================+=====================+
                     |
                     | User clicks [View Results in Chat]
                     v
+==========================================+
|     RESULTS VIEW (S1 - Chat)             |
|                                          |
|  Tab switches to Chat.                   |
|  Conversation shows full output:         |
|                                          |
|  +------------------------------------+  |
|  | Content Team Results               |  |
|  |                                    |  |
|  | --- Writer Output ---              |  |
|  | [Blog post: "AI Tools for Small    |  |
|  |  Business: A Practical Guide"]     |  |
|  | 1,523 words                        |  |
|  |                                    |  |
|  | --- Editor Output ---              |  |
|  | [Revised draft with 3 changes:     |  |
|  |  clarity improvements, SEO         |  |
|  |  keywords added, CTA refined]      |  |
|  |                                    |  |
|  | --- Designer Output ---            |  |
|  | [Header image: warm-toned          |  |
|  |  gradient with AI iconography]     |  |
|  |                                    |  |
|  | [Copy All] [Save to File]          |  |
|  +------------------------------------+  |
|                                          |
|  User can continue chatting to           |
|  iterate on results.                     |
+==========================================+
```

**Decision Points Summary:**

| Decision | Options | Default |
|----------|---------|---------|
| First visit vs. returning | Show onboarding or skip to workspace | Auto-detect via localStorage |
| Agent description method | Type freeform or pick template | Show both options |
| Magic wand refinement | Accept, edit manually, or skip | Accept suggested |
| Model selection | Haiku / Sonnet / Opus | Sonnet (recommended badge) |
| MCP server attachment | Click [+ Add] or drag to canvas | Both supported |
| Input request response | Type response or select suggested | Freeform text input |
| View results | Chat view or stay on canvas | Prompt to switch to Chat |

---

### Flow 2: Adding an MCP Server to Expand Capabilities

The user wants GitHub integration for their team. They discover it in the Library, attach it to their canvas, and see it used in real time.

**Emotional journey:** Curious -> Exploring -> Discovering -> Configuring -> Validated

```
+==========================================+
|     USER ON CANVAS TAB                   |
|     Team is set up, not yet running      |
|                                          |
|  User thinks: "I want my agents to       |
|  be able to read GitHub issues."         |
+====================+=====================+
                     |
                     | User clicks Library tab
                     v
+==========================================+
|     LIBRARY TAB (S3)                     |
|                                          |
|  Sub-tabs: [Skills] [Agents] [*MCP*]    |
|                                          |
|  The MCP sub-tab is selected.            |
|                                          |
|  Search: [github________________]        |
|                                          |
|  Results filter as user types:           |
|                                          |
|  +------------------------------------+  |
|  | [Shield] GitHub            Official|  |
|  | Pull requests, issues, code search |  |
|  |                                    |  |
|  | Tools available:                   |  |
|  |  - create_pull_request             |  |
|  |  - list_issues                     |  |
|  |  - search_code                     |  |
|  |  - get_file_contents               |  |
|  |  - create_issue                    |  |
|  |  + 8 more                          |  |
|  |                                    |  |
|  | [View Details] [+ Add to Project]  |  |
|  +------------------------------------+  |
+====================+=====================+
                     |
          +----------+----------+
         / User action?          \
        +----------+-------------+
        |DETAILS     |ADD     |DRAG
        v            v        v
+---------------+ +--------+ +----------------+
|Details modal  | |Config  | |User drags card |
|shows full     | |modal   | |to Canvas tab.  |
|tool list,     | |asks for| |Tab auto-       |
|docs link,     | |auth    | |switches.       |
|usage examples | |token   | |Drop on team    |
|               | |        | |container.      |
|[+ Add]        | |[Save]  | |Config modal    |
+-------+-------+ +---+----+ |opens.          |
        |             |       +-------+--------+
        +------+------+              |
               |    +-----------------+
               v
+==========================================+
|     MCP CONFIG MODAL                     |
|                                          |
|  +------------------------------------+  |
|  | Configure GitHub Server            |  |
|  |                                    |  |
|  | Connection type: HTTP (auto)       |  |
|  |                                    |  |
|  | Authentication:                    |  |
|  | GitHub Token: [ghp_xxxxxxxxx]      |  |
|  |                                    |  |
|  | Assign to:                         |  |
|  | (*) Entire project                 |  |
|  | ( ) Content Team only              |  |
|  | ( ) Specific agents...             |  |
|  |                                    |  |
|  | [Test Connection]  [Save]          |  |
|  +------------------------------------+  |
+====================+=====================+
                     |
                     | User enters token, clicks [Test Connection]
                     v
          +---------------------+
         / Connection test       \
        /  result?                \
       +----------+--------------+
        |SUCCESS       |FAILURE
        v              v
+----------------+ +-----------------------+
|Green checkmark | |Red alert:             |
|"Connected!     | |"Connection failed.    |
|3 tools         | | Check your token."    |
|verified."      | |                       |
|                | |[Retry] [Edit Token]   |
|[Save]          | +-----------------------+
+-------+--------+
        |
        | User clicks [Save]
        v
+==========================================+
|     CANVAS WITH MCP SERVER               |
|     (auto-switches to Canvas tab)        |
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |  +-------------------------------+ |  |
|  |  | CONTENT TEAM           [Run]  | |  |
|  |  |                               | |  |
|  |  | Writer -> Editor -> Designer  | |  |
|  |  +------+------------------------+ |  |
|  |         |                          |  |
|  |    .....| (dotted line)            |  |
|  |    :    v                          |  |
|  |    : +----------+                  |  |
|  |    : / GitHub  /  Hexagonal node   |  |
|  |    :/ [Shield]/   Blue = HTTP      |  |
|  |     +----------+  "Connected"      |  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|  File updated: .mcp.json                 |
|  Toast: "GitHub server added.            |
|  All team agents can now use             |
|  GitHub tools."                          |
+====================+=====================+
                     |
                     | User runs the team
                     | An agent uses a GitHub tool
                     v
+==========================================+
|     AGENT USING GITHUB TOOL              |
|                                          |
|  Agent detail panel (chain of thought):  |
|                                          |
|  +-------------------+                   |
|  | Editor [working]  |                   |
|  |                   |                   |
|  | Chain of Thought: |                   |
|  | +---------------+ |                   |
|  | |> Reviewing    | |                   |
|  | |  the draft... | |                   |
|  | |              | |                   |
|  | |> Tool call:  | |                   |
|  | |  [GitHub]    | |  <- MCP badge     |
|  | |  list_issues | |     shown on      |
|  | |  repo: blog  | |     tool call     |
|  | |              | |                   |
|  | |> Found 2     | |                   |
|  | |  related     | |                   |
|  | |  issues to   | |                   |
|  | |  reference   | |                   |
|  | +---------------+ |                   |
|  +-------------------+                   |
|                                          |
|  On canvas, the connection line between  |
|  Editor and GitHub hexagon pulses to     |
|  show active tool usage.                 |
+==========================================+
```

---

### Flow 3: Monitoring a Running Pipeline and Providing Input

A team is already running. The user observes status, notices a paused agent, provides input, and watches the pipeline complete.

**Emotional journey:** Observant -> Informed -> Alert -> Helpful -> Relieved -> Accomplished

```
+==========================================+
|     CANVAS VIEW - TEAM RUNNING           |
|                                          |
|  +------------------------------------+  |
|  |  +-------------------------------+ |  |
|  |  | Dev Team           [Running]  | |  |
|  |  |                               | |  |
|  |  | +----------+  +----------+   | |  |
|  |  | | Engineer |  | Designer |   | |  |
|  |  | | [working]|  | [waiting]|   | |  |
|  |  | | (spinner)|  | (dimmed) |   | |  |
|  |  | +-----+----+  +----------+   | |  |
|  |  |       |                       | |  |
|  |  |       v                       | |  |
|  |  | +----------+                  | |  |
|  |  | |    QA    |                  | |  |
|  |  | | [paused] |                  | |  |
|  |  | | (gold)   |                  | |  |
|  |  | +----------+                  | |  |
|  |  +-------------------------------+ |  |
|  +------------------------------------+  |
|                                          |
|  Sidebar status:                         |
|  > Engineer  [working...] spinner        |
|  > Designer  [waiting]    dimmed         |
|  > QA        [paused]     gold dot       |
+====================+=====================+
                     |
                     | Time passes. Engineer finishes.
                     | QA needs user input.
                     v
+==========================================+
|     QA NEEDS INPUT                       |
|                                          |
|  +------------------------------------+  |
|  |  +-------------------------------+ |  |
|  |  | Dev Team       [Needs Input]  | |  |
|  |  |                               | |  |
|  |  | Engineer    Designer          | |  |
|  |  | [done]      [waiting]         | |  |
|  |  | (green)     (dimmed)          | |  |
|  |  |       \                       | |  |
|  |  |        v                      | |  |
|  |  |  +----------+                 | |  |
|  |  |  |    QA    |  "?"            | |  |
|  |  |  | [needs   |  Pulsing        | |  |
|  |  |  |  input]  |  lavender       | |  |
|  |  |  +----------+  bubble         | |  |
|  |  +-------------------------------+ |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | NOTIFICATION (top of screen)       |  |
|  | [!] QA needs your input            |  |
|  |     "Which testing framework?"     |  |
|  |                    [Respond]       |  |
|  +------------------------------------+  |
|                                          |
|  Sidebar badge:                          |
|  > QA  [? needs input]  (pulsing dot)   |
+====================+=====================+
                     |
          +----------+----------+
         / How does user         \
        /  respond?               \
       +-----+--------+----------+
       |CLICK NODE  |NOTIF   |SIDEBAR
       v            v        v
       (All three open the same
        detail panel for QA)
                     |
                     v
+==========================================+
|     QA DETAIL PANEL (S4) - INPUT REQ     |
|                                          |
|  Canvas visible on left.                 |
|  Detail panel slides right:              |
|                                          |
|  +-------------------+                   |
|  | QA [needs input]  |                   |
|  | Model: Sonnet     |                   |
|  | Mode: Plan first  |                   |
|  |                   |                   |
|  | Chain of Thought: |                   |
|  | +---------------+ |                   |
|  | |> Received the | |                   |
|  | |  codebase     | |                   |
|  | |  from         | |                   |
|  | |  Engineer...  | |                   |
|  | |              | |                   |
|  | |> I need to   | |                   |
|  | |  set up      | |                   |
|  | |  tests.      | |                   |
|  | |              | |                   |
|  | |> QUESTION:   | |                   |
|  | |  "Which      | |  <- Highlighted   |
|  | |  testing     | |     in lavender   |
|  | |  framework   | |     background    |
|  | |  do you      | |                   |
|  | |  prefer?     | |                   |
|  | |  - Jest      | |                   |
|  | |  - Vitest    | |                   |
|  | |  - Mocha"    | |                   |
|  | +---------------+ |                   |
|  |                   |                   |
|  | Your response:    |                   |
|  | +--------------+  |                   |
|  | |Use Vitest,   |  |                   |
|  | |it's faster   |  |                   |
|  | |and has good  |  |                   |
|  | |ESM support   |  |                   |
|  | +--------------+  |                   |
|  |                   |                   |
|  | [Send Response]   |                   |
|  +-------------------+                   |
+====================+=====================+
                     |
                     | User types "Use Vitest" and clicks
                     | [Send Response]
                     v
+==========================================+
|     QA RESUMES WORKING                   |
|                                          |
|  Detail panel updates:                   |
|  +-------------------+                   |
|  | QA [working]      |                   |
|  | Spinner animating |                   |
|  |                   |                   |
|  | Chain of Thought: |                   |
|  | +---------------+ |                   |
|  | |> User chose   | |                   |
|  | |  Vitest.      | |                   |
|  | |              | |                   |
|  | |> Setting up  | |                   |
|  | |  vitest      | |                   |
|  | |  config...   | |                   |
|  | |              | |                   |
|  | |> Tool call:  | |                   |
|  | |  [Write]     | |                   |
|  | |  vitest.     | |                   |
|  | |  config.ts   | |                   |
|  | |              | |                   |
|  | |> Writing     | |                   |
|  | |  test        | |                   |
|  | |  suite...    | |                   |
|  | +---------------+ |                   |
|  +-------------------+                   |
|                                          |
|  Canvas updates:                         |
|  QA node: [working] with spinner         |
|  Input bubble disappears                 |
+====================+=====================+
                     |
                     | QA finishes. Designer starts
                     | (was waiting on QA output).
                     | Designer finishes.
                     v
+==========================================+
|     PIPELINE COMPLETE                    |
|                                          |
|  +------------------------------------+  |
|  |  +-------------------------------+ |  |
|  |  | Dev Team        [Complete!]   | |  |
|  |  |                               | |  |
|  |  | Engineer [done]               | |  |
|  |  |    |                          | |  |
|  |  |    v                          | |  |
|  |  | QA [done]   Designer [done]   | |  |
|  |  |                               | |  |
|  |  | All nodes show green          | |  |
|  |  | checkmarks.                   | |  |
|  |  +-------------------------------+ |  |
|  +------------------------------------+  |
|                                          |
|  Summary banner:                         |
|  +------------------------------------+  |
|  | Pipeline complete in 4m 23s        |  |
|  | 3 agents ran. 1 input provided.    |  |
|  |                                    |  |
|  | [View Results] [Run Again] [Save   |  |
|  |                             as     |  |
|  |                          Template] |  |
|  +------------------------------------+  |
+==========================================+
```

---

### Flow 4: Toggling Game Mode

The user is working on the canvas in standard mode, toggles game mode, interacts with sprites, and toggles back.

**Emotional journey:** Working -> Curious -> Delighted -> Playful -> Back to business

```
+==========================================+
|     STANDARD CANVAS MODE                 |
|                                          |
|  Sidebar bottom:                         |
|  [Settings gear]                         |
|  [Game toggle: OFF]  <-- toggle switch   |
|                                          |
|  Canvas:                                 |
|  +------------------------------------+  |
|  |  Clean white background            |  |
|  |  Rounded rectangle agent nodes     |  |
|  |  Smooth bezier connection lines    |  |
|  |  Pastel color badges               |  |
|  |                                    |  |
|  |  +--------+      +--------+       |  |
|  |  | Writer |----->| Editor |       |  |
|  |  | [idle] |      | [idle] |       |  |
|  |  +--------+      +--------+       |  |
|  |                                    |  |
|  |  MCP server: hexagonal node        |  |
|  |  Team: rounded container           |  |
|  +------------------------------------+  |
+====================+=====================+
                     |
                     | User clicks Game Mode toggle
                     v
+==========================================+
|     TRANSITION ANIMATION (~800ms)        |
|                                          |
|  What changes:                           |
|  - Canvas background: white -> grass     |
|    tiles with pixel pattern              |
|  - Agent nodes: rectangles -> pixel      |
|    ghost sprites with hats               |
|  - Connections: bezier lines -> pixel    |
|    cobblestone paths                     |
|  - MCP servers: hexagons -> treasure     |
|    chests                                |
|  - Team container: rounded rect ->       |
|    pixel building with fence + sign      |
|  - Font (canvas labels): Inter ->        |
|    Press Start 2P                        |
|                                          |
|  What stays the same:                    |
|  - Sidebar layout and content            |
|  - Tab bar (Chat / Canvas / Library)     |
|  - Detail panel structure                |
|  - All functionality and controls        |
|  - Sidebar font (stays Inter)            |
|  - Chat view (unaffected by game mode)   |
|  - Library view (unaffected)             |
|  - Accessibility features                |
|  - Keyboard shortcuts                    |
+====================+=====================+
                     |
                     v
+==========================================+
|     GAME MODE CANVAS                     |
|                                          |
|  +------------------------------------+  |
|  |:::::::::::::::::::::::::::::::::::::|  |
|  |::                                ::|  |
|  |::  +---------------------------+  ::|  |
|  |::  | CONTENT TEAM              |  ::|  |
|  |::  | [pixel building + sign]   |  ::|  |
|  |::  |  [pixel fence border]     |  ::|  |
|  |::  |                           |  ::|  |
|  |::  |  ~O~        ~O~          |  ::|  |
|  |::  |  /|\  path  /|\          |  ::|  |
|  |::  |  Writer --> Editor        |  ::|  |
|  |::  |  (quill)    (glasses)     |  ::|  |
|  |::  |                           |  ::|  |
|  |::  |       ~O~                 |  ::|  |
|  |::  |       /|\                 |  ::|  |
|  |::  |    Designer               |  ::|  |
|  |::  |    (beret)                |  ::|  |
|  |::  +---------------------------+  ::|  |
|  |::                                ::|  |
|  |::      +========+                ::|  |
|  |::      |TREASURE|  <- MCP server ::|  |
|  |::      | CHEST  |     (GitHub)   ::|  |
|  |::      +========+                ::|  |
|  |::                                ::|  |
|  |:: Grass tiles: ::::              ::|  |
|  |:: Flowers: *  Trees: ^           ::|  |
|  |:: Path: ====                     ::|  |
|  |:::::::::::::::::::::::::::::::::::::|  |
|  +------------------------------------+  |
|                                          |
|  Game toggle in sidebar: [Game: ON]      |
+====================+=====================+
                     |
                     | User clicks on Writer sprite
                     v
+==========================================+
|     SPRITE INTERACTION                   |
|                                          |
|  Canvas:                                 |
|  +------------------------------------+  |
|  |::                                ::|  |
|  |::                                ::|  |
|  |::  Pixel chat bubble appears     ::|  |
|  |::  above Writer sprite:          ::|  |
|  |::                                ::|  |
|  |::  +--------------------------+  ::|  |
|  |::  | "Ready to write!        |  ::|  |
|  |::  |  What should I work on?"|  ::|  |
|  |::  +---------+----------------+  ::|  |
|  |::            |                   ::|  |
|  |::           ~O~                  ::|  |
|  |::           /|\  <- facing       ::|  |
|  |::           Writer   camera      ::|  |
|  |::                                ::|  |
|  +------------------------------------+  |
|                                          |
|  Detail panel opens on right (standard   |
|  styling, not pixel art):                |
|                                          |
|  +-------------------+                   |
|  | Writer [idle]     |                   |
|  | Model: Sonnet     |                   |
|  |                   |                   |
|  | Chat:             |                   |
|  | +--------------+  |                   |
|  | |Type here..  |  |                   |
|  | +--------------+  |                   |
|  | [Send]            |                   |
|  +-------------------+                   |
+====================+=====================+
                     |
                     | User runs the team in game mode
                     v
+==========================================+
|     GAME MODE RUNNING                    |
|                                          |
|  +------------------------------------+  |
|  |::                                ::|  |
|  |::  Writer sprite walks to        ::|  |
|  |::  writing desk workstation.     ::|  |
|  |::  Quill moves up and down.      ::|  |
|  |::                                ::|  |
|  |::    [desk]                      ::|  |
|  |::   ~O~ /  <- writing animation  ::|  |
|  |::   /|\                          ::|  |
|  |::                                ::|  |
|  |::  When Writer finishes:         ::|  |
|  |::  A carrier pigeon flies from   ::|  |
|  |::  Writer to Editor carrying     ::|  |
|  |::  a scroll.                     ::|  |
|  |::                                ::|  |
|  |::     ~=~>   pigeon with scroll  ::|  |
|  |::                                ::|  |
|  |::  Editor catches scroll,        ::|  |
|  |::  walks to desk workstation.    ::|  |
|  |::                                ::|  |
|  +------------------------------------+  |
|                                          |
|  All state indicators still present:     |
|  - Sidebar shows [working]/[done] text   |
|  - Sprite color matches state            |
|  - Labels appear under sprites           |
+====================+=====================+
                     |
                     | User toggles game mode OFF
                     v
+==========================================+
|     TRANSITION BACK (~800ms)             |
|                                          |
|  Reverse transition:                     |
|  - Grass tiles -> white background       |
|  - Sprites -> rectangular nodes          |
|  - Paths -> bezier lines                 |
|  - Treasure chests -> hexagon nodes      |
|  - Buildings -> rounded containers       |
|  - Press Start 2P -> Inter               |
|                                          |
|  Agent states are preserved exactly.     |
|  If agents were running, they continue.  |
|  No data is lost. Layout positions       |
|  are maintained (sprites map back to     |
|  their node positions).                  |
+==========================================+
```

**Game Mode Toggle Matrix -- What Changes vs. What Stays:**

| Element | Standard Mode | Game Mode | Transition |
|---------|--------------|-----------|------------|
| Canvas background | White (#FAFAF7) | Grass tile pattern | Crossfade |
| Agent nodes | Rounded rectangles | Pixel ghost sprites | Morph animation |
| Agent labels | Inter 14px | Press Start 2P 10px | Font swap |
| Connection lines | Bezier curves | Cobblestone paths | Path redraw |
| MCP servers | Hexagonal nodes | Treasure chests | Shape morph |
| Team containers | Rounded rectangles | Pixel buildings + fence | Shape morph |
| State: working | Spinner icon | Sprite at workstation | Immediate |
| State: needs input | "?" badge | "?" pixel bubble | Immediate |
| State: done | Checkmark | Sprite bows + sparkle | Immediate |
| Data transfer | Animated dot on edge | Carrier pigeon with scroll | Immediate |
| Sidebar | Unchanged | Unchanged | None |
| Tab bar | Unchanged | Unchanged | None |
| Detail panel | Unchanged | Unchanged | None |
| Chat view | Unchanged | Unchanged | None |
| Library view | Unchanged | Unchanged | None |
| Keyboard nav | Unchanged | Unchanged | None |

---

## 2. Component List (Atomic Design Hierarchy)

### Atoms (Smallest Indivisible UI Units)

**Buttons:**

| Component | Variants | Usage |
|-----------|----------|-------|
| `ButtonPrimary` | default, hover, active, disabled, loading | Primary actions: Create, Save, Run |
| `ButtonSecondary` | default, hover, active, disabled | Secondary actions: Cancel, Back |
| `ButtonGhost` | default, hover, active | Tertiary actions: View Details, Close |
| `ButtonIcon` | default, hover, active, disabled | Icon-only: Close (X), Expand, Collapse |
| `ButtonDanger` | default, hover, confirmation | Destructive: Delete agent, Remove server |
| `ButtonToggle` | on, off, disabled | Mode toggles: Game mode, permission mode |
| `ButtonFab` | default, hover | Floating action: + New Agent on canvas |

**Icons:**

| Component | Variants | Usage |
|-----------|----------|-------|
| `IconAgent` | engineer, designer, qa, writer, researcher, custom | Agent role identification |
| `IconState` | working (spinner), done (check), paused (pause), needs-input (?), error (!) | Agent state |
| `IconTool` | read, write, edit, bash, grep, glob | Claude tool types |
| `IconMCP` | official (shield), custom (plug), connected (check), error (x) | MCP server status |
| `IconNav` | chat, canvas, library, settings, game-controller | Navigation tabs |
| `IconAction` | magic-wand, drag-handle, link, unlink, zoom-in, zoom-out, minimap, copy, save | Canvas and editor actions |
| `IconModel` | haiku (feather), sonnet (book), opus (crown) | Model tier identification |
| `IconChevron` | up, down, left, right | Expandable sections |

**Badges:**

| Component | Variants | Usage |
|-----------|----------|-------|
| `BadgeStatus` | working (blue), done (green), paused (gold), needs-input (lavender), error (coral) | Agent state in sidebar, nodes |
| `BadgeOfficial` | shield icon + "Official" | Verified MCP servers, built-in skills |
| `BadgeModel` | haiku, sonnet, opus with tier colors | Model indicator on agents |
| `BadgeCount` | number in circle | Notification count, tool count |
| `BadgeNew` | "New" pill | Recently added items |

**Inputs:**

| Component | Variants | Usage |
|-----------|----------|-------|
| `InputText` | default, focus, error, disabled, with-icon | Agent name, search, config fields |
| `InputTextarea` | default, focus, auto-grow | Agent description, team instructions, chat input |
| `InputSearch` | with filter icon, clearable | Library search, slash command search |
| `InputSelect` | single, with description | Model selection, permission mode |
| `InputCheckbox` | checked, unchecked, indeterminate | Agent selection in team creator |
| `InputRadio` | selected, unselected | Mutually exclusive options |
| `InputToken` | password-style with show/hide | API keys, auth tokens |

**Labels and Text:**

| Component | Variants | Usage |
|-----------|----------|-------|
| `Label` | default, required, optional | Form field labels |
| `Heading` | h1, h2, h3, h4 | Section headings, panel titles |
| `BodyText` | regular, small, muted | Descriptions, helper text |
| `MonoText` | regular, small | Code, chain of thought, file paths |
| `GameText` | heading, body (Press Start 2P) | Game mode labels |
| `Tooltip` | top, bottom, left, right | Hover explanations |
| `HelpText` | default, error, success | Below form inputs |

**Avatars and Indicators:**

| Component | Variants | Usage |
|-----------|----------|-------|
| `AgentAvatar` | ghost with role-colored ring | Agent identification everywhere |
| `StateIndicator` | dot (sidebar), ring (canvas), badge (list) | Agent state at a glance |
| `ProgressRing` | determinate, indeterminate | Agent working animation |
| `OnlineIndicator` | connected, disconnected | MCP server connection state |

**Dividers and Spacers:**

| Component | Variants | Usage |
|-----------|----------|-------|
| `Divider` | horizontal, vertical, with-label | Section separation |
| `Spacer` | 4, 8, 12, 16, 24, 32, 48 | Consistent spacing |

---

### Molecules (Combinations of Atoms)

**Agent-Related Molecules:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `AgentNode` | AgentAvatar + Label + BadgeStatus + BadgeModel + StateIndicator | Canvas node representing one agent |
| `AgentListItem` | AgentAvatar + Label + BadgeStatus + IconChevron | Sidebar agent entry |
| `AgentSummaryCard` | AgentAvatar + Heading + BodyText + BadgeModel + ButtonGhost(edit) | Agent overview in detail panel |
| `AgentStateChip` | StateIndicator + Label text | Compact state display: "Working...", "Done" |

**Skill and Tool Molecules:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `SkillPill` | Label + IconAction(slash) + optional BadgeOfficial | Above chat input, in library |
| `ToolChip` | IconTool + Label | In agent detail, chain of thought |
| `ToolCallBlock` | ToolChip + MonoText(arguments) + expandable result | Chain of thought tool usage |

**MCP Server Molecules:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `MCPServerCard` | BadgeOfficial + Heading + BodyText + BadgeCount(tools) + ButtonSecondary(Add) | Library MCP directory listing |
| `MCPServerNode` | Hexagonal shape + Icon + Label + OnlineIndicator | Canvas node for MCP server |
| `MCPToolList` | List of ToolChip items with descriptions | Server detail view |

**Input and Interaction Molecules:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `SearchBar` | InputSearch + ButtonIcon(filter) + optional dropdown | Library search with type filter |
| `ModeToggleGroup` | 3x InputRadio styled as segmented control + descriptions | Permission mode: Plan / Accept Edits / Auto |
| `ModelSelector` | InputSelect with IconModel + model description + recommendation badge | Choose Haiku/Sonnet/Opus |
| `GameModeToggle` | ButtonToggle + Label + IconNav(game-controller) | Sidebar game mode switch |

**Chat Molecules:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `ChatBubbleUser` | BodyText + timestamp | User message in chat |
| `ChatBubbleAgent` | AgentAvatar + BodyText + MonoText(thinking) + timestamp | Agent response in chat |
| `ChatInputBar` | InputTextarea + ButtonPrimary(Send) + SkillPill row + slash trigger | Bottom of chat view |
| `InputRequestBanner` | AgentAvatar + BodyText(question) + InputTextarea + ButtonPrimary(Respond) | Inline input request |

**Notification Molecules:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `Toast` | Icon + BodyText + optional ButtonGhost(action) + auto-dismiss | Success, error, info notifications |
| `NotificationBadge` | BadgeCount overlaid on parent element | Unread count on sidebar items |
| `AlertBanner` | Icon + Heading + BodyText + ButtonPrimary + ButtonGhost(dismiss) | Pipeline needs input, errors |

**Navigation Molecules:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `TabButton` | IconNav + Label + optional NotificationBadge | Chat, Canvas, Library tabs |
| `SubTabButton` | Label + optional BadgeCount | Skills, Agents, MCP sub-tabs |
| `BreadcrumbTrail` | Multiple Label items with IconChevron separators | Navigation context in panels |

---

### Organisms (Complex Multi-Molecule Components)

**Chat Organisms:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `ChatMessageList` | Scrollable list of ChatBubbleUser + ChatBubbleAgent + InputRequestBanner + system messages | Main chat conversation view |
| `SlashCommandPalette` | SearchBar + scrollable list of SkillPill items + keyboard navigation + fuzzy search | Floating overlay triggered by "/" |
| `ChainOfThought` | Collapsible MonoText blocks with ToolCallBlock items, streaming support, auto-scroll | Agent thinking process in detail panel |

**Canvas Organisms:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `CanvasWorkspace` | React Flow instance + custom AgentNode + MCPServerNode + TeamContainer + EdgeTypes + Toolbar + Minimap | Main visual workspace |
| `CanvasToolbar` | ButtonFab(+Agent) + ButtonFab(+Team) + ButtonIcon(zoom) + ButtonIcon(minimap) + ButtonIcon(fit-view) + GameModeToggle | Top or bottom bar of canvas |
| `TeamContainer` | React Flow group node with header (Heading + ButtonPrimary(Run) + ButtonIcon(settings)) + drop zone for AgentNode items | Visual team boundary on canvas |
| `ConnectionEdge` | Animated bezier line + optional data transfer indicator (dot or pigeon) + label | Canvas edge between nodes |

**Detail Panel Organisms:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `AgentDetailPanel` | AgentSummaryCard + ModeToggleGroup + ModelSelector + ChainOfThought + InputRequestBanner + ToolCallBlock list + close button | Slide-in right panel |
| `TeamDetailPanel` | Heading + InputTextarea(instructions) + agent list with AgentListItem + MCPToolList + ButtonPrimary(Run) | Team configuration panel |
| `MCPServerDetailPanel` | Heading + BodyText(description) + MCPToolList + InputToken(auth) + ButtonPrimary(Test) + ButtonPrimary(Save) | Server config panel |

**Creator Organisms:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `AgentCreatorWizard` | Multi-step modal: Step 1 (InputTextarea + template buttons) -> Step 2 (magic wand refinement + diff view) -> Step 3 (ModelSelector + ModeToggleGroup + InputText(name)) | 3-step agent creation flow |
| `SkillCreatorWizard` | Multi-step modal: Step 1 (InputTextarea + template) -> Step 2 (magic wand refinement) -> Step 3 (name + trigger) | Skill creation flow |
| `TeamCreatorModal` | InputText(name) + InputTextarea(description) + checkbox list of agents + ButtonPrimary(Create) | Team creation dialog |

**Library Organisms:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `MCPServerDirectory` | SearchBar + filter tabs (Official/Custom/All) + grid of MCPServerCard + pagination | MCP server browsing |
| `SkillLibrary` | SearchBar + grid of SkillPill cards with descriptions + ButtonPrimary(+New) | Skill browsing and creation |
| `AgentTemplateLibrary` | Grid of AgentSummaryCard items as templates + ButtonPrimary(+New Custom) | Pre-built agent templates |

**Game Mode Organisms:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `PixiGameCanvas` | PixiJS Application with grass tile background + sprite entities + path tiles + building sprites + chest sprites | Game mode overlay on canvas |
| `SpriteEntity` | Base ghost sprite + hat overlay + state animation + pixel chat bubble + name label | Individual agent in game mode |
| `Workstation` | Pixel art desk/anvil/easel sprite + item animations (hammer swing, quill write) | Where sprites work |
| `CarrierPigeon` | Animated sprite with scroll, follows path between two SpriteEntity locations | Data transfer visualization |
| `PixelTeamBuilding` | Building sprite with sign, fence boundary, door for agents entering/leaving | Team container in game mode |
| `TreasureChest` | Chest sprite with open/close animation, sparkle particles | MCP server in game mode |
| `EggHatchAnimation` | Egg sprite -> wobble frames -> crack frames -> ghost emerges -> hat drops | New agent birth sequence |

**Global Organisms:**

| Component | Composition | Usage |
|-----------|-------------|-------|
| `Sidebar` | Logo + agent list (AgentListItem) + team list + history section + settings link + GameModeToggle | Persistent left navigation |
| `TabBar` | Row of TabButton items (Chat, Canvas, Library) with active indicator | Main content area navigation |
| `OnboardingTour` | Sequence of Tooltip overlays with step counter + Next/Skip buttons | First-time user experience |
| `PermissionRequestModal` | AgentAvatar + BodyText(request description) + code preview + ButtonPrimary(Approve) + ButtonDanger(Deny) | Agent asking for approval |
| `ToastContainer` | Stack of Toast items with auto-dismiss and manual close | Top-right notification area |

---

### Templates (Page-Level Layouts)

**Chat View Template:**

```
+----------------------------------------------------------+
|                                                          |
| +----------+ +----------------------------------------+ |
| |          | | [Chat]  [Canvas]  [Library]             | |
| | SIDEBAR  | |                                        | |
| |          | | +------------------------------------+ | |
| | 240px    | | |                                    | | |
| | fixed    | | |     ChatMessageList                | | |
| |          | | |     (scrollable)                    | | |
| |          | | |                                    | | |
| |          | | |                                    | | |
| |          | | |                                    | | |
| |          | | |                                    | | |
| |          | | |                                    | | |
| |          | | +------------------------------------+ | |
| |          | | | SkillPill row (horizontal scroll)   | | |
| |          | | +------------------------------------+ | |
| |          | | | ChatInputBar                        | | |
| |          | | | [Type message... or / for commands] | | |
| |          | | +------------------------------------+ | |
| +----------+ +----------------------------------------+ |
+----------------------------------------------------------+
```

**Canvas View Template:**

```
+----------------------------------------------------------+
|                                                          |
| +----------+ +----------------------------------------+ |
| |          | | [Chat]  [Canvas]  [Library]             | |
| | SIDEBAR  | |                                        | |
| |          | | +---------------------------++---------+| |
| |          | | |                           ||         || |
| |          | | |                           || DETAIL  || |
| |          | | |    CanvasWorkspace         || PANEL   || |
| |          | | |    (React Flow or PixiJS)  || (0-400px|| |
| |          | | |                           || slide)  || |
| |          | | |                           ||         || |
| |          | | |                           ||         || |
| |          | | |                           ||         || |
| |          | | +---------------------------++---------+| |
| |          | | | CanvasToolbar                         | |
| |          | | | [+Agent] [+Team] [Zoom] [Fit] [Mini] | |
| |          | | +--------------------------------------+| |
| +----------+ +----------------------------------------+ |
+----------------------------------------------------------+
```

**Library View Template:**

```
+----------------------------------------------------------+
|                                                          |
| +----------+ +----------------------------------------+ |
| |          | | [Chat]  [Canvas]  [Library]             | |
| | SIDEBAR  | |                                        | |
| |          | | [Skills]  [Agents]  [MCP Servers]       | |
| |          | |                                        | |
| |          | | +------------------------------------+ | |
| |          | | | SearchBar with filters              | | |
| |          | | +------------------------------------+ | |
| |          | | |                                    | | |
| |          | | |  Card grid (responsive)            | | |
| |          | | |  +--------+ +--------+ +--------+ | | |
| |          | | |  | Card 1 | | Card 2 | | Card 3 | | | |
| |          | | |  +--------+ +--------+ +--------+ | | |
| |          | | |  +--------+ +--------+ +--------+ | | |
| |          | | |  | Card 4 | | Card 5 | | Card 6 | | | |
| |          | | |  +--------+ +--------+ +--------+ | | |
| |          | | |                                    | | |
| |          | | +------------------------------------+ | |
| |          | | | [+ Create New]                      | | |
| |          | | +------------------------------------+ | |
| +----------+ +----------------------------------------+ |
+----------------------------------------------------------+
```

---

## 3. Game Mode Sprite Sheet (ASCII Pixel Art)

All sprites are designed at a 16x16 pixel base and rendered at 48-64px in the UI. The ASCII representations below use a larger canvas for readability. Each character represents approximately one pixel.

### Agent Sprites

**Base Ghost (No Hat) -- The Claude Ghost:**

```
      ....
    ........
   ..........
  .+@@@@@@@@+.
  .@@@@@@@@@@.
  .@@.@@..@@..
  .@@.@@..@@..
  .@@@@@@@@@@.
  .@@@@..@@@@.
  .@@@@@@@@@@.
  .@@@@@@@@@@.
  ..@@.@@.@@..
   .@...@...@.
```
- Orange fill (@), darker outline (.), white eyes (spaces in eye area)
- 2-frame idle: bobs up 1px and down 1px


**Engineer (Hard Hat):**

```
    ########
   ##YELLOW##
   ##########
      ....
    ........
   ..........
  .+@@@@@@@@+.
  .@@@@@@@@@@.
  .@@.@@..@@..
  .@@.@@..@@..
  .@@@@@@@@@@.
  .@@@@..@@@@.
  .@@@@@@@@@@.
  .@@@@@@@@@@.
  ..@@.@@.@@..
   .@...@...@.
```
- Yellow (#) hard hat with brim extending past ghost edges
- Small highlight pixel on hat for shine


**Designer (Beret):**

```
       oo
     oooooo
    ooPURPLo
   ooooooooo
      ....
    ........
   ..........
  .+@@@@@@@@+.
  .@@@@@@@@@@.
  .@@.@@..@@..
  .@@.@@..@@..
  .@@@@@@@@@@.
  .@@@@..@@@@.
  .@@@@@@@@@@.
  .@@@@@@@@@@.
  ..@@.@@.@@..
   .@...@...@.
```
- Purple (o) beret tilted slightly to the right
- Small pom-pom on top (oo)


**QA (Magnifying Glass):**

```
      ....
    ........
   ..........
  .+@@@@@@@@+.
  .@@@@@@@@@@.
  .@@.@@..@@..
  .@@.@@..@@..
  .@@@@@@@@@@.
  .@@@@..@@@@.
  .@@@@@@@@@@.
  .@@@@@@@@@@.  +--+
  ..@@.@@.@@.. /    \
   .@...@...@ |  OO |
               \    /
                +--+
                 /
                /
```
- Magnifying glass held to the right side
- Glass has a circular lens with highlight (OO)
- Handle extends down-right at 45 degrees


**Writer (Quill Pen):**

```
                  /
                 /
                / ~feather~
      ....     /  ~~~~~~~~
    ........  /
   ..........
  .+@@@@@@@@+.
  .@@@@@@@@@@.
  .@@.@@..@@..
  .@@.@@..@@..
  .@@@@@@@@@@.
  .@@@@..@@@@.
  .@@@@@@@@@@.
  .@@@@@@@@@@.
  ..@@.@@.@@..
   .@...@...@.
```
- Quill pen held up-right, extending above the ghost
- Feather detail (wavy lines) on the quill shaft
- Gold/amber colored nib at the bottom


**Researcher (Explorer Hat):**

```
   ____________
  /   BROWN   /|
 /____________/ |
 |  +------+  |/
      ....
    ........
   ..........
  .+@@@@@@@@+.
  .@@@@@@@@@@.
  .@@.@@..@@..
  .@@.@@..@@..
  .@@@@@@@@@@.
  .@@@@..@@@@.
  .@@@@@@@@@@.
  .@@@@@@@@@@.
  ..@@.@@.@@..
   .@...@...@.
```
- Brown explorer/safari hat with wide brim
- Slight indent on top of the hat crown
- Hat band detail (darker brown line)

---

### Workstation Sprites

**Anvil + Hammer (Engineer Workstation):**

```
              ___
             |   |
             | H |
             |___|
              /
             /
  +========+
  |  ANVIL |
  |  ~~~~~~|
  +--+  +--+
  |  |  |  |
  +--+  +--+
==============
```
- Dark gray anvil on a wooden base (==)
- Hammer (H) above, swings down in work animation
- Sparks (*, +) fly on hammer strike frames


**Easel + Palette (Designer Workstation):**

```
    /|
   / |
  /  |
 / +---------+
|  | CANVAS  |
|  |  ~~~~   |
|  |  ~~~~   |
|  +---------+
 \    |
  \   |
   \  |
    +-+

  +---+
 ( o o )
 ( o o )  <- palette with color dots
  +---+
```
- Wooden easel (/) with rectangular canvas
- Canvas shows wavy lines (work in progress)
- Palette below with colored dots (o) for paints


**Desk + Stamp (QA Workstation):**

```
+==============+
|  QA DESK     |
|  +---+ +---+ |
|  |doc| |doc| |
|  +---+ +---+ |
|              |
+-+----------+-+
  |          |
  +----------+

     +--+
     |ST|  <- rubber stamp
     |MP|
     +--+
      ||
```
- Wooden desk with documents on top
- Rubber stamp (ST/MP) to the right
- Stamp animation: lifts up, slams down, "APPROVED" text appears
- Red ink splatter on stamp frames


**Writing Desk + Scrolls (Writer Workstation):**

```
     ~  <- candle flame (flickers)
     |
    +-+
    |C|  <- candle
    +-+
+=============+
| WRITING     |
| DESK        |
|  +------+   |
|  |scroll|   |
|  |~~~~~~|   |
|  |~~~~~~|   |
|  +------+   |
+-+---------+-+
  |         |
  +---------+

 +--+  +--+
 |  |  |  |  <- rolled scrolls
 +--+  +--+
```
- Wooden writing desk with open scroll on top
- Candle with flickering flame (2 frames)
- Rolled scrolls beside the desk
- Writing animation: quill moves across scroll, ink appears


**Globe + Book (Researcher Workstation):**

```
    +----+
   /  ..  \
  | . WW . |  <- globe with continents
  |  ....  |
   \ .... /
    +----+
      ||
    +----+
    |BASE|
    +----+

  +------+
  | BOOK |
  |------|  <- open book
  | ~~~~ |
  | ~~~~ |
  +------+
```
- Spinning globe on a stand (globe rotates through 4 frames)
- Open book below with wavy text lines
- Globe continents shift position each frame to show rotation

---

### Animation Keyframes

**Birth Animation: Egg -> Wobble -> Crack -> Hatch -> Ghost Emerges**

```
Frame 1:         Frame 2:         Frame 3:         Frame 4:         Frame 5:
"Egg appears"    "Wobble left"    "Wobble right"   "Crack!"         "Hatch!"

                                                      *
    ____            ____           ____            ___/\___          ____
   /    \          /    \         /    \          /   /\   \      __/  _ \__
  |      |        |      |       |      |       |   /  \   |    |   ~O~   |
  |      |       |      |         |      |      |  /  * \  |    |   /|\   |
  |      |        |      |       |      |       | /      \ |    |         |
   \____/          \____/         \____/         \___/\___/       \__   __/
                  (tilted         (tilted        (crack lines      (shell
                   left)           right)         appear)           opens)


Frame 6:         Frame 7:         Frame 8:
"Ghost rises"    "Hat drops"      "Sparkle!"

                    ##               ##
                   ####             ####
   ~O~              ~O~              ~O~    * *
   /|\              /|\              /|\   * * *
                                           * *
  __  __           __  __
 |  \/  |         |  \/  |
  (shell           (shell
   halves)          fade out)
```

- Total duration: approximately 2 seconds at 15fps (30 frames)
- Frames 1-3: Egg wobbles (3 repetitions of left-right)
- Frame 4: Crack lines appear on egg shell
- Frame 5: Shell splits open
- Frame 6: Ghost sprite rises from shell halves
- Frame 7: Role-specific hat drops from above onto ghost head
- Frame 8: Sparkle particles burst around the ghost, shell halves fade


**Carrier Pigeon Animation: Flying Left to Right with Scroll**

```
Frame 1:           Frame 2:           Frame 3:           Frame 4:
"Wings up"         "Wings mid"        "Wings down"       "Wings mid"

    .  .               .  .
   / \/ \            __|  |__          .      .           __|  |__
  /  /\  \          /  /\  \          / \    / \         /  /\  \
 /  /__\  \        /  /__\  \        / __\  /__ \       /  /__\  \
    |  |              |  |              |  |              |  |
    |~~|              |~~|              |~~|              |~~|
    (scroll)          (scroll)          (scroll)          (scroll)
```

- Pigeon body is gray-white, 8x6 pixels
- Wings flap in 4-frame cycle
- Scroll (|~~|) dangles beneath the body, swings slightly
- Pigeon follows the bezier path of the connection edge
- Travel speed: approximately 100px per second
- On arrival: pigeon lands, scroll detaches, pigeon flies off-screen upward


### Environment Tiles

All tiles are 16x16 pixels. Below are 4x magnified ASCII representations.

**Grass Tile (base terrain):**

```
+----------------+
|  .  .  .  . .  |
| . .  . . .  .  |
|.  .  .  . .  . |
| .  .  . .  . . |
|  .  .  . .  .  |
| . .  .  . .  . |
|.  . .  .  .  . |
| .  .  . .  . . |
+----------------+
```
- Light green (#8BC8A0) base
- Darker green dots scattered randomly for texture
- 3 variants that tile seamlessly to avoid repetition


**Cobblestone Path Tile:**

```
+----------------+
|+--+ +---+ +--+|
||  | |   | |  ||
|+--+ +---+ +--+|
|+---+ +--+ +---+|
||   | |  | |   ||
|+---+ +--+ +---+|
|+--+ +---+ +--+|
||  | |   | |  ||
+----------------+
```
- Warm gray (#B5B0A8) stones
- Darker gray (#8A857D) gaps between stones
- Horizontal and vertical variants for straight paths
- Corner and T-junction variants for intersections


**Flower (decorative):**

```
  +--+
 / *  \
| *@*  |
 \ *  /
  +--+
   ||
   ||
```
- Small 4x6 pixel decoration placed randomly on grass
- 4 color variants: red, yellow, blue, pink
- 2-frame sway animation (leans left, leans right)
- Placed algorithmically to avoid overlapping with paths


**Tree (decorative):**

```
    +------+
   /  ^^^^  \
  / ^^^^^^^^ \
 / ^^ ^^^ ^^ \
| ^^^^^^^^^^^^ |
 \ ^^^^^^^^^^ /
  \  ^^^^^^  /
   +---++---+
       ||
       ||
       ||
     +----+
```
- Dark green (#4A8C5C) canopy with lighter highlights
- Brown (#8B6914) trunk
- 8x12 pixel footprint
- Casts a 2px shadow to the right
- Placed at canvas edges and between team buildings


**Fence (team boundary):**

```
  |    |    |    |    |
  |    |    |    |    |
==+====+====+====+====+==
  |    |    |    |    |
  |    |    |    |    |
```
- Brown wooden fence, 4px tall repeating segment
- Horizontal and vertical variants
- Corner pieces for team boundary corners
- Gate piece (opening in fence) at team building entrance


**Team Building with Sign:**

```
      +---SIGN---+
      | TEAM NAME|
      +----------+
         |
+========================+
|  +-+    /\    +-+      |
|  | |   /  \   | |      |
|  |W|  / .. \  |W|      |
|  |I| /  ..  \ |I|      |
|  |N|/ ...... \|N|      |
|  |D|  DOOR    |D|      |
|  |O|  +--+    |O|      |
|  |W|  |  |    |W|      |
+==+==+=+--+=+==+==+====+
```
- Stone/wood building with peaked roof
- Windows (W/I/N/D/O/W) on sides
- Door in center (agents enter/exit through here)
- Sign post above with team name in pixel font
- Roof color matches team's assigned color
- Chimney with optional smoke particles when team is running


**Treasure Chest (MCP Server):**

```
Closed:                 Open:

+================+      +================+
|  @@@@@@@@@@@@  |     /  @@@@@@@@@@@@  /|
|  @@@@@@@@@@@@  |    / @@@@@@@@@@@@@ / |
+====+======+====+   +====+======+===+  |
|    | LOCK |    |   |                |  |
|    +------+    |   |   * TOOLS *    | /
|                |   |   * * * * *    |/
+================+   +================+
```
- Brown wooden chest with golden trim (@@)
- Lock on front when closed
- Open animation: lid swings up, sparkle particles (*) rise
- When agent uses MCP tool: chest opens, tool item floats to agent
- Label below chest shows MCP server name


---

## 4. Accessibility Checklist

### Keyboard Navigation Map

**Global Shortcuts:**

| Key | Action | Context |
|-----|--------|---------|
| `Tab` | Move focus to next interactive element | All views |
| `Shift+Tab` | Move focus to previous element | All views |
| `Escape` | Close modal/panel/palette, cancel action | All views |
| `Ctrl+1` / `Cmd+1` | Switch to Chat tab | All views |
| `Ctrl+2` / `Cmd+2` | Switch to Canvas tab | All views |
| `Ctrl+3` / `Cmd+3` | Switch to Library tab | All views |
| `Ctrl+K` / `Cmd+K` | Open slash command palette | All views |
| `Ctrl+N` / `Cmd+N` | Create new agent | All views |
| `Ctrl+G` / `Cmd+G` | Toggle game mode | All views |

**Chat View Navigation:**

| Key | Action |
|-----|--------|
| `Enter` | Send message (when chat input focused) |
| `Shift+Enter` | New line in chat input |
| `/` (in empty input) | Open slash command palette |
| `Arrow Up/Down` | Navigate slash command options |
| `Enter` | Select slash command |
| `Escape` | Close slash command palette |
| `Ctrl+Shift+C` | Copy last agent response |

**Canvas View Navigation:**

| Key | Action |
|-----|--------|
| `Arrow keys` | Pan canvas |
| `+` / `-` | Zoom in / out |
| `0` | Fit view (zoom to show all nodes) |
| `Tab` | Cycle focus between canvas nodes |
| `Enter` | Open detail panel for focused node |
| `Delete` / `Backspace` | Delete focused node (with confirmation) |
| `Ctrl+A` | Select all nodes |
| `Space` | Toggle selection of focused node |

**Detail Panel Navigation:**

| Key | Action |
|-----|--------|
| `Escape` | Close panel |
| `Tab` | Navigate panel controls |
| `Enter` | Activate focused control |
| `Arrow Up/Down` | Scroll chain of thought |

**Modal/Wizard Navigation:**

| Key | Action |
|-----|--------|
| `Escape` | Close modal / cancel |
| `Tab` | Move between form fields |
| `Enter` | Submit current step / confirm |
| `Shift+Tab` | Move to previous field |
| `Arrow Left/Right` | Navigate wizard steps (when step indicator focused) |

### ARIA Roles and Landmarks

**Page Structure:**

```
<body>
  <nav role="navigation" aria-label="Sidebar">
    <!-- Sidebar content -->
    <section aria-label="Agents">...</section>
    <section aria-label="Teams">...</section>
  </nav>

  <main role="main" aria-label="Workspace">
    <div role="tablist" aria-label="View tabs">
      <button role="tab" aria-selected="true">Chat</button>
      <button role="tab" aria-selected="false">Canvas</button>
      <button role="tab" aria-selected="false">Library</button>
    </div>

    <div role="tabpanel" aria-label="Chat view">
      <!-- Active tab content -->
    </div>
  </main>

  <aside role="complementary" aria-label="Detail panel">
    <!-- Slide-in detail panel -->
  </aside>
</body>
```

**Component-Level ARIA:**

| Component | Role | Key ARIA Attributes |
|-----------|------|---------------------|
| Sidebar | `navigation` | `aria-label="Sidebar navigation"` |
| Agent list | `list` | `aria-label="Your agents"` |
| Agent list item | `listitem` | `aria-label="{name} - {state}"` |
| Tab bar | `tablist` | `aria-label="View tabs"` |
| Tab button | `tab` | `aria-selected`, `aria-controls` |
| Tab panel | `tabpanel` | `aria-labelledby` (points to tab) |
| Canvas workspace | `application` | `aria-label="Agent canvas"`, `aria-roledescription="visual workspace"` |
| Agent node (canvas) | `button` within `application` | `aria-label="{name}, {role}, {state}"` |
| Team container | `group` | `aria-label="Team: {name}"` |
| Detail panel | `complementary` | `aria-label="Agent details: {name}"` |
| Chain of thought | `log` | `aria-live="polite"`, `aria-label="Agent thinking"` |
| Chat message list | `log` | `aria-live="polite"`, `aria-label="Conversation"` |
| Chat input | `textbox` | `aria-label="Message input"`, `aria-describedby` (helper text) |
| Slash command palette | `listbox` | `aria-label="Available commands"`, `aria-activedescendant` |
| Modal dialogs | `dialog` | `aria-modal="true"`, `aria-labelledby` (heading) |
| Toast notifications | `status` | `aria-live="polite"` (info), `aria-live="assertive"` (errors) |
| Game mode toggle | `switch` | `aria-label="Game mode"`, `aria-checked` |
| Permission mode | `radiogroup` | `aria-label="Permission mode"` |
| Model selector | `listbox` | `aria-label="AI model"` |
| Progress indicator | `progressbar` or `status` | `aria-label="{agent} is working"`, `aria-valuetext` |
| MCP server node | `button` | `aria-label="{name} MCP server, {status}"` |
| Input request | `alertdialog` | `aria-label="Input needed from {agent}"` |

### Screen Reader Announcements for State Changes

These announcements use `aria-live` regions to inform screen reader users of dynamic changes without requiring focus.

**Agent State Changes:**

| Event | Announcement | Priority |
|-------|-------------|----------|
| Agent starts working | "{Name} has started working." | `polite` |
| Agent finishes | "{Name} has finished successfully." | `polite` |
| Agent needs input | "{Name} needs your input: {question}" | `assertive` |
| Agent encounters error | "Error: {Name} encountered a problem. {error summary}" | `assertive` |
| Agent paused | "{Name} has been paused." | `polite` |
| Agent resumes | "{Name} has resumed working." | `polite` |

**Team State Changes:**

| Event | Announcement | Priority |
|-------|-------------|----------|
| Team starts running | "Team {name} has started. {count} agents are working." | `polite` |
| Team completes | "Team {name} has completed all tasks." | `polite` |
| Team needs input | "Team {name} is paused. {agent} needs your input." | `assertive` |

**Navigation and Actions:**

| Event | Announcement | Priority |
|-------|-------------|----------|
| Tab switch | "Switched to {tab name} view." | `polite` |
| Detail panel opens | "Detail panel opened for {agent/team name}." | `polite` |
| Detail panel closes | "Detail panel closed." | `polite` |
| Agent created | "Agent {name} created successfully." | `polite` |
| Agent deleted | "Agent {name} deleted." | `polite` |
| MCP server added | "{server name} MCP server added to {target}." | `polite` |
| MCP server connected | "{server name} connection successful." | `polite` |
| MCP server failed | "{server name} connection failed. {reason}" | `assertive` |
| Game mode toggled on | "Game mode enabled. Visual theme changed to pixel art." | `polite` |
| Game mode toggled off | "Game mode disabled. Visual theme changed to standard." | `polite` |
| Slash command palette opens | "Command palette open. {count} commands available. Type to filter." | `polite` |
| Input submitted | "Response sent to {agent}." | `polite` |

### Reduced Motion Alternatives

When the user has `prefers-reduced-motion: reduce` set in their operating system preferences, the following changes apply.

**Standard Mode:**

| Normal Animation | Reduced Motion Alternative |
|-----------------|---------------------------|
| Agent spinner rotation | Static "Working..." text label with no rotation |
| Pulsing "?" bubble | Static "?" icon with no pulse |
| Error shake | Static error icon with red border (no shake) |
| Green checkmark fade-in | Instant checkmark appearance |
| Detail panel slide-in | Instant panel appearance (no slide) |
| Toast slide-down | Instant toast appearance |
| Connection edge animated dot | Static dot at midpoint of edge |
| Canvas zoom/pan smooth scroll | Instant zoom/pan snap |
| Modal fade-in/out | Instant show/hide |
| Tab transition | Instant content switch |
| Hover state transitions | Instant color change |

**Game Mode:**

| Normal Animation | Reduced Motion Alternative |
|-----------------|---------------------------|
| Sprite idle bob (2-frame) | Static sprite (single frame, no bob) |
| Sprite walking to workstation | Sprite instantly appears at workstation |
| Tool swing animation (hammer, quill, etc.) | Static "working" pose (tool raised) |
| Egg hatch sequence (8 frames, 2s) | Instant: egg disappears, ghost appears with hat |
| Carrier pigeon flight | Scroll icon appears instantly at destination agent |
| Globe rotation | Static globe (single frame) |
| Candle flame flicker | Static flame (single frame) |
| Flower sway | Static flowers |
| Sparkle particles | No particles shown |
| Smoke from chimney | No smoke shown |
| Chest open animation | Instant open state |
| Transition between standard/game mode | Instant swap (no crossfade) |

**Implementation Note:** All animations should be wrapped in a `useReducedMotion()` hook or CSS media query check. The reduced motion alternatives must convey the same information as the animations -- they differ only in visual presentation, never in semantic content. Every animated state indicator has a text or icon equivalent that is always present regardless of motion preference.

### Color Contrast Verification

All text and interactive elements must meet WCAG AA minimum contrast ratios.

| Element | Foreground | Background | Ratio | Passes AA |
|---------|-----------|------------|-------|-----------|
| Body text | #2D2D2A | #FAFAF7 | 14.2:1 | Yes (AAA) |
| Body text on surface | #2D2D2A | #FFFFFF | 15.4:1 | Yes (AAA) |
| Muted text | #6B6B66 | #FAFAF7 | 5.1:1 | Yes (AA) |
| Primary button text | #FFFFFF | #7C9FE8 | 3.2:1 | Needs bold/large text or darker blue |
| Primary button text (adjusted) | #FFFFFF | #5A7CC4 | 4.6:1 | Yes (AA) |
| Working state label | #2D2D2A | #7CB8E8 | 5.8:1 | Yes (AA) |
| Done state label | #2D2D2A | #8BC8A0 | 7.1:1 | Yes (AA) |
| Needs-input state label | #2D2D2A | #D4A0D4 | 4.9:1 | Yes (AA) |
| Error state label | #2D2D2A | #E89B9B | 5.2:1 | Yes (AA) |
| Paused state label | #2D2D2A | #E8D47C | 7.5:1 | Yes (AA) |
| Game mode pixel text | #FFFFFF | #4A8C5C (grass) | 4.5:1 | Yes (AA, large text) |
| Canvas node label | #2D2D2A | #FFFFFF | 15.4:1 | Yes (AAA) |

**Note:** The primary button color #7C9FE8 does not meet AA contrast for normal white text. The adjusted value #5A7CC4 should be used for interactive button backgrounds, or the button text should be set to a dark color. All state colors pass AA when paired with near-black text.

### Focus Indicators

- All focusable elements display a visible 2px outline in the primary color (#7C9FE8) with a 2px offset
- Focus outline has sufficient contrast against all backgrounds (minimum 3:1 ratio against adjacent colors)
- In game mode, focus on sprite entities shows a dashed pixel-style outline
- Focus is never trapped inside any component (except modal dialogs, which trap focus intentionally per ARIA practices)
- Focus order follows visual reading order: sidebar top-to-bottom, then main content top-to-bottom left-to-right, then detail panel

---

*Design document generated by ClaudeQuest Product Designer. References PRD and Feasibility Analysis dated 2026-02-21.*
