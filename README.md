# TypeScript Learning Environment

A comprehensive offline TypeScript learning setup with tutorials, exercises, and a complete RPG game project.

## 🚀 Quick Setup (New Machine)

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation
```bash
# Clone or download this project
cd typescript-learning

# Install TypeScript and core dependencies
npm install -D typescript @types/node ts-node

# Install testing dependencies
npm install -D jest @types/jest ts-jest

# Verify installation
npm run dev  # Should run without errors
npm test     # Should run all tests
```

## Setup Complete ✅

Your environment includes:
- TypeScript compiler
- Node.js type definitions
- ts-node for direct execution
- Jest testing framework
- Proper project structure

## Quick Start

```bash
# Compile and run the test file
npm run build
npm start

# Or run directly with ts-node
npm run dev

# Watch mode for development
npm run watch
```

## 🧪 Testing

### Install Testing Dependencies (if not done above)
```bash
npm install -D jest @types/jest ts-jest
```

### Run Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode (great for development)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Test specific parts
npm run test:game          # Game project tests only
npm run test:exercises     # Exercise tests only
```

### Test Coverage
The project includes comprehensive tests with coverage reporting:
- **50+ test cases** covering all major TypeScript concepts
- **Coverage thresholds** set to 70%+ for quality assurance
- **Real-world examples** from the RPG game project

## Project Structure

```
typescript-learning/
├── src/           # Source files
├── exercises/     # Practice exercises
├── tutorials/     # Learning materials
├── game-project/  # Complete RPG game
│   ├── src/       # Game source code
│   └── tests/     # Game test files
├── reference/     # Documentation and guides
├── dist/          # Compiled JavaScript (after build)
├── coverage/      # Test coverage reports (after npm run test:coverage)
└── tsconfig.json  # TypeScript configuration
```

## Learning Path

1. **Basics** (`tutorials/01-basics.md`)
   - Type annotations
   - Functions
   - Interfaces
   - Exercise: `exercises/01-basics.ts`

2. **Advanced Types** (`tutorials/02-advanced-types.md`)
   - Union and intersection types
   - Generics
   - Utility types
   - Exercise: `exercises/02-advanced-types.ts`

3. **Classes & OOP** (`tutorials/03-classes-oop.md`)
   - Classes and inheritance
   - Abstract classes
   - Static members
   - Exercise: `exercises/03-classes-oop.ts`

4. **Modules** (`tutorials/04-modules.md`)
   - ES6 modules
   - Namespaces
   - Module resolution
   - Exercise: `exercises/04-modules.ts`

5. **Advanced Features** (`tutorials/05-decorators-async.md`)
   - Decorators
   - Async/await
   - Generic promises
   - Exercise: `exercises/05-decorators-async.ts`

6. **Unit Testing** (`tutorials/06-unit-testing.md`) ⭐
   - Jest setup and configuration
   - Testing classes and functions
   - Mocking and spying
   - Async testing patterns
   - Exercise: `exercises/06-unit-testing.ts`

## 🎮 RPG Game Project

A complete text-based RPG demonstrating all TypeScript concepts:

```bash
# Run the game
cd game-project
npx ts-node src/main.ts

# Test the game
npm run test:game
```

**Features:**
- Character classes (Warrior, Mage, Rogue)
- Turn-based combat system
- Inventory management with generics
- Save/load functionality
- Comprehensive test suite

## Running Exercises

```bash
# Run specific exercise
npx ts-node exercises/01-basics.ts

# Or compile and run
npx tsc exercises/01-basics.ts
node exercises/01-basics.js
```

## 📚 Reference Materials

- `reference/typescript-reference.md` - Complete TypeScript reference
- `reference/advanced-patterns.md` - Advanced patterns and best practices
- `reference/testing-quick-reference.md` - Jest testing quick reference

## Available Scripts

```bash
# Development
npm run dev          # Run main TypeScript file directly
npm run build        # Compile TypeScript to JavaScript
npm run start        # Run compiled JavaScript
npm run watch        # Watch mode for development
npm run clean        # Remove compiled files

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:ci      # Run tests for CI/CD
npm run test:game    # Test game project only
npm run test:exercises # Test exercises only
```

## Tips for Offline Learning

- All tutorials are self-contained with examples
- Each exercise builds on previous concepts
- Use `tsc --noEmit` to check types without compiling
- Enable strict mode in tsconfig.json for better learning
- Run tests frequently to verify your implementations

## Key TypeScript Features to Master

- Type annotations and inference
- Interfaces vs types
- Generic programming
- Union and intersection types
- Class-based OOP
- Module system
- Async programming patterns
- Utility types (Partial, Pick, Omit, etc.)
- Unit testing with Jest

## Troubleshooting

### Common Issues

**"Cannot find module" errors:**
```bash
npm install  # Reinstall dependencies
```

**TypeScript compilation errors:**
```bash
npx tsc --noEmit  # Check types without compiling
```

**Test failures:**
```bash
npm run test:watch  # Run tests in watch mode for debugging
```

**Missing dependencies:**
```bash
# Install all required dependencies
npm install -D typescript @types/node ts-node jest @types/jest ts-jest
```

## Next Steps

1. **Complete the tutorials** in order (01-06)
2. **Work through exercises** - each builds on previous concepts
3. **Explore the game project** - see real-world TypeScript patterns
4. **Write tests** for your own code using the provided examples
5. **Extend the game** with your own features and classes

Happy learning! 🚀

---

**Need Help?**
- Check the `reference/` folder for detailed documentation
- Run `npm test` to see working examples
- Each tutorial includes practical exercises
- The game project demonstrates real-world usage
