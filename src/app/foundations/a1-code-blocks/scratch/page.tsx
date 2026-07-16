import { A1LessonShell } from "../A1LessonShell";
import { ScratchLesson } from "../lessonContent";

export default function Page() {
  return (
    <A1LessonShell slug="scratch">
      <ScratchLesson />
    </A1LessonShell>
  );
}
