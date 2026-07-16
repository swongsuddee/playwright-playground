import { A1LessonShell } from "../A1LessonShell";
import { MazeGame } from "../MazeGame";
import { GameGuide } from "../GameGuide";

export default function Page() {
  return (
    <A1LessonShell slug="maze">
      <p className="small" style={{ fontSize: 13.5 }}>
        You’ve met sequence, loops, events and conditionals. Here’s a bonus game that uses the same idea as the
        “Chase the mouse” practice — react to input and reach the goal. See if you can beat it!
      </p>
      <MazeGame />
      <GameGuide slug="maze" />
    </A1LessonShell>
  );
}
