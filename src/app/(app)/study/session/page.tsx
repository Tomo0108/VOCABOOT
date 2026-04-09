import { Suspense } from "react";
import { StudySessionRouteClient } from "./study-session-route-client";

export default function StudySessionPage() {
  return (
    <Suspense>
      <StudySessionRouteClient />
    </Suspense>
  );
}

