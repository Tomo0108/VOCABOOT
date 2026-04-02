import { Suspense } from "react";
import { StudySessionClient } from "./study-session-client";

export default function StudySessionPage() {
  return (
    <Suspense>
      <StudySessionClient />
    </Suspense>
  );
}

