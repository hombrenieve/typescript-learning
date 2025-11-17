// Core game types and interfaces

export type CharacterClass = "warrior" | "mage" | "rogue";
export type ItemType = "weapon" | "armor" | "consumable" | "misc";
export type ActionType = "attack" | "defend" | "use_item" | "flee";

export interface Stats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  player: PlayerData;
  currentLevel: number;
  gameTime: number;
  inventory: InventoryData;
}

export interface PlayerData {
  name: string;
  class: CharacterClass;
  level: number;
  experience: number;
  stats: Stats;
  position: Position;
}

export interface InventoryData {
  items: ItemData[];
  maxSlots: number;
}

export interface ItemData {
  id: string;
  name: string;
  type: ItemType;
  quantity: number;
  value: number;
}

export interface CombatAction {
  type: ActionType;
  actor: string;
  target?: string;
  itemId?: string;
  damage?: number;
  healing?: number;
}

export interface CombatResult {
  actions: CombatAction[];
  winner?: string;
  experience?: number;
  loot?: ItemData[];
}

// Utility types for configuration
export type CharacterConfig = Record<CharacterClass, {
  baseStats: Omit<Stats, 'health' | 'mana'>;
  healthMultiplier: number;
  manaMultiplier: number;
}>;

export type ItemConfig = Record<ItemType, {
  stackable: boolean;
  usable: boolean;
}>;

// Template literal types for events
export type GameEvent = `game:${string}`;
export type CombatEvent = `combat:${string}`;
export type InventoryEvent = `inventory:${string}`;

export type AllEvents = GameEvent | CombatEvent | InventoryEvent;
