import { promises as fs } from 'fs';
import { join } from 'path';
import { BaseCharacter } from '../characters/BaseCharacter';
import { Warrior, Mage, Rogue } from '../characters/PlayerCharacters';
import { Inventory, BaseItem, Consumable, Weapon } from '../items/Inventory';
import { CombatSystem } from '../combat/CombatSystem';
import { GameState, CharacterClass, PlayerData } from '../types';
import { log, memoize } from '../utils/decorators';

export class Game {
  private player: BaseCharacter | null = null;
  private inventory: Inventory<BaseItem>;
  private gameTime: number = 0;
  private currentLevel: number = 1;
  private saveDirectory: string;

  constructor() {
    this.inventory = new Inventory<BaseItem>(30);
    this.saveDirectory = join(__dirname, '../../saves');
    this.ensureSaveDirectory();
  }

  private async ensureSaveDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.saveDirectory, { recursive: true });
    } catch (error) {
      console.error('Failed to create save directory:', error);
    }
  }

  @log
  async startNewGame(playerName: string, characterClass: CharacterClass): Promise<void> {
    console.log(`\n🎮 Starting new game as ${playerName} the ${characterClass}!`);
    
    this.player = this.createCharacter(playerName, characterClass);
    this.gameTime = 0;
    this.currentLevel = 1;
    
    // Give starting items
    this.giveStartingItems();
    
    console.log(`\n${this.player.getInfo()}`);
    this.inventory.display();
    
    // Start the game loop
    await this.gameLoop();
  }

  private createCharacter(name: string, characterClass: CharacterClass): BaseCharacter {
    switch (characterClass) {
      case "warrior":
        return new Warrior(name);
      case "mage":
        return new Mage(name);
      case "rogue":
        return new Rogue(name);
      default:
        throw new Error(`Unknown character class: ${characterClass}`);
    }
  }

  private giveStartingItems(): void {
    // Starting potion
    const healthPotion = new Consumable(
      'health_potion',
      'Health Potion',
      3,
      50,
      () => {
        if (this.player) {
          const healed = this.player.heal(50);
          console.log(`💚 Restored ${healed} health!`);
        }
      }
    );

    // Starting weapon based on class
    let startingWeapon: Weapon;
    if (this.player instanceof Warrior) {
      startingWeapon = new Weapon('iron_sword', 'Iron Sword', 1, 100, 10);
    } else if (this.player instanceof Mage) {
      startingWeapon = new Weapon('wooden_staff', 'Wooden Staff', 1, 75, 8);
    } else {
      startingWeapon = new Weapon('iron_dagger', 'Iron Dagger', 1, 80, 12);
    }

    this.inventory.addItem(healthPotion);
    this.inventory.addItem(startingWeapon);
  }

  private async gameLoop(): Promise<void> {
    let gameRunning = true;
    let turnCount = 0;
    const maxTurns = 10; // Limit for demo purposes
    
    while (gameRunning && this.player?.isAlive && turnCount < maxTurns) {
      console.log(`\n⏰ Turn ${turnCount + 1}/${maxTurns} | Game Time: ${this.gameTime} | Level: ${this.currentLevel}`);
      console.log("\n🎯 What would you like to do?");
      console.log("1. Explore (find enemies)");
      console.log("2. Check inventory");
      console.log("3. Check character status");
      console.log("4. Save game");
      console.log("5. Quit game");

      // For demo purposes, simulate user choice with some variety
      const choice = this.simulateUserChoice(turnCount);
      
      switch (choice) {
        case 1:
          await this.explore();
          break;
        case 2:
          this.inventory.display();
          break;
        case 3:
          console.log(`\n${this.player.getInfo()}`);
          break;
        case 4:
          await this.saveGame('autosave');
          break;
        case 5:
          gameRunning = false;
          break;
      }

      this.gameTime += 10;
      turnCount++;
      
      // Auto-save every 5 turns
      if (turnCount % 5 === 0) {
        await this.saveGame('autosave');
      }

      // Add a small delay to make it readable
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (turnCount >= maxTurns) {
      console.log("\n🎮 Demo completed! You've experienced the core game mechanics.");
    } else if (!this.player?.isAlive) {
      console.log("\n💀 Game Over! Your character has fallen in battle.");
    } else {
      console.log("\n👋 Thanks for playing!");
    }
  }

  private simulateUserChoice(turnCount: number): number {
    // Simulate user input for demo - more variety and eventual quit
    if (turnCount >= 8) {
      return 5; // Quit after 8 turns
    }
    
    const choices = [1, 1, 2, 3, 1, 4, 1]; // Explore, inventory, status, save
    return choices[turnCount % choices.length];
  }

  @log
  private async explore(): Promise<void> {
    console.log("\n🗺️ Exploring the area...");
    
    const encounterChance = 0.7;
    if (Math.random() < encounterChance) {
      await this.startCombat();
    } else {
      console.log("🌿 You find a peaceful area. Nothing happens.");
      
      // Small chance to find items
      if (Math.random() < 0.3) {
        this.findRandomItem();
      }
    }
  }

  private async startCombat(): Promise<void> {
    if (!this.player) return;

    console.log("\n⚔️ An enemy appears!");
    
    // Create a random enemy
    const enemy = this.createRandomEnemy();
    const combat = new CombatSystem(this.player, [enemy]);
    
    const result = combat.startCombat();
    
    if (result.winner === this.player.name && result.experience) {
      const leveledUp = this.player.gainExperience(result.experience);
      if (leveledUp) {
        console.log(`🎉 Level up! ${this.player.name} is now level ${this.player.level}!`);
      }
      
      // Add loot to inventory
      if (result.loot) {
        result.loot.forEach(lootItem => {
          const item = this.createItemFromData(lootItem);
          if (item) {
            this.inventory.addItem(item);
            console.log(`📦 Found: ${item.name}!`);
          }
        });
      }
    }
  }

  @memoize
  private createRandomEnemy(): BaseCharacter {
    const enemyTypes = ['Goblin', 'Orc', 'Skeleton', 'Wolf'];
    const enemyName = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    // Create enemy as a warrior with scaled stats
    const enemy = new Warrior(enemyName);
    
    // Scale enemy to player level
    if (this.player) {
      const levelDiff = this.player.level - 1;
      for (let i = 0; i < levelDiff; i++) {
        enemy.gainExperience(100); // Force level up
      }
    }
    
    return enemy;
  }

  private findRandomItem(): void {
    const items = [
      { id: 'health_potion', name: 'Health Potion', type: 'consumable', quantity: 1, value: 50 },
      { id: 'mana_potion', name: 'Mana Potion', type: 'consumable', quantity: 1, value: 40 },
      { id: 'gold_coin', name: 'Gold Coin', type: 'misc', quantity: Math.floor(Math.random() * 20) + 5, value: 1 }
    ];
    
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const item = this.createItemFromData(randomItem);
    
    if (item) {
      this.inventory.addItem(item);
      console.log(`✨ You found: ${item.name}!`);
    }
  }

  private createItemFromData(data: any): BaseItem | null {
    switch (data.type) {
      case 'consumable':
        return new Consumable(
          data.id,
          data.name,
          data.quantity,
          data.value,
          () => {
            if (data.id.includes('health') && this.player) {
              const healed = this.player.heal(50);
              console.log(`💚 Restored ${healed} health!`);
            } else if (data.id.includes('mana') && this.player) {
              // Restore mana logic would go here
              console.log(`💙 Restored mana!`);
            }
          }
        );
      case 'weapon':
        return new Weapon(data.id, data.name, data.quantity, data.value, data.attackBonus || 5);
      default:
        return null;
    }
  }

  @log
  async saveGame(saveName: string): Promise<void> {
    if (!this.player) {
      console.log("❌ No active game to save!");
      return;
    }

    try {
      const gameState: GameState = {
        player: {
          name: this.player.name,
          class: this.player.characterClass,
          level: this.player.level,
          experience: this.player.experience,
          stats: this.player.stats,
          position: this.player.position
        },
        currentLevel: this.currentLevel,
        gameTime: this.gameTime,
        inventory: {
          items: this.inventory.getAllItems().map(item => ({
            id: item.id,
            name: item.name,
            type: item.type,
            quantity: item.quantity,
            value: item.value
          })),
          maxSlots: 30
        }
      };

      const saveFile = join(this.saveDirectory, `${saveName}.json`);
      await fs.writeFile(saveFile, JSON.stringify(gameState, null, 2));
      
      console.log(`💾 Game saved as '${saveName}'!`);
    } catch (error) {
      console.error('❌ Failed to save game:', error);
    }
  }

  @log
  async loadGame(saveName: string): Promise<void> {
    try {
      const saveFile = join(this.saveDirectory, `${saveName}.json`);
      const saveData = await fs.readFile(saveFile, 'utf-8');
      const gameState: GameState = JSON.parse(saveData);

      // Recreate player character
      this.player = this.createCharacter(gameState.player.name, gameState.player.class);
      
      // Restore player state (simplified - in real game you'd need more complex restoration)
      this.currentLevel = gameState.currentLevel;
      this.gameTime = gameState.gameTime;

      // Restore inventory
      this.inventory = new Inventory<BaseItem>(gameState.inventory.maxSlots);
      gameState.inventory.items.forEach(itemData => {
        const item = this.createItemFromData(itemData);
        if (item) {
          this.inventory.addItem(item);
        }
      });

      console.log(`📁 Game '${saveName}' loaded successfully!`);
      console.log(`\n${this.player.getInfo()}`);
      
      await this.gameLoop();
    } catch (error) {
      console.error(`❌ Failed to load game '${saveName}':`, error);
    }
  }

  async listSaves(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.saveDirectory);
      return files.filter(file => file.endsWith('.json')).map(file => file.replace('.json', ''));
    } catch (error) {
      console.error('❌ Failed to list saves:', error);
      return [];
    }
  }
}

// TODO: Implement additional game features
// - Quest system
// - NPC interactions
// - Shop system
// - Crafting system
// - Multiple areas/dungeons
