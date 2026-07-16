import { A1LessonShell } from "../A1LessonShell";
import { SinglePractice } from "../lessonContent";

export default function Page() {
  return (
    <A1LessonShell slug="practice-1">
      <SinglePractice practiceId="p1" />
    </A1LessonShell>
  );
}
