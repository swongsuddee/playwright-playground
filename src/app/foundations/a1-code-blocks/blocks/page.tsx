import { A1LessonShell } from "../A1LessonShell";
import { BlocksLesson } from "../lessonContent";

export default function Page() {
  return (
    <A1LessonShell slug="blocks">
      <BlocksLesson />
    </A1LessonShell>
  );
}
