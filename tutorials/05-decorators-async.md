# Decorators and Async Programming

## 1. Method Decorators

```typescript
// Enable decorators in tsconfig.json: "experimentalDecorators": true

function log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyName} with args:`, args);
    const result = method.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}
```

## 2. Class Decorators

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Person {
  constructor(public name: string) {}
}
```

## 3. Promises and Async/Await

```typescript
// Promise-based function
function fetchData(id: number): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve(`Data for ID: ${id}`);
      } else {
        reject(new Error("Invalid ID"));
      }
    }, 1000);
  });
}

// Async/await usage
async function getData(id: number): Promise<void> {
  try {
    const data = await fetchData(id);
    console.log(data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Multiple async operations
async function getAllData(ids: number[]): Promise<string[]> {
  const promises = ids.map(id => fetchData(id));
  return Promise.all(promises);
}
```

## 4. Generic Promises

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function apiCall<T>(url: string): Promise<ApiResponse<T>> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {} as T,
        status: 200,
        message: "Success"
      });
    }, 500);
  });
}

interface User {
  id: number;
  name: string;
}

async function getUser(id: number): Promise<User> {
  const response = await apiCall<User>(`/users/${id}`);
  return response.data;
}
```

## Exercise
Create `exercises/05-decorators-async.ts` and implement:
1. A timing decorator that measures method execution time
2. An async function that simulates file reading with error handling
3. A generic async cache system using Promises
