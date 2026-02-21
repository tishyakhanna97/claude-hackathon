'use client';

import { useEffect, useState } from 'react';
import { EventBus, Events } from '../game/EventBus';
import type { AgentDef, AgentTask } from '../game/data/agents';
import { ZONE_NAMES } from '../game/data/agents';

interface PanelData {
  agent: AgentDef;
  tasks: AgentTask[];
  state: string;
}

export default function DetailPanel() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<PanelData | null>(null);

  useEffect(() => {
    const onOpen = (d: PanelData) => { setData(d); setOpen(true); };
    const onClose = () => setOpen(false);
    EventBus.on(Events.OPEN_DETAIL_PANEL, onOpen);
    EventBus.on(Events.CLOSE_DETAIL_PANEL, onClose);
    return () => {
      EventBus.off(Events.OPEN_DETAIL_PANEL, onOpen);
      EventBus.off(Events.CLOSE_DETAIL_PANEL, onClose);
    };
  }, []);

  if (!data) return null;
  const { agent, tasks, state } = data;
  const statusIcons: Record<string, string> = { running: '⟳', thinking: '◆', done: '✓' };
  const statusColors: Record<string, string> = { running: '#fbbf24', thinking: '#8b5cf6', done: '#22c55e' };

  return (
    <>
      <div className={`detail-scrim${open ? ' open' : ''}`} onClick={() => setOpen(false)} />
      <div className={`detail-panel${open ? ' open' : ''}`}>
        <div className="dp-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="dp-badge" style={{
              background: agent.colorHex + '25',
              color: agent.colorHex,
            }}>{agent.model.toUpperCase()}</span>
            <h2>{agent.name}</h2>
          </div>
          <button className="dp-close" onClick={() => setOpen(false)}>&times;</button>
        </div>
        <div className="dp-body">
          <div className="dp-section">
            <div className="dp-section-title">Agent Info</div>
            <div className="dp-info-row"><span className="dp-info-label">Role</span><span className="dp-info-value">{agent.desc}</span></div>
            <div className="dp-info-row"><span className="dp-info-label">Zone</span><span className="dp-info-value">{ZONE_NAMES[agent.zone]}</span></div>
            <div className="dp-info-row"><span className="dp-info-label">State</span><span className="dp-info-value">{state}</span></div>
            <div style={{ marginTop: 6 }}>
              {agent.skills.map(s => <span key={s} className="dp-tag dp-tag-skill">/{s}</span>)}
              {agent.mcps.map(m => <span key={m} className="dp-tag dp-tag-mcp">{m}</span>)}
            </div>
          </div>
          <div className="dp-section">
            <div className="dp-section-title">Tasks</div>
            {tasks.map((t, i) => (
              <div key={i} className={`task-item ${t.status}`}>
                <div className={`task-status ${t.status}`}>{statusIcons[t.status] || '○'} {t.status}</div>
                <div className="task-name">{t.name}</div>
                <div className="task-detail">{t.detail}</div>
                {t.status !== 'done' && (
                  <div className="task-progress">
                    <div className="task-progress-bar" style={{
                      width: `${t.progress}%`,
                      background: statusColors[t.status],
                    }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
