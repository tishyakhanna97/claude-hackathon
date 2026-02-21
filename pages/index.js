import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const gameRef = useRef(null);
  const [output, setOutput] = useState('');

  useEffect(() => {
    // Phaser must run client-side only
    let game;
    import('phaser').then(({ default: Phaser }) => {
      class MainScene extends Phaser.Scene {
        constructor() { super('MainScene'); }

        create() {
          const cx = this.scale.width / 2;
          const cy = this.scale.height / 2;

          const bg = this.add.graphics();
          bg.fillGradientStyle(0x0f3460, 0x0f3460, 0x16213e, 0x16213e, 1);
          bg.fillRect(0, 0, this.scale.width, this.scale.height);

          this.shape = this.add.triangle(cx, cy, 0, 40, -35, -20, 35, -20, 0xe94560);
          this.shape.setStrokeStyle(2, 0xff6b8a);

          this.add.text(cx, 20, 'claude hackathon', {
            fontSize: '16px', color: '#aaaaaa', fontFamily: 'monospace',
          }).setOrigin(0.5, 0);
        }

        update() { this.shape.angle += 1.2; }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 480,
        height: 270,
        backgroundColor: '#16213e',
        parent: gameRef.current,
        scene: MainScene,
      });
    });

    return () => game?.destroy(true);
  }, []);

  async function askClaude() {
    setOutput('asking claude...');
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Say hello in one sentence.' }),
    });
    const data = await res.json();
    setOutput(data.reply ?? data.error);
  }

  async function pingRedis() {
    setOutput('pinging redis...');
    const res = await fetch('/api/redis');
    const data = await res.json();
    setOutput(JSON.stringify(data));
  }

  return (
    <main style={styles.main}>
      <div ref={gameRef} />
      <div style={styles.ui}>
        <button style={styles.btn} onClick={askClaude}>Ask Claude</button>
        <button style={styles.btn} onClick={pingRedis}>Ping Redis</button>
      </div>
      <p style={styles.output}>{output}</p>
    </main>
  );
}

const styles = {
  main: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '100vh',
    background: '#1a1a2e', fontFamily: 'monospace', color: '#eee',
  },
  ui: { marginTop: 16, display: 'flex', gap: 8 },
  btn: {
    padding: '8px 16px', background: '#e94560', border: 'none',
    color: '#fff', cursor: 'pointer', fontFamily: 'monospace',
    fontSize: 14, borderRadius: 4,
  },
  output: { marginTop: 12, maxWidth: 480, fontSize: 13, color: '#aaa', textAlign: 'center', minHeight: 20 },
};
