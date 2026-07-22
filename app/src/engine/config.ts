/** Configurații globale ale jocului. */

export const CONFIG = {
  /** Dimensiunea logică a jocului (se scalează să încapă în fereastră) */
  GAME_WIDTH: 1280,
  GAME_HEIGHT: 720,
  /** Culoarea de fundal */
  BG_COLOR: 0x1e1e2e,
  /** Număr maxim sloturi în arenă */
  MAX_SLOTS: 5,
  /** Număr subsloturi per carte */
  SLOT_SUBSLOTS: 6,
  /** Energy */
  ENERGY_CAP: 50,
  ENERGY_REGEN: 3,
  /** Cooldown */
  COOLDOWN_MIN: 0.3,
  COOLDOWN_MAX: 5.0,
  /** Boost carte completă */
  BOOST_COMPLETE: 1.3,
  /** Tranziții */
  FADE_DURATION: 300,
} as const;

/** Paleta de culori */
export const COLORS = {
  BG_PRIMARY: 0x1e1e2e,
  BG_PANEL: 0x252538,
  BG_DARK: 0x1a1a2e,
  GOLD: '#ffd43b',
  GOLD_NUM: 0xffd43b,
  TEXT_PRIMARY: '#ffffff',
  TEXT_MUTED: '#757575',
  ACCENT_BLUE: '#a5d8ff',
  ACCENT_GREEN: '#b2f2bb',
  BTN_GREEN: 0x2f9e44,
  BTN_DEFAULT: 0x2a2a42,
  STAT_HP: '#69db7c',
  STAT_ENERGY: '#74c0fc',
  STAT_ATK: '#ff8787',
  PORTRAIT: 0xd0bfff,
} as const;

/** Stările jocului */
export enum GameState {
  MENU = 'MENU',
  BUY_PHASE = 'BUY_PHASE',
  BATTLE_PHASE = 'BATTLE_PHASE',
  RESULTS = 'RESULTS',
}
