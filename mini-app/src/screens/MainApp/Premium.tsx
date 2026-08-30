import { useMemo, useState } from "react";

import { useUser } from "../../context/UserContext";

import {
  updatePremiumPlan,
  type PremiumPlan,
} from "../../api/client";

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

function isPremiumPlan(value: unknown): value is PremiumPlan {
  return value === "MONTHLY" || value === "YEARLY";
}

export default function Premium({ onBack }: Props) {
  const { user, refreshUser } = useUser();

  const activePlan = useMemo<PremiumPlan | null>(() => {
    return isPremiumPlan(user.premiumPlan)
      ? user.premiumPlan
      : null;
  }, [user.premiumPlan]);

  const [selectedPlan, setSelectedPlan] =
    useState<PremiumPlan>(activePlan ?? "MONTHLY");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  const activateSelectedPlan = async () => {
    if (saving) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      await updatePremiumPlan(selectedPlan);
      await refreshUser();

      setMessage(`${selectedPlan} TEST PLAN ACTIVATED`);
    } catch (activationError) {
      console.error(
        "IRONAGE PREMIUM ACTIVATION ERROR:",
        activationError
      );

      setError(
        activationError instanceof Error
          ? activationError.message
          : "Premium activation failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const removeTestPlan = async () => {
    if (saving) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      await updatePremiumPlan(null);
      await refreshUser();

      setMessage("TEST PREMIUM REMOVED");
    } catch (removeError) {
      console.error(
        "IRONAGE PREMIUM REMOVE ERROR:",
        removeError
      );

      setError(
        removeError instanceof Error
          ? removeError.message
          : "Premium reset failed"
      );
    } finally {
      setSaving(false);
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
          <strong>DEVELOPMENT PREVIEW</strong>
          <span>NO REAL PAYMENT IS PROCESSED YET</span>
        </section>

        <section className="premium-status">
          <span>CURRENT PLAN</span>
          <strong>{activePlan ?? "FREE"}</strong>
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

        {error && (
          <div className="premium-message error" role="alert">
            {error}
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
          disabled={saving}
          onClick={activateSelectedPlan}
        >
          {saving
            ? "PROCESSING..."
            : activePlan === selectedPlan
              ? `${selectedPlan} ACTIVE`
              : "ACTIVATE TEST PLAN"}
        </button>

        {activePlan && (
          <button
            type="button"
            className="premium-reset"
            disabled={saving}
            onClick={removeTestPlan}
          >
            REMOVE TEST PREMIUM
          </button>
        )}

      </div>
    </main>
  );
}
