# TypeScript RPG - Exercise Completion Guide

## 🎯 Learning Objectives
This project consolidates all major TypeScript concepts in a practical, engaging way. You'll work with real-world patterns while building a fun text-based RPG.

## 📋 Implementation Checklist

### Phase 1: Core Understanding (30 minutes)
- [ ] **Run the base game** - `npx ts-node src/main.ts`
- [ ] **Study the type system** - Examine `types.ts` for interfaces and unions
- [ ] **Understand decorators** - Look at `@log`, `@validate`, `@cooldown` in action
- [ ] **Explore inheritance** - See how `Warrior`, `Mage`, `Rogue` extend `BaseCharacter`

### Phase 2: Extend Character System (45 minutes)
- [ ] **Add new character class** - Create `Paladin` or `Archer`
  ```typescript
  export class Paladin extends BaseCharacter {
    // Implement healing abilities and high defense
    getSpecialAbility(): string { /* ... */ }
    useSpecialAbility(target?: BaseCharacter): number { /* ... */ }
  }
  ```

- [ ] **Implement status effects** - Add poison, burn, freeze
  ```typescript
  interface StatusEffect {
    type: "poison" | "burn" | "freeze";
    duration: number;
    effect: (character: BaseCharacter) => void;
  }
  ```

- [ ] **Add character traits** - Use intersection types
  ```typescript
  type CharacterTraits = {
    brave: boolean;
    lucky: boolean;
    cursed: boolean;
  };
  
  type EnhancedCharacter = BaseCharacter & CharacterTraits;
  ```

### Phase 3: Advanced Item System (45 minutes)
- [ ] **Create Armor class** - Implement defense bonuses
  ```typescript
  export class Armor extends BaseItem {
    constructor(
      id: string,
      name: string,
      quantity: number,
      value: number,
      public readonly defenseBonus: number,
      public readonly slot: "head" | "chest" | "legs" | "feet"
    ) {
      super(id, name, "armor", quantity, value);
    }
  }
  ```

- [ ] **Implement item rarity** - Use template literal types
  ```typescript
  type Rarity = "common" | "rare" | "epic" | "legendary";
  type RarityColor = `${Rarity}_color`;
  
  interface RarityConfig {
    dropChance: number;
    statMultiplier: number;
    color: string;
  }
  ```

- [ ] **Add crafting system** - Use generic constraints
  ```typescript
  interface Craftable {
    recipe: ItemData[];
    craft(): BaseItem;
  }
  
  class CraftingSystem<T extends BaseItem & Craftable> {
    craft(recipe: T): BaseItem | null { /* ... */ }
  }
  ```

### Phase 4: Enhanced Combat (30 minutes)
- [ ] **Add combo system** - Track consecutive actions
- [ ] **Implement critical hit types** - Different crit effects per class
- [ ] **Create environmental hazards** - Fire, ice, poison areas
- [ ] **Add team combat** - Multiple allies vs multiple enemies

### Phase 5: Game Systems (30 minutes)
- [ ] **Quest system** - Create quest interfaces and tracking
  ```typescript
  interface Quest {
    id: string;
    title: string;
    description: string;
    objectives: QuestObjective[];
    rewards: ItemData[];
    isComplete: boolean;
  }
  ```

- [ ] **Shop system** - NPC trading with dynamic prices
- [ ] **Achievement system** - Track player accomplishments
- [ ] **Leaderboard** - Save and compare high scores

## 🔧 Technical Challenges

### Advanced TypeScript Features to Implement

1. **Conditional Types**
   ```typescript
   type WeaponForClass<T extends CharacterClass> = 
     T extends "warrior" ? Sword :
     T extends "mage" ? Staff :
     T extends "rogue" ? Dagger : never;
   ```

2. **Mapped Types**
   ```typescript
   type CharacterStats<T> = {
     [K in keyof T]: T[K] extends number ? T[K] : never;
   };
   ```

3. **Template Literal Types**
   ```typescript
   type EventName<T extends string> = `on${Capitalize<T>}`;
   type CombatEvents = EventName<"attack" | "defend" | "heal">;
   ```

4. **Higher-Order Types**
   ```typescript
   type DeepReadonly<T> = {
     readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
   };
   ```

## 🎮 Gameplay Extensions

### Easy Extensions (15 minutes each)
- [ ] **Add more enemy types** with unique abilities
- [ ] **Create different areas** with themed enemies
- [ ] **Implement day/night cycle** affecting gameplay
- [ ] **Add character customization** options

### Medium Extensions (30 minutes each)
- [ ] **Multiplayer support** - Multiple characters in party
- [ ] **Skill trees** - Character progression paths
- [ ] **Dynamic events** - Random encounters and choices
- [ ] **Save file encryption** - Secure save data

### Advanced Extensions (45+ minutes)
- [ ] **AI behavior trees** - Complex enemy AI
- [ ] **Procedural generation** - Random dungeons
- [ ] **Real-time combat** - Action-based instead of turn-based
- [ ] **Web interface** - Convert to browser game

## 🧪 Testing Your Implementation

### Unit Tests to Write
```typescript
// Test character creation
describe('Character Creation', () => {
  it('should create warrior with correct stats', () => {
    const warrior = new Warrior('Test');
    expect(warrior.characterClass).toBe('warrior');
    expect(warrior.stats.health).toBeGreaterThan(100);
  });
});

// Test combat system
describe('Combat System', () => {
  it('should handle turn-based combat correctly', () => {
    const player = new Warrior('Player');
    const enemy = new Warrior('Enemy');
    const combat = new CombatSystem(player, [enemy]);
    const result = combat.startCombat();
    expect(result.winner).toBeDefined();
  });
});
```

## 🏆 Success Criteria

By the end of this exercise, you should have:

✅ **Demonstrated mastery of:**
- Class inheritance and abstract classes
- Interface design and implementation
- Generic programming with constraints
- Decorator usage and creation
- Module organization and imports
- Async/await patterns
- Union and intersection types
- Utility types and type manipulation

✅ **Built practical skills in:**
- Error handling and validation
- File I/O operations
- State management
- Event-driven programming
- Design patterns (Factory, Observer, Strategy)

✅ **Created a working game with:**
- Multiple character classes with unique abilities
- Turn-based combat system
- Inventory management
- Save/load functionality
- Extensible architecture

## 🚀 Next Steps

After completing this exercise:
1. **Refactor** - Improve code organization and add more types
2. **Optimize** - Add performance improvements and caching
3. **Extend** - Add your own creative features
4. **Share** - Show off your TypeScript skills!

Remember: The goal is learning TypeScript concepts through practical application. Don't worry about making it perfect - focus on understanding and experimenting with the language features!
