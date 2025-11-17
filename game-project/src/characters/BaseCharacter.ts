import { Stats, Position, CharacterClass } from '../types';
import { log, validate } from '../utils/decorators';

export abstract class BaseCharacter {
  protected _stats: Stats;
  protected _position: Position;
  protected _level: number = 1;
  protected _experience: number = 0;

  constructor(
    public readonly name: string,
    public readonly characterClass: CharacterClass,
    baseStats: Stats,
    startPosition: Position = { x: 0, y: 0 }
  ) {
    this._stats = { ...baseStats };
    this._position = { ...startPosition };
  }

  // Getters
  get stats(): Readonly<Stats> {
    return { ...this._stats };
  }

  get position(): Readonly<Position> {
    return { ...this._position };
  }

  get level(): number {
    return this._level;
  }

  get experience(): number {
    return this._experience;
  }

  get isAlive(): boolean {
    return this._stats.health > 0;
  }

  // Abstract methods that subclasses must implement
  abstract getSpecialAbility(): string;
  abstract useSpecialAbility(target?: BaseCharacter): number;

  @log
  @validate(
    (args) => typeof args[0] === 'number' && args[0] > 0,
    'Damage must be a positive number'
  )
  takeDamage(damage: number): number {
    const actualDamage = Math.max(1, damage - this._stats.defense);
    this._stats.health = Math.max(0, this._stats.health - actualDamage);
    
    if (this._stats.health === 0) {
      console.log(`💀 ${this.name} has been defeated!`);
    }
    
    return actualDamage;
  }

  @log
  heal(amount: number): number {
    const actualHealing = Math.min(amount, this._stats.maxHealth - this._stats.health);
    this._stats.health += actualHealing;
    return actualHealing;
  }

  @log
  attack(target: BaseCharacter): number {
    if (!this.isAlive) {
      throw new Error(`${this.name} cannot attack while defeated`);
    }

    const baseDamage = this._stats.attack;
    const criticalChance = 0.1; // 10% critical hit chance
    const isCritical = Math.random() < criticalChance;
    const damage = isCritical ? baseDamage * 2 : baseDamage;

    if (isCritical) {
      console.log(`💥 Critical hit!`);
    }

    return target.takeDamage(damage);
  }

  @log
  moveTo(newPosition: Position): void {
    this._position = { ...newPosition };
  }

  @log
  gainExperience(exp: number): boolean {
    this._experience += exp;
    const expNeeded = this.getExperienceNeeded();
    
    if (this._experience >= expNeeded) {
      this.levelUp();
      return true;
    }
    return false;
  }

  private getExperienceNeeded(): number {
    return this._level * 100; // Simple formula: level * 100
  }

  @log
  private levelUp(): void {
    this._level++;
    this._experience = 0;
    
    // Increase stats on level up
    const statIncrease = 5;
    this._stats.maxHealth += statIncrease * 2;
    this._stats.health = this._stats.maxHealth; // Full heal on level up
    this._stats.maxMana += statIncrease;
    this._stats.mana = this._stats.maxMana;
    this._stats.attack += statIncrease;
    this._stats.defense += Math.floor(statIncrease / 2);
    this._stats.speed += 1;

    console.log(`🎉 ${this.name} reached level ${this._level}!`);
  }

  // Utility method for displaying character info
  getInfo(): string {
    return `${this.name} (${this.characterClass}) - Level ${this._level}
    HP: ${this._stats.health}/${this._stats.maxHealth}
    MP: ${this._stats.mana}/${this._stats.maxMana}
    ATK: ${this._stats.attack} | DEF: ${this._stats.defense} | SPD: ${this._stats.speed}
    EXP: ${this._experience}/${this.getExperienceNeeded()}`;
  }
}
