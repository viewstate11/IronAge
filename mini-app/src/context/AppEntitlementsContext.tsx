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
  getPremiumPlan,
  type PremiumPlan,
} from "../api/client";

type AppEntitlementsContextValue = {
  premiumPlan: PremiumPlan | null;
  isPremium: boolean;
  loading: boolean;
  error: string | null;
  refreshEntitlements: () => Promise<void>;
};

const AppEntitlementsContext =
  createContext<AppEntitlementsContextValue | null>(
    null
  );

type Props = {
  children: ReactNode;
};

export function AppEntitlementsProvider({
  children,
}: Props) {
  const [
    premiumPlan,
    setPremiumPlan,
  ] = useState<PremiumPlan | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const refreshEntitlements =
    useCallback(async () => {
      setError(null);

      try {
        const premiumPlan =
          await getPremiumPlan();

        setPremiumPlan(
          premiumPlan
        );
      } catch (requestError) {
        console.error(
          "IRONAGE ENTITLEMENTS ERROR:",
          requestError
        );

        setPremiumPlan(null);

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load Premium status"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void refreshEntitlements();
  }, [refreshEntitlements]);

  const value =
    useMemo<AppEntitlementsContextValue>(
      () => ({
        premiumPlan,
        isPremium:
          premiumPlan !== null,
        loading,
        error,
        refreshEntitlements,
      }),
      [
        premiumPlan,
        loading,
        error,
        refreshEntitlements,
      ]
    );

  return (
    <AppEntitlementsContext.Provider
      value={value}
    >
      {children}
    </AppEntitlementsContext.Provider>
  );
}

export function useAppEntitlements() {
  const context =
    useContext(
      AppEntitlementsContext
    );

  if (!context) {
    throw new Error(
      "useAppEntitlements must be used inside AppEntitlementsProvider"
    );
  }

  return context;
}
