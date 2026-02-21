// Simple event emitter — no Phaser dependency so it works server-side
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (...args: any[]) => void;

class SimpleEventEmitter {
  private listeners: Map<string, Set<Listener>> = new Map();
  private contextMap: Map<Listener, Listener> = new Map();

  on(event: string, fn: Listener, context?: unknown) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    const bound = context ? fn.bind(context) : fn;
    this.contextMap.set(fn, bound);
    this.listeners.get(event)!.add(bound);
  }

  off(event: string, fn: Listener) {
    const bound = this.contextMap.get(fn) || fn;
    this.listeners.get(event)?.delete(bound);
    this.listeners.get(event)?.delete(fn);
    this.contextMap.delete(fn);
  }

  emit(event: string, ...args: unknown[]) {
    this.listeners.get(event)?.forEach(fn => fn(...args));
  }
}

export const EventBus = new SimpleEventEmitter();

export const Events = {
  OPEN_DETAIL_PANEL: 'open-detail-panel',
  CLOSE_DETAIL_PANEL: 'close-detail-panel',
  OPEN_SCROLL_REPORT: 'open-scroll-report',
  CLOSE_SCROLL_REPORT: 'close-scroll-report',
  SCROLL_NEXT: 'scroll-next',
  SCROLL_RETRY: 'scroll-retry',
  AGENT_STATE_CHANGE: 'agent-state-change',
  FOCUS_AGENT: 'focus-agent',
  GAME_READY: 'game-ready',
} as const;
