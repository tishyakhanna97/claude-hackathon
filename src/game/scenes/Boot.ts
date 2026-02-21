import * as Phaser from 'phaser';

// GBA-style tile size: 16px tiles scaled 3x
export const TILE = 16;
export const SCALE = 3;
export const TS = TILE * SCALE; // 48px rendered

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('agent-bizops', 'agent-images/biz_op.png');
    this.load.image('agent-researcher', 'agent-images/researcher.png');
    this.load.image('agent-designer', 'agent-images/designer.png');
    this.load.image('agent-engineer', 'agent-images/engineer.png');
    this.load.image('agent-ceo', 'agent-images/ceo.png');
  }

  create() {
    // Generate simple pixel textures using Graphics
    const g = this.add.graphics();

    // Egg sprite
    g.clear();
    g.fillStyle(0xf5f0e0);
    g.fillEllipse(8, 8, 12, 14);
    g.fillStyle(0x6bcb77);
    g.fillCircle(6, 6, 2);
    g.fillCircle(10, 10, 1.5);
    g.generateTexture('sprite-egg', 16, 16);

    // Cracked egg
    g.clear();
    g.fillStyle(0xf5f0e0);
    g.fillEllipse(8, 10, 12, 10);
    g.fillStyle(0xf5f0e0);
    g.fillRect(5, 4, 6, 3);
    g.generateTexture('sprite-egg-cracked', 16, 16);

    g.destroy();
    this.scene.start('WorldScene');
  }
}
