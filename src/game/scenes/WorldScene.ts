import * as Phaser from 'phaser';
import { TILE, SCALE, TS } from './Boot';
import { EventBus, Events } from '../EventBus';
import {
  COLS, ROWS, ZONES, ZONE_NAMES, AGENTS, AGENT_TASKS,
  EGG_POS, WORK_POS,
  buildTileMap, isBlocked, getZoneKeyAt,
  TILE_GRASS, TILE_PATH, TILE_WATER, TILE_ZONE_FLOOR, TILE_ZONE_BORDER,
  TILE_FLOWER, TILE_TREE, TILE_LAB_FLOOR, TILE_LAB_EQUIP,
  TILE_STORE_FLOOR, TILE_STORE_SHELF, TILE_DENSE_TREE,
  DEMO_FINDINGS, type AgentTask, type AgentFindings,
} from '../data/agents';

// Colors — Pokemon Sapphire palette
const GRASS1 = 0x88c070, GRASS2 = 0x78b060;
const PATH1 = 0xd8b068, PATH2 = 0xc8a058;
const WATER1 = 0x5090d0, WATER2 = 0x60a0e0;
const LAB_FL = 0x8090a0, LAB_FL2 = 0x708090, LAB_EQ = 0x506070;
const STORE_FL = 0xc8a870, STORE_FL2 = 0xb89860, STORE_SH = 0x6b4226;
const FLOWER_COLORS = [0xff6b6b, 0xffd93d, 0x6bcb77, 0x4d96ff];

const WORLD_W = COLS * TILE;
const WORLD_H = ROWS * TILE;

type AgentState = 'egg' | 'hatching' | 'walking_to_work' | 'working' | 'walking_to_egg';

interface GameAgent {
  name: string;
  index: number;
  zone: string;
  color: number;
  colorHex: string;
  skills: string[];
  mcps: string[];
  desc: string;
  model: string;
  imageFile: string;
  mapX: number; mapY: number;
  px: number; py: number;
  targetX: number; targetY: number;
  moving: boolean; moveTimer: number; frame: number;
  dir: string;
  eggX: number; eggY: number;
  workX: number; workY: number;
  state: AgentState;
  hatchTimer: number; hatchTriggered: boolean;
  wanderTimer: number;
  tasks: AgentTask[];
  activeTask: AgentTask | null;
  progressTick: number;
  reportedTask: AgentTask | null;
  findings: AgentFindings | null;
}

export class WorldScene extends Phaser.Scene {
  private tileMap!: number[][];
  private gfx!: Phaser.GameObjects.Graphics;
  private player = {
    x: 25, y: 10, px: 25 * TILE, py: 10 * TILE,
    moving: false, dir: 'left', frame: 0, moveTimer: 0,
    targetX: 25, targetY: 10,
  };
  private agents: GameAgent[] = [];
  private cam = { x: 0, y: 0 };
  private gameTime = 0;
  private activePhase = 'discover';
  private lastZoneKey = '';
  private currentZoneName = '';
  private zoneNameTimer = 0;
  private scrollOpen = false;
  private scrollAgentName = '';
  // Phaser Image sprites for characters
  private ceoSprite!: Phaser.GameObjects.Image;
  private agentSprites: Phaser.GameObjects.Image[] = [];
  private agentEggSprites: Phaser.GameObjects.Image[] = [];

  // Dialog state
  private dialog = {
    active: false, text: '', displayedChars: 0, charTimer: 0,
    agentIndex: -1, phase: 'typing' as 'typing' | 'done' | 'question',
    selectedOption: 0,
  };

  private keys: Record<string, boolean> = {};

  constructor() {
    super('WorldScene');
  }

  create() {
    this.tileMap = buildTileMap();
    this.gfx = this.add.graphics();

    // Create agents
    for (let i = 0; i < AGENTS.length; i++) {
      const def = AGENTS[i];
      const ep = EGG_POS[def.name], wp = WORK_POS[def.name];
      const tasks = (AGENT_TASKS[def.name] || []).map(t => ({ ...t }));
      const activeTask = tasks.find(t => t.status === 'running') || tasks.find(t => t.status === 'thinking') || null;
      this.agents.push({
        name: def.name, index: i, zone: def.zone,
        color: def.color, colorHex: def.colorHex,
        skills: def.skills, mcps: def.mcps, desc: def.desc,
        model: def.model, imageFile: def.imageFile,
        mapX: ep.x, mapY: ep.y, px: ep.x * TILE, py: ep.y * TILE,
        targetX: ep.x, targetY: ep.y,
        moving: false, moveTimer: 0, frame: 0, dir: 'down',
        eggX: ep.x, eggY: ep.y, workX: wp.x, workY: wp.y,
        state: 'egg', hatchTimer: 0, hatchTriggered: false,
        wanderTimer: 60 + Math.random() * 120,
        tasks, activeTask, progressTick: Math.random() * 200,
        reportedTask: null, findings: null,
      });
    }

    // Create character sprites (Phaser Images, positioned each frame)
    const agentTexKeys: Record<string, string> = {
      BizOps: 'agent-bizops', Researcher: 'agent-researcher',
      Designer: 'agent-designer', Engineer: 'agent-engineer',
    };
    for (let i = 0; i < this.agents.length; i++) {
      const a = this.agents[i];
      const texKey = agentTexKeys[a.name] || 'sprite-egg';
      // Agent sprite (hidden initially, shown after hatch)
      const sprite = this.add.image(0, 0, texKey).setScale(TS / 64 * 1.6).setVisible(false).setDepth(1000 + i);
      this.agentSprites.push(sprite);
      // Egg sprite (shown initially)
      const eggSprite = this.add.image(0, 0, 'sprite-egg').setScale(TS / 16 * 1.5).setDepth(999 + i);
      this.agentEggSprites.push(eggSprite);
    }
    // CEO sprite
    this.ceoSprite = this.add.image(0, 0, 'agent-ceo').setScale(TS / 64 * 1.6).setDepth(2000);

    // Raw keyboard handling for responsive input
    this.input.keyboard!.on('keydown', (e: KeyboardEvent) => {
      this.keys[e.key] = true;
      if (this.dialog.active) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.handleDialogInput(); }
        if (e.key === 'Escape') this.closeDialog();
        if (this.dialog.phase === 'question') {
          if (e.key === 'ArrowUp' || e.key === 'w') this.dialog.selectedOption = 0;
          if (e.key === 'ArrowDown' || e.key === 's') this.dialog.selectedOption = 1;
        }
        return;
      }
      if (this.scrollOpen) { if (e.key === 'Escape') { EventBus.emit(Events.CLOSE_SCROLL_REPORT); this.scrollOpen = false; } return; }
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.tryInteract(); }
      if (e.key === 'Escape') EventBus.emit(Events.CLOSE_DETAIL_PANEL);
    });
    this.input.keyboard!.on('keyup', (e: KeyboardEvent) => { this.keys[e.key] = false; });

    // Listen for React events
    EventBus.on(Events.SCROLL_NEXT, this.handleScrollNext, this);
    EventBus.on(Events.SCROLL_RETRY, this.handleScrollRetry, this);
    EventBus.on(Events.CLOSE_SCROLL_REPORT, () => { this.scrollOpen = false; this.scrollAgentName = ''; }, this);

    // Initial camera
    this.cam.x = this.player.px * SCALE - this.scale.width / 2;
    this.cam.y = this.player.py * SCALE - this.scale.height / 2;

    this.emitAgentStates();
    EventBus.emit(Events.GAME_READY);
  }

  update() {
    this.gameTime++;
    this.updatePlayer();
    this.updateAgents();
    this.updateCamera();
    this.updateZoneDetection();
    this.updateSpritePositions();
    this.draw();
  }

  private updateSpritePositions() {
    // Position CEO sprite
    const csx = this.player.px * SCALE - this.cam.x + TS / 2;
    const csy = this.player.py * SCALE - this.cam.y + TS * 0.3;
    this.ceoSprite.setPosition(csx, csy);

    // Position agent sprites
    for (let i = 0; i < this.agents.length; i++) {
      const a = this.agents[i];
      const sx = a.px * SCALE - this.cam.x + TS / 2;
      const sy = a.py * SCALE - this.cam.y + TS * 0.3;

      if (a.state === 'egg') {
        this.agentEggSprites[i].setVisible(true);
        this.agentSprites[i].setVisible(false);
        this.agentEggSprites[i].setPosition(sx, sy + Math.sin(this.gameTime * 0.03 + i) * 2);
      } else if (a.state === 'hatching') {
        this.agentEggSprites[i].setVisible(true);
        this.agentSprites[i].setVisible(false);
        this.agentEggSprites[i].setPosition(sx + Math.sin(this.gameTime * 0.5) * 2, sy);
        if (a.hatchTimer > 40) this.agentEggSprites[i].setTexture('sprite-egg-cracked');
      } else {
        this.agentEggSprites[i].setVisible(false);
        this.agentSprites[i].setVisible(true);
        this.agentSprites[i].setPosition(sx, sy);
      }
    }
  }

  // ——— PLAYER MOVEMENT ———
  private updatePlayer() {
    if (this.dialog.active || this.scrollOpen) return;
    const MOVE_SPEED = 2;

    if (this.player.moving) {
      const tx = this.player.targetX * TILE, ty = this.player.targetY * TILE;
      const dx = tx - this.player.px, dy = ty - this.player.py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOVE_SPEED) {
        this.player.px = tx; this.player.py = ty;
        this.player.x = this.player.targetX; this.player.y = this.player.targetY;
        this.player.moving = false; this.player.frame = 0;
      } else {
        this.player.px += (dx / dist) * MOVE_SPEED;
        this.player.py += (dy / dist) * MOVE_SPEED;
        this.player.moveTimer++; this.player.frame = Math.floor(this.player.moveTimer / 8) % 2;
      }
      return;
    }

    let dx = 0, dy = 0, dir = this.player.dir;
    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) { dy = -1; dir = 'up'; }
    else if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) { dy = 1; dir = 'down'; }
    else if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) { dx = -1; dir = 'left'; }
    else if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) { dx = 1; dir = 'right'; }
    this.player.dir = dir;

    if (dx || dy) {
      const nx = this.player.x + dx, ny = this.player.y + dy;
      if (!isBlocked(this.tileMap, nx, ny) && !this.agents.some(a => a.state === 'working' && a.mapX === nx && a.mapY === ny)) {
        this.player.targetX = nx; this.player.targetY = ny;
        this.player.moving = true; this.player.moveTimer = 0;
      }
    }
  }

  // ——— AGENT AI ———
  private updateAgents() {
    for (const a of this.agents) {
      a.progressTick++;
      if (a.progressTick > 60) {
        a.progressTick = 0;
        a.tasks.forEach(t => {
          if (t.status === 'running' && t.progress < 95) t.progress += Math.random() * 3;
          if (t.status === 'thinking' && t.progress < 80) t.progress += Math.random() * 2;
        });
      }

      const inZone = getZoneKeyAt(this.player.x, this.player.y) === a.zone;

      switch (a.state) {
        case 'egg':
          if (inZone && a.activeTask && !a.hatchTriggered) {
            a.hatchTriggered = true; a.state = 'hatching'; a.hatchTimer = 0;
            this.emitAgentStates();
          }
          break;
        case 'hatching':
          a.hatchTimer++;
          if (a.hatchTimer > 80) {
            a.state = 'walking_to_work';
            a.targetX = a.workX; a.targetY = a.workY;
            a.moving = true; a.moveTimer = 0;
            if (!a.findings) this.fetchFindings(a);
            this.emitAgentStates();
          }
          break;
        case 'walking_to_work':
          if (!a.moving) {
            if (a.mapX === a.workX && a.mapY === a.workY) {
              a.state = 'working'; a.wanderTimer = 60 + Math.random() * 120;
              this.emitAgentStates();
            } else this.stepToward(a, a.workX, a.workY);
          }
          break;
        case 'working':
          if (!a.reportedTask && a.activeTask?.status === 'running' && a.activeTask.progress >= 95 && a.findings && !this.scrollOpen) {
            a.reportedTask = a.activeTask;
            this.scrollOpen = true; this.scrollAgentName = a.name;
            EventBus.emit(Events.OPEN_SCROLL_REPORT, { agentName: a.name, findings: a.findings });
          }
          a.wanderTimer--;
          if (a.wanderTimer <= 0 && !a.moving) {
            const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]] as const;
            const d = dirs[Math.floor(Math.random() * 4)];
            const nx = a.mapX + d[0], ny = a.mapY + d[1];
            if (!isBlocked(this.tileMap, nx, ny) && Math.abs(nx - a.workX) + Math.abs(ny - a.workY) <= 2
              && !(nx === this.player.x && ny === this.player.y)) {
              a.targetX = nx; a.targetY = ny; a.moving = true; a.moveTimer = 0;
              a.dir = d[0] < 0 ? 'left' : d[0] > 0 ? 'right' : d[1] < 0 ? 'up' : 'down';
            }
            a.wanderTimer = 90 + Math.random() * 150;
          }
          break;
        case 'walking_to_egg':
          if (!a.moving) {
            if (a.mapX === a.eggX && a.mapY === a.eggY) {
              a.state = 'egg'; a.hatchTriggered = false;
              this.emitAgentStates();
            } else this.stepToward(a, a.eggX, a.eggY);
          }
          break;
      }

      // Movement interpolation
      if (a.moving) {
        const tx = a.targetX * TILE, ty = a.targetY * TILE;
        const dx = tx - a.px, dy = ty - a.py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1.5) {
          a.px = tx; a.py = ty; a.mapX = a.targetX; a.mapY = a.targetY;
          a.moving = false; a.frame = 0;
          if (a.state === 'working') a.wanderTimer = 90 + Math.random() * 150;
        } else {
          a.px += (dx / dist) * 1.5; a.py += (dy / dist) * 1.5;
          a.moveTimer++; a.frame = Math.floor(a.moveTimer / 10) % 2;
        }
      }
    }
  }

  private stepToward(a: GameAgent, goalX: number, goalY: number) {
    const dx = Math.sign(goalX - a.mapX), dy = Math.sign(goalY - a.mapY);
    let nx = a.mapX + dx, ny = a.mapY + dy;
    if (!isBlocked(this.tileMap, nx, ny)) {
      a.targetX = nx; a.targetY = ny; a.moving = true; a.moveTimer = 0;
      a.dir = dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down';
    } else if (dx && !isBlocked(this.tileMap, a.mapX + dx, a.mapY)) {
      a.targetX = a.mapX + dx; a.targetY = a.mapY; a.moving = true; a.moveTimer = 0;
      a.dir = dx < 0 ? 'left' : 'right';
    } else if (dy && !isBlocked(this.tileMap, a.mapX, a.mapY + dy)) {
      a.targetX = a.mapX; a.targetY = a.mapY + dy; a.moving = true; a.moveTimer = 0;
      a.dir = dy < 0 ? 'up' : 'down';
    }
  }

  private async fetchFindings(a: GameAgent) {
    try {
      const resp = await fetch('/api/agent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: a.name }),
      });
      if (!resp.ok) throw new Error('fail');
      const data = await resp.json();
      a.findings = { title: a.name + ' Report', findings: data.findings };
    } catch {
      a.findings = DEMO_FINDINGS[a.name] || { title: a.name + ' Report', findings: [{ label: 'Status', text: 'Working...' }] };
    }
  }

  // ——— CAMERA ———
  private updateCamera() {
    const w = this.scale.width, h = this.scale.height;
    const tx = this.player.px * SCALE - w / 2 + TS / 2;
    const ty = this.player.py * SCALE - h / 2 + TS / 2;
    this.cam.x += (tx - this.cam.x) * 0.1;
    this.cam.y += (ty - this.cam.y) * 0.1;
    this.cam.x = Math.max(0, Math.min(WORLD_W * SCALE - w, this.cam.x));
    this.cam.y = Math.max(0, Math.min(WORLD_H * SCALE - h, this.cam.y));
  }

  private updateZoneDetection() {
    const found = getZoneKeyAt(this.player.x, this.player.y);
    if (found && found !== this.lastZoneKey) {
      this.currentZoneName = ZONE_NAMES[found] || found;
      this.zoneNameTimer = 120; this.activePhase = found;
    }
    this.lastZoneKey = found;
    if (this.zoneNameTimer > 0) this.zoneNameTimer--;
  }

  // ——— INTERACTION ———
  private getAdjacentAgent(): number {
    for (let i = 0; i < this.agents.length; i++) {
      const a = this.agents[i];
      if (a.state !== 'working' && a.state !== 'egg' && a.state !== 'walking_to_egg') continue;
      const dx = Math.abs(a.mapX - this.player.x), dy = Math.abs(a.mapY - this.player.y);
      if (dx <= 1 && dy <= 1 && (dx + dy) <= 2) return i;
    }
    return -1;
  }

  private tryInteract() {
    const idx = this.getAdjacentAgent(); if (idx === -1) return;
    const a = this.agents[idx];
    if (a.state === 'egg') {
      this.openDialog(`A dormant egg... ${a.name} is resting.`, idx);
      return;
    }
    const taskStr = a.activeTask
      ? `I'm working on: "${a.activeTask.name}" (${a.activeTask.status}). ${a.activeTask.detail}`
      : `Idle. Skills: ${a.skills.map(s => '/' + s).join(', ')}`;
    this.openDialog(`${a.name}: ${taskStr}`, idx);
  }

  private openDialog(text: string, agentIndex: number) {
    this.dialog = { active: true, text, displayedChars: 0, charTimer: 0, agentIndex, phase: 'typing', selectedOption: 0 };
  }

  private handleDialogInput() {
    if (this.dialog.phase === 'typing') { this.dialog.displayedChars = this.dialog.text.length; this.dialog.phase = 'done'; }
    else if (this.dialog.phase === 'done') { this.dialog.phase = 'question'; this.dialog.selectedOption = 0; }
    else if (this.dialog.phase === 'question') {
      if (this.dialog.selectedOption === 0 && this.dialog.agentIndex >= 0) {
        const a = this.agents[this.dialog.agentIndex];
        EventBus.emit(Events.OPEN_DETAIL_PANEL, { agent: AGENTS[a.index], tasks: a.tasks, state: a.state });
      }
      this.closeDialog();
    }
  }

  private closeDialog() { this.dialog.active = false; }

  private handleScrollNext() {
    const a = this.agents.find(ag => ag.name === this.scrollAgentName);
    if (a) {
      a.tasks.forEach(t => { if (t.status === 'running') { t.status = 'done'; t.progress = 100; } });
      a.activeTask = a.tasks.find(t => t.status === 'thinking') || null;
      a.state = 'walking_to_egg'; a.targetX = a.eggX; a.targetY = a.eggY;
      a.moving = true; a.moveTimer = 0;
      this.emitAgentStates();
    }
    this.scrollOpen = false; this.scrollAgentName = '';
  }

  private handleScrollRetry() {
    const a = this.agents.find(ag => ag.name === this.scrollAgentName);
    if (a) {
      const t = a.tasks.find(t => t.status === 'done' && t.progress === 100) || a.tasks.find(t => t.status === 'running');
      if (t) { t.progress = 10; t.status = 'running'; a.activeTask = t; }
      a.reportedTask = null; a.findings = null; this.fetchFindings(a);
    }
    this.scrollOpen = false; this.scrollAgentName = '';
  }

  private emitAgentStates() {
    EventBus.emit(Events.AGENT_STATE_CHANGE, this.agents.map(a => ({
      name: a.name, state: a.state, color: a.colorHex, imageFile: a.imageFile,
    })));
  }

  // ═══════════════════════════════════════════
  // DRAWING — Pokemon Sapphire style top-down
  // ═══════════════════════════════════════════
  private draw() {
    const g = this.gfx;
    const w = this.scale.width, h = this.scale.height;
    g.clear();

    // Background
    g.fillStyle(0x0f172a); g.fillRect(0, 0, w, h);

    // Visible tile range
    const sc = Math.max(0, Math.floor(this.cam.x / TS));
    const ec = Math.min(COLS, Math.ceil((this.cam.x + w) / TS) + 1);
    const sr = Math.max(0, Math.floor(this.cam.y / TS));
    const er = Math.min(ROWS, Math.ceil((this.cam.y + h) / TS) + 1);

    // Draw tiles
    for (let y = sr; y < er; y++) {
      for (let x = sc; x < ec; x++) {
        this.drawTile(g, x, y);
      }
    }

    // Zone labels
    g.save();
    for (const [k, z] of Object.entries(ZONES)) {
      const sx = (z.x + z.w / 2) * TS - this.cam.x;
      const sy = z.y * TS - this.cam.y - 8;
      if (sx < -200 || sx > w + 200 || sy < -50 || sy > h + 50) continue;
      // Draw zone label using simple rectangles as background
      const color = k === this.activePhase ? z.color : Phaser.Display.Color.ValueToColor(z.color).darken(30).color;
      const name = ZONE_NAMES[k].toUpperCase();
      // Background bar
      g.fillStyle(0x0f172a, 0.7);
      g.fillRect(sx - 50, sy - 8, 100, 14);
      // We'll use Phaser text objects for zone labels instead
    }
    g.restore();

    // Depth-sorted characters
    const chars: Array<{ type: string; index: number; py: number; px: number }> = [];
    chars.push({ type: 'player', index: -1, py: this.player.py, px: this.player.px });
    for (const a of this.agents) {
      if (a.state === 'egg') chars.push({ type: 'egg', index: a.index, py: a.py, px: a.px });
      else if (a.state === 'hatching') chars.push({ type: a.hatchTimer < 40 ? 'egg' : 'egg-crack', index: a.index, py: a.py, px: a.px });
      else chars.push({ type: 'agent', index: a.index, py: a.py, px: a.px });
    }
    chars.sort((a, b) => a.py - b.py);

    for (const c of chars) {
      const sx = c.px * SCALE - this.cam.x;
      const sy = c.py * SCALE - this.cam.y;
      if (sx < -TS || sy < -TS || sx > w + TS || sy > h + TS) continue;

      if (c.type === 'player') {
        // Draw CEO using loaded image
        const ceoTex = this.textures.exists('agent-ceo') ? 'agent-ceo' : null;
        if (ceoTex) {
          // Use existing image objects managed outside graphics
        } else {
          // Fallback: colored rectangle
          g.fillStyle(0xe53e3e); g.fillRect(sx + 6, sy + 2, TS - 12, TS / 3);
          g.fillStyle(0xffd5b0); g.fillRect(sx + 10, sy + TS / 3, TS - 20, TS / 3);
          g.fillStyle(0x3182ce); g.fillRect(sx + 8, sy + TS * 2 / 3, TS - 16, TS / 3);
        }
      } else if (c.type === 'egg') {
        // Draw egg
        g.fillStyle(0xf5f0e0);
        g.fillEllipse(sx + TS / 2, sy + TS / 2 + Math.sin(this.gameTime * 0.03 + c.index) * 2, TS * 0.5, TS * 0.65);
        g.fillStyle(0x6bcb77);
        g.fillCircle(sx + TS / 2 - 5, sy + TS / 2 - 4, 3);
        g.fillCircle(sx + TS / 2 + 6, sy + TS / 2 + 2, 2);
      } else if (c.type === 'egg-crack') {
        const shake = Math.sin(this.gameTime * 0.5) * 2;
        g.fillStyle(0xf5f0e0);
        g.fillEllipse(sx + TS / 2 + shake, sy + TS / 2 + 4, TS * 0.5, TS * 0.4);
        // Top crack pieces
        g.fillRect(sx + TS / 2 - 8 + shake, sy + 6, 6, 8);
        g.fillRect(sx + TS / 2 + 2 + shake, sy + 4, 6, 8);
      }
      // Agent sprites are drawn separately as Phaser Images below
    }

    // Thought bubbles for working agents
    this.drawThoughtBubbles(g, w, h);

    // Interaction prompt
    if (!this.dialog.active) {
      const idx = this.getAdjacentAgent();
      if (idx >= 0) {
        const a = this.agents[idx];
        const sx = a.px * SCALE - this.cam.x + TS / 2;
        const sy = a.py * SCALE - this.cam.y - (a.state === 'working' ? 40 : 16);
        const pulse = 0.7 + Math.sin(this.gameTime * 0.08) * 0.3;
        g.fillStyle(0x000000, 0.8 * pulse);
        g.fillRoundedRect(sx - 31, sy - 12, 62, 22, 4);
        // Text drawn below
      }
    }

    // Minimap
    this.drawMinimap(g, w, h);

    // Zone popup
    if (this.zoneNameTimer > 0) {
      const alpha = Math.min(1, this.zoneNameTimer / 30);
      g.fillStyle(0x0a0f1e, 0.85 * alpha);
      g.fillRoundedRect(w / 2 - 80, 38, 160, 34, 6);
    }

    // Dialog box
    if (this.dialog.active) {
      this.drawDialog(g, w, h);
    }
  }

  private drawTile(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    const sx = x * TS - this.cam.x;
    const sy = y * TS - this.cam.y;
    const t = this.tileMap[y][x];

    switch (t) {
      case TILE_GRASS:
        g.fillStyle((x + y) % 2 === 0 ? GRASS1 : GRASS2);
        g.fillRect(sx, sy, TS, TS);
        break;
      case TILE_PATH:
        g.fillStyle((x + y) % 2 === 0 ? PATH1 : PATH2);
        g.fillRect(sx, sy, TS, TS);
        break;
      case TILE_WATER: {
        const w = Math.sin(this.gameTime * 0.03 + x * 0.5 + y * 0.3) * 0.5 + 0.5;
        g.fillStyle(w > 0.5 ? WATER1 : WATER2);
        g.fillRect(sx, sy, TS, TS);
        if (Math.sin(this.gameTime * 0.05 + x * 2 + y * 3) > 0.9) {
          g.fillStyle(0xffffff, 0.4);
          g.fillRect(sx + TS / 3, sy + TS / 4, TS / 5, TS / 5);
        }
        break;
      }
      case TILE_ZONE_FLOOR: {
        const z = this.getZoneAt(x, y);
        if (z) {
          g.fillStyle(z.color, z === ZONES[this.activePhase] ? 0.12 : 0.06);
          g.fillRect(sx, sy, TS, TS);
        } else {
          g.fillStyle((x + y) % 2 === 0 ? GRASS1 : GRASS2);
          g.fillRect(sx, sy, TS, TS);
        }
        break;
      }
      case TILE_ZONE_BORDER: {
        const z = this.getZoneAt(x, y);
        if (z) {
          const isActive = z === ZONES[this.activePhase];
          g.fillStyle(z.color, isActive ? 0.25 : 0.12);
          g.fillRect(sx, sy, TS, TS);
          g.fillStyle(z.color, isActive ? 0.4 : 0.2);
          g.fillRect(sx + 2, sy + 2, TS - 4, TS - 4);
        }
        break;
      }
      case TILE_FLOWER: {
        g.fillStyle((x + y) % 2 === 0 ? GRASS1 : GRASS2);
        g.fillRect(sx, sy, TS, TS);
        const fc = FLOWER_COLORS[(x * 7 + y * 13) % FLOWER_COLORS.length];
        const bob = Math.sin(this.gameTime * 0.02 + x + y) * 2;
        g.fillStyle(fc);
        g.fillCircle(sx + TS / 2, sy + TS / 3 + bob + 4, 5);
        g.fillStyle(0x4a7c3f);
        g.fillRect(sx + TS / 2 - 1, sy + TS / 3 + 9 + bob, 3, 10);
        break;
      }
      case TILE_TREE: {
        g.fillStyle((x + y) % 2 === 0 ? GRASS1 : GRASS2);
        g.fillRect(sx, sy, TS, TS);
        // Trunk
        g.fillStyle(0x5a3a1e);
        g.fillRect(sx + TS / 2 - 3, sy + TS / 2, 6, TS / 2);
        // Canopy
        g.fillStyle(0x2d6a1e);
        g.fillRect(sx + 4, sy + 4, TS - 8, TS / 2 - 2);
        g.fillStyle(0x3a8c2a);
        g.fillRect(sx + 8, sy, TS - 16, TS / 3);
        break;
      }
      case TILE_LAB_FLOOR:
        g.fillStyle((x + y) % 2 === 0 ? LAB_FL : LAB_FL2);
        g.fillRect(sx, sy, TS, TS);
        g.lineStyle(1, 0x607080, 0.25);
        g.strokeRect(sx, sy, TS, TS);
        break;
      case TILE_LAB_EQUIP: {
        g.fillStyle(LAB_EQ);
        g.fillRect(sx, sy, TS, TS);
        g.fillStyle(0x60d0a0);
        const bubY = Math.sin(this.gameTime * 0.06 + x) * 3;
        g.fillRect(sx + TS / 2 - 3, sy + TS / 3 + bubY, 6, 8);
        g.fillStyle(0x40b080);
        g.fillRect(sx + TS / 2 - 1, sy + TS / 4 + bubY, 3, 4);
        break;
      }
      case TILE_STORE_FLOOR:
        g.fillStyle((x + y) % 2 === 0 ? STORE_FL : STORE_FL2);
        g.fillRect(sx, sy, TS, TS);
        break;
      case TILE_STORE_SHELF:
        g.fillStyle(STORE_SH);
        g.fillRect(sx, sy, TS, TS);
        g.fillStyle(0x8b5a3e);
        g.fillRect(sx + 3, sy + 4, TS - 6, TS / 3);
        g.fillRect(sx + 3, sy + TS / 2 + 2, TS - 6, TS / 3);
        break;
      case TILE_DENSE_TREE:
        g.fillStyle(0x1a4a12);
        g.fillRect(sx, sy, TS, TS);
        g.fillStyle(0x2d5a1e);
        g.fillRect(sx + 4, sy + 4, TS - 8, TS - 8);
        break;
    }
  }

  private getZoneAt(tx: number, ty: number) {
    for (const z of Object.values(ZONES)) {
      if (tx >= z.x && tx < z.x + z.w && ty >= z.y && ty < z.y + z.h) return z;
    }
    return null;
  }

  private drawThoughtBubbles(g: Phaser.GameObjects.Graphics, w: number, h: number) {
    for (const a of this.agents) {
      if (a.state !== 'working' || !a.activeTask) continue;
      const sx = a.px * SCALE - this.cam.x + TS / 2;
      const sy = a.py * SCALE - this.cam.y - 8;
      if (sx < -100 || sx > w + 100 || sy < -50 || sy > h + 50) continue;

      const isThinking = a.activeTask.status === 'thinking';
      const bc = isThinking ? 0x8b5cf6 : 0xfbbf24;
      const floatY = Math.sin(this.gameTime * 0.04 + a.index * 2) * 3;

      // Dots
      g.fillStyle(bc, 0.4);
      g.fillCircle(sx - 2, sy + floatY + 4, 2);
      g.fillCircle(sx - 6, sy + floatY - 2, 3);

      // Bubble background
      const bw = 120, bh = 20, bx = sx - bw / 2, by = sy - bh - 6 + floatY;
      g.fillStyle(0x0a0f1e, 0.88);
      g.fillRoundedRect(bx, by, bw, bh, 4);
      g.lineStyle(1, bc, 0.4);
      g.strokeRoundedRect(bx, by, bw, bh, 4);
    }
  }

  private drawMinimap(g: Phaser.GameObjects.Graphics, w: number, h: number) {
    const mmW = 130, mmH = 90;
    const mmX = w - mmW - 12, mmY = 12;
    const sx = mmW / COLS, sy = mmH / ROWS;

    g.fillStyle(0x0a0f1e, 0.88);
    g.fillRoundedRect(mmX - 4, mmY - 4, mmW + 8, mmH + 8, 6);

    for (const [k, z] of Object.entries(ZONES)) {
      g.fillStyle(z.color, k === this.activePhase ? 0.3 : 0.15);
      g.fillRect(mmX + z.x * sx, mmY + z.y * sy, z.w * sx, z.h * sy);
    }

    for (const a of this.agents) {
      g.fillStyle(a.state === 'egg' ? 0xf5f0e0 : a.color, 1);
      g.fillRect(mmX + a.mapX * sx - 1, mmY + a.mapY * sy - 1, 3, 3);
    }

    g.fillStyle(0xfbbf24, 1);
    g.fillRect(mmX + this.player.x * sx - 2, mmY + this.player.y * sy - 2, 4, 4);
  }

  private drawDialog(g: Phaser.GameObjects.Graphics, w: number, h: number) {
    const boxH = 130, boxY = h - boxH - 16, boxX = 30, boxW = w - 60;

    // Box background
    g.fillStyle(0x0a0f1e, 0.94);
    g.fillRoundedRect(boxX, boxY, boxW, boxH, 8);

    // Border
    const a = this.dialog.agentIndex >= 0 ? this.agents[this.dialog.agentIndex] : null;
    const borderColor = a ? a.color : 0x60a5fa;
    g.lineStyle(2, borderColor, 0.5);
    g.strokeRoundedRect(boxX, boxY, boxW, boxH, 8);

    // Portrait area
    if (a) {
      g.fillStyle(0x0f172a);
      g.fillRect(boxX + 14, boxY + (boxH - 56) / 2, 56, 56);
      g.lineStyle(1, a.color, 0.5);
      g.strokeRect(boxX + 14, boxY + (boxH - 56) / 2, 56, 56);

      if (a.state === 'egg') {
        g.fillStyle(0xf5f0e0);
        g.fillEllipse(boxX + 42, boxY + boxH / 2, 24, 30);
        g.fillStyle(0x6bcb77);
        g.fillCircle(boxX + 38, boxY + boxH / 2 - 5, 4);
      }
    }

    // Typing animation
    if (this.dialog.phase === 'typing') {
      this.dialog.charTimer++;
      if (this.dialog.charTimer >= 1) {
        this.dialog.charTimer = 0;
        this.dialog.displayedChars = Math.min(this.dialog.displayedChars + 1, this.dialog.text.length);
        if (this.dialog.displayedChars >= this.dialog.text.length) this.dialog.phase = 'done';
      }
    }
  }
}
