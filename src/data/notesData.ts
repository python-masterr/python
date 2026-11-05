import { NoteTopic } from '../types';

export const pythonNotes: NoteTopic[] = [
  {
    id: 'intro',
    title: '1. Introduction to Python',
    category: 'Basics',
    readTime: '4 min',
    difficulty: 'Beginner',
    summary: 'Discover Python philosophy, interpreted execution model, dynamic typing, and why Python powers modern AI, data science, and web development.',
    content: [
      'Python was created by Guido van Rossum and released in 1991. It emphasizes code readability with its notable use of significant whitespace.',
      'Unlike compiled languages (such as C++ or Rust) where source code is compiled directly to machine code, Python executes via an interpreter that compiles source code into intermediate bytecode (.pyc), which is then run on the Python Virtual Machine (PVM).',
      'The "Zen of Python" (import this) outlines guiding principles: Beautiful is better than ugly, Explicit is better than implicit, and Simple is better than complex.',
    ],
    keyPoints: [
      'High-level, interpreted, dynamically typed language',
      'Indentation-based syntax replaces curly braces {}',
      'Batteries-included standard library for networking, math, and files',
      'Multi-paradigm: supports procedural, OOP, and functional programming',
    ],
    codeExample: `# Welcome to Python Master!
message = "Hello, Python Master!"
version = 3.12

print(message)
print(f"Running on Python {version}")
print(f"Character count: {len(message)}")`,
    expectedOutput: `Hello, Python Master!
Running on Python 3.12
Character count: 21`,
    miniQuiz: {
      question: 'Which of the following defines blocks of code in Python?',
      options: ['Curly braces {}', 'Indentation (spaces / tabs)', 'Keywords BEGIN and END', 'Semicolons ;'],
      correctIndex: 1,
      explanation: 'Python uses indentation to delimit code blocks instead of curly braces or keywords.',
    },
  },
  {
    id: 'variables',
    title: '2. Variables & Dynamic Typing',
    category: 'Basics',
    readTime: '5 min',
    difficulty: 'Beginner',
    summary: 'Understand Python variable assignment, reference semantics, mutable vs immutable memory identifiers, and duck typing.',
    content: [
      'In Python, variables are not typed memory slots; rather, they are names (references) bound to objects in memory.',
      'You do not declare types beforehand. When you write x = 42, Python creates an integer object 42 in memory and points the reference x to it.',
      'Python is strongly typed: it will not implicitly convert strings to integers in operations like "5" + 5; you must explicitly cast using int("5").',
    ],
    keyPoints: [
      'Snake_case naming convention for variables and functions (PEP 8)',
      'Multiple assignment: a, b = 10, 20',
      'Dynamic typing allows re-binding names to different object types',
      'Use type() to inspect object type at runtime',
    ],
    codeExample: `# Variable declarations and swapping
name = "Guido"
experience_years = 30
is_creator = True

print(f"Developer: {name}")
print(f"Years: {experience_years}, Type: {type(experience_years).__name__}")

# Pythonic variable swap
x, y = 100, 200
x, y = y, x
print(f"Swapped values: x={x}, y={y}")`,
    expectedOutput: `Developer: Guido
Years: 30, Type: int
Swapped values: x=200, y=100`,
    miniQuiz: {
      question: 'What is the result of type(3.14) in Python?',
      options: ['<class "double">', '<class "float">', '<class "decimal">', '<class "real">'],
      correctIndex: 1,
      explanation: 'In Python, floating point decimal numbers belong to the float class.',
    },
  },
  {
    id: 'data-types',
    title: '3. Data Types & Type Casting',
    category: 'Basics',
    readTime: '6 min',
    difficulty: 'Beginner',
    summary: 'Master core primitives: integers, floating-point numbers, booleans, strings, and explicit type conversion.',
    content: [
      'Python provides built-in numeric types: int (arbitrary precision integers), float (IEEE 754 64-bit double precision), and complex (e.g. 3 + 4j).',
      'Strings (str) in Python are immutable sequences of Unicode characters. Once created, individual characters cannot be changed in place.',
      'Booleans (bool) are subclasses of integers: True equals 1 and False equals 0 in arithmetic contexts.',
    ],
    keyPoints: [
      'int has unlimited precision in Python 3',
      'str supports slicing: text[start:stop:step]',
      'Explicit conversion: int(), float(), str(), bool()',
      'Falsy values: 0, 0.0, "", [], {}, set(), None, False',
    ],
    codeExample: `# Data types and explicit casting
num_str = "128"
converted_int = int(num_str)
float_val = float(converted_int)

text = "Python Programming"
sliced_text = text[0:6]
reversed_text = text[::-1]

print(f"Converted: {converted_int} ({type(converted_int).__name__})")
print(f"Slice: {sliced_text}")
print(f"Reversed: {reversed_text}")`,
    expectedOutput: `Converted: 128 (int)
Slice: Python
Reversed: gnimmargorP nohtyP`,
    miniQuiz: {
      question: 'Which of the following values evaluates to False in a boolean context?',
      options: ['"False"', '[-1]', '"" (empty string)', '{"key": False}'],
      correctIndex: 2,
      explanation: 'Empty sequences like "" (empty string), empty lists [], and 0 evaluate to False.',
    },
  },
  {
    id: 'operators',
    title: '4. Operators & Expressions',
    category: 'Basics',
    readTime: '5 min',
    difficulty: 'Beginner',
    summary: 'Explore arithmetic, assignment, logical, comparison, identity (is vs ==), and membership (in) operators.',
    content: [
      'Python features standard arithmetic operators plus integer floor division // and exponentiation **.',
      'The identity operator "is" checks if two variables point to the exact same memory address (id(a) == id(b)), whereas equality "==" checks value equivalence.',
      'The membership operator "in" allows clean checking if an element exists in a string, list, tuple, or dictionary.',
    ],
    keyPoints: [
      '// performs floor division (e.g., 7 // 2 is 3)',
      '** performs exponentiation (e.g., 2 ** 3 is 8)',
      'is checks memory identity; == checks value equivalence',
      'Chained comparisons: 10 < x < 50 is valid syntax in Python',
    ],
    codeExample: `# Operators demo
a, b = 17, 5

floor_div = a // b
modulus = a % b
power = b ** 3

# Identity vs Equality
list_1 = [1, 2, 3]
list_2 = [1, 2, 3]

print(f"17 // 5 = {floor_div}")
print(f"17 % 5 = {modulus}")
print(f"5 ** 3 = {power}")
print(f"list_1 == list_2: {list_1 == list_2}")
print(f"list_1 is list_2: {list_1 is list_2}")`,
    expectedOutput: `17 // 5 = 3
17 % 5 = 2
5 ** 3 = 125
list_1 == list_2: True
list_1 is list_2: False`,
    miniQuiz: {
      question: 'What is the output of 7 // 2 in Python?',
      options: ['3.5', '3', '4', '3.0'],
      correctIndex: 1,
      explanation: '// is the floor division operator which returns the largest integer less than or equal to the quotient.',
    },
  },
  {
    id: 'control-flow',
    title: '5. Conditionals & Control Flow',
    category: 'Control Flow',
    readTime: '5 min',
    difficulty: 'Beginner',
    summary: 'Direct code execution using if, elif, else branches, ternary conditional expressions, and modern pattern matching.',
    content: [
      'Conditional branching in Python relies on clean if-elif-else ladders without parenthesis or brackets.',
      'Ternary conditional expressions allow concise inline assignments: status = "Pass" if score >= 50 else "Fail".',
      'Python short-circuits boolean operations: in "a or b", if a is truthy, b is never evaluated.',
    ],
    keyPoints: [
      'No switch/case in older Python; replaced by if/elif or match/case in 3.10+',
      'Ternary expression: X if CONDITION else Y',
      'Logical operators: and, or, not (written as words, not &&, ||, !)',
    ],
    codeExample: `# Grade evaluation & ternary operator
score = 88

if score >= 90:
    grade = "A+"
elif score >= 80:
    grade = "A"
elif score >= 70:
    grade = "B"
else:
    grade = "C"

status = "Honors" if score >= 85 else "Standard"

print(f"Score: {score}")
print(f"Letter Grade: {grade}")
print(f"Classification: {status}")`,
    expectedOutput: `Score: 88
Letter Grade: A
Classification: Honors`,
    miniQuiz: {
      question: 'How do you write a ternary conditional expression in Python?',
      options: ['condition ? val1 : val2', 'val1 if condition else val2', 'if condition then val1 else val2', 'val1 ? condition : val2'],
      correctIndex: 1,
      explanation: 'Python uses the inline syntax "val1 if condition else val2".',
    },
  },
  {
    id: 'loops',
    title: '6. Loops & Iterations',
    category: 'Control Flow',
    readTime: '6 min',
    difficulty: 'Beginner',
    summary: 'Harness the power of for-in loops, while loops, range generator, enumerate, break, continue, and the else clause on loops.',
    content: [
      'The for loop in Python is an iterator consumer (foreach style) that iterates directly over items in any iterable object (list, tuple, string, dictionary).',
      'The range() function produces an immutable sequence of numbers on demand without allocating entire lists in memory.',
      'Python supports a unique "else" block on both for and while loops: the else block executes ONLY if the loop finishes without hitting a break statement!',
    ],
    keyPoints: [
      'range(start, stop, step) generates sequences on the fly',
      'enumerate(iterable) provides both index and item',
      'break terminates loop immediately; continue skips to next iteration',
      'loop else executes only if loop did NOT terminate via break',
    ],
    codeExample: `# Loops and range demo
print("Counting squares:")
for i in range(1, 6):
    print(f"{i}^2 = {i * i}")

# Enumerate demo
fruits = ["Apple", "Blueberry", "Cherry"]
print("\\nFruits index:")
for idx, fruit in enumerate(fruits, start=1):
    print(f"{idx}: {fruit}")`,
    expectedOutput: `Counting squares:
1^2 = 1
2^2 = 4
3^2 = 9
4^2 = 16
5^2 = 25

Fruits index:
1: Apple
2: Blueberry
3: Cherry`,
    miniQuiz: {
      question: 'When does the "else" clause of a for loop execute?',
      options: ['Every time the loop finishes', 'Only if the loop was interrupted by break', 'Only if the loop finished normally without break', 'When an exception is thrown'],
      correctIndex: 2,
      explanation: 'A loop else clause executes only when the iterable is exhausted without encountering a break statement.',
    },
  },
  {
    id: 'functions',
    title: '7. Functions, Lambdas & Scope',
    category: 'Control Flow',
    readTime: '7 min',
    difficulty: 'Intermediate',
    summary: 'Write reusable code with def, default parameters, *args, **kwargs, first-class functions, closures, and lambda expressions.',
    content: [
      'Functions are declared with the def keyword. In Python, functions are first-class citizens: they can be passed as arguments, assigned to variables, and returned from other functions.',
      'Variable positional arguments (*args) arrive as a tuple; variable keyword arguments (**kwargs) arrive as a dictionary.',
      'Python resolves variable names following the LEGB rule: Local, Enclosing, Global, Built-in.',
      'Never use mutable default arguments like def add_item(item, target=[]). Defaults are evaluated once when the function is defined, causing state leaks.',
    ],
    keyPoints: [
      'LEGB scope resolution order (Local, Enclosing, Global, Builtin)',
      '*args packs positional args; **kwargs packs keyword args',
      'Lambda: anonymous single-expression functions: lambda x, y: x + y',
      'docstrings ("""...""") document purpose and parameters',
    ],
    codeExample: `# Functions, variable arguments & lambdas
def calculate_stats(*numbers):
    total = sum(numbers)
    count = len(numbers)
    average = total / count if count > 0 else 0
    return total, average

total, avg = calculate_stats(10, 20, 30, 40, 50)
print(f"Total: {total}, Average: {avg}")

# Lambda sorting
pairs = [(1, 'one'), (3, 'three'), (2, 'two')]
sorted_pairs = sorted(pairs, key=lambda item: item[0])
print(f"Sorted pairs: {sorted_pairs}")`,
    expectedOutput: `Total: 150, Average: 30.0
Sorted pairs: [(1, 'one'), (2, 'two'), (3, 'three')]`,
    miniQuiz: {
      question: 'What is dangerous about using def append_to(element, target=[]): ?',
      options: ['It causes a syntax error', 'The default list is shared across all function calls', 'Lists cannot be passed as arguments', 'It creates an infinite loop'],
      correctIndex: 1,
      explanation: 'Default argument expressions are evaluated once when the function is defined, so mutable defaults like lists retain mutations across calls.',
    },
  },
  {
    id: 'lists-tuples',
    title: '8. Lists, Tuples & Comprehensions',
    category: 'Data Structures',
    readTime: '7 min',
    difficulty: 'Beginner',
    summary: 'Compare mutable lists vs immutable tuples, indexing, slicing, memory efficiency, and concise list comprehensions.',
    content: [
      'Lists are mutable, ordered sequences enclosed in brackets []. Elements can be added, modified, and removed dynamically.',
      'Tuples are immutable sequences enclosed in parentheses (). Once created, elements cannot be modified, making them hashable and usable as dictionary keys.',
      'List comprehensions offer a concise syntax to transform or filter iterables: [x**2 for x in nums if x % 2 == 0].',
    ],
    keyPoints: [
      'Lists: mutable, dynamic array backing, O(1) amortized append',
      'Tuples: immutable, lower memory footprint, can be dict keys',
      'Slicing syntax: list[start:end:step]',
      'List comprehension: [expr for item in iterable if condition]',
    ],
    codeExample: `# Lists vs Tuples & Comprehensions
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# List comprehension: squares of even numbers
even_squares = [n * n for n in nums if n % 2 == 0]
print(f"Even squares: {even_squares}")

# Slicing
reversed_nums = nums[::-1]
print(f"Reversed slice: {reversed_nums[:5]}")

# Tuple unpacking
coords = (37.7749, -122.4194)
lat, lon = coords
print(f"Latitude: {lat}, Longitude: {lon}")`,
    expectedOutput: `Even squares: [4, 16, 36, 64, 100]
Reversed slice: [10, 9, 8, 7, 6]
Latitude: 37.7749, Longitude: -122.4194`,
    miniQuiz: {
      question: 'Which sequence type can be used as a dictionary key?',
      options: ['List', 'Dictionary', 'Tuple containing immutable elements', 'Set'],
      correctIndex: 2,
      explanation: 'Dictionary keys must be hashable and immutable; tuples containing immutable objects are hashable.',
    },
  },
  {
    id: 'dicts-sets',
    title: '9. Dictionaries & Sets',
    category: 'Data Structures',
    readTime: '6 min',
    difficulty: 'Intermediate',
    summary: 'Understand O(1) average hash table operations, key lookup, dict comprehensions, and set mathematical operations.',
    content: [
      'Dictionaries (dict) store key-value pairs backed by highly optimized hash tables. In Python 3.7+, dictionaries maintain insertion order.',
      'Sets (set) are unordered collections of unique, hashable elements. They are ideal for deduplication and mathematical operations like union (|), intersection (&), and difference (-).',
      'Use the .get(key, default) method to safely retrieve values without raising a KeyError when a key is missing.',
    ],
    keyPoints: [
      'O(1) average time complexity for lookups, insertions, and deletions',
      'dict.get(key, default) avoids KeyError exceptions',
      'Sets guarantee uniqueness and fast membership testing (x in set)',
      'Dictionary comprehensions: {k: v for k, v in ...}',
    ],
    codeExample: `# Dictionary & Set operations
student = {
    "name": "Alex",
    "track": "Python",
    "xp": 350
}

# Safe lookup with default
badge = student.get("badge", "Novice")
print(f"Student: {student['name']}, Badge: {badge}")

# Set deduplication and union
languages_team_a = {"Python", "JavaScript", "Go"}
languages_team_b = {"Python", "Rust", "TypeScript"}

all_languages = languages_team_a | languages_team_b
shared = languages_team_a & languages_team_b

print(f"All tech: {sorted(list(all_languages))}")
print(f"Shared: {sorted(list(shared))}")`,
    expectedOutput: `Student: Alex, Badge: Novice
All tech: ['Go', 'JavaScript', 'Python', 'Rust', 'TypeScript']
Shared: ['Python']`,
    miniQuiz: {
      question: 'What is the average time complexity for checking membership "x in my_set"?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'],
      correctIndex: 2,
      explanation: 'Sets in Python are implemented using hash tables, giving O(1) average time complexity for membership testing.',
    },
  },
  {
    id: 'oop',
    title: '10. Object-Oriented Programming (OOP)',
    category: 'OOP',
    readTime: '8 min',
    difficulty: 'Intermediate',
    summary: 'Master classes, __init__ constructor, self reference, inheritance, super(), encapsulation, polymorphism, and dunder methods.',
    content: [
      'Python classes are defined with the class keyword. The __init__ method initializes new object instances.',
      'The self parameter represents the specific instance being operated upon, allowing access to instance attributes and methods.',
      'Inheritance allows a subclass to inherit attributes and methods from a base class. Use super() to delegate method calls up the inheritance chain.',
      'Dunder (double underscore) magic methods like __str__, __repr__, __len__, and __eq__ enable operator overloading and idiomatic integration with Python builtins.',
    ],
    keyPoints: [
      'Class attributes are shared; instance attributes are bound to self',
      'super().__init__() calls parent constructor',
      'Encapsulation conventions: _protected (single leading underscore), __private (name mangling)',
      'Polymorphism enables treating different classes via a uniform interface',
    ],
    codeExample: `# OOP class with inheritance and methods
class Developer:
    def __init__(self, name: str, specialty: str):
        self.name = name
        self.specialty = specialty
        self.points = 0

    def code(self, hours: int):
        earned = hours * 10
        self.points += earned
        print(f"{self.name} coded for {hours}h and earned {earned} XP!")

class PythonMasterDeveloper(Developer):
    def code(self, hours: int):
        # Python master earns 1.5x bonus XP!
        earned = int(hours * 15)
        self.points += earned
        print(f"🐍 {self.name} master-coded for {hours}h (+{earned} XP)!")

dev = PythonMasterDeveloper("Maya", "Data Engineering")
dev.code(4)
print(f"Total XP: {dev.points}")`,
    expectedOutput: `🐍 Maya master-coded for 4h (+60 XP)!
Total XP: 60`,
    miniQuiz: {
      question: 'What is the purpose of the "self" parameter in Python class methods?',
      options: ['It refers to the class itself', 'It points to the specific instance of the class', 'It is an optional naming convention with no real purpose', 'It prevents global variable access'],
      correctIndex: 1,
      explanation: 'self refers to the current instance of the class upon which the method was called.',
    },
  },
  {
    id: 'files',
    title: '11. File Handling & Context Managers',
    category: 'Advanced',
    readTime: '6 min',
    difficulty: 'Intermediate',
    summary: 'Safely read, write, and manipulate files using the "with" context manager protocol (__enter__ and __exit__).',
    content: [
      'Always open files using the "with" statement. It implements the Context Manager protocol, guaranteeing that the file stream is closed even if an exception occurs.',
      'Common modes: "r" for reading, "w" for writing (truncating existing content), "a" for appending, and "r+" for reading and writing.',
      'You can create custom context managers using classes with __enter__ and __exit__ methods, or using the @contextmanager decorator from contextlib.',
    ],
    keyPoints: [
      'with open("file.txt", "r") as f: guarantees deterministic resource cleanup',
      'Reading entire file: f.read(); line by line: for line in f:',
      'Handling JSON files: json.dump() and json.load()',
      'Context manager protocol: __enter__ returns resource, __exit__ handles cleanup',
    ],
    codeExample: `# File I/O simulation and JSON serialization
import json

app_state = {
    "user": "Pythonist",
    "level": 3,
    "completed_topics": ["intro", "variables", "control-flow"],
    "active": True
}

# Serialize to JSON string
json_data = json.dumps(app_state, indent=2)
print("Serialized JSON file content:")
print(json_data)

# Deserialize back to Python dict
parsed = json.loads(json_data)
print(f"\\nDeserialized user: {parsed['user']}, topics count: {len(parsed['completed_topics'])}")`,
    expectedOutput: `Serialized JSON file content:
{
  "user": "Pythonist",
  "level": 3,
  "completed_topics": [
    "intro",
    "variables",
    "control-flow"
  ],
  "active": true
}

Deserialized user: Pythonist, topics count: 3`,
    miniQuiz: {
      question: 'Why is using "with open(...)" preferred over just "open(...)"?',
      options: ['It makes file reading faster', 'It automatically closes the file even if exceptions occur', 'It encrypts the file on disk', 'It automatically creates parent directories'],
      correctIndex: 1,
      explanation: 'The with context manager ensures __exit__ is called, closing file descriptors safely even if an error is raised.',
    },
  },
  {
    id: 'exceptions',
    title: '12. Exception Handling & Robust Code',
    category: 'Advanced',
    readTime: '6 min',
    difficulty: 'Intermediate',
    summary: 'Catch and handle errors gracefully using try, except, else, finally blocks, and custom exceptions.',
    content: [
      'Exceptions in Python are objects derived from BaseException (typically Exception).',
      'The "try" block encloses risky code; "except" catches specified exception types; "else" executes if NO exception occurred; "finally" always executes regardless of outcomes.',
      'Avoid bare except: clauses (catching BaseException). Always catch specific errors like ValueError, KeyError, or ZeroDivisionError.',
    ],
    keyPoints: [
      'try -> except -> else -> finally flow',
      'raise ValueError("Message") triggers explicit exceptions',
      'Custom exceptions inherit from Exception',
      'finally is ideal for releasing sockets, locks, or database connections',
    ],
    codeExample: `# Graceful exception handling
def safe_divide(numerator, denominator):
    try:
        result = numerator / denominator
    except ZeroDivisionError:
        print("Error: Cannot divide by zero!")
        return None
    except TypeError as e:
        print(f"Type error: {e}")
        return None
    else:
        print("Division successful.")
        return result
    finally:
        print("Calculation attempt finished.")

print(f"10 / 2: {safe_divide(10, 2)}")
print(f"\\n10 / 0: {safe_divide(10, 0)}")`,
    expectedOutput: `Division successful.
Calculation attempt finished.
10 / 2: 5.0

Error: Cannot divide by zero!
Calculation attempt finished.
10 / 0: None`,
    miniQuiz: {
      question: 'When does the "else" block in a try-except structure execute?',
      options: ['Always', 'Only when an exception is caught', 'Only when NO exception is raised in try', 'Only if finally fails'],
      correctIndex: 2,
      explanation: 'The else block in a try-except-else-finally structure executes only if the try block completes without raising any exceptions.',
    },
  },
  {
    id: 'modules-stdlib',
    title: '13. Modules & Standard Library',
    category: 'Advanced',
    readTime: '7 min',
    difficulty: 'Advanced',
    summary: 'Harness Python batteries-included standard libraries: math, random, datetime, collections, and itertools.',
    content: [
      'A module is simply a file containing Python definitions and statements (.py). A package is a collection of modules within a directory containing __init__.py.',
      'The Python Standard Library is renowned for its breadth: math for mathematical functions, collections for specialized container datatypes (Counter, defaultdict, deque), and itertools for efficient looping.',
      'Virtual environments (venv) isolate package dependencies per project, preventing conflicts between different library versions.',
    ],
    keyPoints: [
      'import module vs from module import function',
      'collections.Counter makes frequency counting trivial',
      'collections.defaultdict prevents missing key exceptions',
      'Virtual environments created with: python -m venv .venv',
    ],
    codeExample: `# Standard library math and random
import math
import random

radius = 5.0
circle_area = math.pi * math.pow(radius, 2)
hypot = math.sqrt(3**2 + 4**2)

print(f"Circle Area (r=5): {round(circle_area, 2)}")
print(f"Hypotenuse (3, 4): {hypot}")

# Random choices
tools = ["Python", "Docker", "PostgreSQL", "React"]
picked = random.choice(tools)
print(f"Random tool selection: {picked}")`,
    expectedOutput: `Circle Area (r=5): 78.54
Hypotenuse (3, 4): 5.0
Random tool selection: Python`,
    miniQuiz: {
      question: 'Which built-in module provides specialized data structures like deque, Counter, and defaultdict?',
      options: ['itertools', 'collections', 'datastructs', 'sys'],
      correctIndex: 1,
      explanation: 'The collections module provides alternatives to Python general purpose built-in containers dict, list, set, and tuple.',
    },
  },
  {
    id: 'web-apis',
    title: '14. Web Frameworks & REST APIs',
    category: 'Web & APIs',
    readTime: '7 min',
    difficulty: 'Advanced',
    summary: 'Build modern backends and microservices with Flask and FastAPI, understand WSGI/ASGI, routing, and HTTP methods.',
    content: [
      'Python is a dominant language for web services. Flask is a lightweight microframework; FastAPI is a modern, high-performance asynchronous framework based on standard Python type hints.',
      'WSGI (Web Server Gateway Interface) is the synchronous standard (Flask, Django), while ASGI (Asynchronous Server Gateway Interface) supports async/await concurrency (FastAPI, Starlette).',
      'REST APIs use standard HTTP verbs: GET (fetch), POST (create), PUT/PATCH (update), and DELETE (remove), communicating payload data formatted as JSON.',
    ],
    keyPoints: [
      'Flask uses decorators like @app.route("/api/items") to bind URLs to handler functions',
      'FastAPI uses Pydantic models for automatic validation, serialization, and OpenAPI docs',
      'requests library simplifies client-side HTTP calls: requests.get(url)',
      'Asynchronous endpoints use async def and await for high I/O throughput',
    ],
    codeExample: `# Simulated Flask / FastAPI microservice handler
def get_user_profile(user_id: int):
    database = {
        101: {"username": "py_coder", "role": "Engineer", "badges": 12},
        102: {"username": "algo_queen", "role": "Data Scientist", "badges": 24}
    }
    
    if user_id in database:
        return {"status": 200, "data": database[user_id]}
    return {"status": 404, "error": "User not found"}

response_ok = get_user_profile(101)
response_missing = get_user_profile(999)

print(f"HTTP 200 Response: {response_ok}")
print(f"HTTP 404 Response: {response_missing}")`,
    expectedOutput: `HTTP 200 Response: {'status': 200, 'data': {'username': 'py_coder', 'role': 'Engineer', 'badges': 12}}
HTTP 404 Response: {'status': 404, 'error': 'User not found'}`,
    miniQuiz: {
      question: 'What is the primary difference between WSGI and ASGI in Python web frameworks?',
      options: ['ASGI supports async concurrency while WSGI is synchronous', 'WSGI is faster than ASGI for WebSockets', 'ASGI cannot handle JSON', 'WSGI was created for Python 3.12 only'],
      correctIndex: 0,
      explanation: 'ASGI (Asynchronous Server Gateway Interface) extends WSGI with support for asynchronous programming, WebSockets, and high concurrency.',
    },
  },
];
