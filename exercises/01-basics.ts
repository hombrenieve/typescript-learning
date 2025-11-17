// Exercise 1: Basic TypeScript

// TODO: 1. Create a function that takes two numbers and returns their sum
function addNumbers(a: number, b: number): number {
  // Your implementation here
  return a + b;
}

// TODO: 2. Create an interface for a Book
interface Book {
  title: string;
  author: string;
  year?: number;
}

// TODO: 3. Create an array of books and display them
const books: Book[] = [
  { title: "1984", author: "George Orwell", year: 1949 },
  { title: "White Wolf", author: "Paulo Coelho" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925 },
  { title: "To Kill a Mockingbird", author: "Harper Lee" }
];

function displayBooks(books: Book[]): void {
  books.forEach((book) => {
    console.log(`${book.title} by ${book.author}` + (book.year ? ` (${book.year})` : ''));
  });
}

// Test your implementations
console.log("Sum of 5 and 3:", addNumbers(5, 3));
displayBooks(books);
