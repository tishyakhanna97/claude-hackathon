'use client';

import { useEffect, useState } from 'react';
import { EventBus, Events } from '../game/EventBus';

interface AgentState {
  name: string;
  state: string;
  color: string;
  imageFile: string;
}

const STATE_LABELS: Record<string, string> = {
  egg: 'dormant',
  hatching: 'hatching...',
  walking_to_work: 'heading to work',
  working: 'working',
  walking_to_egg: 'returning',
};

const STATE_COLORS: Record<string, string> = {
  egg: '#64748b',
  hatching: '#fbbf24',
  walking_to_work: '#fbbf24',
  working: '#22c55e',
  walking_to_egg: '#f59e0b',
};

export default function AgentRoster() {
  const [agents, setAgents] = useState<AgentState[]>([]);

  useEffect(() => {
    const onUpdate = (states: AgentState[]) => setAgents(states);
    EventBus.on(Events.AGENT_STATE_CHANGE, onUpdate);
    return () => { EventBus.off(Events.AGENT_STATE_CHANGE, onUpdate); };
  }, []);

  if (agents.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: 12, left: 12, zIndex: 50,
      background: 'rgba(10,15,30,0.88)',
      borderRadius: 6, padding: '8px 6px', minWidth: 170,
      fontFamily: 'monospace',
    }}>
      <div style={{ fontSize: 8, color: '#475569', letterSpacing: 1, padding: '0 8px 6px', textTransform: 'uppercase' }}>
        TEAM
      </div>
      {agents.map(a => (
        <div
          key={a.name}
          onClick={() => EventBus.emit(Events.FOCUS_AGENT, a.name)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 8px', cursor: 'pointer',
            background: a.color + '18', borderRadius: 4, marginBottom: 2,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/agent-images/${a.imageFile}`} alt={a.name} width={18} height={18} style={{ imageRendering: 'pixelated' }} />
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: STATE_COLORS[a.state] || '#64748b',
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 10, color: '#cbd5e1' }}>{a.name}</div>
            <div style={{ fontSize: 7, color: '#475569' }}>{STATE_LABELS[a.state] || a.state}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
