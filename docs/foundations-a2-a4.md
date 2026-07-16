# Foundations A2–A4 — Draft Detail

Status: **draft for discussion** · Last updated: 2026-07-14

Detail spec for the next three **Track A — Foundations** modules, following the shape that
[A1 — Code Blocks](../src/app/foundations/a1-code-blocks/) already ships:

- an **overview page** listing numbered steps,
- a set of **lesson routes** (`learn` / `build` / `play`) driven by one data file,
- a **companion rail** (right panel): external-tool launcher + objective + a "show answer"
  checkpoint + one reference card,
- prev/next nav via a `*LessonShell`, wired into the `Sidebar` under **Track A**.

Each module below gives the module goal, the recommended external tool, the `LESSONS[]`
(with checkpoint Q/A), the `PRACTICES[]`, any reference data the lessons render, and the
companion-rail spec — everything a `practice-author` needs to build it the way A1 was built.

---

## The Track A through-line (why these three, in this order)

The whole point of Foundations is to reach Track B (Playwright) with a tester's mental model
already in place. Each module teaches the **same three control-flow ideas** — sequence,
selection, iteration — in a new representation, and each one is used again in the next:

| Module | Representation of the same 3 ideas | Feeds forward to |
|--------|------------------------------------|------------------|
| A1 ✅ | **Blocks** (Scratch) — no syntax, snap-to-fit | the idea of "instructions that run in order" |
| A2 | **Flow diagrams** — shapes + arrows | A3 draws its decompositions as A2 flowcharts |
| A3 | **Decomposition** — words → numbered steps → flowchart + edge cases | A4 codes those steps; edge cases become **test cases** |
| A4 | **Code** — same logic in TypeScript + Python | Track B, where TS is Playwright's first-class language |

The bridge to say out loud in A3/A4: *a decomposed flow, with its decision branches and
error paths, is essentially a set of test cases.* That single sentence is the reason
Foundations exists before Track B.

---

## Shared conventions (same as A1)

- **Route base:** `/foundations/aN-<slug>` — one folder per module, mirroring
  `a1-code-blocks/`.
- **Data file:** `flowData.ts` / `decompData.ts` / `langData.ts`, each exporting
  `MODULE_BASE`, `TOOL_URL`(s), `LESSONS: Lesson[]`, `PRACTICES: Practice[]`, and any
  module-specific reference arrays (shape legend, trigger-word map, syntax cheat sheet).
- **`Lesson` type** (unchanged from A1): `slug, n, kind: "learn"|"build"|"play", title,
  summary, objective, checkQ, checkA, practiceId?`.
- **`Practice` type** (adapt A1's `blocks` field per module — see each module): `id, n,
  title, concept, goal, steps[], hint`, plus a module-specific "ingredients" list.
- **Companion rail:** clone `A1Rail.tsx` → `A2Rail`/`A3Rail`/`A4Rail`. Same structure:
  external-tool launcher button, "Step N of M" progress bar, "In this step" (objective),
  "✓ Checkpoint" (checkQ → reveal checkA), and one "Remember" card.
- **Practices are "learn here, build in the real tool, mark done":** teach in-app, the
  learner produces the artifact in the external tool, then toggles `Mark as done`
  (`localStorage`, one key per module, e.g. `a2-practice-progress`). Same as A1.
- **Styling:** reuse `panel/panelHeader/panelBody/card/stack/badge/btn/btnPrimary/small/
  code/inspectorList` and the CSS-variable tokens (`--accent-soft`, `--success-soft`, …).
  No hardcoded UI colors — except a deliberate, self-contained palette for a `play` game
  board (A1's maze does this).
- **Sidebar:** add one `Session` entry per module under `track: "A"`, with `children`
  mapped from that module's `LESSONS` (same pattern as the A1 entry).

---

## A2 — Flow diagrams

**Goal:** read and build flowcharts for simple logic — the shapes, the three control-flow
patterns as diagrams, and tracing a chart by hand.

**External tool (recommended):** **draw.io** (`https://app.diagrams.net`) — drag-drop, no
signup, has a Flowchart shape set. Closest to A1's no-typing ethos.
**Optional alt for the curious:** **Mermaid Live Editor** (`https://mermaid.live`) — write
the diagram as text; a good bridge to "diagrams as code" and to Track B. Offer both in the
rail; recommend draw.io first.

**Data file:** `flowData.ts` · **Base:** `/foundations/a2-flow-diagrams`

### Reference data the lessons render

`SHAPES` (the flowchart legend — rendered as cards like A1's `CATEGORIES`):

| Shape | Name | Means |
|-------|------|-------|
| Oval / stadium | **Terminator** | Start or End of the flow |
| Rectangle | **Process** | A single action / step |
| Diamond | **Decision** | A yes/no question — two arrows out |
| Parallelogram | **Input / Output** | Read a value in, or show a result out |
| Arrow | **Flow line** | The direction the flow moves |
| Small circle | **Connector** | Join flows / jump to another part |

`PATTERNS` (the three control-flow shapes as diagrams — the A1 callback):
- **Sequence** — boxes stacked, one arrow each. "Do this, then this."
- **Selection** — a diamond with **Yes**/**No** branches that rejoin. "if / else."
- **Iteration** — an arrow that loops **back** to a decision. "repeat until / while."

### `LESSONS[]`

| n | slug | kind | title | summary | objective | checkQ → checkA |
|---|------|------|-------|---------|-----------|-----------------|
| 1 | `what-is-a-flowchart` | learn | What is a flowchart? | A picture of your logic before you code it. | Say what a flowchart is and why we draw one first. | *Why draw a flowchart before writing code?* → It shows the logic and its decisions/loops so mistakes are cheap to fix before any code exists. |
| 2 | `shapes` | learn | The shapes | Terminator, process, decision, I/O, arrows. | Match each shape to what it means. | *Which shape has more than one arrow coming out, and why?* → The **decision** diamond — one arrow per answer (Yes/No). |
| 3 | `three-patterns` | learn | Sequence, selection, iteration | The same three ideas from A1, as diagrams. | Recognise the three control-flow patterns in a chart. | *A2 arrow that points back upward usually means what?* → A loop (iteration) — the flow repeats. |
| 4 | `tracing` | learn | Reading a flowchart | Follow the arrows for a given input. | Trace a chart step-by-step and predict its output. | *When you hit a decision while tracing, what do you do?* → Answer its question for the current value, then follow the matching arrow. |
| 5 | `practice-1` | build | Draw: make tea | Practice · sequence | Draw a pure-sequence chart, start → end. | *How many arrows leave a process box?* → Exactly one — sequence has no branches. |
| 6 | `practice-2` | build | Draw: even or odd | Practice · selection | Draw one decision with two branches that rejoin. | *What are the two arrows out of "n ÷ 2 has no remainder?"* → Yes → "even", No → "odd". |
| 7 | `practice-3` | build | Draw: count 1 to 5 | Practice · iteration | Draw a loop that repeats a step five times. | *What stops the loop?* → The decision "counter > 5?" — when Yes, exit. |
| 8 | `practice-4` | build | Draw: login flow | Practice · combined | Sequence + decision + loop-back on failure. | *Where does the "wrong password" arrow go?* → Back to the "enter password" step (retry loop), not to End. |
| 9 | `trace-game` | play | Trace Challenge (bonus) | Predict the output of a chart you're shown. | Have fun — read a chart and pick the right result. | *If two people trace the same chart with the same input, should they get the same answer?* → Yes — a correct flowchart is deterministic. |

### `PRACTICES[]` (build lessons; each has `goal`, `ingredients`=shapes, `steps`, `hint`)

- **p1 — Make tea** *(sequence)* — Goal: Start → "boil water" → "add teabag" → "pour" →
  "add milk" → End. Ingredients: terminator ×2, process ×4, arrows. Hint: no diamonds — a
  sequence just flows straight down.
- **p2 — Even or odd** *(selection)* — Goal: input `n` → decision "`n % 2 == 0`?" → Yes:
  output "even" / No: output "odd" → both rejoin → End. Ingredients: terminator, I/O,
  decision, process ×2. Hint: the two branches must **rejoin** before End.
- **p3 — Count 1 to 5** *(iteration)* — Goal: set `count = 1` → decision "`count > 5`?" →
  No: "print count", "count = count + 1", arrow **back** to the decision / Yes: End.
  Ingredients: process, decision, arrows (incl. one going back). Hint: the loop-back arrow
  is what makes it repeat.
- **p4 — Login flow** *(combined)* — Goal: Start → input user+password → decision
  "correct?" → No: "show error", loop back to input / Yes: "show dashboard" → End.
  Ingredients: all shapes. Hint: this is your first *testable* flow — the No branch is the
  error path a tester always checks.

### `trace-game` (the A2 capstone, mirrors A1's maze)

In-app, no external tool. Render a small fixed flowchart (as an SVG or a
Mermaid-rendered diagram — the repo already has the Mermaid MCP available) with a decision
+ a loop. Show an input value; ask "what does this chart output?" as 3–4 multiple-choice
answers; reveal correct/incorrect with the traced path highlighted. Keep a hit/try counter
like the maze. This makes *reading* logic a game, not a reading exercise.

### Companion rail (`A2Rail`)

- Launcher: **Open draw.io ↗** (primary) + a small **Mermaid Live ↗** secondary link.
- Progress bar + "In this step" (objective) + "✓ Checkpoint" (checkQ/checkA) — identical to
  A1Rail.
- "Remember" card: *Ovals start & end · rectangles do · diamonds decide · arrows point the
  way.*

---

## A3 — Problem decomposition

**Goal:** turn a real-world case into ordered, unambiguous steps, then into an A2 flowchart —
and start spotting edge cases (the seed of test thinking).

**External tool:** none required — the artifact is a **numbered step list** (and optionally
the A2 chart). The rail links back to the A2 diagram tool for the "draw it" half. Optional
in-app enhancement: a plain `<textarea>` "worksheet" where the learner types their steps and
`Mark as done` (still `localStorage`), so the module isn't purely read-only.

**Data file:** `decompData.ts` · **Base:** `/foundations/a3-decomposition`

### Reference data the lessons render

`TRIGGERS` (plain-English words → the structure they imply → A2 shape — rendered as cards):

| In the words you hear… | It's a… | Flowchart shape |
|------------------------|---------|-----------------|
| "then", "next", "after that" | Sequence | stacked processes |
| "if", "when", "unless", "otherwise" | Selection (decision) | diamond |
| "for each", "repeat", "until", "keep …ing" | Iteration (loop) | loop-back arrow |
| "ask", "enter", "show", "display" | Input / Output | parallelogram |
| "what if it's empty / wrong / missing?" | **Edge case** | an extra branch |

`PIPELINE` (the method, shown as an ordered card list):
1. **Read** the case; underline the nouns (data) and verbs (actions).
2. **List** the happy-path steps in order — small enough that each is unambiguous.
3. **Mark** decisions and repeats (use the trigger words above).
4. **Hunt edge cases** — empty, wrong, missing, too many, out of order.
5. **Draw** the flowchart (hand off to A2) — happy path + each branch.

### `LESSONS[]`

| n | slug | kind | title | summary | objective | checkQ → checkA |
|---|------|------|-------|---------|-----------|-----------------|
| 1 | `what-is-decomposition` | learn | Breaking a problem down | Big fuzzy task → small clear steps. | Explain why computers (and testers) need explicit steps. | *Why must each step be unambiguous?* → A computer does exactly what's written — a vague step can be done a wrong way. |
| 2 | `words-to-steps` | learn | From words to steps | Underline nouns & verbs; write a numbered list. | Turn a plain-English case into ordered steps. | *What's the difference between a "step" and a "decision"?* → A step always runs; a decision picks which step runs next. |
| 3 | `trigger-words` | learn | Spotting decisions & loops | The words that reveal branches and repeats. | Use trigger words to find selections and iterations. | *"Keep asking until the PIN is right" — which pattern is that?* → Iteration (a loop that repeats until a condition is met). |
| 4 | `edge-cases` | learn | The "what if?" step | Empty, wrong, missing, too many. | List edge cases for a simple case — the seed of testing. | *Why do edge cases matter to a tester?* → They're where software breaks; each one becomes a test case. |
| 5 | `practice-1` | build | Decompose: withdraw cash (ATM) | Practice · decision + error path | Steps + chart with a "wrong PIN" retry loop. | *Where does "wrong PIN" go?* → Back to "enter PIN" (retry), and after N tries → "card kept". |
| 6 | `practice-2` | build | Decompose: make breakfast | Practice · iteration | Steps with a "for each person" repeat. | *"For each person, make toast" — what shape?* → A loop over the list of people. |
| 7 | `practice-3` | build | Decompose: online checkout | Practice · combined | Sequence + "in stock?" + "payment ok?" + "keep shopping" loop. | *How many decision points does checkout have?* → At least two — stock check and payment check (plus the keep-shopping loop). |
| 8 | `capstone` | play | Case → steps → chart → tests | Take one case all the way through. | See a decomposition become test cases. | *Your flow has a happy path and 3 branches. Roughly how many test cases is that?* → About four — one per distinct path through the flow. |

### `PRACTICES[]`

- **p1 — Withdraw cash (ATM)** *(decision + error path)* — Goal: card in → enter PIN →
  decision "PIN correct?" (No → retry, max 3 → keep card) → enter amount → decision "enough
  balance?" (No → "insufficient funds") → dispense → End. Trigger words to spot: "if",
  "until". Hint: every "No" branch is a test a QA writes.
- **p2 — Make breakfast for the family** *(iteration)* — Goal: get list of people → "for
  each person": ask what they want → make it → serve → next person → when list empty, End.
  Hint: the loop repeats once per person — that's iteration over a list.
- **p3 — Online checkout** *(combined)* — Goal: view cart → decision "keep shopping?" (Yes →
  loop back) → decision "all in stock?" (No → remove/notify) → enter payment → decision
  "payment ok?" (No → retry) → confirm order → End. Hint: name each decision — those names
  are your test scenarios.

### `capstone` (the A3 play lesson — the bridge to Track B)

In-app, guided (not a game board): show **one** case (e.g. "reset your password") rendered in
three synced columns — plain English → numbered steps → the A2 flowchart — then a fourth card
that lists the resulting **test cases** ("valid email → link sent", "unknown email → generic
message", "expired link → error", "weak new password → rejected"). Punchline card: *"You just
designed test cases without writing a line of code."* This is the explicit Foundations → Track
B handoff.

### Companion rail (`A3Rail`)

- Launcher: **Open draw.io ↗** (to draw the chart half) — reuse A2's tool.
- Progress + objective + checkpoint (same as A1Rail).
- "Remember" card: the trigger-word cheat: *if/when → decision · for each/until → loop ·
  what-if → edge case.*

---

## A4 — Programming language basics

**Goal:** write the **same logic** in real code — TypeScript **and** Python, side by side —
and *watch it run* with an execution visualizer. Per the plan, **drop C/C++** (no Playwright
binding); TS is recommended because it's Playwright's first-class language, Python as the
friendly alternative.

**External tools:**
- **TypeScript Playground** — `https://www.typescriptlang.org/play` (edit + run TS in the
  browser, shows the compiled JS).
- **Python Tutor** — `https://pythontutor.com/visualize.html` (step through Python **or**
  JavaScript line-by-line with a live variables table — this is the plan's "code-execution
  visualization" / Python-Tutor idea, feature #4).

**Data file:** `langData.ts` · **Base:** `/foundations/a4-language-basics`

### Reference data the lessons render

`SYNTAX` (the TS ↔ Python cheat sheet — rendered as a two-column table; the lessons show
these snippets side by side using the `code`/`CodeBox` style):

| Concept | TypeScript | Python |
|---------|-----------|--------|
| Print output | `console.log("hi")` | `print("hi")` |
| Variable | `let name = "Sam";` | `name = "Sam"` |
| Comment | `// note` | `# note` |
| If / else | `if (n % 2 === 0) { … } else { … }` | `if n % 2 == 0:` … `else:` |
| Loop (count) | `for (let i = 1; i <= 5; i++) { … }` | `for i in range(1, 6):` |
| Function | `function grade(s: number) { … }` | `def grade(s):` |

`CALLBACKS` (tie each concept back to A1–A3, rendered as one card):
- A block that snapped in A1 → a **statement** you type here (and now typos *can* break it).
- A flowchart process (A2) → a line of code; a diamond → an `if`; a loop-back → a `for`/
  `while`.
- The decomposed steps from A3 → the body of a **function**.

### `LESSONS[]`

| n | slug | kind | title | summary | objective | checkQ → checkA |
|---|------|------|-------|---------|-----------|-----------------|
| 1 | `what-is-a-language` | learn | From blocks to text | Why we type code now — and why syntax exists. | Explain what a programming language is vs blocks/diagrams. | *In Scratch you couldn't make a syntax error. Why can you now?* → Text has grammar rules; a missing `;`, `:` or bracket breaks it. |
| 2 | `variables-and-output` | learn | Variables & output | Store a value; print a result. TS vs Python. | Read a variable + print in both languages. | *What's the same about `let x = 5` and `x = 5`?* → Both name a value `x`; only the spelling/rules differ. |
| 3 | `if-else` | learn | Making decisions | The A2 diamond, now as `if/else`. | Write an if/else in TS and Python. | *A flowchart diamond maps to which keyword?* → `if` (with `else` for the other branch). |
| 4 | `loops` | learn | Repeating | The A2 loop-back, now as `for`/`while`. | Write a counting loop in both languages. | *Which flowchart shape becomes a `for` loop?* → The loop-back arrow (iteration). |
| 5 | `functions` | learn | Naming your steps | Wrap A3's steps in a reusable function. | Define and call a function in both languages. | *How is a function like Scratch's "My Blocks"?* → Both bundle steps under a name you can reuse. |
| 6 | `practice-1` | build | Code: greeting | Practice · variables + output | Print a greeting using a name variable, TS + Python. | *Same program, two languages — should the output match?* → Yes — same logic, different syntax. |
| 7 | `practice-2` | build | Code: even or odd | Practice · if/else | Code the A2 even/odd chart in both languages. | *Which operator gives the remainder?* → `%` in both TS and Python. |
| 8 | `practice-3` | build | Code: count 1 to 5 | Practice · loops | Code the A2 counting loop in both languages. | *`range(1, 6)` prints which numbers?* → 1, 2, 3, 4, 5 — the end is exclusive. |
| 9 | `practice-4` | build | Code: FizzBuzz | Practice · combined | Loop + `if/else` + operators, in both languages. | *Why check "divisible by 15" before 3 and 5?* → So "FizzBuzz" wins over "Fizz"/"Buzz" — order of decisions matters. |
| 10 | `visualize` | play | Watch it run | Step through your code line-by-line. | Use Python Tutor to watch variables change each step. | *What does the visualizer show that a flowchart can't?* → The actual **values** in variables at each step. |

### `PRACTICES[]` (each has `goal`, `ts` snippet, `py` snippet, `steps`, `hint`)

The `Practice` type gains `ts: string` and `py: string` (the side-by-side snippets) in place
of A1's `blocks`. Show them with the existing `code`/`CodeBox` styling.

- **p1 — Greeting** *(variables + output)* — Goal: store a name, print `Hello, <name>!`.
  `ts`: `let name = "Sam"; console.log(\`Hello, ${name}!\`);` · `py`: `name = "Sam"` /
  `print(f"Hello, {name}!")`. Hint: change the name and re-run — the output follows the
  variable.
- **p2 — Even or odd** *(if/else)* — Goal: given `n`, print "even"/"odd". Mirrors A2 p2 and
  A4 lesson 3. Hint: this is the A2 diamond, in text.
- **p3 — Count 1 to 5** *(loops)* — Goal: print 1..5 with a loop. Mirrors A2 p3. Hint: the
  loop body runs once per number.
- **p4 — FizzBuzz** *(combined)* — Goal: 1..15; multiples of 3 → "Fizz", of 5 → "Buzz", of
  both → "FizzBuzz", else the number. Hint: check the combined case first — order of `if`s
  matters (the classic bug).

### `visualize` (the A4 play lesson)

In-app: show p2 or FizzBuzz as a static side-by-side (TS | Python), then a big **Open in
Python Tutor ↗** button that deep-links the snippet so the learner steps through it and
watches the variables table. Optional: a tiny in-house stepper for one canonical snippet
(highlight current line + a variables table) as a later enhancement — the plan calls the
embed the v1 and the in-house stepper a follow-up.

### Companion rail (`A4Rail`)

- Launchers: **TypeScript Playground ↗** + **Python Tutor ↗** (two buttons).
- Progress + objective + checkpoint (same as A1Rail).
- "Remember" card: *Same logic, different spelling. `//`+`;` in TS, `#`+`:` in Python.*

---

## Build order & wiring notes

Suggested order: **A2 → A3 → A4** (A3 draws A2 charts; A4 codes A2/A3 logic). Each module is
independent to build and ships like A1:

1. `mkdir a{N}-<slug>/` with `page.tsx` (overview), `layout.tsx` (Sidebar + children +
   `A{N}Rail`), `{module}Data.ts`, `A{N}LessonShell.tsx`, `A{N}Rail.tsx`, `lessonContent.tsx`,
   and one `page.tsx` per lesson route (`<slug>/page.tsx`) — clone A1's files and swap data.
2. Add a `Session` entry per module to `sessions[]` in
   [Sidebar.tsx](../src/components/layout/Sidebar.tsx) under `track: "A"`, with `children`
   mapped from that module's `LESSONS` (copy the A1 entry).
3. Keep every interactive element testable (`data-testid` + accessible name + role) — the
   `play` lessons especially, since they're the richest DOM.

Open questions for review:
- **A2 tool:** draw.io (drag-drop, matches A1) vs Mermaid Live (diagrams-as-code, bridges to
  B) — recommend draw.io primary, Mermaid secondary. Confirm?
- **A3:** keep it artifact-on-paper (link to A2's tool) or add the in-app step `<textarea>`
  worksheet? Recommend the worksheet — keeps the module hands-on.
- **A4 languages:** TS + Python only, or include **Java** (a Playwright binding) as a third
  read-only column? Plan leans TS + Python; Java optional.
- **Progress:** these use the same per-module `localStorage` mark-as-done as A1. Roll into
  the plan's optional cross-module progress bar (feature #5) later.
