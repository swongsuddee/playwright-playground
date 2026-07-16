export const A2_BASE = "/foundations/a2-flow-diagrams";

export type A2Lesson = { slug: string; n: number; title: string; summary: string; objective: string; checkQ: string; checkA: string };

export const A2_LESSONS: A2Lesson[] = [
  {
    slug: "what",
    n: 1,
    title: "What is a flowchart?",
    summary: "Boxes + arrows that describe a process.",
    objective: "Understand what a flowchart is and how to read it top-to-bottom.",
    checkQ: "Which direction do you read a flowchart?",
    checkA: "Top to bottom, following the arrows.",
  },
  {
    slug: "shapes",
    n: 2,
    title: "The shapes",
    summary: "The five shapes you'll actually use.",
    objective: "Recognise the core flowchart shapes and what each means.",
    checkQ: "What does a diamond shape mean?",
    checkA: "A decision — a yes/no question where the flow branches.",
  },
  {
    slug: "read",
    n: 3,
    title: "Reading a flowchart",
    summary: "A worked example + trace it yourself.",
    objective: "Trace a flowchart from Start to End, branching at a decision.",
    checkQ: "What happens when the flow reaches a decision?",
    checkA: "It branches — you follow a different arrow depending on the answer.",
  },
  {
    slug: "build",
    n: 4,
    title: "Build your own",
    summary: "Drag shapes, snap to grid, connect the flow.",
    objective: "Drag shapes onto the grid and connect Start → … → End.",
    checkQ: "Which two shapes are fixed on the canvas?",
    checkA: "Start (pinned to the top) and End (pinned to the bottom) — you build the flow between them.",
  },
];

export function getA2Lesson(slug: string): A2Lesson | undefined {
  return A2_LESSONS.find((l) => l.slug === slug);
}
