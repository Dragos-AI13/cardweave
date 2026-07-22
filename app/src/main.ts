/** Entry point. Inițializează motorul și pornește Main Menu. */

import { GameEngine } from './engine/GameEngine';
import { GameState } from './engine/config';
import { MenuScene } from './scenes/MenuScene';

async function main(): Promise<void> {
  const engine = await GameEngine.create();

  // Montează canvas-ul
  const container = document.getElementById('game');
  if (!container) {
    throw new Error('Container #game not found');
  }
  container.appendChild(engine.canvas);
  engine.canvas.style.display = 'block';

  // Înregistrează scene
  const menu = new MenuScene(engine);
  engine.sm.register(GameState.MENU, menu);

  // Eveniment: click Joacă → trecem la BUY_PHASE (deocamdată doar log)
  engine.events.on('START_GAME', () => {
    console.log('[Game] START_GAME → tranziție la BUY_PHASE');
    // T002: aici vom face tranziția efectivă
  });

  // Pornește
  await engine.sm.go(GameState.MENU);
}

main().catch(console.error);
