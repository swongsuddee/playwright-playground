// A tiny, safe expression evaluator for the A2 flowchart runner.
// Supports numbers, strings, booleans, variables, arithmetic (+ - * / %),
// comparisons (== != < <= > >=), boolean (&& || !), unary (-, !), and parentheses.
// No eval / Function — a hand-written recursive-descent parser.

export type Val = number | string | boolean;
export type Vars = Record<string, Val>;

type Tok = { t: "num" | "str" | "id" | "op"; v: string };

function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  const two = ["==", "!=", "<=", ">=", "&&", "||"];
  while (i < src.length) {
    const c = src[i];
    if (c === " " || c === "\t") { i++; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1, s = "";
      while (j < src.length && src[j] !== c) { s += src[j]; j++; }
      if (j >= src.length) throw new Error("Unclosed string");
      toks.push({ t: "str", v: s }); i = j + 1; continue;
    }
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] ?? ""))) {
      let j = i, s = "";
      while (j < src.length && /[0-9.]/.test(src[j])) { s += src[j]; j++; }
      toks.push({ t: "num", v: s }); i = j; continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i, s = "";
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) { s += src[j]; j++; }
      toks.push({ t: "id", v: s }); i = j; continue;
    }
    const pair = src.slice(i, i + 2);
    if (two.includes(pair)) { toks.push({ t: "op", v: pair }); i += 2; continue; }
    if ("+-*/%<>!()".includes(c)) { toks.push({ t: "op", v: c }); i++; continue; }
    throw new Error(`Unexpected character “${c}”`);
  }
  return toks;
}

class Parser {
  private p = 0;
  constructor(private toks: Tok[], private vars: Vars) {}
  private peek() { return this.toks[this.p]; }
  private eat() { return this.toks[this.p++]; }
  private isOp(v: string) { const t = this.peek(); return t && t.t === "op" && t.v === v; }

  parse(): Val {
    const v = this.or();
    if (this.p < this.toks.length) throw new Error("Unexpected extra input");
    return v;
  }
  private or(): Val {
    let a = this.and();
    while (this.isOp("||")) { this.eat(); const b = this.and(); a = truthy(a) || truthy(b); }
    return a;
  }
  private and(): Val {
    let a = this.cmp();
    while (this.isOp("&&")) { this.eat(); const b = this.cmp(); a = truthy(a) && truthy(b); }
    return a;
  }
  private cmp(): Val {
    let a = this.add();
    while (this.peek() && this.peek().t === "op" && ["==", "!=", "<", "<=", ">", ">="].includes(this.peek().v)) {
      const op = this.eat().v; const b = this.add();
      a = compare(a, b, op);
    }
    return a;
  }
  private add(): Val {
    let a = this.mul();
    while (this.isOp("+") || this.isOp("-")) {
      const op = this.eat().v; const b = this.mul();
      if (op === "+") a = typeof a === "string" || typeof b === "string" ? String(a) + String(b) : num(a) + num(b);
      else a = num(a) - num(b);
    }
    return a;
  }
  private mul(): Val {
    let a = this.unary();
    while (this.isOp("*") || this.isOp("/") || this.isOp("%")) {
      const op = this.eat().v; const b = this.unary();
      a = op === "*" ? num(a) * num(b) : op === "/" ? num(a) / num(b) : num(a) % num(b);
    }
    return a;
  }
  private unary(): Val {
    if (this.isOp("-")) { this.eat(); return -num(this.unary()); }
    if (this.isOp("!")) { this.eat(); return !truthy(this.unary()); }
    return this.primary();
  }
  private primary(): Val {
    const t = this.peek();
    if (!t) throw new Error("Unexpected end of expression");
    if (this.isOp("(")) { this.eat(); const v = this.or(); if (!this.isOp(")")) throw new Error("Missing )"); this.eat(); return v; }
    this.eat();
    if (t.t === "num") return Number(t.v);
    if (t.t === "str") return t.v;
    if (t.t === "id") {
      if (t.v === "true") return true;
      if (t.v === "false") return false;
      if (!(t.v in this.vars)) throw new Error(`Unknown variable “${t.v}”`);
      return this.vars[t.v];
    }
    throw new Error(`Unexpected “${t.v}”`);
  }
}

function num(v: Val): number { const n = typeof v === "number" ? v : Number(v); if (Number.isNaN(n)) throw new Error(`“${v}” is not a number`); return n; }
function truthy(v: Val): boolean { return typeof v === "boolean" ? v : typeof v === "number" ? v !== 0 : v !== ""; }
function compare(a: Val, b: Val, op: string): boolean {
  if (op === "==") return a === b || String(a) === String(b);
  if (op === "!=") return !(a === b || String(a) === String(b));
  const x = num(a), y = num(b);
  return op === "<" ? x < y : op === "<=" ? x <= y : op === ">" ? x > y : x >= y;
}

/** Evaluate an expression string against variables. Throws Error with a friendly message. */
export function evalExpr(src: string, vars: Vars): Val {
  const toks = tokenize(src);
  if (toks.length === 0) throw new Error("Empty expression");
  return new Parser(toks, vars).parse();
}

/** Parse a process statement: either `name = expr` (assignment) or a bare expression. */
export function runStatement(src: string, vars: Vars): void {
  const m = src.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([^=].*)$/);
  if (m && !src.trim().startsWith("=")) {
    vars[m[1]] = evalExpr(m[2], vars);
  } else {
    evalExpr(src, vars); // bare expression (no assignment) — evaluated, result ignored
  }
}

/** Turn a raw input string into a number when it looks numeric, else keep the string. */
export function coerceInput(raw: string): Val {
  const s = raw.trim();
  if (s !== "" && /^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return raw;
}
