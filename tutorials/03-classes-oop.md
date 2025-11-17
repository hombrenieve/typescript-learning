# Classes and Object-Oriented Programming

## 1. Basic Classes

```typescript
class Animal {
  protected name: string;
  private age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  public speak(): void {
    console.log(`${this.name} makes a sound`);
  }
  
  protected getAge(): number {
    return this.age;
  }
}

class Dog extends Animal {
  private breed: string;
  
  constructor(name: string, age: number, breed: string) {
    super(name, age);
    this.breed = breed;
  }
  
  public speak(): void {
    console.log(`${this.name} barks`);
  }
  
  public getInfo(): string {
    return `${this.name} is a ${this.breed}, age ${this.getAge()}`;
  }
}
```

## 2. Abstract Classes

```typescript
abstract class Shape {
  abstract calculateArea(): number;
  
  display(): void {
    console.log(`Area: ${this.calculateArea()}`);
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  
  calculateArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }
  
  calculateArea(): number {
    return this.width * this.height;
  }
}
```

## 3. Static Members and Getters/Setters

```typescript
class Counter {
  private static instanceCount = 0;
  private _value = 0;
  
  constructor() {
    Counter.instanceCount++;
  }
  
  static getInstanceCount(): number {
    return Counter.instanceCount;
  }
  
  get value(): number {
    return this._value;
  }
  
  set value(newValue: number) {
    if (newValue >= 0) {
      this._value = newValue;
    }
  }
  
  increment(): void {
    this._value++;
  }
}
```

## Exercise
Create `exercises/03-classes-oop.ts` and implement:
1. A Vehicle abstract class with concrete Car and Motorcycle subclasses
2. A BankAccount class with private balance and public deposit/withdraw methods
3. Use static methods to track total number of accounts created
