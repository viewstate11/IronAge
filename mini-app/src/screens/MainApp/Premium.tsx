import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

import { useUser } from "../../context/UserContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAppEntitlements } from "../../context/AppEntitlementsContext";

import {
  verifyApplePremiumPurchase,
  type PremiumPlan,
} from "../../api/client";

import {
  IronAgeStoreKit,
} from "../../native/ironAgeStoreKit";

import "./Premium.css";

type Props = {
  onBack: () => void;
};

const PLAN_FEATURE_KEYS = [
  "premium.featureWorkouts",
  "premium.featureProgress",
  "premium.featureNutrition",
  "premium.featureAi",
  "premium.featureExperience",
];

export default function Premium({ onBack }: Props) {
  const { refreshUser } = useUser();
  const { t } = useLanguage();

  const isNativeIOS =
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "ios";

  const {
    premiumPlan,
    loading: entitlementLoading,
    error: entitlementError,
    refreshEntitlements,
  } = useAppEntitlements();

  const [selectedPlan, setSelectedPlan] =
    useState<PremiumPlan>(
      premiumPlan ?? "MONTHLY"
    );

  const [message, setMessage] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (premiumPlan) {
      setSelectedPlan(premiumPlan);
    }
  }, [premiumPlan]);


  const [isPurchasing, setIsPurchasing] =
    useState(false);

  const handlePremiumCheckout = async () => {
    if (premiumPlan === selectedPlan) {
      return;
    }

    if (!isNativeIOS) {
      setError(
        t("premium.iosOnly")
      );
      setMessage(null);
      return;
    }

    setError(null);
    setMessage(null);
    setIsPurchasing(true);

    try {
      const productId =
        selectedPlan === "MONTHLY"
          ? "com.ironage.app.premium.monthly"
          : "com.ironage.app.premium.yearly";

      const purchase =
        await IronAgeStoreKit.purchase({
          productId,
        });

      if (
        purchase.status === "CANCELLED"
      ) {
        setMessage(
          t("premium.cancelled")
        );
        return;
      }

      if (
        purchase.status === "PENDING"
      ) {
        setMessage(
          t("premium.pending")
        );
        return;
      }

      if (
        !purchase.signedTransaction
      ) {
        throw new Error(
          t("premium.signedMissing")
        );
      }

      const verification =
        await verifyApplePremiumPurchase(
          purchase.signedTransaction
        );

      setSelectedPlan(
        verification.premiumPlan
      );

      await refreshEntitlements();
      await refreshUser();

      setMessage(
        `${
          verification.premiumPlan === "MONTHLY"
            ? t("premium.monthly")
            : t("premium.yearly")
        } ${t("premium.activated")}`
      );
    } catch (checkoutError) {
      console.error(
        "IRONAGE PREMIUM CHECKOUT ERROR:",
        checkoutError
      );

      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : t("premium.purchaseFailed")
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <main className="premium-page">
      <div className="premium-content">

        <header className="premium-header">
          <button
            type="button"
            className="premium-back"
            onClick={onBack}
          >
            ← PROFILE
          </button>

          <span>IRONAGE</span>
        </header>

        <section className="premium-hero">
          <span className="premium-eyebrow">
            IRONAGE PREMIUM
          </span>

          <h1>
            BREAK
            <br />
            <strong>{t("premium.limits")}</strong>
          </h1>

          <p>
            Unlock the complete IRONAGE experience.
          </p>
        </section>

        <section className="premium-dev-notice">
          <strong>{t("premium.access")}</strong>
          <span>{t("premium.securePayment")}</span>
        </section>

        <section className="premium-status">
          <span>{t("premium.currentPlan")}</span>
          <strong>
            {entitlementLoading
              ? t("common.loading")
              : premiumPlan === "MONTHLY"
                ? t("premium.monthly")
                : premiumPlan === "YEARLY"
                  ? t("premium.yearly")
                  : t("premium.free")}
          </strong>
        </section>

        <section className="premium-plans">
          <button
            type="button"
            className={
              selectedPlan === "MONTHLY"
                ? "premium-plan selected"
                : "premium-plan"
            }
            onClick={() => setSelectedPlan("MONTHLY")}
          >
            <div>
              <span>{t("premium.monthly")}</span>
              <strong>{t("premium.flexible")}</strong>
            </div>
            <b>{selectedPlan === "MONTHLY" ? "✓" : "○"}</b>
          </button>

          <button
            type="button"
            className={
              selectedPlan === "YEARLY"
                ? "premium-plan selected"
                : "premium-plan"
            }
            onClick={() => setSelectedPlan("YEARLY")}
          >
            <div>
              <span>{t("premium.yearly")}</span>
              <strong>{t("premium.bestValue")}</strong>
            </div>
            <b>{selectedPlan === "YEARLY" ? "✓" : "○"}</b>
          </button>
        </section>

        <section className="premium-features">
          <span className="premium-section-title">
            INCLUDED
          </span>

          {PLAN_FEATURE_KEYS.map((feature) => (
            <div
              key={feature}
              className="premium-feature"
            >
              <span>✓</span>
              <strong>{feature}</strong>
            </div>
          ))}
        </section>

        {(error || entitlementError) && (
          <div
            className="premium-message error"
            role="alert"
          >
            {error ?? entitlementError}
          </div>
        )}

        {message && (
          <div className="premium-message success" role="status">
            {message}
          </div>
        )}

        <button
          type="button"
          className="premium-activate"
          onClick={handlePremiumCheckout}
          disabled={
            isPurchasing ||
            entitlementLoading ||
            premiumPlan === selectedPlan ||
            !isNativeIOS
          }
        >
          {premiumPlan === selectedPlan
            ? `${
                selectedPlan === "MONTHLY"
                  ? t("premium.monthly")
                  : t("premium.yearly")
              } ${t("premium.active")}`
            : !isNativeIOS
              ? t("premium.availableIos")
              : isPurchasing
                ? t("premium.processing")
                : t("premium.continuePayment")}
        </button>

      </div>
    </main>
  );
}
