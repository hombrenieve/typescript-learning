// Exercise 2: Advanced Types

// TODO: 1. Create a generic Stack class
class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    // Your implementation here
  }
  
  pop(): T | undefined {
    // Your implementation here
    return undefined;
  }
  
  peek(): T | undefined {
    // Your implementation here
    return undefined;
  }
  
  isEmpty(): boolean {
    // Your implementation here
    return true;
  }
}

// TODO: 2. Create a union type for payment methods
type PaymentMethod = "credit" | "debit" | "paypal" | "cash";

function processPayment(method: PaymentMethod, amount: number): string {
  // Your implementation here
  return "";
}

// TODO: 3. Use utility types for user management
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: "admin" | "user";
}

// Create types using utility types
type CreateUserData = Omit<User, "id">;
type UserSummary = Pick<User, "id" | "name" | "role">;
type PartialUserUpdate = Partial<Pick<User, "name" | "email" | "age">>;

function createUser(userData: CreateUserData): User {
  // Your implementation here
  return {} as User;
}

function updateUser(id: number, updates: PartialUserUpdate): User {
  // Your implementation here
  return {} as User;
}

// Test your implementations
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
console.log("Stack peek:", stack.peek());
console.log("Stack pop:", stack.pop());

console.log("Payment result:", processPayment("credit", 100));
