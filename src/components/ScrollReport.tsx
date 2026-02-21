'use client';

import { useEffect, useState, useRef } from 'react';
import { EventBus, Events } from '../game/EventBus';
import type { AgentFindings } from '../game/data/agents';

interface ScrollData {
  agentName: string;
  findings: AgentFindings;
}

export default function ScrollReport() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ScrollData | null>(null);
  const [showRetryInput, setShowRetryInput] = useState(false);
  const retryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = (d: ScrollData) => { setData(d); setOpen(true); setShowRetryInput(false); };
    const onClose = () => { setOpen(false); setShowRetryInput(false); };
    EventBus.on(Events.OPEN_SCROLL_REPORT, onOpen);
    EventBus.on(Events.CLOSE_SCROLL_REPORT, onClose);
    return () => {
      EventBus.off(Events.OPEN_SCROLL_REPORT, onOpen);
      EventBus.off(Events.CLOSE_SCROLL_REPORT, onClose);
    };
  }, []);

  const handleNext = () => {
    EventBus.emit(Events.SCROLL_NEXT);
    setOpen(false);
  };

  const handleRetry = () => {
    if (!showRetryInput) {
      setShowRetryInput(true);
      setTimeout(() => retryRef.current?.focus(), 50);
      return;
    }
    EventBus.emit(Events.SCROLL_RETRY);
    setOpen(false);
  };

  const handleScrimClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      EventBus.emit(Events.CLOSE_SCROLL_REPORT);
      setOpen(false);
    }
  };

  if (!data) return null;

  return (
    <div className={`scroll-scrim${open ? ' open' : ''}`} onClick={handleScrimClick}>
      <div className="scroll-wrap">
        <div className="scroll-spindle" />
        <div className="scroll-body">
          <div className="scroll-from">Report from {data.agentName}</div>
          <div className="scroll-title">{data.findings.title}</div>
          {data.findings.findings.map((f, i) => (
            <div key={i} className="scroll-finding">
              <b>{f.label}:</b> {f.text}
            </div>
          ))}
        </div>
        <div className="scroll-actions">
          <button className="scroll-btn scroll-btn-next" onClick={handleNext}>NEXT</button>
          <button className="scroll-btn scroll-btn-retry" onClick={handleRetry}>RETRY</button>
          {showRetryInput && (
            <input
              ref={retryRef}
              className="scroll-retry-input show"
              placeholder="Tell the agent what to redo..."
              onKeyDown={e => { if (e.key === 'Enter') handleRetry(); }}
              style={{ display: 'block' }}
            />
          )}
        </div>
        <div className="scroll-spindle" />
      </div>
    </div>
  );
}
