import { A1LessonShell } from "../A1LessonShell";
import { SinglePractice } from "../lessonContent";

export default function Page() {
  return (
    <A1LessonShell slug="practice-2">
      <SinglePractice practiceId="p2" />
    </A1LessonShell>
  );
}
