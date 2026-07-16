import { A1LessonShell } from "../A1LessonShell";
import { AngryBirds } from "../AngryBirds";
import { GameGuide } from "../GameGuide";

export default function Page() {
  return (
    <A1LessonShell slug="angry-birds">
      <p className="small" style={{ fontSize: 13.5 }}>
        The last bonus game. A slingshot, a bit of gravity, and some blocks to bounce off — drag to aim, release to
        fire, and clear the pigs. Same loop / variables / conditionals, now with physics.
      </p>
      <AngryBirds />
      <GameGuide slug="angry-birds" />
    </A1LessonShell>
  );
}
