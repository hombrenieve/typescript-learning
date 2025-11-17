import { BaseCharacter } from '../characters/BaseCharacter';
import { CombatAction, CombatResult, ActionType } from '../types';
import { log } from '../utils/decorators';

export interface CombatParticipant {
  character: BaseCharacter;
  isPlayer: boolean;
}

export class CombatSystem {
  private participants: CombatParticipant[] = [];
  private currentTurn: number = 0;
  private combatLog: CombatAction[] = [];

  constructor(
    private player: BaseCharacter,
    private enemies: BaseCharacter[]
  ) {
    this.participants.push({ character: player, isPlayer: true });
    enemies.forEach(enemy => {
      this.participants.push({ character: enemy, isPlayer: false });
    });

    // Sort by speed (fastest first)
    this.participants.sort((a, b) => b.character.stats.speed - a.character.stats.speed);
  }

  @log
  startCombat(): CombatResult {
    console.log("\n⚔️ Combat begins!");
    this.displayParticipants();

    while (!this.isCombatOver()) {
      const currentParticipant = this.getCurrentParticipant();
      
      if (currentParticipant.character.isAlive) {
        if (currentParticipant.isPlayer) {
          this.playerTurn(currentParticipant.character);
        } else {
          this.enemyTurn(currentParticipant.character);
        }
      }

      this.nextTurn();
    }

    return this.getCombatResult();
  }

  private getCurrentParticipant(): CombatParticipant {
    return this.participants[this.currentTurn % this.participants.length];
  }

  private nextTurn(): void {
    this.currentTurn++;
  }

  private isCombatOver(): boolean {
    const aliveEnemies = this.participants.filter(p => !p.isPlayer && p.character.isAlive);
    const alivePlayer = this.participants.find(p => p.isPlayer && p.character.isAlive);
    
    return aliveEnemies.length === 0 || !alivePlayer;
  }

  private playerTurn(player: BaseCharacter): void {
    console.log(`\n🎯 ${player.name}'s turn!`);
    
    // For demo purposes, use simple AI for player actions
    // In a real game, this would be user input
    const aliveEnemies = this.participants
      .filter(p => !p.isPlayer && p.character.isAlive)
      .map(p => p.character);

    if (aliveEnemies.length === 0) return;

    const target = aliveEnemies[0]; // Attack first alive enemy
    const action = this.choosePlayerAction(player, target);
    this.executeAction(action);
  }

  private enemyTurn(enemy: BaseCharacter): void {
    console.log(`\n👹 ${enemy.name}'s turn!`);
    
    const playerParticipant = this.participants.find(p => p.isPlayer);
    if (!playerParticipant || !playerParticipant.character.isAlive) return;

    const action = this.chooseEnemyAction(enemy, playerParticipant.character);
    this.executeAction(action);
  }

  private choosePlayerAction(player: BaseCharacter, target: BaseCharacter): CombatAction {
    // Simple AI: 70% attack, 20% special ability, 10% defend
    const rand = Math.random();
    
    if (rand < 0.7) {
      return {
        type: "attack",
        actor: player.name,
        target: target.name
      };
    } else if (rand < 0.9 && player.stats.mana >= 15) {
      return {
        type: "attack", // Special ability treated as attack for simplicity
        actor: player.name,
        target: target.name
      };
    } else {
      return {
        type: "defend",
        actor: player.name
      };
    }
  }

  private chooseEnemyAction(enemy: BaseCharacter, target: BaseCharacter): CombatAction {
    // Simple enemy AI: 80% attack, 20% defend
    const rand = Math.random();
    
    if (rand < 0.8) {
      return {
        type: "attack",
        actor: enemy.name,
        target: target.name
      };
    } else {
      return {
        type: "defend",
        actor: enemy.name
      };
    }
  }

  @log
  private executeAction(action: CombatAction): void {
    const actor = this.findCharacterByName(action.actor);
    const target = action.target ? this.findCharacterByName(action.target) : undefined;

    if (!actor) return;

    switch (action.type) {
      case "attack":
        if (target) {
          const damage = actor.attack(target);
          action.damage = damage;
          console.log(`💥 ${actor.name} attacks ${target.name} for ${damage} damage!`);
        }
        break;

      case "defend":
        console.log(`🛡️ ${actor.name} defends, reducing incoming damage!`);
        // Temporarily increase defense (simplified)
        break;

      case "flee":
        console.log(`💨 ${actor.name} attempts to flee!`);
        // Implement flee logic
        break;
    }

    this.combatLog.push(action);
  }

  private findCharacterByName(name: string): BaseCharacter | undefined {
    return this.participants.find(p => p.character.name === name)?.character;
  }

  private getCombatResult(): CombatResult {
    const aliveEnemies = this.participants.filter(p => !p.isPlayer && p.character.isAlive);
    const playerAlive = this.participants.find(p => p.isPlayer && p.character.isAlive);

    let winner: string | undefined;
    let experience = 0;

    if (playerAlive && aliveEnemies.length === 0) {
      winner = playerAlive.character.name;
      experience = this.calculateExperience();
      console.log(`\n🎉 Victory! ${winner} gains ${experience} experience!`);
    } else if (!playerAlive) {
      winner = aliveEnemies[0]?.character.name;
      console.log(`\n💀 Defeat! ${winner} is victorious!`);
    }

    return {
      actions: this.combatLog,
      winner,
      experience,
      loot: this.generateLoot()
    };
  }

  private calculateExperience(): number {
    const defeatedEnemies = this.participants.filter(p => !p.isPlayer && !p.character.isAlive);
    return defeatedEnemies.reduce((exp, enemy) => exp + (enemy.character.level * 25), 0);
  }

  private generateLoot(): any[] {
    // Simple loot generation
    const loot = [];
    const rand = Math.random();
    
    if (rand < 0.3) {
      loot.push({ id: 'potion', name: 'Health Potion', type: 'consumable', quantity: 1, value: 50 });
    }
    
    if (rand < 0.1) {
      loot.push({ id: 'sword', name: 'Iron Sword', type: 'weapon', quantity: 1, value: 100 });
    }

    return loot;
  }

  private displayParticipants(): void {
    console.log("\n👥 Combat Participants:");
    this.participants.forEach(p => {
      const icon = p.isPlayer ? "🧙" : "👹";
      console.log(`${icon} ${p.character.name} (Level ${p.character.level}) - HP: ${p.character.stats.health}/${p.character.stats.maxHealth}`);
    });
  }
}

// TODO: Implement advanced combat features
// - Status effects (poison, burn, freeze)
// - Area of effect attacks
// - Combat items usage
// - Combo attacks
// - Environmental hazards
