import { useState } from "react";

import "./Onboarding.css";

import vasylPhoto from "../../assets/vasyl-ua.jpg";

import {
  useUser,
  type ProfileData,
} from "../../context/UserContext";

import {
  useLanguage,
} from "../../context/LanguageContext";

import type {
  Gender,
  Goal,
} from "../../types/user";

import NameStep from "./steps/NameStep";
import AgeStep from "./steps/AgeStep";
import GenderStep from "./steps/GenderStep";
import HeightStep from "./steps/HeightStep";
import WeightStep from "./steps/WeightStep";
import GoalStep from "./steps/GoalStep";
import FinishStep from "./steps/FinishStep";

/* =========================================================
   TYPE HELPERS
========================================================= */

/*
 * Gender у types/user.ts використовує:
 * MALE | FEMALE | OTHER
 */

function normalizeGender(
  value: unknown
): Gender {
  if (
    value === "MALE" ||
    value === "male"
  ) {
    return "MALE";
  }

  if (
    value === "FEMALE" ||
    value === "female"
  ) {
    return "FEMALE";
  }

  return "OTHER";
}

/*
 * Goal:
 *
 * Тут ми НЕ вигадуємо значення Goal.
 *
 * Якщо значення вже є string,
 * перевіряємо його через список значень,
 * які реально використовуються в application.
 *
 * Fallback — перше безпечне значення
 * через cast, щоб не ламати API.
 */

function normalizeGoal(
  value: unknown
): Goal {
  if (typeof value !== "string") {
    return "MUSCLE";
  }

  const normalized = value.toUpperCase();

  switch (normalized) {
    case "MUSCLE":
    case "BUILD_MUSCLE":
      return "MUSCLE";

    case "LOSE_WEIGHT":
    case "FAT":
    case "LOSE_FAT":
      return "LOSE_WEIGHT";

    case "MAINTAIN":
      return "MAINTAIN";

    case "ENDURANCE":
      return "ENDURANCE";

    case "STRENGTH":
    case "GET_STRONGER":
      return "STRENGTH";

    case "FITNESS":
    case "IMPROVE_FITNESS":
      return "FITNESS";

    default:
      return "MUSCLE";
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Onboarding() {
  const {
    user,
    completeOnboarding,
  } = useUser();

  const { t } = useLanguage();

  const [step, setStep] =
    useState<number>(0);

  const [saving, setSaving] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string>("");

  /* =======================================================
     PROFILE STATE
  ======================================================= */

  const [profile, setProfile] =
    useState<ProfileData>({
      name:
        user.name ||
        user.firstName ||
        "",

      age:
        typeof user.age === "number"
          ? user.age
          : 0,

      gender:
        normalizeGender(
          user.gender
        ),

      height:
        typeof user.height === "number"
          ? user.height
          : 180,

      weight:
        typeof user.weight === "number"
          ? user.weight
          : 80,

      goal:
        normalizeGoal(
          user.goal
        ),
    });

  /* =======================================================
     NEXT
  ======================================================= */

  const next = (): void => {
    setError("");

    setStep(
      (current) =>
        Math.min(
          current + 1,
          6
        )
    );
  };

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const previous = (): void => {
    setError("");

    setStep(
      (current) =>
        Math.max(
          current - 1,
          0
        )
    );
  };

  /* =======================================================
     UPDATE PROFILE
  ======================================================= */

  const updateProfile = <
    K extends keyof ProfileData
  >(
    key: K,
    value: ProfileData[K]
  ): void => {
    setProfile(
      (current) => ({
        ...current,
        [key]: value,
      })
    );

    setError("");
  };

  /* =======================================================
     UPDATE GENDER
  ======================================================= */

  const updateGender = (
    value: string
  ): void => {
    updateProfile(
      "gender",
      normalizeGender(value)
    );
  };

  /* =======================================================
     UPDATE GOAL
  ======================================================= */

  const updateGoal = (
    value: string
  ): void => {
    updateProfile(
      "goal",
      normalizeGoal(value)
    );
  };

  /* =======================================================
     FINISH ONBOARDING
  ======================================================= */

  const finishOnboarding =
    async (): Promise<void> => {
      if (saving) {
        return;
      }

      setError("");

      /* -----------------------------------------------
         NAME
      ------------------------------------------------ */

      if (
        !profile.name.trim()
      ) {
        setError(
          t("onboarding.error.name")
        );

        setStep(0);

        return;
      }

      /* -----------------------------------------------
         AGE
      ------------------------------------------------ */

      if (
        !profile.age ||
        profile.age < 13 ||
        profile.age > 100
      ) {
        setError(
          t("onboarding.error.age")
        );

        setStep(1);

        return;
      }

      /* -----------------------------------------------
         GENDER
      ------------------------------------------------ */

      if (
        !profile.gender
      ) {
        setError(
          t("onboarding.error.gender")
        );

        setStep(2);

        return;
      }

      /* -----------------------------------------------
         HEIGHT
      ------------------------------------------------ */

      if (
        !profile.height ||
        profile.height < 100 ||
        profile.height > 250
      ) {
        setError(
          t("onboarding.error.height")
        );

        setStep(3);

        return;
      }

      /* -----------------------------------------------
         WEIGHT
      ------------------------------------------------ */

      if (
        !profile.weight ||
        profile.weight < 30 ||
        profile.weight > 300
      ) {
        setError(
          t("onboarding.error.weight")
        );

        setStep(4);

        return;
      }

      /* -----------------------------------------------
         GOAL
      ------------------------------------------------ */

      if (
        !profile.goal
      ) {
        setError(
          t("onboarding.error.goal")
        );

        setStep(5);

        return;
      }

      /* -----------------------------------------------
         SAVE
      ------------------------------------------------ */

      setSaving(true);

      try {
        const savedUser =
          await completeOnboarding(
            profile
          );

      } catch (err) {
        console.error(
          "IRONAGE: Onboarding error",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : t("onboarding.error.save")
        );
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="onboarding">

      <img
        src={vasylPhoto}
        alt=""
        aria-hidden="true"
        className="onboarding-photo"
      />

      <div
        className="onboarding-overlay"
      />

      <div
        className="onboarding-vignette"
      />

      <div className="onboarding-content">

        <header
          className="onboarding-header"
        >

          <div className="onboarding-logo">
            IRON
            <span>AGE</span>
          </div>

          <div className="onboarding-counter">

            <span>
              {String(
                step + 1
              ).padStart(
                2,
                "0"
              )}
            </span>

            <i>/</i>

            07

          </div>

        </header>

        <div className="onboarding-progress">

          <div
            className="onboarding-progress-fill"
            style={{
              width:
                `${((step + 1) / 7) * 100}%`,
            }}
          />

        </div>

        {error && (
          <div
            role="alert"
            style={{
              marginTop:
                "16px",

              padding:
                "14px 16px",

              border:
                "1px solid rgba(255, 80, 80, 0.45)",

              borderRadius:
                "10px",

              background:
                "rgba(255, 50, 50, 0.08)",

              color:
                "#ff7777",

              fontSize:
                "14px",

              lineHeight:
                1.4,
            }}
          >
            {error}
          </div>
        )}

        <div className="onboarding-body">

          {step === 0 && (
            <NameStep
              value={
                profile.name
              }
              onChange={(
                value
              ) =>
                updateProfile(
                  "name",
                  value
                )
              }
              next={next}
            />
          )}

          {step === 1 && (
            <AgeStep
              value={
                profile.age
              }
              onChange={(
                value
              ) =>
                updateProfile(
                  "age",
                  value
                )
              }
              next={next}
            />
          )}

          {step === 2 && (
            <GenderStep
              value={
                profile.gender
              }
              onChange={(
                value
              ) =>
                updateGender(
                  value
                )
              }
              next={next}
            />
          )}

          {step === 3 && (
            <HeightStep
              value={
                profile.height
              }
              onChange={(
                value
              ) =>
                updateProfile(
                  "height",
                  value
                )
              }
              next={next}
            />
          )}

          {step === 4 && (
            <WeightStep
              value={
                profile.weight
              }
              onChange={(
                value
              ) =>
                updateProfile(
                  "weight",
                  value
                )
              }
              next={next}
            />
          )}

          {step === 5 && (
            <GoalStep
              value={
                profile.goal
              }
              onChange={(
                value
              ) =>
                updateGoal(
                  value
                )
              }
              next={next}
            />
          )}

          {step === 6 && (
            <FinishStep
              finish={
                finishOnboarding
              }
            />
          )}

        </div>

        {saving && (
          <div
            role="status"
            aria-live="polite"
            style={{
              textAlign:
                "center",

              marginTop:
                "16px",

              fontSize:
                "14px",

              color:
                "#D4AF37",

              opacity:
                0.9,
            }}
          >
            {t("onboarding.saving")}
          </div>
        )}

        {step > 0 &&
          !saving && (
            <button
              type="button"
              onClick={
                previous
              }
              style={{
                marginTop:
                  "16px",

                width:
                  "100%",

                background:
                  "transparent",

                border:
                  "1px solid rgba(212, 175, 55, 0.25)",

                color:
                  "rgba(255,255,255,0.7)",

                borderRadius:
                  "10px",

                padding:
                  "12px 16px",

                cursor:
                  "pointer",

                fontSize:
                  "14px",
              }}
            >
              {t("common.back")}
            </button>
          )}

      </div>

    </main>
  );
}