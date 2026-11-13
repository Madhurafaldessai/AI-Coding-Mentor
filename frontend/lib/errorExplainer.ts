import { Lang } from "@mentor/shared";

export interface FriendlyErrorDiagnosis {
  title: string;
  explanation: string;
  suggestion: string;
}

interface ErrorRule {
  pattern: RegExp;
  languages?: Lang[];
  diagnose: (match: RegExpMatchArray, raw: string) => FriendlyErrorDiagnosis;
}

const ERROR_RULES: ErrorRule[] = [
  // 1. Python IndentationError
  {
    pattern: /IndentationError:\s*(.*)/i,
    languages: ["python"],
    diagnose: (_, raw) => ({
      title: "Indentation Mismatch",
      explanation: "Python uses indentation (spaces/tabs) to define code blocks instead of curly braces.",
      suggestion: "Check your line spacing. Ensure all code inside your function, loop, or if-statement aligns by 4 spaces.",
    }),
  },
  // 2. Python SyntaxError
  {
    pattern: /SyntaxError:\s*invalid syntax/i,
    languages: ["python"],
    diagnose: () => ({
      title: "Syntax Slip",
      explanation: "Python couldn't understand a statement on this line.",
      suggestion: "Look for a missing colon (:) at the end of a 'def', 'if', or 'for' line, or an unclosed parenthesis.",
    }),
  },
  // 3. Python NameError
  {
    pattern: /NameError:\s*name '([^']+)' is not defined/i,
    languages: ["python"],
    diagnose: (match) => ({
      title: `Unknown Variable '${match[1]}'`,
      explanation: `Python looked for '${match[1]}' but couldn't find where it was created.`,
      suggestion: `Check for typos in '${match[1]}', or make sure you declared and assigned it before using it.`,
    }),
  },
  // 4. Python IndexError
  {
    pattern: /IndexError:\s*(?:list|string|tuple)?\s*index out of range/i,
    languages: ["python"],
    diagnose: () => ({
      title: "Index Out of Bounds",
      explanation: "You tried to access an item at an index that doesn't exist.",
      suggestion: "Remember that counting starts at 0. A list of 5 items only has indices from 0 up to 4.",
    }),
  },
  // 5. Python TypeError (str + int concatenation)
  {
    pattern: /TypeError:\s*can only concatenate str \(not "(?:int|float)"\) to str/i,
    languages: ["python"],
    diagnose: () => ({
      title: "Type Mismatch",
      explanation: "You tried to join text with a number directly.",
      suggestion: "Convert the number to text first using str(number) or use f'text {number}'.",
    }),
  },
  // 6. Python KeyError
  {
    pattern: /KeyError:\s*'([^']+)'/i,
    languages: ["python"],
    diagnose: (match) => ({
      title: `Dictionary Key Missing ('${match[1]}')`,
      explanation: `The dictionary doesn't have a key named '${match[1]}'.`,
      suggestion: `Check if the key is in the dictionary with 'if "${match[1]}" in dict:', or use dict.get("${match[1]}").`,
    }),
  },
  // 7. Python ZeroDivisionError
  {
    pattern: /ZeroDivisionError:\s*division by zero/i,
    languages: ["python"],
    diagnose: () => ({
      title: "Division by Zero",
      explanation: "A calculation attempted to divide a number by zero.",
      suggestion: "Add a check to verify the divisor is not zero before dividing (e.g. 'if divisor != 0:').",
    }),
  },
  // 8. Python AttributeError
  {
    pattern: /AttributeError:\s*'([^']+)' object has no attribute '([^']+)'/i,
    languages: ["python"],
    diagnose: (match) => ({
      title: `Attribute Not Found`,
      explanation: `A variable of type '${match[1]}' does not have a method or property called '.${match[2]}()'.`,
      suggestion: `Verify your variable type and spelling. Did a previous function return None instead of an object?`,
    }),
  },
  // 9. Python ValueError (invalid int)
  {
    pattern: /ValueError:\s*invalid literal for int\(\) with base 10:\s*'([^']*)'/i,
    languages: ["python"],
    diagnose: (match) => ({
      title: "Cannot Convert to Number",
      explanation: `int() expected digits but received '${match[1]}'.`,
      suggestion: "Make sure you strip whitespace or symbols before converting string input to an integer.",
    }),
  },

  // 10. JavaScript ReferenceError
  {
    pattern: /ReferenceError:\s*([^\s]+) is not defined/i,
    languages: ["javascript"],
    diagnose: (match) => ({
      title: `Variable '${match[1]}' Not Found`,
      explanation: `JavaScript couldn't find a variable named '${match[1]}' in scope.`,
      suggestion: `Declare '${match[1]}' with let, const, or check if you mistyped the variable name.`,
    }),
  },
  // 11. JavaScript TypeError: Cannot read properties of undefined/null
  {
    pattern: /TypeError:\s*Cannot read propert(?:y|ies) of (undefined|null) \(reading '([^']+)'\)/i,
    languages: ["javascript"],
    diagnose: (match) => ({
      title: `Cannot Read Property of ${match[1]}`,
      explanation: `You attempted to access .${match[2]} on a value that is currently ${match[1]}.`,
      suggestion: `Guard the access with optional chaining (?.${match[2]}) or check if the object exists first.`,
    }),
  },
  // 12. JavaScript TypeError: is not a function
  {
    pattern: /TypeError:\s*([^\s]+) is not a function/i,
    languages: ["javascript"],
    diagnose: (match) => ({
      title: `'${match[1]}' is Not a Function`,
      explanation: `You tried to call '${match[1]}()' with parentheses, but it is not a callable function.`,
      suggestion: `Check the type of '${match[1]}' and confirm spelling against standard array/string methods.`,
    }),
  },
  // 13. JavaScript SyntaxError: Unexpected token
  {
    pattern: /SyntaxError:\s*Unexpected token\s*'([^']+)'/i,
    languages: ["javascript"],
    diagnose: (match) => ({
      title: `Unexpected Symbol '${match[1]}'`,
      explanation: `JavaScript found '${match[1]}' in a position where the language grammar does not permit it.`,
      suggestion: `Check for unmatched parentheses '()', curly braces '{}', or a misplaced comma/semicolon.`,
    }),
  },
  // 14. JavaScript RangeError (Recursion)
  {
    pattern: /RangeError:\s*Maximum call stack size exceeded/i,
    languages: ["javascript"],
    diagnose: () => ({
      title: "Infinite Recursion",
      explanation: "A recursive function kept calling itself until browser memory ran out.",
      suggestion: "Check your recursive base condition. Make sure arguments reduce toward the base case every step.",
    }),
  },

  // 15. C++ Missing Semicolon
  {
    pattern: /error:\s*expected '(?:;|,\s*or\s*;)' before/i,
    languages: ["cpp"],
    diagnose: () => ({
      title: "Missing Semicolon (;)",
      explanation: "C++ requires statements to end with a semicolon.",
      suggestion: "Check the end of the line immediately above this error and add the missing semicolon.",
    }),
  },
  // 16. C++ Undeclared Identifier
  {
    pattern: /error:\s*'([^']+)' was not declared in this scope/i,
    languages: ["cpp"],
    diagnose: (match) => ({
      title: `Undeclared Variable '${match[1]}'`,
      explanation: `The compiler doesn't recognize '${match[1]}' in the current block.`,
      suggestion: `Declare the variable with its type (e.g. 'int ${match[1]};') or include the required header file.`,
    }),
  },
  // 17. C++ Type Conversion Error
  {
    pattern: /error:\s*cannot convert '([^']+)' to '([^']+)'/i,
    languages: ["cpp"],
    diagnose: (match) => ({
      title: `Cannot Convert ${match[1]} to ${match[2]}`,
      explanation: `C++ is strictly typed and will not implicitly convert these types.`,
      suggestion: `Check the return type of your function or cast explicitly if conversion is safe.`,
    }),
  },
  // 18. C++ Segmentation Fault
  {
    pattern: /segmentation fault/i,
    languages: ["cpp"],
    diagnose: () => ({
      title: "Segmentation Fault (Memory Access Violation)",
      explanation: "Your program attempted to read or write to a memory address it does not own.",
      suggestion: "Check your array bounds and pointer dereferences. Make sure pointers are initialized before use.",
    }),
  },

  // 19. Universal Timeout
  {
    pattern: /(?:timeout|took too long|execution timed out)/i,
    diagnose: () => ({
      title: "Execution Timed Out (> 5 Seconds)",
      explanation: "Your code took longer than 5 seconds to complete, likely due to an infinite loop.",
      suggestion: "Check while-loops or for-loops to ensure loop conditions eventually terminate (e.g. increment counters).",
    }),
  },
];

export function explainError(
  rawError: string,
  language: Lang
): FriendlyErrorDiagnosis {
  if (!rawError || !rawError.trim()) {
    return {
      title: "Execution Error",
      explanation: "An error occurred during execution.",
      suggestion: "Check the raw traceback below for clues.",
    };
  }

  for (const rule of ERROR_RULES) {
    if (rule.languages && !rule.languages.includes(language)) {
      continue;
    }
    const match = rawError.match(rule.pattern);
    if (match) {
      return rule.diagnose(match, rawError);
    }
  }

  // Fallback diagnosis
  return {
    title: "Runtime Issue Detected",
    explanation: "Your code encountered an issue during test execution.",
    suggestion: "Expand the raw output below to inspect the exact line and error details.",
  };
}

