/** Motorul principal al jocului. Inițializează PixiJS + StateMachine + EventBus. */

import * as PIXI from 'pixi.js';
import { CONFIG } from './config';
import { StateMachine } from './StateMachine';
import { EventBus } from './EventBus';

export class GameEngine {
  readonly app: PIXI.Application;
  readonly sm: StateMachine;
  readonly events: EventBus;

  /** Container care păstrează proporțiile jocului, indiferent de dimensiunea ecranului */
  readonly gameContainer: PIXI.Container;

  private constructor(app: PIXI.Application) {
    this.app = app;
    this.sm = new StateMachine();
    this.events = new EventBus();
    this.gameContainer = new PIXI.Container();
    this.app.stage.addChild(this.gameContainer);

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  static async create(): Promise<GameEngine> {
    const app = new PIXI.Application();
    await app.init({
      width: CONFIG.GAME_WIDTH,
      height: CONFIG.GAME_HEIGHT,
      backgroundColor: CONFIG.BG_COLOR,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    const engine = new GameEngine(app);

    app.ticker.add((ticker) => {
      engine.sm.update(ticker.deltaTime);
    });

    return engine;
  }

  /** Redimensionează canvas-ul să umple tot ecranul și scalează conținutul proporțional. */
  private handleResize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Redimensionează renderer-ul să umple ecranul
    this.app.renderer.resize(w, h);

    // Calculează scala să încapă GAME_WIDTH×GAME_HEIGHT în fereastră
    const scaleX = w / CONFIG.GAME_WIDTH;
    const scaleY = h / CONFIG.GAME_HEIGHT;
    const scale = Math.min(scaleX, scaleY);

    this.gameContainer.scale.set(scale);

    // Centrează container-ul scalat
    this.gameContainer.x = (w - CONFIG.GAME_WIDTH * scale) / 2;
    this.gameContainer.y = (h - CONFIG.GAME_HEIGHT * scale) / 2;
  }

  get stage(): PIXI.Container {
    return this.app.stage;
  }

  get canvas(): HTMLCanvasElement {
    return this.app.canvas as HTMLCanvasElement;
  }
}
