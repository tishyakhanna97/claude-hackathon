'use client';

import dynamic from 'next/dynamic';
import DetailPanel from '@/components/DetailPanel';
import AgentRoster from '@/components/AgentRoster';
import ScrollReport from '@/components/ScrollReport';

// Dynamically import GameCanvas to prevent SSR (Phaser needs window)
const GameCanvas = dynamic(() => import('@/components/GameCanvas'), { ssr: false });

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <GameCanvas />
      <AgentRoster />
      <DetailPanel />
      <ScrollReport />
      {/* Controls hint */}
      <div style={{
        position: 'fixed', bottom: 10, left: 10, zIndex: 50,
        background: 'rgba(10,15,30,0.75)', borderRadius: 4, padding: '4px 12px',
        fontFamily: 'monospace', fontSize: 10, color: '#475569',
      }}>
        WASD/Arrows: Move &nbsp;|&nbsp; SPACE: Talk &nbsp;|&nbsp; ESC: Close
      </div>
    </main>
  );
}
