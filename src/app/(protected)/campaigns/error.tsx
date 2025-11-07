"use client";

import { ErrorBoundary } from "@/components";

const CampaignsError = ({
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
      title="Unable to load campaigns"
      description="We encountered an error while loading your campaigns. This could be due to a network issue or a temporary problem with our servers."
      context="Campaigns page"
      homeUrl="/campaigns"
      homeLabel="Reload Page"
      showSignOut={true}
    />
  );
};

export default CampaignsError;
