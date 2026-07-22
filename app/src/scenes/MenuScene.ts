/** Scena Main Menu — ecranul principal al jocului. */

import * as PIXI from 'pixi.js';
import { CONFIG, COLORS } from '../engine/config';
import { Scene } from '../engine/StateMachine';
import { GameEngine } from '../engine/GameEngine';
import { IGNIS } from '../data/characters';

const TEXT_STYLE = {
  brand: { fontFamily: 'monospace', fontSize: 13, fill: COLORS.GOLD, letterSpacing: 4, fontWeight: '400' as const },
  title: { fontFamily: 'Georgia, serif', fontSize: 52, fill: COLORS.GOLD, fontWeight: '900' as const, letterSpacing: 2 },
  subtitle: { fontFamily: 'monospace', fontSize: 16, fill: COLORS.ACCENT_BLUE, letterSpacing: 3 },
  btnPrimary: { fontFamily: 'monospace', fontSize: 24, fill: '#ffffff', fontWeight: '600' as const },
  btnSecondary: { fontFamily: 'monospace', fontSize: 20, fill: COLORS.ACCENT_BLUE },
  keyHint: { fontFamily: 'monospace', fontSize: 13, fill: '#ffffff' },
  footer: { fontFamily: 'monospace', fontSize: 13, fill: COLORS.TEXT_MUTED },
  footerTag: { fontFamily: 'monospace', fontSize: 13, fill: COLORS.GOLD },
  rarity: { fontFamily: 'monospace', fontSize: 13, fill: COLORS.GOLD, letterSpacing: 3 },
  portraitText: { fontFamily: 'monospace', fontSize: 16, fill: '#1e1e2e', fontWeight: '600' as const },
  charName: { fontFamily: 'Georgia, serif', fontSize: 30, fill: '#fff3bf', fontWeight: '700' as const },
  charClass: { fontFamily: 'monospace', fontSize: 14, fill: COLORS.ACCENT_BLUE, letterSpacing: 2 },
  statLabel: { fontFamily: 'monospace', fontSize: 12, fill: '#ffffff', letterSpacing: 2 },
  statValue: { fontFamily: 'monospace', fontSize: 24, fontWeight: '600' as const },
  lore: { fontFamily: 'monospace', fontSize: 14, fill: COLORS.TEXT_MUTED, align: 'center' as const },
  slots: { fontFamily: 'monospace', fontSize: 13, fill: COLORS.GOLD, letterSpacing: 1 },
};

export class MenuScene implements Scene {
  readonly container = new PIXI.Container();
  private engine!: GameEngine;

  constructor(engine: GameEngine) {
    this.engine = engine;
    this.build();
  }

  private build(): void {
    this.buildBackground();
    this.buildLeftPanel();
    this.buildRightPanel();
  }

  // ---------------------------------------------------------------
  //  Fundal
  // ---------------------------------------------------------------

  private buildBackground(): void {
    const bg = new PIXI.Graphics();
    bg.rect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
    bg.fill({ color: CONFIG.BG_COLOR });
    this.container.addChild(bg);
  }

  // ---------------------------------------------------------------
  //  PANOU STÂNGA
  // ---------------------------------------------------------------

  private leftPanel!: PIXI.Container;

  private buildLeftPanel(): void {
    this.leftPanel = new PIXI.Container();
    this.leftPanel.x = 40;
    this.leftPanel.y = 40;

    const bg = new PIXI.Graphics();
    bg.roundRect(0, 0, 520, 720, 12);
    bg.fill({ color: COLORS.BG_PANEL });
    this.leftPanel.addChild(bg);

    this.buildBrand();
    this.buildButtons();
    this.buildFooter();
    this.container.addChild(this.leftPanel);
  }

  private txt(style: keyof typeof TEXT_STYLE, text: string, x: number, y: number, alpha = 1): PIXI.Text {
    const t = new PIXI.Text({ text, style: TEXT_STYLE[style] });
    t.x = x;
    t.y = y;
    t.alpha = alpha;
    return t;
  }

  private buildBrand(): void {
    this.leftPanel.addChild(this.txt('brand', 'NOUS RESEARCH PREZINTA', 30, 36, 0.4));
    this.leftPanel.addChild(this.txt('title', 'CARDWEAVE', 30, 62));

    const line = new PIXI.Graphics();
    line.moveTo(30, 130);
    line.lineTo(490, 130);
    line.stroke({ width: 1, color: COLORS.GOLD_NUM, alpha: 0.15 });
    this.leftPanel.addChild(line);

    this.leftPanel.addChild(this.txt('subtitle', 'Auto-battle card crafting', 30, 142, 0.5));
  }

  private buildButtons(): void {
    const btnDefs = [
      { label: '>  JOACA', key: 'Enter', primary: true },
      { label: '<>  Colectie', key: 'C', primary: false },
      { label: '#  Setari', key: 'S', primary: false },
    ];

    btnDefs.forEach((btn, i) => {
      const y = 210 + i * 56;

      const bg = new PIXI.Graphics();
      if (btn.primary) {
        bg.roundRect(30, y, 460, 52, 8);
        bg.fill({ color: COLORS.BTN_GREEN });
        bg.stroke({ width: 2, color: 0xb2f2bb });
      } else {
        bg.roundRect(30, y, 460, 52, 8);
        bg.fill({ color: COLORS.BTN_DEFAULT, alpha: 0.6 });
        bg.stroke({ width: 1, color: 0xa5d8ff, alpha: 0.3 });
      }

      const label = this.txt(btn.primary ? 'btnPrimary' : 'btnSecondary', btn.label, 60, y + 13);
      const hint = this.txt('keyHint', `[${btn.key}]`, 430, y + 16, 0.4);

      const hit = new PIXI.Graphics();
      hit.roundRect(30, y, 460, 52, 8);
      hit.fill({ color: 0xffffff, alpha: 0.001 });
      hit.eventMode = 'static';
      hit.cursor = 'pointer';

      if (btn.primary) {
        hit.on('pointerdown', () => this.engine.events.emit('START_GAME'));
        hit.on('pointerover', () => { bg.tint = 0xdddddd; });
        hit.on('pointerout', () => { bg.tint = 0xffffff; });
      } else {
        hit.on('pointerdown', () => console.log(`[Menu] ${btn.label} placeholder`));
      }

      this.leftPanel.addChild(bg, label, hint, hit);
    });
  }

  private buildFooter(): void {
    this.leftPanel.addChild(this.txt('footer', 'v0.1.0  |  2026', 30, 680));
    const tag = this.txt('footerTag', 'Offline-first', 390, 680, 0.4);
    this.leftPanel.addChild(tag);
  }

  // ---------------------------------------------------------------
  //  PANOU DREAPTA — Card personaj
  // ---------------------------------------------------------------

  private rightPanel!: PIXI.Container;

  private buildRightPanel(): void {
    this.rightPanel = new PIXI.Container();
    this.rightPanel.x = 600;
    this.rightPanel.y = 40;

    const bg = new PIXI.Graphics();
    bg.roundRect(0, 0, 560, 720, 12);
    bg.fill({ color: COLORS.BG_DARK });
    this.rightPanel.addChild(bg);

    const divider = new PIXI.Graphics();
    divider.moveTo(-40, 20);
    divider.lineTo(-40, 700);
    divider.stroke({ width: 1, color: COLORS.GOLD_NUM, alpha: 0.06 });
    this.rightPanel.addChild(divider);

    this.buildCharacterCard();
    this.container.addChild(this.rightPanel);
  }

  private buildCharacterCard(): void {
    const cx = 280;
    const cy = 70;

    const card = new PIXI.Graphics();
    card.roundRect(cx - 140, cy, 280, 520, 12);
    card.fill({ color: 0x1c1c30, alpha: 0.6 });
    card.stroke({ width: 1, color: COLORS.GOLD_NUM, alpha: 0.10 });
    this.rightPanel.addChild(card);

    const rarity = this.txt('rarity', `—  ${IGNIS.rarity.toUpperCase()}  —`, cx, cy + 28, 0.4);
    rarity.anchor.set(0.5, 0);
    this.rightPanel.addChild(rarity);

    const portrait = new PIXI.Graphics();
    portrait.circle(cx, cy + 130, 90);
    portrait.fill({ color: COLORS.PORTRAIT });
    portrait.stroke({ width: 2, color: COLORS.GOLD_NUM, alpha: 0.15 });
    this.rightPanel.addChild(portrait);

    const pText = this.txt('portraitText', 'DRAGON', cx, cy + 122);
    pText.anchor.set(0.5);
    this.rightPanel.addChild(pText);

    const name = this.txt('charName', IGNIS.name, cx, cy + 250);
    name.anchor.set(0.5, 0);
    this.rightPanel.addChild(name);

    const cls = this.txt('charClass', `${IGNIS.race}  |  ${IGNIS.className}`, cx, cy + 290);
    cls.anchor.set(0.5, 0);
    cls.alpha = 0.6;
    this.rightPanel.addChild(cls);

    const stats: { label: string; value: string; color: string }[] = [
      { label: 'HP', value: `${IGNIS.baseHp}`, color: COLORS.STAT_HP },
      { label: 'Energie', value: `+${IGNIS.energyCapBonus}`, color: COLORS.STAT_ENERGY },
      { label: 'Atac', value: `${IGNIS.baseAttack}`, color: COLORS.STAT_ATK },
    ];

    stats.forEach((s, i) => {
      const sx = cx - 90 + i * 100;

      const box = new PIXI.Graphics();
      box.roundRect(sx - 35, cy + 340, 70, 65, 6);
      box.fill({ color: 0x1e1e32, alpha: 0.6 });
      box.stroke({ width: 1, color: s.color, alpha: 0.4 });
      this.rightPanel.addChild(box);

      const lbl = new PIXI.Text({ text: s.label, style: { fontFamily: 'monospace', fontSize: 12, fill: s.color, letterSpacing: 2 } });
      lbl.anchor.set(0.5, 0);
      lbl.x = sx; lbl.y = cy + 347; lbl.alpha = 0.5;
      this.rightPanel.addChild(lbl);

      const val = new PIXI.Text({ text: s.value, style: { fontFamily: 'monospace', fontSize: 24, fill: s.color, fontWeight: '600' } });
      val.anchor.set(0.5, 0);
      val.x = sx; val.y = cy + 368;
      this.rightPanel.addChild(val);
    });

    const lore = this.txt('lore', IGNIS.lore, cx, cy + 430);
    lore.anchor.set(0.5, 0);
    this.rightPanel.addChild(lore);

    const slots = this.txt('slots', '[ @ ] [ @ ] [ @ ] [ O ] [ O ]    3/6 active', cx, cy + 470, 0.35);
    slots.anchor.set(0.5, 0);
    this.rightPanel.addChild(slots);
  }

  // ---------------------------------------------------------------
  //  LIFECYCLE
  // ---------------------------------------------------------------

  enter(): void {
    // Adăugăm în gameContainer (care e scalat automat), nu direct în stage
    this.engine.gameContainer.addChild(this.container);
    this.container.alpha = 0;
    const fade = () => {
      this.container.alpha += 0.05;
      if (this.container.alpha < 1) requestAnimationFrame(fade);
    };
    fade();
  }

  update(_delta: number): void {
    // no-op in menu
  }

  exit(): void {
    this.container.alpha = 1;
    const fade = () => {
      this.container.alpha -= 0.08;
      if (this.container.alpha > 0) {
        requestAnimationFrame(fade);
      } else {
        this.engine.gameContainer.removeChild(this.container);
      }
    };
    fade();
  }
}
