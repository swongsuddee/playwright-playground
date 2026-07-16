import { A1LessonShell } from "../A1LessonShell";
import { SinglePractice } from "../lessonContent";

export default function Page() {
  return (
    <A1LessonShell slug="practice-5">
      <SinglePractice practiceId="p5" />
    </A1LessonShell>
  );
}
