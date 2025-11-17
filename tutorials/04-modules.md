# Modules and Namespaces

## 1. ES6 Modules

### Exporting

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;

// Default export
export default class Calculator {
  multiply(a: number, b: number): number {
    return a * b;
  }
}
```

### Importing

```typescript
// main.ts
import Calculator, { add, subtract, PI } from './math';
import * as MathUtils from './math';

const calc = new Calculator();
console.log(add(5, 3));
console.log(MathUtils.subtract(10, 4));
```

## 2. Namespaces

```typescript
namespace Geometry {
  export interface Point {
    x: number;
    y: number;
  }
  
  export class Circle {
    constructor(public center: Point, public radius: number) {}
    
    area(): number {
      return Math.PI * this.radius ** 2;
    }
  }
  
  export namespace Utils {
    export function distance(p1: Point, p2: Point): number {
      return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    }
  }
}

// Usage
const point: Geometry.Point = { x: 0, y: 0 };
const circle = new Geometry.Circle(point, 5);
const dist = Geometry.Utils.distance({ x: 0, y: 0 }, { x: 3, y: 4 });
```

## 3. Module Resolution

```typescript
// types.ts
export interface User {
  id: number;
  name: string;
}

// userService.ts
import { User } from './types';

export class UserService {
  private users: User[] = [];
  
  addUser(user: User): void {
    this.users.push(user);
  }
  
  getUser(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }
}
```

## Exercise
Create `exercises/04-modules.ts` and supporting files:
1. Create a `logger.ts` module with different log levels
2. Create a `validation.ts` module with email/phone validators
3. Import and use these modules in your main exercise file
