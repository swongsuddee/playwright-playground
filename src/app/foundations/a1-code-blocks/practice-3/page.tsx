import { A1LessonShell } from "../A1LessonShell";
import { SinglePractice } from "../lessonContent";

export default function Page() {
  return (
    <A1LessonShell slug="practice-3">
      <SinglePractice practiceId="p3" />
    </A1LessonShell>
  );
}
