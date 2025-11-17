#!/usr/bin/env node

import { Game } from './game/Game';
import { CharacterClass } from './types';

async function main() {
  console.log(`
🎮 Welcome to TypeScript RPG!
================================

This is a demonstration game showcasing TypeScript features:
- Classes and inheritance
- Interfaces and types
- Generics
- Decorators
- Async/await
- And much more!
`);

  const game = new Game();

  try {
    // Check for existing saves
    const saves = await game.listSaves();
    
    if (saves.length > 0) {
      console.log("\n💾 Found existing saves:");
      saves.forEach((save, index) => {
        console.log(`${index + 1}. ${save}`);
      });
      console.log(`${saves.length + 1}. Start new game`);
      
      // For demo purposes, always start new game
      // In real implementation, you'd get user input here
      console.log("\n🆕 Starting new game for demo...");
    }

    // Demo character creation
    const playerName = "Hero";
    const characterClasses: CharacterClass[] = ["warrior", "mage", "rogue"];
    const selectedClass = characterClasses[Math.floor(Math.random() * characterClasses.length)];
    
    console.log(`\n🎭 Creating character: ${playerName} the ${selectedClass}`);
    
    await game.startNewGame(playerName, selectedClass);
    
  } catch (error) {
    console.error("❌ Game error:", error);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Thanks for playing TypeScript RPG!');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the game
if (require.main === module) {
  main().catch(console.error);
}

export { main };
