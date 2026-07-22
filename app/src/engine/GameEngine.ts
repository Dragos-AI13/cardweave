/** Motorul principal al jocului. Inițializează PixiJS + StateMachine + EventBus. */

import * as PIXI from 'pixi.js';
import { CONFIG } from './config';
import { StateMachine } from './StateMachine';
import { EventBus } from './EventBus';

export class GameEngine {
  readonly app: PIXI.Application;
  readonly sm: StateMachine;
  readonly events: EventBus;

  private constructor(app: PIXI.Application) {
    this.app = app;
    this.sm = new StateMachine();
    this.events = new EventBus();
  }

  static async create(): Promise<GameEngine> {
    const app = new PIXI.Application();
    await app.init({
      width: CONFIG.CANVAS_WIDTH,
      height: CONFIG.CANVAS_HEIGHT,
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

  get stage(): PIXI.Container {
    return this.app.stage;
  }

  get canvas(): HTMLCanvasElement {
    return this.app.canvas as HTMLCanvasElement;
  }
}
