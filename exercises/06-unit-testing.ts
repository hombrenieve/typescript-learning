// Exercise 6: Unit Testing in TypeScript

// TODO: Install testing dependencies first:
// npm install -D jest @types/jest ts-jest

// TODO: Create jest.config.js in project root:
/*
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/exercises'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    'exercises/**/*.ts',
    '!**/*.d.ts',
  ],
};
*/

// ===== CLASSES TO TEST =====

export class Calculator {
  private history: number[] = [];

  add(a: number, b: number): number {
    const result = a + b;
    this.history.push(result);
    return result;
  }

  subtract(a: number, b: number): number {
    const result = a - b;
    this.history.push(result);
    return result;
  }

  multiply(a: number, b: number): number {
    const result = a * b;
    this.history.push(result);
    return result;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero is not allowed');
    }
    const result = a / b;
    this.history.push(result);
    return result;
  }

  getHistory(): number[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  getLastResult(): number | undefined {
    return this.history[this.history.length - 1];
  }
}

// Generic Stack implementation
export class Stack<T> {
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

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  toArray(): T[] {
    return [...this.items];
  }
}

// Interface for external dependency
export interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<boolean>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<boolean>;
}

export class UserManager {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService
  ) {}

  async createUser(name: string, email: string): Promise<User> {
    if (!name.trim()) {
      throw new Error('Name is required');
    }
    
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    const user: User = {
      id: this.generateId(),
      name: name.trim(),
      email: email.toLowerCase(),
      isActive: true
    };

    await this.userRepo.save(user);
    
    // Send welcome email
    await this.emailService.sendEmail(
      user.email,
      'Welcome!',
      `Hello ${user.name}, welcome to our platform!`
    );

    return user;
  }

  async deactivateUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = false;
    await this.userRepo.save(user);

    // Send deactivation email
    await this.emailService.sendEmail(
      user.email,
      'Account Deactivated',
      `Hello ${user.name}, your account has been deactivated.`
    );
  }

  async updateUserEmail(id: string, newEmail: string): Promise<void> {
    if (!this.isValidEmail(newEmail)) {
      throw new Error('Invalid email format');
    }

    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const oldEmail = user.email;
    user.email = newEmail.toLowerCase();
    await this.userRepo.save(user);

    // Send confirmation to both emails
    await Promise.all([
      this.emailService.sendEmail(
        oldEmail,
        'Email Changed',
        'Your email address has been updated.'
      ),
      this.emailService.sendEmail(
        newEmail,
        'Email Confirmed',
        'Your new email address has been confirmed.'
      )
    ]);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Async utility function
export async function fetchUserData(userId: string): Promise<any> {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Function with retry logic
export async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// ===== TODO: CREATE TEST FILES =====

/*
TODO: Create Calculator.test.ts with tests for:
1. Basic arithmetic operations (add, subtract, multiply, divide)
2. Division by zero error handling
3. History tracking functionality
4. Edge cases (negative numbers, decimals, zero)

Example test structure:
```typescript
import { Calculator } from './06-unit-testing';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    test('should add positive numbers correctly', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test('should add negative numbers correctly', () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });

    test('should record result in history', () => {
      calculator.add(2, 3);
      expect(calculator.getHistory()).toContain(5);
    });
  });

  // Add more test suites for subtract, multiply, divide, etc.
});
```

TODO: Create Stack.test.ts with tests for:
1. Generic functionality with different types (string, number, objects)
2. LIFO (Last In, First Out) behavior
3. Empty stack edge cases
4. Size and isEmpty methods

TODO: Create UserManager.test.ts with tests for:
1. User creation with validation
2. Email service integration (using mocks)
3. Repository integration (using mocks)
4. Error handling scenarios
5. Async operation testing

Example mock setup:
```typescript
import { UserManager, UserRepository, EmailService } from './06-unit-testing';

describe('UserManager', () => {
  let userManager: UserManager;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    mockUserRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    
    mockEmailService = {
      sendEmail: jest.fn(),
    };

    userManager = new UserManager(mockUserRepo, mockEmailService);
  });

  // Add your tests here
});
```

TODO: Create async function tests for:
1. fetchUserData with successful responses
2. fetchUserData with HTTP errors
3. fetchWithRetry with retry logic
4. Network timeout scenarios

TODO: Add these scripts to package.json:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

TODO: Run tests with:
- npm test (run all tests)
- npm run test:watch (watch mode for development)
- npm run test:coverage (generate coverage report)
*/
