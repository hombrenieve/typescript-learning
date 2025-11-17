import { BaseCharacter } from '../../src/characters/BaseCharacter';
import { Stats, Position } from '../../src/types';

// Concrete implementation for testing abstract class
class TestCharacter extends BaseCharacter {
  getSpecialAbility(): string {
    return "Test Ability";
  }

  useSpecialAbility(target?: BaseCharacter): number {
    return 10;
  }
}

describe('BaseCharacter', () => {
  let character: TestCharacter;
  let target: TestCharacter;

  const baseStats: Stats = {
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    attack: 20,
    defense: 10,
    speed: 15
  };

  beforeEach(() => {
    character = new TestCharacter('Hero', 'warrior', baseStats);
    target = new TestCharacter('Enemy', 'warrior', baseStats);
  });

  describe('constructor', () => {
    test('should create character with correct properties', () => {
      expect(character.name).toBe('Hero');
      expect(character.characterClass).toBe('warrior');
      expect(character.level).toBe(1);
      expect(character.experience).toBe(0);
      expect(character.isAlive).toBe(true);
    });

    test('should initialize stats correctly', () => {
      expect(character.stats.health).toBe(100);
      expect(character.stats.maxHealth).toBe(100);
      expect(character.stats.attack).toBe(20);
    });

    test('should set default position', () => {
      expect(character.position).toEqual({ x: 0, y: 0 });
    });

    test('should set custom position', () => {
      const customPosition: Position = { x: 5, y: 10 };
      const customCharacter = new TestCharacter('Custom', 'mage', baseStats, customPosition);
      expect(customCharacter.position).toEqual(customPosition);
    });
  });

  describe('takeDamage', () => {
    test('should reduce health by damage minus defense', () => {
      const damage = 15;
      const expectedDamage = Math.max(1, damage - character.stats.defense);
      
      character.takeDamage(damage);
      
      expect(character.stats.health).toBe(100 - expectedDamage);
    });

    test('should deal minimum 1 damage', () => {
      const lowDamage = 5; // Less than defense (10)
      
      character.takeDamage(lowDamage);
      
      expect(character.stats.health).toBe(99); // 100 - 1
    });

    test('should not reduce health below 0', () => {
      const massiveDamage = 200;
      
      character.takeDamage(massiveDamage);
      
      expect(character.stats.health).toBe(0);
      expect(character.isAlive).toBe(false);
    });

    test('should throw error for negative damage', () => {
      expect(() => character.takeDamage(-5)).toThrow('Damage must be a positive number');
    });

    test('should throw error for zero damage', () => {
      expect(() => character.takeDamage(0)).toThrow('Damage must be a positive number');
    });
  });

  describe('heal', () => {
    test('should restore health', () => {
      character.takeDamage(30); // Reduce health first
      const initialHealth = character.stats.health;
      
      const healed = character.heal(20);
      
      expect(character.stats.health).toBe(initialHealth + 20);
      expect(healed).toBe(20);
    });

    test('should not heal above max health', () => {
      character.takeDamage(30); // This deals 20 damage (30-10 defense), so health becomes 80
      
      const healed = character.heal(50); // Try to heal 50
      
      expect(character.stats.health).toBe(100); // Should be capped at max
      expect(healed).toBe(20); // Only healed 20 points (from 80 to 100)
    });

    test('should return 0 when already at full health', () => {
      const healed = character.heal(20);
      
      expect(character.stats.health).toBe(100);
      expect(healed).toBe(0);
    });
  });

  describe('attack', () => {
    test('should deal damage to target', () => {
      const targetInitialHealth = target.stats.health;
      
      character.attack(target);
      
      expect(target.stats.health).toBeLessThan(targetInitialHealth);
    });

    test('should throw error when attacker is dead', () => {
      character.takeDamage(200); // Kill the character
      
      expect(() => character.attack(target)).toThrow('Hero cannot attack while defeated');
    });

    test('should have chance for critical hits', () => {
      // Mock Math.random to force critical hit
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.05); // Force critical hit (< 0.1)
      
      const targetInitialHealth = target.stats.health;
      character.attack(target);
      
      // Critical hit should deal double damage
      const expectedDamage = Math.max(1, (character.stats.attack * 2) - target.stats.defense);
      expect(target.stats.health).toBe(targetInitialHealth - expectedDamage);
      
      Math.random = originalRandom;
    });
  });

  describe('moveTo', () => {
    test('should update character position', () => {
      const newPosition: Position = { x: 10, y: 20 };
      
      character.moveTo(newPosition);
      
      expect(character.position).toEqual(newPosition);
    });

    test('should not modify original position object', () => {
      const newPosition: Position = { x: 10, y: 20 };
      
      character.moveTo(newPosition);
      newPosition.x = 999; // Modify original
      
      expect(character.position.x).toBe(10); // Should not be affected
    });
  });

  describe('gainExperience', () => {
    test('should increase experience', () => {
      character.gainExperience(50);
      
      expect(character.experience).toBe(50);
    });

    test('should level up when experience threshold is reached', () => {
      const leveledUp = character.gainExperience(100);
      
      expect(leveledUp).toBe(true);
      expect(character.level).toBe(2);
      expect(character.experience).toBe(0); // Reset after level up
    });

    test('should not level up when experience threshold is not reached', () => {
      const leveledUp = character.gainExperience(50);
      
      expect(leveledUp).toBe(false);
      expect(character.level).toBe(1);
      expect(character.experience).toBe(50);
    });

    test('should increase stats on level up', () => {
      const originalStats = { ...character.stats };
      
      character.gainExperience(100); // Level up
      
      expect(character.stats.maxHealth).toBeGreaterThan(originalStats.maxHealth);
      expect(character.stats.attack).toBeGreaterThan(originalStats.attack);
      expect(character.stats.defense).toBeGreaterThan(originalStats.defense);
      expect(character.stats.health).toBe(character.stats.maxHealth); // Full heal
    });
  });

  describe('getInfo', () => {
    test('should return formatted character information', () => {
      const info = character.getInfo();
      
      expect(info).toContain('Hero');
      expect(info).toContain('warrior');
      expect(info).toContain('Level 1');
      expect(info).toContain('HP: 100/100');
      expect(info).toContain('MP: 50/50');
    });
  });

  describe('abstract methods', () => {
    test('should implement getSpecialAbility', () => {
      expect(character.getSpecialAbility()).toBe('Test Ability');
    });

    test('should implement useSpecialAbility', () => {
      expect(character.useSpecialAbility()).toBe(10);
    });
  });
});
