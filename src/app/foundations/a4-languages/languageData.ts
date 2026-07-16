// A4 — Programming Languages
// The SAME beginner program in three languages, plus a canned (fake) execution
// trace so we can build a Python-Tutor-style step-through visualizer WITHOUT a
// real interpreter. The three programs are written so one shared trace works for
// all of them: each trace step references a logical "anchor", and every language
// maps that anchor to its own real line number (see ANCHORS below).

export type Lang = "python" | "typescript" | "java";

export const LANGS: { key: Lang; label: string; note: string }[] = [
  { key: "python", label: "Python", note: "Great first language" },
  { key: "typescript", label: "TypeScript", note: "Used by this playground" },
  { key: "java", label: "Java", note: "Also supported by Playwright" },
];

// The program (as arrays of lines, so we can render numbered, highlightable code).
// Logic (identical in all three):
//   loop over the numbers 1..5
//   for each number: if it is even print "<n> is even" else print "<n> is odd"
//   keep a running total; at the end print "total = 15"
export const PROGRAMS: Record<Lang, string[]> = {
  python: [
    "total = 0",
    "for n in range(1, 6):",
    "    if n % 2 == 0:",
    '        print(f"{n} is even")',
    "    else:",
    '        print(f"{n} is odd")',
    "    total += n",
    'print(f"total = {total}")',
  ],
  typescript: [
    "let total = 0;",
    "for (let n = 1; n <= 5; n++) {",
    "  if (n % 2 === 0) {",
    "    console.log(`${n} is even`);",
    "  } else {",
    "    console.log(`${n} is odd`);",
    "  }",
    "  total += n;",
    "}",
    "console.log(`total = ${total}`);",
  ],
  java: [
    "public class Numbers {",
    "  public static void main(String[] args) {",
    "    int total = 0;",
    "    for (int n = 1; n <= 5; n++) {",
    "      if (n % 2 == 0) {",
    '        System.out.println(n + " is even");',
    "      } else {",
    '        System.out.println(n + " is odd");',
    "      }",
    "      total += n;",
    "    }",
    '    System.out.println("total = " + total);',
    "  }",
    "}",
  ],
};

// A logical location in the program that the trace can point at.
export type Anchor =
  | "init" // set total = 0
  | "forLine" // the for-loop header
  | "printEven" // print "<n> is even"
  | "printOdd" // print "<n> is odd"
  | "addTotal" // total += n
  | "printTotal"; // print the final total

// Real 1-based line number of each anchor, per language. Because the boilerplate
// differs (Java wraps everything in a class + main), the numbers differ — but the
// single shared trace below stays correct for every language.
export const ANCHORS: Record<Lang, Record<Anchor, number>> = {
  python: { init: 1, forLine: 2, printEven: 4, printOdd: 6, addTotal: 7, printTotal: 8 },
  typescript: { init: 1, forLine: 2, printEven: 4, printOdd: 6, addTotal: 8, printTotal: 10 },
  java: { init: 3, forLine: 4, printEven: 6, printOdd: 8, addTotal: 10, printTotal: 12 },
};

export type Step = {
  anchor: Anchor;
  vars: { n: number | null; total: number };
  output: string[]; // the full console output AFTER this step runs
  note: string; // plain-language narration of what just happened
};

// Canned trace — 13 fixed steps. NOT produced by a real interpreter; each value
// is written out by hand so it always matches the code shown above.
export const TRACE: Step[] = [
  {
    anchor: "init",
    vars: { n: null, total: 0 },
    output: [],
    note: "Create a running total and set it to 0.",
  },
  {
    anchor: "forLine",
    vars: { n: 1, total: 0 },
    output: [],
    note: "The loop begins. n starts at 1 and repeats while n is 5 or less.",
  },
  {
    anchor: "printOdd",
    vars: { n: 1, total: 0 },
    output: ["1 is odd"],
    note: "n = 1. 1 % 2 is 1 (not 0), so n is odd → run the else branch.",
  },
  {
    anchor: "addTotal",
    vars: { n: 1, total: 1 },
    output: ["1 is odd"],
    note: "Add n (1) to total. total is now 1.",
  },
  {
    anchor: "printEven",
    vars: { n: 2, total: 1 },
    output: ["1 is odd", "2 is even"],
    note: "n = 2. 2 % 2 is 0, so n is even → run the if branch.",
  },
  {
    anchor: "addTotal",
    vars: { n: 2, total: 3 },
    output: ["1 is odd", "2 is even"],
    note: "Add n (2) to total. total is now 3.",
  },
  {
    anchor: "printOdd",
    vars: { n: 3, total: 3 },
    output: ["1 is odd", "2 is even", "3 is odd"],
    note: "n = 3. Odd → run the else branch.",
  },
  {
    anchor: "addTotal",
    vars: { n: 3, total: 6 },
    output: ["1 is odd", "2 is even", "3 is odd"],
    note: "Add n (3) to total. total is now 6.",
  },
  {
    anchor: "printEven",
    vars: { n: 4, total: 6 },
    output: ["1 is odd", "2 is even", "3 is odd", "4 is even"],
    note: "n = 4. Even → run the if branch.",
  },
  {
    anchor: "addTotal",
    vars: { n: 4, total: 10 },
    output: ["1 is odd", "2 is even", "3 is odd", "4 is even"],
    note: "Add n (4) to total. total is now 10.",
  },
  {
    anchor: "printOdd",
    vars: { n: 5, total: 10 },
    output: ["1 is odd", "2 is even", "3 is odd", "4 is even", "5 is odd"],
    note: "n = 5. Odd → run the else branch.",
  },
  {
    anchor: "addTotal",
    vars: { n: 5, total: 15 },
    output: ["1 is odd", "2 is even", "3 is odd", "4 is even", "5 is odd"],
    note: "Add n (5) to total. total is now 15. The next n would be 6, so the loop stops.",
  },
  {
    anchor: "printTotal",
    vars: { n: 5, total: 15 },
    output: ["1 is odd", "2 is even", "3 is odd", "4 is even", "5 is odd", "total = 15"],
    note: "The loop is done. Print the final total.",
  },
];
