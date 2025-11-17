// Exercise 2: Advanced Types

class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
  
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

type PaymentMethod = "credit" | "debit" | "paypal" | "cash";

//Initialize credits for user in the different payment methods
let userCredits: Record<PaymentMethod, number> = {
  credit: 500,
  debit: 300,
  paypal: 200,
  cash: 100,
};

function processPayment(method: PaymentMethod, amount: number): string {
  console.log(`Processing ${amount} payment via ${method}.`);
  if (userCredits[method] >= amount) {
    userCredits[method] -= amount;
    return `Payment of ${amount} via ${method} successful. Remaining credit: ${userCredits[method]}`;
  } else {
    return `Insufficient credit for ${method}. Available: ${userCredits[method]}, Required: ${amount}`;
  }
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
  // add autoincrement id logic here
  const newUser: User = {
    id: Math.floor(Math.random() * 10000), // Simulated ID generation
    ...userData,
  };
  return newUser;
}

function updateUser(id: number, updates: PartialUserUpdate): User {
  //Create a mock user for demonstration
  const existingUser: User = {
    id,
    name: "John Doe",
    email: "john.doe@nowhere.is",
    age: 30,
    role: "user",
  };
  const updatedUser: User = {
    ...existingUser,
    ...updates,
  };
  return updatedUser;
}

// Test your implementations
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
console.log("Stack peek:", stack.peek());
console.log("Stack pop:", stack.pop());
console.log("Is stack empty?", stack.isEmpty());
console.log("What is left?", stack.peek());

console.log("Payment result:", processPayment("credit", 100));
console.log("Payment result:", processPayment("paypal", 250));

const newUser = createUser({ name: "Alice", email: "alice.in.wonderland@is.she", age: 28, role: "admin" });
console.log("New User:", newUser);

const updatedUser = updateUser(1, { email: "newmail@is.he" });
console.log("Updated User:", updatedUser);