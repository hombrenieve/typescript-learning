# TypeScript Testing Quick Reference

## Setup Commands
```bash
# Install testing dependencies
npm install -D jest @types/jest ts-jest

# Run tests
npm test                    # Run all tests once
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
npm run test:game          # Run only game project tests
npm run test:exercises     # Run only exercise tests
```

## Common Jest Matchers

### Equality
```typescript
expect(value).toBe(4);                    // Strict equality (===)
expect(value).toEqual({name: 'John'});    // Deep equality
expect(value).not.toBe(null);             // Negation
```

### Truthiness
```typescript
expect(value).toBeTruthy();               // Truthy values
expect(value).toBeFalsy();                // Falsy values
expect(value).toBeNull();                 // null
expect(value).toBeUndefined();            // undefined
expect(value).toBeDefined();              // not undefined
```

### Numbers
```typescript
expect(value).toBeGreaterThan(3);         // > 3
expect(value).toBeGreaterThanOrEqual(3);  // >= 3
expect(value).toBeLessThan(5);            // < 5
expect(value).toBeCloseTo(0.3);           // Floating point
expect(value).toBeWithinRange(1, 10);     // Custom matcher
```

### Strings
```typescript
expect('hello world').toMatch(/world/);   // Regex match
expect('hello world').toContain('world'); // Substring
expect('hello').toHaveLength(5);          // String length
```

### Arrays and Objects
```typescript
expect(['a', 'b', 'c']).toContain('b');   // Array contains
expect(['a', 'b', 'c']).toHaveLength(3);  // Array length
expect(obj).toHaveProperty('name');       // Object property
expect(obj).toHaveProperty('age', 30);    // Property with value
expect(obj).toMatchObject({name: 'John'}); // Partial object match
```

### Functions and Mocks
```typescript
expect(mockFn).toHaveBeenCalled();                    // Called at least once
expect(mockFn).toHaveBeenCalledTimes(2);             // Called exact times
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2'); // Called with args
expect(mockFn).toHaveBeenLastCalledWith('arg');      // Last call args
expect(mockFn).toHaveReturnedWith('value');          // Returned value
```

### Promises and Async
```typescript
await expect(promise).resolves.toBe('success');      // Promise resolves
await expect(promise).rejects.toThrow('error');      // Promise rejects
await expect(asyncFn()).resolves.toEqual(expected);  // Async function
```

### Exceptions
```typescript
expect(() => fn()).toThrow();                        // Throws any error
expect(() => fn()).toThrow('Specific message');      // Throws specific message
expect(() => fn()).toThrow(TypeError);               // Throws specific type
```

## Test Structure Patterns

### Basic Test Structure
```typescript
describe('Component/Class Name', () => {
  // Setup
  let instance: MyClass;
  
  beforeEach(() => {
    instance = new MyClass();
  });
  
  afterEach(() => {
    // Cleanup
  });
  
  describe('method name', () => {
    test('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = instance.method(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Testing Classes
```typescript
describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  test('should add numbers correctly', () => {
    expect(calculator.add(2, 3)).toBe(5);
  });

  test('should throw on division by zero', () => {
    expect(() => calculator.divide(5, 0)).toThrow();
  });
});
```

### Testing with Mocks
```typescript
describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };
    userService = new UserService(mockRepository);
  });

  test('should find user by id', async () => {
    const mockUser = { id: '1', name: 'John' };
    mockRepository.findById.mockResolvedValue(mockUser);

    const result = await userService.getUser('1');

    expect(result).toEqual(mockUser);
    expect(mockRepository.findById).toHaveBeenCalledWith('1');
  });
});
```

### Testing Async Functions
```typescript
describe('API calls', () => {
  test('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchUserData('1');

    expect(result).toEqual(mockData);
  });

  test('should handle API errors', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(fetchUserData('1')).rejects.toThrow('HTTP error');
  });
});
```

## Mock Patterns

### Function Mocks
```typescript
const mockFn = jest.fn();
mockFn.mockReturnValue('mocked value');
mockFn.mockReturnValueOnce('first call');
mockFn.mockResolvedValue('async value');
mockFn.mockRejectedValue(new Error('async error'));
```

### Module Mocks
```typescript
// Mock entire module
jest.mock('./userService');

// Mock specific functions
jest.mock('./utils', () => ({
  formatDate: jest.fn(() => '2023-01-01'),
  validateEmail: jest.fn(() => true),
}));

// Partial mock
jest.mock('./config', () => ({
  ...jest.requireActual('./config'),
  API_URL: 'http://test-api.com',
}));
```

### Class Mocks
```typescript
jest.mock('./Database');
const MockDatabase = Database as jest.MockedClass<typeof Database>;

beforeEach(() => {
  MockDatabase.mockClear();
});
```

## Testing Best Practices

### 1. Test Naming
```typescript
// Good
test('should return user when valid ID is provided')
test('should throw error when user is not found')
test('should calculate total price including tax')

// Bad
test('user test')
test('error case')
test('calculation')
```

### 2. AAA Pattern
```typescript
test('should calculate discount correctly', () => {
  // Arrange
  const price = 100;
  const discountPercent = 10;
  const calculator = new PriceCalculator();

  // Act
  const result = calculator.applyDiscount(price, discountPercent);

  // Assert
  expect(result).toBe(90);
});
```

### 3. Test Edge Cases
```typescript
describe('StringValidator', () => {
  test('should handle empty string', () => {
    expect(validator.isValid('')).toBe(false);
  });

  test('should handle null input', () => {
    expect(validator.isValid(null)).toBe(false);
  });

  test('should handle very long strings', () => {
    const longString = 'a'.repeat(10000);
    expect(validator.isValid(longString)).toBe(false);
  });
});
```

### 4. Isolated Tests
```typescript
// Each test should be independent
beforeEach(() => {
  // Reset state before each test
  database.clear();
  mockService.mockReset();
});
```

## Coverage Goals
- **Statements**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+

## Common Testing Scenarios

### Testing TypeScript Generics
```typescript
describe('Generic Container', () => {
  test('should work with strings', () => {
    const container = new Container<string>();
    container.add('hello');
    expect(container.get(0)).toBe('hello');
  });

  test('should work with numbers', () => {
    const container = new Container<number>();
    container.add(42);
    expect(container.get(0)).toBe(42);
  });
});
```

### Testing Error Boundaries
```typescript
test('should handle invalid input gracefully', () => {
  const invalidInputs = [null, undefined, '', -1, NaN];
  
  invalidInputs.forEach(input => {
    expect(() => processInput(input)).toThrow();
  });
});
```

### Testing State Changes
```typescript
test('should update state correctly', () => {
  const initialState = component.getState();
  
  component.updateValue('new value');
  
  const newState = component.getState();
  expect(newState).not.toEqual(initialState);
  expect(newState.value).toBe('new value');
});
```
