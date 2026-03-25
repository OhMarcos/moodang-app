"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "@/lib/posthog";
import { initPostHog, POSTHOG_KEY } from "@/lib/posthog";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Initialize PostHog on mount
  useEffect(() => {
    initPostHog();
  }, []);

  // Track pageviews on route change (use window.location for full URL to avoid useSearchParams bailout)
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    if (!posthog.__loaded) return;

    const url = window.location.pathname + window.location.search;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname]);

  return <>{children}</>;
}
