# TypeScript Complete Reference Guide

## Table of Contents
1. [Type System](#type-system)
2. [Functions](#functions)
3. [Classes](#classes)
4. [Interfaces & Types](#interfaces--types)
5. [Generics](#generics)
6. [Modules](#modules)
7. [Decorators](#decorators)
8. [Utility Types](#utility-types)
9. [Advanced Patterns](#advanced-patterns)
10. [Compiler Options](#compiler-options)

## Type System

### Primitive Types
```typescript
let str: string = "hello";
let num: number = 42;
let bool: boolean = true;
let sym: symbol = Symbol("key");
let big: bigint = 100n;
let undef: undefined = undefined;
let nul: null = null;
```

### Array Types
```typescript
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];
let mixed: (string | number)[] = [1, "two", 3];
let readonly: ReadonlyArray<number> = [1, 2, 3];
```

### Tuple Types
```typescript
let tuple: [string, number] = ["hello", 42];
let namedTuple: [name: string, age: number] = ["John", 30];
let optionalTuple: [string, number?] = ["hello"];
let restTuple: [string, ...number[]] = ["hello", 1, 2, 3];
```

### Object Types
```typescript
let obj: { name: string; age: number } = { name: "John", age: 30 };
let optional: { name: string; age?: number } = { name: "John" };
let indexed: { [key: string]: any } = { prop1: "value1" };
```

### Union and Intersection Types
```typescript
type StringOrNumber = string | number;
type Combined = { name: string } & { age: number };

// Discriminated unions
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };
```

### Literal Types
```typescript
type Direction = "up" | "down" | "left" | "right";
type OneToFive = 1 | 2 | 3 | 4 | 5;
type EventName = `on${Capitalize<string>}`;
```

## Functions

### Function Types
```typescript
// Function declaration
function add(a: number, b: number): number {
  return a + b;
}

// Function expression
const multiply = (a: number, b: number): number => a * b;

// Function type
type MathOperation = (a: number, b: number) => number;

// Optional and default parameters
function greet(name: string, greeting = "Hello", punctuation?: string): string {
  return `${greeting}, ${name}${punctuation || "!"}`;
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

// Overloads
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
  return typeof value === "string" ? value.toUpperCase() : value * 2;
}
```

### This Parameter
```typescript
interface Handler {
  info: string;
}

function callback(this: Handler, event: Event): void {
  console.log(this.info);
}
```

## Classes

### Basic Class Syntax
```typescript
class Animal {
  public name: string;
  protected species: string;
  private age: number;
  readonly id: number;
  static count = 0;

  constructor(name: string, species: string, age: number) {
    this.name = name;
    this.species = species;
    this.age = age;
    this.id = ++Animal.count;
  }

  public speak(): void {
    console.log(`${this.name} makes a sound`);
  }

  protected getSpecies(): string {
    return this.species;
  }

  private getAge(): number {
    return this.age;
  }

  static getCount(): number {
    return Animal.count;
  }
}
```

### Inheritance
```typescript
class Dog extends Animal {
  constructor(name: string, age: number, public breed: string) {
    super(name, "Canine", age);
  }

  public speak(): void {
    console.log(`${this.name} barks`);
  }

  public getInfo(): string {
    return `${this.name} is a ${this.breed} (${this.getSpecies()})`;
  }
}
```

### Abstract Classes
```typescript
abstract class Shape {
  abstract calculateArea(): number;
  abstract calculatePerimeter(): number;

  display(): void {
    console.log(`Area: ${this.calculateArea()}, Perimeter: ${this.calculatePerimeter()}`);
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }

  calculatePerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}
```

### Getters and Setters
```typescript
class Temperature {
  private _celsius: number = 0;

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    this._celsius = value;
  }

  get fahrenheit(): number {
    return (this._celsius * 9/5) + 32;
  }

  set fahrenheit(value: number) {
    this._celsius = (value - 32) * 5/9;
  }
}
```

## Interfaces & Types

### Interface Declaration
```typescript
interface User {
  readonly id: number;
  name: string;
  email?: string;
  [key: string]: any; // Index signature
}

// Interface extension
interface Admin extends User {
  permissions: string[];
}

// Interface merging
interface User {
  lastLogin?: Date;
}
```

### Function Interfaces
```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

interface StringArray {
  [index: number]: string;
}

interface NumberDictionary {
  [index: string]: number;
}
```

### Type Aliases
```typescript
type Point = {
  x: number;
  y: number;
};

type EventHandler<T> = (event: T) => void;
type Predicate<T> = (item: T) => boolean;
```

## Generics

### Generic Functions
```typescript
function identity<T>(arg: T): T {
  return arg;
}

function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn);
}

// Generic constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

### Generic Classes
```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;

  constructor(zeroValue: T, addFn: (x: T, y: T) => T) {
    this.zeroValue = zeroValue;
    this.add = addFn;
  }
}
```

### Generic Interfaces
```typescript
interface GenericIdentityFn<T> {
  (arg: T): T;
}

interface Repository<T> {
  findById(id: string): T | undefined;
  save(entity: T): void;
  delete(id: string): boolean;
}
```

## Modules

### ES6 Modules
```typescript
// Exporting
export const PI = 3.14159;
export function add(a: number, b: number): number {
  return a + b;
}

export class Calculator {
  multiply(a: number, b: number): number {
    return a * b;
  }
}

export default class DefaultCalculator {
  divide(a: number, b: number): number {
    return a / b;
  }
}

// Re-exporting
export { add as addition } from './math';
export * from './utils';

// Importing
import DefaultCalculator, { PI, add, Calculator } from './math';
import * as MathUtils from './math';
```

### Namespaces
```typescript
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }

  const lettersRegexp = /^[A-Za-z]+$/;
  const numberRegexp = /^[0-9]+$/;

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }

  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
```

## Decorators

### Class Decorators
```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
  return class extends constructor {
    newProperty = "new property";
    hello = "override";
  }
}

@sealed
@classDecorator
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

### Method Decorators
```typescript
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

function log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Call: ${propertyName}(${JSON.stringify(args)}) => ${JSON.stringify(method.apply(this, args))}`);
    return method.apply(this, args);
  };
}

class Calculator {
  @enumerable(false)
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}
```

### Property Decorators
```typescript
function format(formatString: string) {
  return function (target: any, propertyKey: string) {
    let value = target[propertyKey];

    const getter = () => value;
    const setter = (newVal: string) => {
      value = formatString.replace('%s', newVal);
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

class Greeter {
  @format("Hello, %s")
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }
}
```

## Utility Types

### Built-in Utility Types
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial<T> - makes all properties optional
type PartialUser = Partial<User>;

// Required<T> - makes all properties required
type RequiredUser = Required<PartialUser>;

// Readonly<T> - makes all properties readonly
type ReadonlyUser = Readonly<User>;

// Pick<T, K> - picks specific properties
type UserSummary = Pick<User, "id" | "name">;

// Omit<T, K> - omits specific properties
type CreateUser = Omit<User, "id">;

// Record<K, T> - creates object type with specific keys
type UserRoles = Record<string, "admin" | "user" | "guest">;

// Exclude<T, U> - excludes types from union
type NonStringTypes = Exclude<string | number | boolean, string>;

// Extract<T, U> - extracts types from union
type StringTypes = Extract<string | number | boolean, string>;

// NonNullable<T> - excludes null and undefined
type NonNullableString = NonNullable<string | null | undefined>;

// ReturnType<T> - gets return type of function
type AddResult = ReturnType<typeof add>;

// Parameters<T> - gets parameter types of function
type AddParams = Parameters<typeof add>;

// ConstructorParameters<T> - gets constructor parameter types
type UserConstructorParams = ConstructorParameters<typeof User>;

// InstanceType<T> - gets instance type of constructor
type UserInstance = InstanceType<typeof User>;
```

### Template Literal Types
```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<"click">; // "onClick"

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
```

## Advanced Patterns

### Conditional Types
```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
type Flatten<T> = T extends any[] ? T[number] : T;

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type StrArrOrNumArr = ToArray<string | number>; // string[] | number[]
```

### Mapped Types
```typescript
type Optional<T> = {
  [P in keyof T]?: T[P];
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};
```

### Index Types
```typescript
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map(n => o[n]);
}

interface Person {
  name: string;
  age: number;
}

let person: Person = {
  name: 'Jarid',
  age: 35
};

let strings: string[] = pluck(person, ['name']); // ok, string[]
```

## Compiler Options

### Key tsconfig.json Options
```json
{
  "compilerOptions": {
    // Basic Options
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    
    // Strict Type-Checking Options
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    
    // Module Resolution Options
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    
    // Advanced Options
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Compiler Flags
```bash
# Compile with specific options
tsc --target ES2020 --module commonjs --strict

# Check types without emitting
tsc --noEmit

# Watch mode
tsc --watch

# Generate declaration files
tsc --declaration

# Specific file compilation
tsc file.ts --outDir dist
```
