import { InterviewQuestion } from '../types';

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'iq-1',
    category: 'Core Python',
    difficulty: 'Junior',
    frequency: 'Critical',
    question: 'What is Python and what makes it dynamically typed and interpreted?',
    answer: `Python is a high-level, general-purpose, interpreted programming language created by Guido van Rossum. 
It is "dynamically typed" because variable types are determined and bound at runtime rather than compile-time. Variables are simply labels referencing objects in memory.
It is "interpreted" because source code is compiled into intermediate bytecode (.pyc files) and executed line-by-line by the Python Virtual Machine (CPython), without requiring pre-compilation into native machine assembly.`,
    codeSnippet: `# Dynamic typing example:
x = 42         # Bound to int object
x = "Python"   # Re-bound to str object without compilation error`,
    keyTakeaway: 'Python handles memory allocation dynamically and binds type info to objects, not variables.',
  },
  {
    id: 'iq-2',
    category: 'Data Structures',
    difficulty: 'Junior',
    frequency: 'Critical',
    question: 'What is the primary difference between a List and a Tuple?',
    answer: `1. Mutability: Lists are mutable (elements can be appended, removed, modified in-place); Tuples are immutable (cannot be modified after instantiation).
2. Memory & Performance: Tuples are allocated in a single, fixed-size memory block, making them lighter on memory and slightly faster to allocate. Lists allocate extra buffer space to allow O(1) amortized appends.
3. Hashability: Because tuples are immutable, tuples containing only hashable elements can serve as dictionary keys or set elements; lists cannot.
4. Syntax: Lists use brackets [1, 2], tuples use parentheses (1, 2).`,
    codeSnippet: `my_list = [1, 2]
my_list.append(3)   # Allowed!

my_tuple = (1, 2)
# my_tuple.append(3) -> AttributeError: 'tuple' has no attribute 'append'
# valid_dict = {my_tuple: "coordinates"}  # Valid!`,
    keyTakeaway: 'Use tuples for write-protected records and dictionary keys; use lists for collections of variable size.',
  },
  {
    id: 'iq-3',
    category: 'OOP & Design',
    difficulty: 'Junior',
    frequency: 'High',
    question: 'What is OOP and how are its 4 pillars implemented in Python?',
    answer: `Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects" that bundle state (attributes) and behavior (methods).
The 4 pillars in Python:
1. Encapsulation: Grouping data with methods. Python uses naming conventions (_single_underscore for protected, __double_underscore for private name mangling).
2. Inheritance: Deriving classes from parent classes (class Child(Parent):). Supports single and multiple inheritance.
3. Polymorphism: Different classes responding to the same method interface (Duck Typing: "If it walks like a duck and quacks like a duck, it is a duck").
4. Abstraction: Hiding internal complexity using abstract base classes (from abc import ABC, abstractmethod).`,
    codeSnippet: `from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"`,
    keyTakeaway: 'Python embraces Duck Typing for polymorphism, prioritizing behavior over rigid inheritance hierarchies.',
  },
  {
    id: 'iq-4',
    category: 'OOP & Design',
    difficulty: 'Junior',
    frequency: 'High',
    question: 'What is Inheritance and how does super() work in Python?',
    answer: `Inheritance allows a new class (subclass) to inherit attributes and methods from an existing class (superclass), promoting code reuse and extensibility.
super() returns a proxy object that delegates method calls to a parent or sibling class following Python's Method Resolution Order (MRO). It avoids hardcoding parent class names and is critical for cooperative multiple inheritance.`,
    codeSnippet: `class Vehicle:
    def __init__(self, brand):
        self.brand = brand

class Car(Vehicle):
    def __init__(self, brand, doors):
        super().__init__(brand)  # Delegate to Vehicle.__init__
        self.doors = doors`,
    keyTakeaway: 'Always use super() rather than explicit parent calls Parent.__init__(self) to support multiple inheritance.',
  },
  {
    id: 'iq-5',
    category: 'OOP & Design',
    difficulty: 'Mid',
    frequency: 'High',
    question: 'What is Polymorphism and how does Duck Typing embody it in Python?',
    answer: `Polymorphism means "many forms". In Python, polymorphism is predominantly achieved through "Duck Typing": functions do not verify if an argument inherits from a specific type; instead, they simply call the desired method or access the desired attribute.
If the object supports the required behavior, the code succeeds regardless of the object's class inheritance hierarchy.`,
    codeSnippet: `def render_audio(player):
    # Doesn't care if player is Spotify, MP3, or Streamer
    # as long as it implements .play()
    player.play()`,
    keyTakeaway: 'Focus on what an object can do, not what its inheritance ancestor is.',
  },
  {
    id: 'iq-6',
    category: 'Memory & GIL',
    difficulty: 'Senior',
    frequency: 'Critical',
    question: 'What is the Python GIL (Global Interpreter Lock) and how does it affect multithreading?',
    answer: `The Global Interpreter Lock (GIL) is a mutex in CPython that ensures only one native thread executes Python bytecode at any given moment.
Why it exists: CPython's memory management is not thread-safe; the GIL protects reference counts and object states from concurrent race conditions.
Implications:
- CPU-bound tasks (e.g., heavy math, crypto, image rendering) do not benefit from Python threading and can actually run slower due to lock contention. Use the multiprocessing module or native extensions (NumPy, Cython) to bypass the GIL.
- I/O-bound tasks (e.g., network calls, file downloads, database queries) release the GIL while waiting on sockets, so threading or asyncio works exceptionally well.`,
    codeSnippet: `# For CPU-bound parallel processing:
from multiprocessing import Pool

def square(n):
    return n * n

if __name__ == '__main__':
    with Pool() as p:
        results = p.map(square, [1, 2, 3, 4, 5])`,
    keyTakeaway: 'Use threading/asyncio for I/O-bound workflows; use multiprocessing for CPU-bound computations in Python.',
  },
  {
    id: 'iq-7',
    category: 'Advanced & Concurrency',
    difficulty: 'Mid',
    frequency: 'Critical',
    question: 'What is a Decorator in Python and how do you write one?',
    answer: `A decorator is a design pattern and syntactic sugar (@decorator) used to extend or modify the behavior of a function or method without changing its source code.
Under the hood, a decorator is a higher-order function that takes another function as an argument, defines a wrapper, and returns the wrapper.`,
    codeSnippet: `import time
from functools import wraps

def timer(func):
    @wraps(func)  # Preserves docstring and __name__
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start
        print(f"{func.__name__} took {duration:.4f}s")
        return result
    return wrapper

@timer
def heavy_computation():
    return sum(i * i for i in range(100000))`,
    keyTakeaway: 'Decorators wrap functions; always use @functools.wraps on the inner wrapper to preserve function metadata.',
  },
  {
    id: 'iq-8',
    category: 'Advanced & Concurrency',
    difficulty: 'Mid',
    frequency: 'High',
    question: 'What is the difference between a Generator and a regular Function?',
    answer: `A regular function computes its entire return value and exits using "return", deallocating its local stack frame.
A generator function uses the "yield" keyword. Instead of returning all items at once, it returns a generator iterator that produces values lazily on demand (O(1) memory space).
When yield is encountered, the generator's execution state and local variables are paused in memory and resumed when next() is called.`,
    codeSnippet: `# Generator computes infinite numbers with zero memory explosion:
def count_stream():
    n = 1
    while True:
        yield n
        n += 1

gen = count_stream()
print(next(gen))  # 1
print(next(gen))  # 2`,
    keyTakeaway: 'Generators yield values lazily, enabling processing of massive or infinite datasets without exhausting RAM.',
  },
  {
    id: 'iq-9',
    category: 'Core Python',
    difficulty: 'Junior',
    frequency: 'High',
    question: 'What is the difference between "==" and "is"?',
    answer: `"==" is the equality operator: it checks whether the values of two objects are equal by calling the __eq__() dunder method.
"is" is the identity operator: it checks whether two variables point to the exact same object in memory by comparing their memory addresses (id(a) == id(b)).`,
    codeSnippet: `a = [1, 2, 3]
b = [1, 2, 3]

print(a == b)  # True (identical content)
print(a is b)  # False (two distinct heap allocations)`,
    keyTakeaway: 'Use "==" to compare values; use "is" only when checking identity (e.g. "x is None").',
  },
  {
    id: 'iq-10',
    category: 'Memory & GIL',
    difficulty: 'Mid',
    frequency: 'High',
    question: 'How does Python manage memory and perform Garbage Collection?',
    answer: `Python uses two primary mechanisms for automatic memory management:
1. Reference Counting: Every object has a reference count tracking how many variables/containers point to it. When the count drops to zero, the object is immediately deallocated from memory.
2. Generational Garbage Collector (gc module): Resolves circular references (e.g., object A references B, and B references A) that reference counting cannot clear. It divides objects into 3 generations (Gen 0, Gen 1, Gen 2) based on object lifetime, collecting young objects more frequently.`,
    codeSnippet: `import sys

items = []
print(sys.getrefcount(items))  # Displays current reference count`,
    keyTakeaway: 'Reference counting provides immediate cleanup; generational GC handles circular references.',
  },
  {
    id: 'iq-11',
    category: 'Data Structures',
    difficulty: 'Mid',
    frequency: 'Medium',
    question: 'What is the difference between shallow copy and deep copy?',
    answer: `A shallow copy (copy.copy()) constructs a new collection object and inserts references to the original child objects. If child objects are mutable, mutating a nested object affects both copies.
A deep copy (copy.deepcopy()) recursively copies all nested objects, creating completely independent clones with disjoint memory addresses.`,
    codeSnippet: `import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)

original[0].append(99)
# shallow[0] now contains 99!
# deep[0] remains [1, 2]!`,
    keyTakeaway: 'Use deepcopy when dealing with nested mutable structures (lists of dicts, graphs).',
  },
  {
    id: 'iq-12',
    category: 'Web & Frameworks',
    difficulty: 'Mid',
    frequency: 'High',
    question: 'Compare Flask vs Django vs FastAPI: when should you use each?',
    answer: `1. Flask: A minimalist microframework. Provides routing and templating; you choose your ORM, auth, and database tools. Best for small-to-medium microservices, quick prototypes, and custom architectures.
2. Django: A full-featured "batteries-included" web framework. Comes with a built-in ORM, admin dashboard, auth system, and migrations. Ideal for large enterprise web applications with standard CRUD and relational databases.
3. FastAPI: A modern, high-concurrency async framework built on Starlette and Pydantic. Leverages Python type hints for automatic request validation, serialization, and interactive Swagger documentation. Best for high-performance REST APIs, AI/ML model inference servers, and microservices.`,
    keyTakeaway: 'Use FastAPI for modern APIs and microservices; Django for all-in-one web monoliths; Flask for lightweight bespoke apps.',
  },
];
