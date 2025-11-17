# Unit Testing in TypeScript

## 1. Testing Setup with Jest

### Install Testing Dependencies
```bash
npm install -D jest @types/jest ts-jest
```

### Jest Configuration (jest.config.js)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
```

## 2. Basic Test Structure

### Simple Function Testing
```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// math.test.ts
import { add, divide } from './math';

describe('Math functions', () => {
  test('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });

  test('should divide two numbers correctly', () => {
    expect(divide(10, 2)).toBe(5);
    expect(divide(7, 2)).toBe(3.5);
  });

  test('should throw error when dividing by zero', () => {
    expect(() => divide(5, 0)).toThrow('Division by zero');
  });
});
```

## 3. Testing Classes

### Class Under Test
```typescript
// Calculator.ts
export class Calculator {
  private history: string[] = [];

  add(a: number, b: number): number {
    const result = a + b;
    this.history.push(`${a} + ${b} = ${result}`);
    return result;
  }

  subtract(a: number, b: number): number {
    const result = a - b;
    this.history.push(`${a} - ${b} = ${result}`);
    return result;
  }

  getHistory(): string[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }
}
```

### Class Tests
```typescript
// Calculator.test.ts
import { Calculator } from './Calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  afterEach(() => {
    calculator.clearHistory();
  });

  describe('add', () => {
    test('should add positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test('should add negative numbers', () => {
      expect(calculator.add(-2, -3)).toBe(-5);
    });

    test('should record operation in history', () => {
      calculator.add(2, 3);
      expect(calculator.getHistory()).toContain('2 + 3 = 5');
    });
  });

  describe('subtract', () => {
    test('should subtract numbers correctly', () => {
      expect(calculator.subtract(5, 3)).toBe(2);
    });

    test('should handle negative results', () => {
      expect(calculator.subtract(3, 5)).toBe(-2);
    });
  });

  describe('history management', () => {
    test('should start with empty history', () => {
      expect(calculator.getHistory()).toEqual([]);
    });

    test('should clear history', () => {
      calculator.add(1, 1);
      calculator.clearHistory();
      expect(calculator.getHistory()).toEqual([]);
    });

    test('should maintain operation order', () => {
      calculator.add(1, 2);
      calculator.subtract(5, 3);
      const history = calculator.getHistory();
      expect(history[0]).toBe('1 + 2 = 3');
      expect(history[1]).toBe('5 - 3 = 2');
    });
  });
});
```

## 4. Testing with Mocks and Spies

### Service with Dependencies
```typescript
// UserService.ts
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async getUser(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUserEmail(id: string, newEmail: string): Promise<void> {
    const user = await this.getUser(id);
    user.email = newEmail;
    await this.userRepo.save(user);
  }
}
```

### Testing with Mocks
```typescript
// UserService.test.ts
import { UserService, UserRepository, User } from './UserService';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepo = {
      findById: jest.fn(),
      save: jest.fn(),
    };
    userService = new UserService(mockUserRepo);
  });

  describe('getUser', () => {
    test('should return user when found', async () => {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      };
      mockUserRepo.findById.mockResolvedValue(mockUser);

      const result = await userService.getUser('1');

      expect(result).toEqual(mockUser);
      expect(mockUserRepo.findById).toHaveBeenCalledWith('1');
    });

    test('should throw error when user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(userService.getUser('1')).rejects.toThrow('User not found');
    });
  });

  describe('updateUserEmail', () => {
    test('should update user email', async () => {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'old@example.com'
      };
      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockUserRepo.save.mockResolvedValue();

      await userService.updateUserEmail('1', 'new@example.com');

      expect(mockUser.email).toBe('new@example.com');
      expect(mockUserRepo.save).toHaveBeenCalledWith(mockUser);
    });
  });
});
```

## 5. Testing Async Code

### Async Function Testing
```typescript
// ApiService.ts
export class ApiService {
  async fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async fetchWithRetry(url: string, maxRetries: number = 3): Promise<any> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.fetchData(url);
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}

// ApiService.test.ts
import { ApiService } from './ApiService';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService();
    mockFetch.mockClear();
  });

  describe('fetchData', () => {
    test('should fetch data successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await apiService.fetchData('https://api.example.com/data');

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data');
    });

    test('should throw error on HTTP error', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      await expect(apiService.fetchData('https://api.example.com/data'))
        .rejects.toThrow('HTTP error! status: 404');
    });
  });

  describe('fetchWithRetry', () => {
    test('should retry on failure', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue({
          ok: true,
          json: async () => ({ success: true }),
        } as Response);

      const result = await apiService.fetchWithRetry('https://api.example.com/data');

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });
});
```

## 6. Testing TypeScript-Specific Features

### Testing Generics
```typescript
// Container.ts
export class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }
}

// Container.test.ts
import { Container } from './Container';

describe('Container', () => {
  describe('with strings', () => {
    let container: Container<string>;

    beforeEach(() => {
      container = new Container<string>();
    });

    test('should store and retrieve strings', () => {
      container.add('hello');
      container.add('world');

      expect(container.get(0)).toBe('hello');
      expect(container.get(1)).toBe('world');
      expect(container.getAll()).toEqual(['hello', 'world']);
    });

    test('should filter strings', () => {
      container.add('apple');
      container.add('banana');
      container.add('apricot');

      const filtered = container.filter(item => item.startsWith('ap'));
      expect(filtered).toEqual(['apple', 'apricot']);
    });
  });

  describe('with numbers', () => {
    let container: Container<number>;

    beforeEach(() => {
      container = new Container<number>();
    });

    test('should store and retrieve numbers', () => {
      container.add(1);
      container.add(2);

      expect(container.getAll()).toEqual([1, 2]);
    });
  });
});
```

## 7. Test Coverage and Best Practices

### Coverage Configuration
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  },
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### Testing Best Practices

#### 1. AAA Pattern (Arrange, Act, Assert)
```typescript
test('should calculate total price with tax', () => {
  // Arrange
  const price = 100;
  const taxRate = 0.1;
  const calculator = new PriceCalculator();

  // Act
  const total = calculator.calculateWithTax(price, taxRate);

  // Assert
  expect(total).toBe(110);
});
```

#### 2. Descriptive Test Names
```typescript
// Good
test('should throw error when dividing by zero')
test('should return empty array when no items match filter')
test('should update user email and save to database')

// Bad
test('division test')
test('filter test')
test('update test')
```

#### 3. Test Edge Cases
```typescript
describe('StringValidator', () => {
  test('should handle empty string', () => {
    expect(validator.isValid('')).toBe(false);
  });

  test('should handle null input', () => {
    expect(validator.isValid(null)).toBe(false);
  });

  test('should handle undefined input', () => {
    expect(validator.isValid(undefined)).toBe(false);
  });

  test('should handle very long strings', () => {
    const longString = 'a'.repeat(10000);
    expect(validator.isValid(longString)).toBe(false);
  });
});
```

## 8. Common Jest Matchers

```typescript
// Equality
expect(value).toBe(4); // Strict equality
expect(value).toEqual({ name: 'John' }); // Deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3.5);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3); // For floating point

// Strings
expect('hello world').toMatch(/world/);
expect('hello world').toContain('world');

// Arrays
expect(['Alice', 'Bob', 'Eve']).toContain('Alice');
expect(['a', 'b', 'c']).toHaveLength(3);

// Exceptions
expect(() => {
  throw new Error('Wrong!');
}).toThrow('Wrong!');

// Promises
await expect(promise).resolves.toBe('success');
await expect(promise).rejects.toThrow('error');

// Function calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(2);
```

## Exercise
Create `exercises/06-unit-testing.ts` and write comprehensive tests for:
1. A Calculator class with basic operations
2. A UserManager class with async operations
3. A generic Stack data structure
4. Mock external dependencies and test error scenarios
