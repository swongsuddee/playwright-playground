import { A1LessonShell } from "../A1LessonShell";
import { FlappyBird } from "../FlappyBird";
import { GameGuide } from "../GameGuide";

export default function Page() {
  return (
    <A1LessonShell slug="flappy">
      <p className="small" style={{ fontSize: 13.5 }}>
        Another bonus game. Flappy Bird is nothing but a <b>forever loop</b>, a <b>variable</b> for speed that gravity
        changes each tick, and an <b>if</b> that ends the run on a crash — the exact ideas you just practised in
        Scratch, running many times a second.
      </p>
      <FlappyBird />
      <GameGuide slug="flappy" />
    </A1LessonShell>
  );
}
