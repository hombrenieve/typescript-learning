import { BaseCharacter } from './BaseCharacter';
import { Stats, Position } from '../types';
import { cooldown, log } from '../utils/decorators';

export class Warrior extends BaseCharacter {
  constructor(name: string, position?: Position) {
    const baseStats: Stats = {
      health: 120,
      maxHealth: 120,
      mana: 30,
      maxMana: 30,
      attack: 25,
      defense: 15,
      speed: 8
    };
    super(name, "warrior", baseStats, position);
  }

  getSpecialAbility(): string {
    return "Berserker Rage - Doubles attack for one turn";
  }

  @log
  @cooldown(3)
  useSpecialAbility(target?: BaseCharacter): number {
    if (this._stats.mana < 15) {
      throw new Error("Not enough mana for Berserker Rage");
    }

    this._stats.mana -= 15;
    console.log(`⚔️ ${this.name} enters Berserker Rage!`);
    
    if (target) {
      const originalAttack = this._stats.attack;
      this._stats.attack *= 2;
      const damage = this.attack(target);
      this._stats.attack = originalAttack;
      return damage;
    }
    
    return 0;
  }
}

export class Mage extends BaseCharacter {
  constructor(name: string, position?: Position) {
    const baseStats: Stats = {
      health: 80,
      maxHealth: 80,
      mana: 100,
      maxMana: 100,
      attack: 15,
      defense: 8,
      speed: 12
    };
    super(name, "mage", baseStats, position);
  }

  getSpecialAbility(): string {
    return "Fireball - Magical attack that ignores defense";
  }

  @log
  @cooldown(2)
  useSpecialAbility(target?: BaseCharacter): number {
    if (this._stats.mana < 25) {
      throw new Error("Not enough mana for Fireball");
    }

    this._stats.mana -= 25;
    console.log(`🔥 ${this.name} casts Fireball!`);
    
    if (target) {
      const magicDamage = this._stats.attack + 20; // Magic damage ignores defense
      return target.takeDamage(magicDamage);
    }
    
    return 0;
  }

  @log
  healSpell(target: BaseCharacter): number {
    if (this._stats.mana < 20) {
      throw new Error("Not enough mana for Heal");
    }

    this._stats.mana -= 20;
    const healAmount = 30 + Math.floor(this._level * 5);
    console.log(`✨ ${this.name} casts Heal on ${target.name}!`);
    return target.heal(healAmount);
  }
}

export class Rogue extends BaseCharacter {
  private _stealthActive: boolean = false;

  constructor(name: string, position?: Position) {
    const baseStats: Stats = {
      health: 90,
      maxHealth: 90,
      mana: 50,
      maxMana: 50,
      attack: 20,
      defense: 10,
      speed: 18
    };
    super(name, "rogue", baseStats, position);
  }

  getSpecialAbility(): string {
    return "Stealth Strike - Next attack deals double damage and has high crit chance";
  }

  @log
  @cooldown(4)
  useSpecialAbility(target?: BaseCharacter): number {
    if (this._stats.mana < 20) {
      throw new Error("Not enough mana for Stealth Strike");
    }

    this._stats.mana -= 20;
    this._stealthActive = true;
    console.log(`🥷 ${this.name} enters stealth!`);
    
    if (target) {
      return this.stealthAttack(target);
    }
    
    return 0;
  }

  @log
  private stealthAttack(target: BaseCharacter): number {
    if (!this._stealthActive) {
      return this.attack(target);
    }

    this._stealthActive = false;
    const baseDamage = this._stats.attack * 2; // Double damage
    const criticalChance = 0.5; // 50% critical hit chance when stealthed
    const isCritical = Math.random() < criticalChance;
    const damage = isCritical ? baseDamage * 1.5 : baseDamage;

    console.log(`🗡️ Stealth Strike!${isCritical ? ' Critical hit!' : ''}`);
    return target.takeDamage(damage);
  }

  // Override attack to use stealth if active
  attack(target: BaseCharacter): number {
    if (this._stealthActive) {
      return this.stealthAttack(target);
    }
    return super.attack(target);
  }
}

// TODO: Implement these character classes following the same pattern
// - Each should have unique stats and special abilities
// - Use decorators appropriately
// - Consider class-specific mechanics
