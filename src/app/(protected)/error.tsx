"use client";

import { ErrorBoundary } from "@/components";

const ProtectedError = ({
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
      title="Something went wrong"
      description="We encountered an error while loading this page."
      context="Protected route"
      homeUrl="/campaigns"
      homeLabel="Back to Campaigns"
      showSignOut={true}
    />
  );
};

export default ProtectedError;
