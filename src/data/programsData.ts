import { ProgramItem } from '../types';

export const pythonPrograms: ProgramItem[] = [
  {
    id: 'hello-world',
    title: 'Hello World & String Formatting',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    description: 'The canonical first program in Python showcasing basic output, string interpolation, and f-strings.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    code: `# Canonical Hello World in Python
name = "Future Python Master"
role = "Software Engineer"
skills = ["Python", "Algorithms", "Clean Code"]

print("🐍 Welcome to Python Master!")
print(f"Hello, {name}!")
print(f"Target Role: {role}")
print(f"Core Skills: {', '.join(skills)}")
print("Let's build something extraordinary today.")`,
    explanation: 'Demonstrates print(), string variables, f-string interpolation, and the str.join() method.',
  },
  {
    id: 'calculator',
    title: 'Multi-Operation Calculator',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    description: 'Performs arithmetic calculations including addition, subtraction, multiplication, division, modulo, and exponentiation.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    code: `# Multi-Operation Calculator
def calculate(a, b, op):
    if op == '+':
        return a + b
    elif op == '-':
        return a - b
    elif op == '*':
        return a * b
    elif op == '/':
        if b == 0:
            return "Error: Cannot divide by zero!"
        return a / b
    elif op == '^' or op == '**':
        return a ** b
    elif op == '%':
        return a % b
    else:
        return f"Unknown operator '{op}'"

# Test calculations
num1 = 24
num2 = 7

print(f"{num1} + {num2} = {calculate(num1, num2, '+')}")
print(f"{num1} - {num2} = {calculate(num1, num2, '-')}")
print(f"{num1} * {num2} = {calculate(num1, num2, '*')}")
print(f"{num1} / {num2} = {round(calculate(num1, num2, '/'), 3)}")
print(f"{num1} % {num2} = {calculate(num1, num2, '%')}")
print(f"2 ** 8 = {calculate(2, 8, '**')}")`,
    explanation: 'Uses conditionals to dispatch operations and guards against division by zero.',
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Series Generator',
    category: 'Math & Algorithms',
    difficulty: 'Intermediate',
    description: 'Generates the Fibonacci sequence up to N terms using both iterative and generator techniques.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `# Fibonacci Sequence Generator
def generate_fibonacci(n_terms):
    if n_terms <= 0:
        return []
    if n_terms == 1:
        return [0]
    
    sequence = [0, 1]
    while len(sequence) < n_terms:
        next_val = sequence[-1] + sequence[-2]
        sequence.append(next_val)
    return sequence

terms = 12
fib_seq = generate_fibonacci(terms)

print(f"First {terms} Fibonacci numbers:")
print(fib_seq)

# Calculate Golden Ratio approximation
if len(fib_seq) > 2:
    phi_approx = fib_seq[-1] / fib_seq[-2]
    print(f"Golden Ratio Approximation (F_{terms}/F_{terms-1}): {round(phi_approx, 5)}")`,
    explanation: 'Computes sequence iteratively in O(n) time, avoiding the O(2^n) exponential blowup of naive recursion.',
  },
  {
    id: 'prime-number',
    title: 'Prime Number Checker & Sieve',
    category: 'Math & Algorithms',
    difficulty: 'Intermediate',
    description: 'Verifies prime numbers using trial division up to sqrt(n) and lists all primes in a given range.',
    timeComplexity: 'O(sqrt(n))',
    spaceComplexity: 'O(1)',
    code: `# Prime Number Checker & Range Finder
import math

def is_prime(number):
    if number <= 1:
        return False
    if number <= 3:
        return True
    if number % 2 == 0 or number % 3 == 0:
        return False
    
    limit = int(math.sqrt(number))
    for i in range(5, limit + 1, 6):
        if number % i == 0 or number % (i + 2) == 0:
            return False
    return True

# Test primes in range 1 to 50
limit = 50
primes = [n for n in range(1, limit + 1) if is_prime(n)]

print(f"Prime numbers up to {limit}:")
print(primes)
print(f"Total count: {len(primes)}")

test_num = 997
print(f"Is {test_num} prime? -> {is_prime(test_num)}")`,
    explanation: 'Uses the 6k ± 1 optimization for primality testing, checking divisibility only up to the square root.',
  },
  {
    id: 'student-management',
    title: 'Student Grade & GPA System',
    category: 'Applications',
    difficulty: 'Intermediate',
    description: 'Manages student rosters, calculates subject grades, weighted GPA, and identifies class honors.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `# Student Management System
students = [
    {"name": "Sophia", "scores": [95, 92, 88, 98]},
    {"name": "Marcus", "scores": [78, 82, 85, 79]},
    {"name": "Elena", "scores": [90, 87, 91, 89]},
    {"name": "David", "scores": [65, 72, 70, 68]}
]

def analyze_students(roster):
    print("=" * 45)
    print("🎓 STUDENT GRADE AUDIT REPORT")
    print("=" * 45)
    
    for s in roster:
        avg = sum(s["scores"]) / len(s["scores"])
        if avg >= 90:
            grade = "A (Distinction)"
        elif avg >= 80:
            grade = "B (Merit)"
        elif avg >= 70:
            grade = "C (Pass)"
        else:
            grade = "Needs Improvement"
        
        print(f"Student: {s['name']} | Avg: {round(avg, 1)}% | Grade: {grade}")

analyze_students(students)`,
    explanation: 'Combines dictionaries, lists, aggregation functions, and formatted string alignment.',
  },
  {
    id: 'expense-tracker',
    title: 'Personal Expense & Budget Tracker',
    category: 'Applications',
    difficulty: 'Intermediate',
    description: 'Tracks categorized transactions, generates breakdown summaries, and checks against monthly budget limits.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    code: `# Personal Expense Tracker
expenses = [
    {"desc": "Groceries", "category": "Food", "amount": 64.50},
    {"desc": "Cloud Server Hosting", "category": "Tech", "amount": 25.00},
    {"desc": "Coffee & Pastry", "category": "Food", "amount": 8.75},
    {"desc": "Subway Pass", "category": "Transport", "amount": 32.00},
    {"desc": "Python Course Book", "category": "Education", "amount": 42.00},
    {"desc": "Dinner with Friends", "category": "Food", "amount": 55.00}
]

def generate_financial_report(data, budget_limit=300.00):
    total = sum(item["amount"] for item in data)
    category_totals = {}
    
    for item in data:
        cat = item["category"]
        category_totals[cat] = category_totals.get(cat, 0.0) + item["amount"]
        
    print("💰 MONTHLY EXPENSE BREAKDOWN")
    print("-" * 35)
    for cat, amt in sorted(category_totals.items(), key=lambda x: x[1], reverse=True):
        pct = (amt / total) * 100
        print(f"{cat}: " + "$" + f"{round(amt, 2)} ({round(pct, 1)}%)")
    print("-" * 35)
    print("Total Spent : " + "$" + f"{round(total, 2)}")
    print("Budget Limit: " + "$" + f"{round(budget_limit, 2)}")
    
    status = "Under Budget ✅" if total <= budget_limit else "Over Budget ⚠️"
    print(f"Status      : {status}")

generate_financial_report(expenses, 300.00)`,
    explanation: 'Uses dictionary aggregation, sorting by custom lambda keys, and percentage calculations.',
  },
  {
    id: 'palindrome-anagram',
    title: 'Palindrome & Anagram Verifier',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    description: 'Verifies whether strings read identically forwards and backwards, and whether two words are anagrams.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `# Palindrome & Anagram Verifier
def is_palindrome(text):
    clean = "".join(ch.lower() for ch in text if ch.isalnum())
    return clean == clean[::-1]

def is_anagram(str1, str2):
    clean1 = "".join(ch.lower() for ch in str1 if ch.isalnum())
    clean2 = "".join(ch.lower() for ch in str2 if ch.isalnum())
    return sorted(clean1) == sorted(clean2)

# Test Palindromes
samples = ["Racecar", "Never odd or even", "Python Master"]
print("🔍 PALINDROME CHECKS:")
for s in samples:
    print(f"'{s}' -> {is_palindrome(s)}")

# Test Anagrams
pair_a = ("listen", "silent")
pair_b = ("python", "typhoon")
print("\\n🔍 ANAGRAM CHECKS:")
print(f"'{pair_a[0]}' & '{pair_a[1]}' -> {is_anagram(*pair_a)}")
print(f"'{pair_b[0]}' & '{pair_b[1]}' -> {is_anagram(*pair_b)}")`,
    explanation: 'Shows string normalization, character filtering with list comprehensions, slicing, and sorting.',
  },
  {
    id: 'password-analyzer',
    title: 'Password Strength & Generator',
    category: 'Games & Utilities',
    difficulty: 'Intermediate',
    description: 'Evaluates password complexity criteria and generates high-entropy cryptographic passwords.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `# Password Strength Evaluator & Generator
import random

def evaluate_password(pwd):
    length_ok = len(pwd) >= 8
    has_upper = any(c.isupper() for c in pwd)
    has_lower = any(c.islower() for c in pwd)
    has_digit = any(c.isdigit() for c in pwd)
    has_special = any(c in "!@#$%^&*()-_+=" for c in pwd)
    
    score = sum([length_ok, has_upper, has_lower, has_digit, has_special])
    
    ratings = {5: "Very Strong 🛡️", 4: "Strong 💪", 3: "Moderate ⚠️", 2: "Weak ❌", 1: "Very Weak 🚨"}
    return ratings.get(score, "Unacceptable")

def generate_password(length=14):
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    return "".join(random.choice(chars) for _ in range(length))

test_passwords = ["123456", "pythontips", "Python2026!", generate_password(16)]

print("🔑 PASSWORD EVALUATION:")
for p in test_passwords:
    print(f"{p} -> {evaluate_password(p)}")`,
    explanation: 'Uses Python any() generator expressions, random choices, and dictionary scoring maps.',
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort Visualizer',
    category: 'Math & Algorithms',
    difficulty: 'Intermediate',
    description: 'Implements the Bubble Sort algorithm with step-by-step state logging of swaps and comparisons.',
    timeComplexity: 'O(n^2)',
    spaceComplexity: 'O(1)',
    code: `# Bubble Sort with Step Tracing
def bubble_sort(arr):
    n = len(arr)
    steps = 0
    print(f"Initial Array: {arr}\\n")
    
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                steps += 1
                print(f"Step {steps}: Swapped -> {arr}")
        if not swapped:
            # Optimized exit if already sorted
            break
            
    print(f"\\nSorted Array: {arr}")
    print(f"Total Swaps Performed: {steps}")
    return arr

sample_list = [64, 34, 25, 12, 22, 11, 90]
bubble_sort(sample_list)`,
    explanation: 'Features an early termination flag swapped when no adjacent elements require swapping.',
  },
  {
    id: 'bank-oop',
    title: 'Bank Account Simulator (OOP)',
    category: 'OOP & Data',
    difficulty: 'Intermediate',
    description: 'Models real-world bank transactions with inheritance, encapsulation, and balance checking.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    code: `# Bank Account System using OOP
class BankAccount:
    def __init__(self, owner, starting_balance=0.0):
        self.owner = owner
        self._balance = starting_balance  # Encapsulated attribute
        self.transactions = []

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            self.transactions.append("Deposit: +" + str(round(amount, 2)))
            print(f"✅ Deposited {amount}. New Balance: {round(self._balance, 2)}")
        else:
            print("❌ Invalid deposit amount.")

    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            self.transactions.append("Withdrawal: -" + str(round(amount, 2)))
            print(f"💸 Withdrew {amount}. Remaining Balance: {round(self._balance, 2)}")
        else:
            print(f"❌ Insufficient funds! Current Balance: {round(self._balance, 2)}")

    def get_statement(self):
        print(f"\\n📄 STATEMENT FOR {self.owner.upper()}:")
        for t in self.transactions:
            print(f"  • {t}")
        print(f"Final Balance: {round(self._balance, 2)}")

# Execute banking simulation
account = BankAccount("Satoshi Nakamoto", 500.00)
account.deposit(250.00)
account.withdraw(120.50)
account.withdraw(900.00)
account.get_statement()`,
    explanation: 'Illustrates object initialization, instance methods, and transaction log tracking.',
  },
  {
    id: 'caesar-cipher',
    title: 'Caesar Cipher Encryptor',
    category: 'Games & Utilities',
    difficulty: 'Beginner',
    description: 'Implements classical substitution cryptography with shifting character ASCII ord() codes.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    code: `# Caesar Cipher Cryptography
def caesar_cipher(text, shift, decrypt=False):
    if decrypt:
        shift = -shift
    result = []
    
    for char in text:
        if char.isupper():
            base = ord('A')
            shifted = chr((ord(char) - base + shift) % 26 + base)
            result.append(shifted)
        elif char.islower():
            base = ord('a')
            shifted = chr((ord(char) - base + shift) % 26 + base)
            result.append(shifted)
        else:
            result.append(char)
            
    return "".join(result)

secret_message = "Python is the lingua franca of Artificial Intelligence!"
shift_key = 5

encrypted = caesar_cipher(secret_message, shift_key)
decrypted = caesar_cipher(encrypted, shift_key, decrypt=True)

print(f"Original : {secret_message}")
print(f"Encrypted: {encrypted}")
print(f"Decrypted: {decrypted}")`,
    explanation: 'Demonstrates ord() and chr() ASCII manipulation with modulo arithmetic for alphabet wrapping.',
  },
  {
    id: 'word-counter',
    title: 'Text Analyzer & Word Frequency',
    category: 'Applications',
    difficulty: 'Beginner',
    description: 'Parses raw text, strips punctuation, normalizes case, and builds a descending frequency table.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(u)',
    code: `# Word Frequency Counter
sample_text = "Python is powerful. Python is fast. Python runs everywhere from servers to tiny microcontrollers. Learning Python opens infinite possibilities."

def analyze_frequency(text):
    words = text.lower().replace(".", "").replace(",", "").split()
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
        
    print(f"Total Words Processed: {len(words)}")
    print(f"Unique Words Found: {len(counts)}\\n")
    print("Top Word Frequencies:")
    for word, count in sorted(counts.items(), key=lambda x: x[1], reverse=True)[:6]:
        bar = "█" * (count * 2)
        print(f"{word}: {count} {bar}")

analyze_frequency(sample_text)`,
    explanation: 'Uses string split, dictionary frequency tables, and visual ASCII frequency bars.',
  },
];
