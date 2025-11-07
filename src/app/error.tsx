"use client";

import { ErrorBoundary } from "@/components";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <ErrorBoundary
      error={error}
      reset={reset}
      title="Something went wrong!"
      description="An unexpected error occurred. We apologize for the inconvenience."
      context="Application"
      homeUrl="/"
      homeLabel="Go Home"
    />
  );
};

export default Error;
