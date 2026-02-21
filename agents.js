// ═══════════════════════════════════════════
// agents.js — Edit this file to configure agent
// front-end behavior, tasks, positions, and visuals.
// ═══════════════════════════════════════════

// ─── Agent Config ───────────────────────────
// Edit these to change who's on your team.
const AGENT_CONFIG = [
  {
    name: "BizOps",
    model: "opus",
    skills: ["discover"],
    mcps: [],
    desc: "Market analysis & strategy",
    zone: "discover",
    color: "#22c55e",
    darkColor: "#14532d",
    workRole: "store",
  },
  {
    name: "Researcher",
    model: "sonnet",
    skills: ["discover"],
    mcps: ["Context7"],
    desc: "Competitive analysis & trends",
    zone: "discover",
    color: "#8b5cf6",
    darkColor: "#3b0764",
    workRole: "lab",
  },
  {
    name: "Designer",
    model: "opus",
    skills: ["design"],
    mcps: ["Chrome DevTools"],
    desc: "UI/UX & wireframes",
    zone: "design",
    color: "#ec4899",
    darkColor: "#831843",
    workRole: "studio",
  },
  {
    name: "Engineer",
    model: "opus",
    skills: ["build"],
    mcps: ["GitHub"],
    desc: "Architecture & implementation",
    zone: "build",
    color: "#3b82f6",
    darkColor: "#1e3a5f",
    workRole: "desk",
  },
];

// ─── Egg & Work Positions (tile coords) ─────
// Edit to reposition agents on the map.
const EGG_POS = {
  "BizOps":     { x: 10, y: 7  },
  "Researcher": { x: 10, y: 13 },
  "Designer":   { x: 33, y: 7  },
  "Engineer":   { x: 33, y: 23 },
};

const WORK_POS = {
  "BizOps":     { x: 7,  y: 7  },
  "Researcher": { x: 18, y: 15 },
  "Designer":   { x: 34, y: 7  },
  "Engineer":   { x: 34, y: 23 },
};

// ─── Initial Tasks ───────────────────────────
// Edit to change what each agent works on.
const AGENT_TASKS = {
  "BizOps": [
    { name: "Analyzing competitor pricing",  status: "running",  detail: "/discover — scanning 5 competitors",       progress: 40  },
    { name: "TAM/SAM/SOM estimation",        status: "thinking", detail: "/discover — modeling market size",          progress: 20  },
    { name: "Go-to-market draft v1",         status: "done",     detail: "/discover — launch strategy complete",      progress: 100 },
  ],
  "Researcher": [
    { name: "Scraping competitor features",  status: "running",  detail: "/discover — Context7 deep dive",           progress: 55  },
    { name: "User sentiment analysis",       status: "thinking", detail: "/discover — processing reviews",            progress: 25  },
    { name: "Trend report: AI tooling 2026", status: "done",     detail: "/discover — 12 key findings",              progress: 100 },
  ],
  "Designer": [
    { name: "Wireframing onboarding flow",   status: "running",  detail: "/design — 3 of 5 screens done",            progress: 60  },
    { name: "Color contrast audit (WCAG)",   status: "thinking", detail: "/design — checking AA compliance",          progress: 45  },
    { name: "Component library audit",       status: "done",     detail: "/design — catalogued 24 components",        progress: 100 },
  ],
  "Engineer": [
    { name: "Building auth module",          status: "running",  detail: "/build — JWT implementation",               progress: 65  },
    { name: "Planning API structure",        status: "thinking", detail: "/build — REST vs GraphQL",                  progress: 30  },
    { name: "Updated error handlers",        status: "done",     detail: "/build — added 4 error types",              progress: 100 },
  ],
};

// ─── Demo Findings Fallback ──────────────────
// Shown if the API call fails.
const DEMO_FINDINGS = {
  "BizOps": { title: "Market Analysis Report", findings: [
    { label: "Competitor Pricing", text: "3 of 5 competitors charge $15-25/mo. One outlier at $49/mo bundles premium support." },
    { label: "TAM Estimate",       text: "Total addressable market ~$2.4B for AI dev tools. SAM for solo/indie devs: ~$180M." },
    { label: "Go-to-Market",       text: "Recommend freemium with $12/mo pro tier. Launch on Product Hunt + HN." },
    { label: "Key Risk",           text: "Crowded market — differentiation through UX and agent orchestration is the moat." },
  ]},
  "Researcher": { title: "Competitive Intelligence Brief", findings: [
    { label: "Feature Gap",    text: "No competitor offers visual agent orchestration. Most use chat-only with no transparency." },
    { label: "User Sentiment", text: "Reddit/HN: 72% positive on AI coding tools, #1 complaint is 'black box'." },
    { label: "Trend",          text: "Agent-based architectures growing 3x YoY." },
    { label: "Opportunity",    text: "'Game-ified AI dashboard' is a completely unoccupied niche." },
  ]},
  "Designer": { title: "Design Direction Brief", findings: [
    { label: "Core Flow",    text: "Onboarding → product input → agent dashboard is the critical path. Keep it under 3 steps." },
    { label: "First Screens",text: "Prioritize onboarding prompt and agent findings scroll." },
    { label: "Visual Tone",  text: "Pixel-retro meets dark SaaS. High contrast, monospace, animated sprites." },
    { label: "UX Risk",      text: "The game world can confuse non-gamers. Add a tooltip layer on first load." },
  ]},
  "Engineer": { title: "Technical Architecture Plan", findings: [
    { label: "Tech Stack",  text: "Next.js or plain HTML + Vercel serverless functions. No database needed for MVP." },
    { label: "Data Model",  text: "Product context string → agent name → findings array. Store in-memory on client." },
    { label: "MVP Slice",   text: "Ship onboarding input + one working agent (BizOps) end-to-end first." },
    { label: "Tech Risk",   text: "Anthropic API latency can hit 5-10s. Add loading state to scroll." },
  ]},
};

const AGENT_TITLES = {
  "BizOps":     "Market Analysis Report",
  "Researcher": "Competitive Intelligence Brief",
  "Designer":   "Design Direction Brief",
  "Engineer":   "Technical Architecture Plan",
};

// ═══════════════════════════════════════════
// Agent Class
// Edit update(), wanderStep(), etc. to change
// how individual agents behave on screen.
// ═══════════════════════════════════════════
class Agent {
  constructor(config, index) {
    // Identity
    this.name       = config.name;
    this.model      = config.model;
    this.skills     = config.skills;
    this.mcps       = config.mcps;
    this.desc       = config.desc;
    this.zone       = config.zone;
    this.color      = config.color;
    this.darkColor  = config.darkColor;
    this.workRole   = config.workRole;
    this.index      = index;

    // Positions
    const ep = EGG_POS[this.name];
    const wp = WORK_POS[this.name];
    this.eggX  = ep.x; this.eggY  = ep.y;
    this.workX = wp.x; this.workY = wp.y;
    this.x = ep.x; this.y = ep.y;
    this.px = ep.x * 16; this.py = ep.y * 16; // pixel pos (pre-scale)

    // Movement
    this.moving    = false;
    this.dir       = "down";
    this.frame     = 0;
    this.moveTimer = 0;
    this.targetX   = ep.x;
    this.targetY   = ep.y;

    // Tasks
    const rawTasks = AGENT_TASKS[this.name] || [];
    this.tasks      = rawTasks.map(t => ({ ...t })); // shallow copy so each instance is independent
    this.activeTask = this.tasks.find(t => t.status === "running")
                   || this.tasks.find(t => t.status === "thinking")
                   || null;
    this.progressTick    = Math.random() * 200;
    this.reportedTask    = null;
    this.completedTaskCount = 0;

    // Egg lifecycle state
    // "egg" | "hatching" | "walking_to_work" | "working" | "walking_to_egg"
    this.state         = "egg";
    this.hatchTimer    = 0;
    this.hatchTriggered = false;
    this.sleepState    = "fresh"; // "fresh" | "resting" (resting = completed ≥1 task)

    // Wandering
    this.wanderTimer  = 60 + Math.random() * 120;
    this.wanderRadius = 2;
  }

  // ── Main per-frame update ──────────────────
  // gameCtx shape:
  //   { player, isBlocked, TILE, getZoneKeyAt,
  //     scrollOpen, textBoxOpen,
  //     AGENT_FINDINGS, AGENT_STATUS,
  //     openTextBox, fetchFindings, fetchStatus }
  update(gameCtx) {
    const { player, isBlocked, TILE, getZoneKeyAt,
            scrollOpen, textBoxOpen,
            AGENT_FINDINGS, AGENT_STATUS,
            openTextBox, fetchFindings, fetchStatus } = gameCtx;

    // Progress tick — slowly advance running/thinking tasks
    this.progressTick++;
    if (this.progressTick > 60) {
      this.progressTick = 0;
      this.tasks.forEach(t => {
        if (t.status === "running"  && t.progress < 95) t.progress += Math.random() * 3;
        if (t.status === "thinking" && t.progress < 80) t.progress += Math.random() * 2;
      });
    }

    const inZone = getZoneKeyAt(player.x, player.y) === this.zone;

    // ── State machine ──────────────────────
    if (this.state === "egg") {
      if (inZone && this.activeTask && !this.hatchTriggered) {
        this.hatchTriggered = true;
        this.state = "hatching";
        this.hatchTimer = 0;
      }
    }

    else if (this.state === "hatching") {
      this.hatchTimer++;
      if (this.hatchTimer > 80) {
        this.state   = "walking_to_work";
        this.targetX = this.workX;
        this.targetY = this.workY;
        this.moving  = true;
        this.moveTimer = 0;
      }
    }

    else if (this.state === "walking_to_work") {
      if (!this.moving) {
        if (this.x === this.workX && this.y === this.workY) {
          this.state = "working";
          this.wanderTimer = 60 + Math.random() * 120;
          // Fire API calls once on arrival
          if (!AGENT_FINDINGS[this.name]) fetchFindings(this.name);
          if (!AGENT_STATUS[this.name])   fetchStatus(this.name);
        } else {
          this.walkTowardTarget(this.workX, this.workY, isBlocked);
        }
      }
    }

    else if (this.state === "working") {
      // Trigger text box when task hits ≥95% and findings are ready
      if (!this.reportedTask
          && this.activeTask
          && this.activeTask.status === "running"
          && this.activeTask.progress >= 95
          && AGENT_FINDINGS[this.name]
          && !scrollOpen
          && !textBoxOpen) {
        this.reportedTask = this.activeTask;
        openTextBox(this.name);
      }
      this.wanderStep(isBlocked, player);
    }

    else if (this.state === "walking_to_egg") {
      if (!this.moving) {
        if (this.x === this.eggX && this.y === this.eggY) {
          this.returnToEgg();
        } else {
          this.walkTowardTarget(this.eggX, this.eggY, isBlocked);
        }
      }
    }

    // Shared movement interpolation
    if (this.moving) {
      const tx = this.targetX * TILE, ty = this.targetY * TILE;
      const dx = tx - this.px, dy = ty - this.py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1.5) {
        this.px = tx; this.py = ty;
        this.x  = this.targetX; this.y = this.targetY;
        this.moving = false; this.frame = 0;
        if (this.state === "working") this.wanderTimer = 90 + Math.random() * 150;
      } else {
        this.px += (dx / dist) * 1.5;
        this.py += (dy / dist) * 1.5;
        this.moveTimer++;
        this.frame = Math.floor(this.moveTimer / 10) % 2;
      }
    }
  }

  // ── Walk one step toward (tx, ty) ──────────
  walkTowardTarget(tx, ty, isBlocked) {
    const dx = Math.sign(tx - this.x);
    const dy = Math.sign(ty - this.y);
    let nx = this.x + dx, ny = this.y + dy;
    if (!isBlocked(nx, ny)) {
      this.targetX = nx; this.targetY = ny;
      this.moving = true; this.moveTimer = 0;
      this._setDir(dx, dy);
    } else if (dx && !isBlocked(this.x + dx, this.y)) {
      this.targetX = this.x + dx; this.targetY = this.y;
      this.moving = true; this.moveTimer = 0;
      this._setDir(dx, 0);
    } else if (dy && !isBlocked(this.x, this.y + dy)) {
      this.targetX = this.x; this.targetY = this.y + dy;
      this.moving = true; this.moveTimer = 0;
      this._setDir(0, dy);
    }
  }

  // ── Random wander near workstation ─────────
  wanderStep(isBlocked, player) {
    this.wanderTimer--;
    if (this.wanderTimer <= 0 && !this.moving) {
      const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
      const d = dirs[Math.floor(Math.random() * 4)];
      const nx = this.x + d[0], ny = this.y + d[1];
      const dist = Math.abs(nx - this.workX) + Math.abs(ny - this.workY);
      if (!isBlocked(nx, ny) && dist <= this.wanderRadius && !(nx === player.x && ny === player.y)) {
        this.targetX = nx; this.targetY = ny;
        this.moving = true; this.moveTimer = 0;
        this._setDir(d[0], d[1]);
      } else {
        this.wanderTimer = 30 + Math.random() * 60;
      }
    }
  }

  // ── Arrive back at egg ─────────────────────
  returnToEgg() {
    if (this.completedTaskCount > 0) {
      this.sleepState = "resting";
    }
    this.state = "egg";
    this.hatchTriggered = false;
  }

  // ── Mark active task done, advance queue ───
  acceptTask() {
    if (this.reportedTask) {
      this.reportedTask.status = "done";
      this.reportedTask.progress = 100;
      this.completedTaskCount++;
    }
    this.activeTask = this.tasks.find(t => t.status === "thinking") || null;
    // Walk back to egg
    this.state   = "walking_to_egg";
    this.targetX = this.eggX;
    this.targetY = this.eggY;
    this.moving  = true;
    this.moveTimer = 0;
  }

  // ── Reset task for retry ───────────────────
  retryTask(AGENT_FINDINGS, fetchFindings) {
    const runningTask = this.tasks.find(t => t.status === "done" && t.progress === 100)
                     || this.tasks.find(t => t.status === "running");
    if (runningTask) {
      runningTask.progress = 10;
      runningTask.status   = "running";
      this.activeTask      = runningTask;
    }
    this.reportedTask = null;
    delete AGENT_FINDINGS[this.name];
    fetchFindings(this.name);
  }

  // ── Trigger hatch manually (spawn pad) ─────
  triggerHatch() {
    if (this.state === "egg" && !this.hatchTriggered) {
      this.hatchTriggered = true;
      this.state      = "hatching";
      this.hatchTimer = 0;
    }
  }

  // ── Internal helpers ───────────────────────
  _setDir(dx, dy) {
    if      (dx < 0) this.dir = "left";
    else if (dx > 0) this.dir = "right";
    else if (dy < 0) this.dir = "up";
    else if (dy > 0) this.dir = "down";
  }
}

// ─── Factory: build the agents array ─────────
function createAgents() {
  return AGENT_CONFIG.map((cfg, i) => new Agent(cfg, i));
}
