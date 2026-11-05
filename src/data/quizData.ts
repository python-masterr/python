import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'Fundamentals',
    difficulty: 'Beginner',
    question: 'What type of language is Python primarily categorized as?',
    options: ['Programming Language', 'Relational Database', 'Web Browser Engine', 'Hardware Instruction Set'],
    correctIndex: 0,
    explanation: 'Python is a high-level, interpreted, general-purpose programming language created by Guido van Rossum.',
  },
  {
    id: 'q2',
    topic: 'Data Types',
    difficulty: 'Beginner',
    question: 'What is the output of the following expression in Python?',
    codeSnippet: 'print(type(4 / 2))',
    options: ['<class "int">', '<class "float">', '<class "number">', '<class "double">'],
    correctIndex: 1,
    explanation: 'In Python 3, standard division (/) always produces a float, even if the division is exact (4 / 2 -> 2.0). Floor division (//) produces an int.',
  },
  {
    id: 'q3',
    topic: 'Lists & Mutability',
    difficulty: 'Intermediate',
    question: 'What will be printed when running this code?',
    codeSnippet: `a = [1, 2]
b = a
b.append(3)
print(a)`,
    options: ['[1, 2]', '[1, 2, 3]', '[3]', 'Error: assignment cannot mutate source'],
    correctIndex: 1,
    explanation: 'Lists in Python are mutable objects. "b = a" assigns a reference to the same list in memory. Mutating b via .append() also mutates a.',
  },
  {
    id: 'q4',
    topic: 'Slicing',
    difficulty: 'Beginner',
    question: 'What is the output of string slicing with a step of -1?',
    codeSnippet: `s = "PYTHON"
print(s[::-1])`,
    options: ['"PYTHON"', '"NOHTYP"', '"P"', '"N"'],
    correctIndex: 1,
    explanation: 'The slice [::-1] starts from the end and steps backward by 1, reversing the entire string.',
  },
  {
    id: 'q5',
    topic: 'Identity vs Equality',
    difficulty: 'Intermediate',
    question: 'What are the values of expr1 and expr2?',
    codeSnippet: `x = [10, 20]
y = [10, 20]
expr1 = x == y
expr2 = x is y
print(expr1, expr2)`,
    options: ['True True', 'True False', 'False True', 'False False'],
    correctIndex: 1,
    explanation: '== compares values (both lists contain identical items -> True). "is" checks memory identity; x and y are two distinct list objects in memory -> False.',
  },
  {
    id: 'q6',
    topic: 'Booleans & Truthiness',
    difficulty: 'Beginner',
    question: 'Which of the following values evaluates to True in Python?',
    options: ['bool("")', 'bool([])', 'bool("False")', 'bool(0)'],
    correctIndex: 2,
    explanation: 'Any non-empty string in Python evaluates to True. Even "False" is a string containing 5 characters, so bool("False") is True!',
  },
  {
    id: 'q7',
    topic: 'Functions',
    difficulty: 'Intermediate',
    question: 'What is the output of the second call to func()?',
    codeSnippet: `def func(val, items=[]):
    items.append(val)
    return items

func(1)
print(func(2))`,
    options: ['[2]', '[1, 2]', '[[1], [2]]', 'Runtime Error'],
    correctIndex: 1,
    explanation: 'Default arguments are evaluated once when the function is defined. The list "items" persists across consecutive function calls.',
  },
  {
    id: 'q8',
    topic: 'Tuples',
    difficulty: 'Beginner',
    question: 'How do you create a single-element tuple containing the number 5?',
    options: ['t = (5)', 't = (5,)', 't = tuple(5)', 't = [5]'],
    correctIndex: 1,
    explanation: 'A comma is mandatory to distinguish a single-element tuple (5,) from parenthesized arithmetic (5).',
  },
  {
    id: 'q9',
    topic: 'Dictionaries',
    difficulty: 'Intermediate',
    question: 'What happens when accessing a key that does not exist in a dictionary using square brackets d["missing"]?',
    options: ['Returns None', 'Returns False', 'Raises KeyError', 'Creates the key with None value'],
    correctIndex: 2,
    explanation: 'Square bracket lookup d[key] raises a KeyError if the key is missing. Use d.get(key) to safely return None or a fallback default.',
  },
  {
    id: 'q10',
    topic: 'OOP',
    difficulty: 'Intermediate',
    question: 'Which special dunder method is invoked when converting an object to a string via str(obj) or print(obj)?',
    options: ['__init__', '__str__', '__format__', '__cast__'],
    correctIndex: 1,
    explanation: '__str__ is invoked by str() and print() to produce an informal, readable string representation of an object.',
  },
  {
    id: 'q11',
    topic: 'List Comprehension',
    difficulty: 'Intermediate',
    question: 'What is the result of this list comprehension?',
    codeSnippet: 'result = [x * 2 for x in range(5) if x % 2 == 1]\nprint(result)',
    options: ['[0, 2, 4]', '[2, 6]', '[1, 3]', '[2, 4, 6, 8]'],
    correctIndex: 1,
    explanation: 'range(5) yields 0, 1, 2, 3, 4. The condition "x % 2 == 1" filters odd numbers (1 and 3). Multiplying by 2 gives [2, 6].',
  },
  {
    id: 'q12',
    topic: 'Control Flow',
    difficulty: 'Advanced',
    question: 'What will be output by this loop with an else clause?',
    codeSnippet: `for i in range(3):
    if i == 5:
        break
else:
    print("Completed!")`,
    options: ['Completed!', 'Nothing is printed', 'Error: else cannot be attached to a loop', 'Prints Completed! 3 times'],
    correctIndex: 0,
    explanation: 'In Python, a loop else clause executes when the loop finishes iterating without encountering a break statement.',
  },
  {
    id: 'q13',
    topic: 'Exception Handling',
    difficulty: 'Intermediate',
    question: 'Which block in a try-except statement ALWAYS executes, regardless of errors?',
    options: ['else', 'finally', 'catch', 'always'],
    correctIndex: 1,
    explanation: 'The finally block always executes when leaving a try statement, whether an exception occurred, was handled, or the block returned.',
  },
  {
    id: 'q14',
    topic: 'Strings & Multiplication',
    difficulty: 'Beginner',
    question: 'What is the output of "Py" * 3?',
    options: ['PyPyPy', 'Py3', 'Error: cannot multiply string by int', '["Py", "Py", "Py"]'],
    correctIndex: 0,
    explanation: 'Multiplying a string by an integer n repeats the string n times: "Py" * 3 produces "PyPyPy".',
  },
  {
    id: 'q15',
    topic: 'Generators',
    difficulty: 'Advanced',
    question: 'Which keyword transforms a standard Python function into a generator function?',
    options: ['generate', 'yield', 'return', 'stream'],
    correctIndex: 1,
    explanation: 'The yield keyword pauses function execution and yields a value to the caller, producing a generator iterator.',
  },
];
