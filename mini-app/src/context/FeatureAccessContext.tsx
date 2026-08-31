import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  api,
  telegramAuthOptions,
} from "../api/client";

import {
  canAccessFeature as evaluateFeatureAccess,
  type FeatureKey,
} from "../config/featureAccess";

import {
  useAppEntitlements,
} from "./AppEntitlementsContext";

type CoachProfileResponse = {
  success: boolean;
  coach: {
    id: number;
    userId: number;
    isActive: boolean;
  } | null;
};

type MyProgramsResponse = {
  success: boolean;
  assignments: Array<{
    id: number;
    isActive: boolean;
  }>;
};

type FeatureAccessContextValue = {
  isPremium: boolean;
  isCoach: boolean;
  isClient: boolean;

  loading: boolean;
  error: string | null;

  canAccess: (
    feature: FeatureKey
  ) => boolean;

  refreshAccess: () => Promise<void>;
};

const FeatureAccessContext =
  createContext<
    FeatureAccessContextValue | null
  >(null);

type Props = {
  children: ReactNode;
};

export function FeatureAccessProvider({
  children,
}: Props) {
  const {
    isPremium,
    loading: entitlementLoading,
  } = useAppEntitlements();

  const [isCoach, setIsCoach] =
    useState(false);

  const [isClient, setIsClient] =
    useState(false);

  const [roleLoading, setRoleLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refreshAccess =
    useCallback(async () => {
      setError(null);

      try {
        const [
          coachResult,
          programsResult,
        ] = await Promise.allSettled([
          api.get<CoachProfileResponse>(
            "/coaches/me",
            telegramAuthOptions()
          ),

          api.get<MyProgramsResponse>(
            "/my-programs",
            telegramAuthOptions()
          ),
        ]);

        if (
          coachResult.status ===
          "fulfilled"
        ) {
          const coach =
            coachResult.value?.coach ??
            null;

          setIsCoach(
            Boolean(
              coach &&
              coach.isActive !== false
            )
          );
        } else {
          console.error(
            "IRONAGE COACH ACCESS ERROR:",
            coachResult.reason
          );

          setIsCoach(false);
        }

        if (
          programsResult.status ===
          "fulfilled"
        ) {
          const assignments =
            Array.isArray(
              programsResult.value
                ?.assignments
            )
              ? programsResult.value
                  .assignments
              : [];

          setIsClient(
            assignments.some(
              (assignment) =>
                assignment.isActive !==
                false
            )
          );
        } else {
          console.error(
            "IRONAGE CLIENT ACCESS ERROR:",
            programsResult.reason
          );

          setIsClient(false);
        }

        if (
          coachResult.status ===
            "rejected" ||
          programsResult.status ===
            "rejected"
        ) {
          setError(
            "Some access permissions could not be loaded"
          );
        }
      } finally {
        setRoleLoading(false);
      }
    }, []);

  useEffect(() => {
    void refreshAccess();
  }, [refreshAccess]);

  const canAccess =
    useCallback(
      (feature: FeatureKey) => {
        return evaluateFeatureAccess(
          feature,
          {
            isPremium,
            isCoach,
            isClient,
          }
        );
      },
      [
        isPremium,
        isCoach,
        isClient,
      ]
    );

  const value =
    useMemo<FeatureAccessContextValue>(
      () => ({
        isPremium,
        isCoach,
        isClient,

        loading:
          entitlementLoading ||
          roleLoading,

        error,

        canAccess,
        refreshAccess,
      }),
      [
        isPremium,
        isCoach,
        isClient,
        entitlementLoading,
        roleLoading,
        error,
        canAccess,
        refreshAccess,
      ]
    );

  return (
    <FeatureAccessContext.Provider
      value={value}
    >
      {children}
    </FeatureAccessContext.Provider>
  );
}

export function useFeatureAccess() {
  const context =
    useContext(
      FeatureAccessContext
    );

  if (!context) {
    throw new Error(
      "useFeatureAccess must be used inside FeatureAccessProvider"
    );
  }

  return context;
}
