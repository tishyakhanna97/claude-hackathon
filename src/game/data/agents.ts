export interface AgentTask {
  name: string;
  status: 'running' | 'thinking' | 'done';
  detail: string;
  progress: number;
}

export interface AgentDef {
  name: string;
  model: string;
  skills: string[];
  mcps: string[];
  desc: string;
  zone: string;
  color: number;
  colorHex: string;
  darkColorHex: string;
  workRole: string;
  imageFile: string;
}

export interface Finding {
  label: string;
  text: string;
}

export interface AgentFindings {
  title: string;
  findings: Finding[];
}

export const AGENT_TASKS: Record<string, AgentTask[]> = {
  BizOps: [
    { name: 'Analyzing competitor pricing', status: 'running', detail: '/discover — scanning 5 competitors', progress: 40 },
    { name: 'TAM/SAM/SOM estimation', status: 'thinking', detail: '/discover — modeling market size', progress: 20 },
    { name: 'Go-to-market draft v1', status: 'done', detail: '/discover — launch strategy complete', progress: 100 },
  ],
  Researcher: [
    { name: 'Scraping competitor features', status: 'running', detail: '/discover — Context7 deep dive', progress: 55 },
    { name: 'User sentiment analysis', status: 'thinking', detail: '/discover — processing reviews', progress: 25 },
    { name: 'Trend report: AI tooling 2026', status: 'done', detail: '/discover — 12 key findings', progress: 100 },
  ],
  Designer: [
    { name: 'Wireframing onboarding flow', status: 'running', detail: '/design — 3 of 5 screens done', progress: 60 },
    { name: 'Color contrast audit (WCAG)', status: 'thinking', detail: '/design — checking AA compliance', progress: 45 },
    { name: 'Component library audit', status: 'done', detail: '/design — catalogued 24 components', progress: 100 },
  ],
  Engineer: [
    { name: 'Building auth module', status: 'running', detail: '/build — JWT implementation', progress: 65 },
    { name: 'Planning API structure', status: 'thinking', detail: '/build — REST vs GraphQL', progress: 30 },
    { name: 'Updated error handlers', status: 'done', detail: '/build — added 4 error types', progress: 100 },
  ],
};

export const AGENTS: AgentDef[] = [
  { name: 'BizOps', model: 'opus', skills: ['discover'], mcps: [], desc: 'Market analysis & strategy',
    zone: 'discover', color: 0x22c55e, colorHex: '#22c55e', darkColorHex: '#14532d', workRole: 'store', imageFile: 'biz_op.png' },
  { name: 'Researcher', model: 'sonnet', skills: ['discover'], mcps: ['Context7'], desc: 'Competitive analysis & trends',
    zone: 'discover', color: 0x8b5cf6, colorHex: '#8b5cf6', darkColorHex: '#3b0764', workRole: 'lab', imageFile: 'researcher.png' },
  { name: 'Designer', model: 'opus', skills: ['design'], mcps: ['Chrome DevTools'], desc: 'UI/UX & wireframes',
    zone: 'design', color: 0xec4899, colorHex: '#ec4899', darkColorHex: '#831843', workRole: 'studio', imageFile: 'designer.png' },
  { name: 'Engineer', model: 'opus', skills: ['build'], mcps: ['GitHub'], desc: 'Architecture & implementation',
    zone: 'build', color: 0x3b82f6, colorHex: '#3b82f6', darkColorHex: '#1e3a5f', workRole: 'desk', imageFile: 'engineer.png' },
];

export const ZONE_NAMES: Record<string, string> = {
  discover: 'Discovery Zone',
  design: 'Design Zone',
  build: 'Build Zone',
};

export const DEMO_FINDINGS: Record<string, AgentFindings> = {
  BizOps: {
    title: 'Market Analysis Report',
    findings: [
      { label: 'Competitor Pricing', text: '3 of 5 competitors charge $15-25/mo. One outlier at $49/mo bundles premium support.' },
      { label: 'TAM Estimate', text: 'Total addressable market ~$2.4B for AI dev tools. SAM for solo/indie devs: ~$180M.' },
      { label: 'Go-to-Market', text: 'Recommend freemium with $12/mo pro tier. Launch on Product Hunt + HN.' },
      { label: 'Key Risk', text: 'Crowded market — differentiation through UX and agent orchestration is the moat.' },
    ],
  },
  Researcher: {
    title: 'Competitive Intelligence Brief',
    findings: [
      { label: 'Feature Gap', text: 'No competitor offers visual agent orchestration. Most use chat-only with no transparency.' },
      { label: 'User Sentiment', text: "Reddit/HN: 72% positive on AI coding tools, #1 complaint is 'black box' — users want to see what the AI is doing." },
      { label: 'Trend', text: 'Agent-based architectures growing 3x YoY. Multi-agent frameworks gaining traction but lack polish.' },
      { label: 'Opportunity', text: "'Game-ified AI dashboard' is a completely unoccupied niche." },
    ],
  },
};

// Map layout constants
export const COLS = 48;
export const ROWS = 34;

export const ZONES: Record<string, { x: number; y: number; w: number; h: number; color: number; colorHex: string; darkColorHex: string }> = {
  discover: { x: 2, y: 2, w: 22, h: 18, color: 0x22c55e, colorHex: '#22c55e', darkColorHex: '#166534' },
  design: { x: 28, y: 2, w: 14, h: 12, color: 0xec4899, colorHex: '#ec4899', darkColorHex: '#9d174d' },
  build: { x: 28, y: 18, w: 14, h: 12, color: 0x3b82f6, colorHex: '#3b82f6', darkColorHex: '#1e40af' },
};

export const WORKSTATIONS = {
  store: { x: 5, y: 5, w: 5, h: 4 },
  lab: { x: 16, y: 13, w: 5, h: 4 },
};

export const EGG_POS: Record<string, { x: number; y: number }> = {
  BizOps: { x: 10, y: 7 },
  Researcher: { x: 10, y: 13 },
  Designer: { x: 33, y: 7 },
  Engineer: { x: 33, y: 23 },
};

export const WORK_POS: Record<string, { x: number; y: number }> = {
  BizOps: { x: 7, y: 7 },
  Researcher: { x: 18, y: 15 },
  Designer: { x: 34, y: 7 },
  Engineer: { x: 34, y: 23 },
};

// Tile type constants
export const TILE_GRASS = 0;
export const TILE_PATH = 1;
export const TILE_WATER = 2;
export const TILE_ZONE_FLOOR = 3;
export const TILE_ZONE_BORDER = 4;
export const TILE_FLOWER = 5;
export const TILE_TREE = 6;
export const TILE_LAB_FLOOR = 7;
export const TILE_LAB_EQUIP = 8;
export const TILE_STORE_FLOOR = 9;
export const TILE_STORE_SHELF = 10;
export const TILE_DENSE_TREE = 11;

// Build the tilemap
export function buildTileMap(): number[][] {
  const map: number[][] = [];
  for (let y = 0; y < ROWS; y++) {
    map[y] = [];
    for (let x = 0; x < COLS; x++) map[y][x] = TILE_GRASS;
  }

  // Place zone borders & floors
  for (const z of Object.values(ZONES)) {
    for (let dy = 0; dy < z.h; dy++) {
      for (let dx = 0; dx < z.w; dx++) {
        const tx = z.x + dx, ty = z.y + dy;
        if (ty < ROWS && tx < COLS) {
          map[ty][tx] = (dx === 0 || dx === z.w - 1 || dy === 0 || dy === z.h - 1) ? TILE_ZONE_BORDER : TILE_ZONE_FLOOR;
        }
      }
    }
  }

  // Pond
  const pondX = 17, pondY = 5;
  for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 4; dx++) {
    const px = pondX + dx, py = pondY + dy;
    if (map[py]?.[px] === TILE_ZONE_FLOOR) map[py][px] = TILE_WATER;
  }

  // Store area
  const st = WORKSTATIONS.store;
  for (let dy = 0; dy < st.h; dy++) for (let dx = 0; dx < st.w; dx++) {
    const tx = st.x + dx, ty = st.y + dy;
    if (map[ty]?.[tx] === TILE_ZONE_FLOOR) {
      map[ty][tx] = (dy === 0 || (dx === 0 && dy < st.h - 1)) ? TILE_STORE_SHELF : TILE_STORE_FLOOR;
    }
  }

  // Lab area
  const lb = WORKSTATIONS.lab;
  for (let dy = 0; dy < lb.h; dy++) for (let dx = 0; dx < lb.w; dx++) {
    const tx = lb.x + dx, ty = lb.y + dy;
    if (map[ty]?.[tx] === TILE_ZONE_FLOOR) {
      map[ty][tx] = (dy === 0 || (dx === lb.w - 1 && dy < lb.h - 1)) ? TILE_LAB_EQUIP : TILE_LAB_FLOOR;
    }
  }

  // Paths through discover zone
  const discPath: { x: number; y: number }[] = [
    ...Array.from({ length: 4 }, (_, i) => ({ x: 23 + i, y: 10 })),
    ...Array.from({ length: 4 }, (_, i) => ({ x: 23 + i, y: 11 })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 12, y: 3 + i })),
    ...Array.from({ length: 16 }, (_, i) => ({ x: 13, y: 3 + i })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 9 + i, y: 7 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 9 + i, y: 8 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 14 + i, y: 15 })),
    ...Array.from({ length: 3 }, (_, i) => ({ x: 14 + i, y: 16 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 4 + i, y: 10 })),
    ...Array.from({ length: 10 }, (_, i) => ({ x: 4 + i, y: 11 })),
  ];
  for (const p of discPath) {
    if (map[p.y]?.[p.x] === TILE_ZONE_FLOOR) map[p.y][p.x] = TILE_PATH;
  }

  // Paths connecting zones
  for (let x = ZONES.discover.x + ZONES.discover.w; x < ZONES.design.x; x++) { map[10][x] = TILE_PATH; map[11][x] = TILE_PATH; }
  for (let y = ZONES.design.y + ZONES.design.h; y < ZONES.build.y; y++) { map[y][34] = TILE_PATH; map[y][35] = TILE_PATH; }

  // Punch doorways
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 1; y < ROWS - 1; y++) for (let x = 1; x < COLS - 1; x++) {
      if (map[y][x] === TILE_ZONE_BORDER) {
        const n = [map[y - 1]?.[x], map[y + 1]?.[x], map[y][x - 1], map[y][x + 1]];
        if (n.includes(TILE_PATH) || (pass === 1 && n.includes(TILE_ZONE_FLOOR) && n.includes(TILE_PATH))) {
          map[y][x] = TILE_ZONE_FLOOR;
        }
      }
    }
  }

  // Seeded random for deterministic decoration
  let seed = 42;
  function seededRandom() { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; }

  // Trees in discover zone
  for (let y = ZONES.discover.y + 1; y < ZONES.discover.y + ZONES.discover.h - 1; y++)
    for (let x = ZONES.discover.x + 1; x < ZONES.discover.x + ZONES.discover.w - 1; x++)
      if (map[y][x] === TILE_ZONE_FLOOR && seededRandom() < 0.08) map[y][x] = TILE_TREE;

  // Dense border trees
  for (let x = 0; x < COLS; x++) { if (map[0][x] === TILE_GRASS) map[0][x] = TILE_DENSE_TREE; if (map[ROWS - 1][x] === TILE_GRASS) map[ROWS - 1][x] = TILE_DENSE_TREE; }
  for (let y = 0; y < ROWS; y++) { if (map[y][0] === TILE_GRASS) map[y][0] = TILE_DENSE_TREE; if (map[y][COLS - 1] === TILE_GRASS) map[y][COLS - 1] = TILE_DENSE_TREE; }

  // Flowers in discover zone
  for (let y = ZONES.discover.y + 1; y < ZONES.discover.y + ZONES.discover.h - 1; y++)
    for (let x = ZONES.discover.x + 1; x < ZONES.discover.x + ZONES.discover.w - 1; x++)
      if (map[y][x] === TILE_ZONE_FLOOR && seededRandom() < 0.06) map[y][x] = TILE_FLOWER;

  // Flowers on open grass
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++)
    if (map[y][x] === TILE_GRASS && seededRandom() < 0.03) map[y][x] = TILE_FLOWER;

  return map;
}

export function isBlocked(map: number[][], tx: number, ty: number): boolean {
  if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return true;
  const t = map[ty][tx];
  return t === TILE_WATER || t === TILE_TREE || t === TILE_LAB_EQUIP || t === TILE_STORE_SHELF || t === TILE_DENSE_TREE;
}

export function getZoneKeyAt(tx: number, ty: number): string {
  for (const [k, z] of Object.entries(ZONES)) {
    if (tx >= z.x && tx < z.x + z.w && ty >= z.y && ty < z.y + z.h) return k;
  }
  return '';
}
