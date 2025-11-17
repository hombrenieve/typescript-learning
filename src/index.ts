console.log("TypeScript environment is ready!");

// Test basic TypeScript features
const greeting: string = "Hello, TypeScript!";
const version: number = 1.0;

interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Developer",
  age: 30
};

console.log(`${greeting} Version: ${version}`);
console.log(`User: ${user.name}, Age: ${user.age}`);
