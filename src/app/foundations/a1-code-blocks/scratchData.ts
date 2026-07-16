// A3 — Code Blocks with Scratch. Content data for the guide + practices.
// Learners build in the real Scratch editor; this page only teaches and guides.

export const SCRATCH_URL = "https://scratch.mit.edu/projects/editor/?tutorial=getStarted";

export const A1_BASE = "/foundations/a1-code-blocks";

/** A1 is a small multi-page session. Each lesson is its own route (`${A1_BASE}/${slug}`). */
export type Lesson = {
  slug: string;
  n: number;
  kind: "learn" | "build" | "play";
  title: string;
  summary: string;
  objective: string;
  checkQ: string;
  checkA: string;
  practiceId?: string; // for "build" lessons — links to a PRACTICES entry
};

export const LESSONS: Lesson[] = [
  {
    slug: "code-blocks",
    n: 1,
    kind: "learn",
    title: "What is a code block?",
    summary: "The puzzle-piece idea behind block programming.",
    objective: "Understand what a block is and why block coding can’t have syntax errors.",
    checkQ: "Why is it impossible to make a syntax error in Scratch?",
    checkA: "Blocks only snap where they fit — an invalid combination simply won’t connect.",
  },
  {
    slug: "scratch",
    n: 2,
    kind: "learn",
    title: "What is Scratch?",
    summary: "Sprites, the stage, and the green flag.",
    objective: "Know what Scratch is and how to open and run a project.",
    checkQ: "Which button runs your code, and which stops it?",
    checkA: "The green flag ⚑ runs everything; the red stop ⏹ ends it.",
  },
  {
    slug: "blocks",
    n: 3,
    kind: "learn",
    title: "The kinds of blocks",
    summary: "The nine categories and the block shapes.",
    objective: "Recognise the block categories and how each shape connects.",
    checkQ: "Which category holds the loops and if-blocks?",
    checkA: "Control — the orange C-blocks that wrap around other blocks.",
  },
  {
    slug: "using-blocks",
    n: 4,
    kind: "learn",
    title: "How to use them",
    summary: "Drag, snap, wrap, and run.",
    objective: "Be able to assemble and run a simple stack of blocks.",
    checkQ: "In what order do the blocks in a stack run?",
    checkA: "Top to bottom — that order is called a sequence.",
  },
  {
    slug: "practice-1",
    n: 5,
    kind: "build",
    practiceId: "p1",
    title: "Make the cat talk",
    summary: "Practice · sequence + events",
    objective: "Build a script where the cat says two things when you click the flag.",
    checkQ: "In what order do the two “say” blocks run?",
    checkA: "Top to bottom — first one, then the next. That’s a sequence.",
  },
  {
    slug: "practice-2",
    n: 6,
    kind: "build",
    practiceId: "p2",
    title: "Walk across the stage",
    summary: "Practice · loops",
    objective: "Use a repeat loop to move the cat smoothly across the stage.",
    checkQ: "Why use a loop instead of ten “move” blocks?",
    checkA: "A loop repeats one block many times — less work and easy to change.",
  },
  {
    slug: "practice-3",
    n: 7,
    kind: "build",
    practiceId: "p3",
    title: "Never-ending dance",
    summary: "Practice · forever loop",
    objective: "Use a forever loop to animate the cat until you press stop.",
    checkQ: "How do you stop a “forever” loop?",
    checkA: "Click the red stop ⏹ — a forever loop runs until then.",
  },
  {
    slug: "practice-4",
    n: 8,
    kind: "build",
    practiceId: "p4",
    title: "Click to meow",
    summary: "Practice · events",
    objective: "React to a click on the sprite with a sound and a size change.",
    checkQ: "What makes this script run?",
    checkA: "The “when this sprite clicked” event — a different hat block.",
  },
  {
    slug: "practice-5",
    n: 9,
    kind: "build",
    practiceId: "p5",
    title: "Chase the mouse",
    summary: "Practice · forever + conditionals + sensing",
    objective: "Make the cat follow the mouse and react when it catches it.",
    checkQ: "When does an “if” block run the blocks inside it?",
    checkA: "Only when its hexagon condition is true — here, when touching the pointer.",
  },
  {
    slug: "maze",
    n: 10,
    kind: "play",
    title: "Maze Challenge (bonus game)",
    summary: "Steer to the goal without touching the walls.",
    objective: "Have fun! Steer your cursor from START to the red goal without touching a wall.",
    checkQ: "What happens when your cursor touches a black wall?",
    checkA: "You’re sent back to the START — touch the green START square to try again.",
  },
  {
    slug: "flappy",
    n: 11,
    kind: "play",
    title: "Flappy Bird (bonus game)",
    summary: "Tap to flap through the pipes.",
    objective: "Have fun! Tap or press Space to flap and slip the bird through the gaps in the pipes.",
    checkQ: "Which programming idea makes the bird keep falling and the pipes keep moving?",
    checkA: "A loop that runs every frame — each tick adds gravity to the bird and slides the pipes left.",
  },
  {
    slug: "angry-birds",
    n: 12,
    kind: "play",
    title: "Angry Birds (bonus game)",
    summary: "Drag the slingshot to knock out the pigs.",
    objective: "Have fun! Drag the bird back on the slingshot to aim and power your shot, then clear all the pigs.",
    checkQ: "What decides how far and high the bird flies?",
    checkA: "The pull vector — how far and in which direction you drag becomes the launch speed and angle.",
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

/** The nine Scratch 3.0 palette categories. `color` is Scratch's own category color (shown as a swatch). */
export type Category = {
  name: string;
  color: string;
  blurb: string;
  examples: string[];
  beginner?: boolean;
};

export const CATEGORIES: Category[] = [
  { name: "Motion", color: "#4C97FF", beginner: true, blurb: "Move and rotate the sprite around the stage.", examples: ["move 10 steps", "turn ↻ 15 degrees", "go to x: 0 y: 0"] },
  { name: "Looks", color: "#9966FF", beginner: true, blurb: "Make the sprite speak, change costume, size or effects.", examples: ["say “Hello!” for 2 seconds", "next costume", "change size by 10"] },
  { name: "Sound", color: "#CF63CF", beginner: true, blurb: "Play sounds and change the volume.", examples: ["play sound Meow", "start sound Pop", "change volume by -10"] },
  { name: "Events", color: "#FFBF00", beginner: true, blurb: "Start scripts — the “when …” hat blocks that kick things off.", examples: ["when ⚑ clicked", "when this sprite clicked", "when [space] key pressed"] },
  { name: "Control", color: "#FFAB19", beginner: true, blurb: "Loops and conditionals — blocks that wrap other blocks.", examples: ["repeat 10", "forever", "if <…> then", "wait 1 seconds"] },
  { name: "Sensing", color: "#5CB1D6", blurb: "Detect the mouse, keys, edges and other sprites.", examples: ["touching mouse-pointer?", "ask “…” and wait", "key [space] pressed?"] },
  { name: "Operators", color: "#59C059", blurb: "Math, text and logic. These plug into slots on other blocks.", examples: ["( ) + ( )", "pick random 1 to 10", "< > and < >"] },
  { name: "Variables", color: "#FF8C1A", blurb: "Store and change values, like a score or a name.", examples: ["set [score] to 0", "change [score] by 1"] },
  { name: "My Blocks", color: "#FF6680", blurb: "Build your own reusable block from other blocks.", examples: ["define [jump]", "jump"] },
];

/** Block shapes tell you how a block connects. */
export type Shape = { name: string; hint: string; blurb: string };

export const SHAPES: Shape[] = [
  { name: "Hat", hint: "rounded top", blurb: "Starts a script. Every stack begins with one (usually an Events block)." },
  { name: "Stack", hint: "puzzle notches", blurb: "An action. Snap them under each other to run in order (top → bottom)." },
  { name: "C-block", hint: "wraps around", blurb: "Loops & conditionals. Blocks placed inside run repeatedly or conditionally." },
  { name: "Reporter", hint: "rounded oval", blurb: "A value (number/text). Drag it into a slot on another block." },
  { name: "Boolean", hint: "hexagon", blurb: "A true/false answer. Fits the diamond slot of an if or wait-until." },
];

/** How to drive the editor, in order. */
export const HOW_TO: string[] = [
  "Open the editor with the button on the right. Scratch runs in your browser — nothing to install.",
  "The cat sprite lives on the Stage (top-right). The green flag ⚑ runs your code; the red ⏹ stops it.",
  "Blocks live in the palette on the left, grouped by the colored categories above.",
  "Drag a hat block (“when ⚑ clicked”) into the code area in the middle.",
  "Drag action blocks under it — they snap together like LEGO when they line up.",
  "To repeat or make decisions, grab a Control C-block and drop other blocks inside it.",
  "Click the green flag and watch the sprite. No typing, no syntax errors — if a block doesn’t belong, it won’t snap.",
];

/** Beginner practices to do inside the Scratch editor. Progressive difficulty. */
export type Practice = {
  id: string;
  n: number;
  title: string;
  concept: string;
  goal: string;
  blocks: string[];
  steps: string[];
  hint: string;
};

export const PRACTICES: Practice[] = [
  {
    id: "p1",
    n: 1,
    title: "Make the cat talk",
    concept: "sequence + events",
    goal: "When you click the green flag, the cat says “Hello!” then “I can code!”",
    blocks: ["when ⚑ clicked", "say “Hello!” for 2 seconds", "say “I can code!” for 2 seconds"],
    steps: [
      "Drag “when ⚑ clicked” (Events) into the code area.",
      "Snap “say Hello! for 2 seconds” (Looks) underneath it.",
      "Snap another “say …” below and change the text to “I can code!”.",
      "Click the green flag.",
    ],
    hint: "Blocks run top-to-bottom — that order is called a sequence.",
  },
  {
    id: "p2",
    n: 2,
    title: "Walk across the stage",
    concept: "loops",
    goal: "The cat glides to the right instead of jumping there instantly.",
    blocks: ["when ⚑ clicked", "repeat 10", "move 10 steps", "wait 0.1 seconds"],
    steps: [
      "Start with “when ⚑ clicked”.",
      "Add a “repeat 10” (Control) C-block.",
      "Inside the loop, put “move 10 steps” and “wait 0.1 seconds”.",
      "Run it, then change the repeat count and watch the difference.",
    ],
    hint: "A loop repeats blocks so you don’t copy-paste “move” ten times.",
  },
  {
    id: "p3",
    n: 3,
    title: "Never-ending dance",
    concept: "forever loop + animation",
    goal: "The cat keeps switching costumes and turning until you press stop.",
    blocks: ["when ⚑ clicked", "forever", "next costume", "turn ↻ 15 degrees", "wait 0.2 seconds"],
    steps: [
      "Use “when ⚑ clicked”, then a “forever” C-block.",
      "Inside forever: “next costume”, “turn 15 degrees”, “wait 0.2 seconds”.",
      "Run it — it never ends. Click the red stop ⏹ to end it.",
    ],
    hint: "“forever” loops until you stop the program. Great for animations.",
  },
  {
    id: "p4",
    n: 4,
    title: "Click to meow",
    concept: "event handlers",
    goal: "Clicking the cat makes it meow and grow briefly.",
    blocks: ["when this sprite clicked", "start sound Meow", "change size by 20", "wait 0.3 seconds", "change size by -20"],
    steps: [
      "Use the “when this sprite clicked” hat block (Events).",
      "Add “start sound Meow” (Sound).",
      "Grow with “change size by 20”, wait, then shrink back with “-20”.",
      "Click the cat on the stage.",
    ],
    hint: "Different hat blocks respond to different events — a flag click vs a sprite click.",
  },
  {
    id: "p5",
    n: 5,
    title: "Chase the mouse",
    concept: "forever + conditionals + sensing",
    goal: "The cat follows your mouse, and says “Got you!” when it reaches the pointer.",
    blocks: ["when ⚑ clicked", "forever", "point towards mouse-pointer", "move 5 steps", "if <touching mouse-pointer?> then", "say “Got you!” for 1 seconds"],
    steps: [
      "Start with “when ⚑ clicked” and a “forever” loop.",
      "Inside: “point towards mouse-pointer” (Motion) then “move 5 steps”.",
      "Add an “if <touching mouse-pointer?> then” (Control + Sensing).",
      "Inside the if, put “say Got you! for 1 seconds”.",
    ],
    hint: "An “if” only runs its inside blocks when the hexagon condition is true.",
  },
];
