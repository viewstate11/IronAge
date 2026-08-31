import { useEffect, useState } from "react";

import { useUser } from "../../context/UserContext";
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

const PLAN_FEATURES = [
  "FULL WORKOUT ACCESS",
  "ADVANCED PROGRESS TRACKING",
  "PREMIUM NUTRITION TOOLS",
  "AI TRAINER ACCESS",
  "IRONAGE PREMIUM EXPERIENCE",
];

export default function Premium({ onBack }: Props) {
  const { refreshUser } = useUser();

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
          "PURCHASE CANCELLED"
        );
        return;
      }

      if (
        purchase.status === "PENDING"
      ) {
        setMessage(
          "PURCHASE PENDING"
        );
        return;
      }

      if (
        !purchase.signedTransaction
      ) {
        throw new Error(
          "Apple signed transaction missing"
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
        `${verification.premiumPlan} PREMIUM ACTIVATED`
      );
    } catch (checkoutError) {
      console.error(
        "IRONAGE PREMIUM CHECKOUT ERROR:",
        checkoutError
      );

      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Premium purchase failed"
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
            <strong>YOUR LIMITS.</strong>
          </h1>

          <p>
            Unlock the complete IRONAGE experience.
          </p>
        </section>

        <section className="premium-dev-notice">
          <strong>PREMIUM ACCESS</strong>
          <span>SECURE APP STORE PAYMENT</span>
        </section>

        <section className="premium-status">
          <span>CURRENT PLAN</span>
          <strong>
            {entitlementLoading
              ? "LOADING..."
              : premiumPlan ?? "FREE"}
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
              <span>MONTHLY</span>
              <strong>FLEXIBLE</strong>
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
              <span>YEARLY</span>
              <strong>BEST VALUE</strong>
            </div>
            <b>{selectedPlan === "YEARLY" ? "✓" : "○"}</b>
          </button>
        </section>

        <section className="premium-features">
          <span className="premium-section-title">
            INCLUDED
          </span>

          {PLAN_FEATURES.map((feature) => (
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
            premiumPlan === selectedPlan
          }
        >
          {premiumPlan === selectedPlan
            ? `${selectedPlan} ACTIVE`
            : isPurchasing
              ? "PROCESSING..."
              : "CONTINUE TO PAYMENT"}
        </button>

      </div>
    </main>
  );
}
