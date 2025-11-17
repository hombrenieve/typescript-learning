# Advanced Types

## 1. Union Types

```typescript
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

function processStatus(status: Status): void {
  switch (status) {
    case "pending":
      console.log("Processing...");
      break;
    case "approved":
      console.log("Approved!");
      break;
    case "rejected":
      console.log("Rejected!");
      break;
  }
}
```

## 2. Intersection Types

```typescript
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

type FlyingFish = Flyable & Swimmable;

const flyingFish: FlyingFish = {
  fly() { console.log("Flying!"); },
  swim() { console.log("Swimming!"); }
};
```

## 3. Generic Types

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Generic interface
interface Container<T> {
  value: T;
  getValue(): T;
}

class Box<T> implements Container<T> {
  constructor(public value: T) {}
  
  getValue(): T {
    return this.value;
  }
}

const stringBox = new Box<string>("hello");
const numberBox = new Box<number>(42);
```

## 4. Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - makes all properties optional
type PartialUser = Partial<User>;

// Pick - select specific properties
type UserSummary = Pick<User, "id" | "name">;

// Omit - exclude specific properties
type CreateUser = Omit<User, "id">;

// Record - create object type with specific keys
type UserRoles = Record<string, "admin" | "user" | "guest">;
```

## Exercise
Create `exercises/02-advanced-types.ts` and implement:
1. A generic Stack class with push/pop methods
2. A union type for different payment methods
3. Use utility types to create user management functions
