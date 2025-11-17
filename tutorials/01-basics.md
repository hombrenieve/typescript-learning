# TypeScript Basics

## 1. Type Annotations

```typescript
// Basic types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let items: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 42];

// Any type (avoid when possible)
let anything: any = "could be anything";
```

## 2. Functions

```typescript
// Function with typed parameters and return type
function add(a: number, b: number): number {
  return a + b;
}

// Optional parameters
function greet(name: string, title?: string): string {
  return title ? `Hello, ${title} ${name}` : `Hello, ${name}`;
}

// Default parameters
function multiply(a: number, b: number = 1): number {
  return a * b;
}

// Arrow functions
const divide = (a: number, b: number): number => a / b;
```

## 3. Interfaces

```typescript
interface Person {
  name: string;
  age: number;
  email?: string; // Optional property
  readonly id: number; // Read-only property
}

const person: Person = {
  id: 1,
  name: "Alice",
  age: 25
};
```

## Exercise
Create a file `exercises/01-basics.ts` and implement:
1. A function that takes two numbers and returns their sum
2. An interface for a Book with title, author, and optional year
3. Create an array of books and display them
