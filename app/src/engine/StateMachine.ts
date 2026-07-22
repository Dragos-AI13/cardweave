/** Mașină de stări pentru flow-ul jocului. */

import { GameState } from './config';

export interface Scene {
  enter(): void;
  update(delta: number): void;
  exit(): void;
  readonly container: import('pixi.js').Container;
}

export class StateMachine {
  private currentState: GameState | null = null;
  private currentScene: Scene | null = null;
  private scenes = new Map<GameState, Scene>();
  private exitCallback: (() => void) | null = null;

  register(state: GameState, scene: Scene): void {
    this.scenes.set(state, scene);
  }

  onExit(cb: () => void): void {
    this.exitCallback = cb;
  }

  async go(state: GameState): Promise<void> {
    if (this.currentScene) {
      this.currentScene.exit();
    }
    const scene = this.scenes.get(state);
    if (!scene) {
      console.warn(`StateMachine: no scene registered for ${state}`);
      return;
    }
    this.currentState = state;
    this.currentScene = scene;
    scene.enter();
  }

  update(delta: number): void {
    this.currentScene?.update(delta);
  }

  get state(): GameState | null {
    return this.currentState;
  }

  get scene(): Scene | null {
    return this.currentScene;
  }
}
