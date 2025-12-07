"use client";

import { useEffect, useState } from "react";
export function DashboardClient() {
  const [usage, setUsage] = useState<{ used: number; limit: number; plan: string } | null>(null);
  const [trialInfo, setTrialInfo] = useState<{ daysRemaining: number; trialEndDate: string } | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Fetch usage data
    fetch("/api/analytics/usage")
      .then((res) => res.json())
      .then((data) => {
        if (data.plan && data.used !== undefined && data.limit !== undefined) {
          setUsage({ used: data.used, limit: data.limit, plan: data.plan });
        }
      })
      .catch((err) => logger.error("Unhandled error", err instanceof Error ? err : new Error(String(err)), { component: "dashboard-client", action: "unknown" }));

    // Fetch trial info
    fetch("/api/trial/user-data")
      .then((res) => res.json())
      .then((data) => {
        if (data.plan === "trial" && data.trialEndDate && data.trialDaysRemaining !== null) {
          setTrialInfo({
            daysRemaining: data.trialDaysRemaining,
            trialEndDate: data.trialEndDate,
          });
        }
        setIsFirstVisit(data.isFirstVisit || false);
      })
      .catch((err) => logger.error("Unhandled error", err instanceof Error ? err : new Error(String(err)), { component: "dashboard-client", action: "unknown" }));
  }, []);

  return (
    <>
      {/* Upgrade Nudges */}
      {usage && (
        <UsageProgressBanner
          used={usage.used}
          limit={usage.limit}
          plan={usage.plan}
        />
      )}
      {trialInfo && trialInfo.daysRemaining <= 3 && (
        <TrialCountdownBanner
          daysRemaining={trialInfo.daysRemaining}
          trialEndDate={trialInfo.trialEndDate}
        />
      )}

      {/* What's Next Checklist for new users */}
      {isFirstVisit && (
        <div className="mb-8">
          <WhatsNextChecklist />
        </div>
      )}
    </>
  );
}
