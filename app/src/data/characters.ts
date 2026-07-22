/** Definiții de caractere. */

export interface CharacterData {
  id: string;
  name: string;
  race: string;
  className: string;
  title: string;
  lore: string;
  baseHp: number;
  energyCapBonus: number;
  energyRegenBonus: number;
  baseAttack: number;
  rarity: string;
  color: number;
}

export const IGNIS: CharacterData = {
  id: 'ignis',
  name: 'Ignis',
  race: 'Dragonkin',
  className: 'Mage',
  title: 'Stăpânul Focului',
  lore: 'Stăpânul focului. Primul Dragonkin trezit din Marele Somn.',
  baseHp: 90,
  energyCapBonus: 5,
  energyRegenBonus: 0.5,
  baseAttack: 12,
  rarity: 'Starter',
  color: 0xd0bfff,
};

export const CHARACTERS: Record<string, CharacterData> = {
  ignis: IGNIS,
};
