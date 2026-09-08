import {
  useEffect,
  useState,
} from "react";

import {
  useUser,
} from "../../context/UserContext";

import {
  useLanguage,
} from "../../context/LanguageContext";

import type {
  Gender,
  Goal,
} from "../../types/user";

import "./EditProfile.css";

type Props = {
  onBack: () => void;
};

const genders: Gender[] = [
  "MALE",
  "FEMALE",
  "OTHER",
];

const goals: Goal[] = [
  "MUSCLE",
  "LOSE_WEIGHT",
  "MAINTAIN",
  "ENDURANCE",
  "STRENGTH",
  "FITNESS",
];

export default function EditProfile({
  onBack,
}: Props) {
  const {
    user,
    updateProfile,
  } = useUser();

  const { t } = useLanguage();

  const [
    name,
    setName,
  ] = useState("");

  const [
    age,
    setAge,
  ] = useState("");

  const [
    gender,
    setGender,
  ] = useState<Gender | "">("");

  const [
    height,
    setHeight,
  ] = useState("");

  const [
    weight,
    setWeight,
  ] = useState("");

  const [
    goal,
    setGoal,
  ] = useState<Goal | "">("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const [
    success,
    setSuccess,
  ] = useState(false);

  useEffect(() => {
    setName(
      user.name ||
      user.firstName ||
      ""
    );

    setAge(
      user.age !== null
        ? String(user.age)
        : ""
    );

    setGender(
      genders.includes(
        user.gender as Gender
      )
        ? (user.gender as Gender)
        : ""
    );

    setHeight(
      user.height !== null
        ? String(user.height)
        : ""
    );

    setWeight(
      user.weight !== null
        ? String(user.weight)
        : ""
    );

    setGoal(
      goals.includes(
        user.goal as Goal
      )
        ? (user.goal as Goal)
        : ""
    );
  }, [user]);

  const genderLabel = (
    value: Gender
  ) => {
    switch (value) {
      case "MALE":
        return t(
          "editProfile.genderMale"
        );

      case "FEMALE":
        return t(
          "editProfile.genderFemale"
        );

      default:
        return t(
          "editProfile.genderOther"
        );
    }
  };

  const goalLabel = (
    value: Goal
  ) => {
    switch (value) {
      case "MUSCLE":
        return t(
          "editProfile.goalMuscle"
        );

      case "LOSE_WEIGHT":
        return t(
          "editProfile.goalLoseWeight"
        );

      case "MAINTAIN":
        return t(
          "editProfile.goalMaintain"
        );

      case "ENDURANCE":
        return t(
          "editProfile.goalEndurance"
        );

      case "STRENGTH":
        return t(
          "editProfile.goalStrength"
        );

      default:
        return t(
          "editProfile.goalFitness"
        );
    }
  };

  async function saveProfile() {
    const normalizedName =
      name.trim();

    const parsedAge =
      Number(age);

    const parsedHeight =
      Number(height);

    const parsedWeight =
      Number(weight);

    if (!normalizedName) {
      setError(
        t(
          "editProfile.errorName"
        )
      );
      return;
    }

    if (
      !Number.isFinite(parsedAge) ||
      parsedAge < 1 ||
      parsedAge > 120
    ) {
      setError(
        t(
          "editProfile.errorAge"
        )
      );
      return;
    }

    if (!gender) {
      setError(
        t(
          "editProfile.errorGender"
        )
      );
      return;
    }

    if (
      !Number.isFinite(parsedHeight) ||
      parsedHeight < 100 ||
      parsedHeight > 250
    ) {
      setError(
        t(
          "editProfile.errorHeight"
        )
      );
      return;
    }

    if (
      !Number.isFinite(parsedWeight) ||
      parsedWeight < 30 ||
      parsedWeight > 300
    ) {
      setError(
        t(
          "editProfile.errorWeight"
        )
      );
      return;
    }

    if (!goal) {
      setError(
        t(
          "editProfile.errorGoal"
        )
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      await updateProfile({
        name:
          normalizedName,

        age:
          parsedAge,

        gender,

        height:
          parsedHeight,

        weight:
          parsedWeight,

        goal,
      });

      setSuccess(true);
    } catch (err) {
      console.error(
        "IRONAGE EDIT PROFILE UI ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : t(
              "editProfile.errorSave"
            )
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="edit-profile">
      <div className="edit-profile__shell">

        <header className="edit-profile__header">
          <button
            type="button"
            className="edit-profile__back"
            onClick={onBack}
            aria-label={t("common.back")}
          >
            ←
          </button>

          <div>
            <span>
              IRONAGE
            </span>

            <h1>
              {t("editProfile.title")}
            </h1>

            <p>
              {t("editProfile.subtitle")}
            </p>
          </div>
        </header>

        <section className="edit-profile__card">

          <label className="edit-profile__field">
            <span>
              {t("editProfile.name")}
            </span>

            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(
                  event.target.value
                );
                setSuccess(false);
              }}
              autoComplete="name"
            />
          </label>

          <label className="edit-profile__field">
            <span>
              {t("editProfile.age")}
            </span>

            <input
              type="number"
              min="1"
              max="120"
              inputMode="numeric"
              value={age}
              onChange={(event) => {
                setAge(
                  event.target.value
                );
                setSuccess(false);
              }}
            />
          </label>

          <div className="edit-profile__field">
            <span>
              {t("editProfile.gender")}
            </span>

            <div className="edit-profile__choices">
              {genders.map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    className={
                      gender === item
                        ? "edit-profile__choice edit-profile__choice--active"
                        : "edit-profile__choice"
                    }
                    onClick={() => {
                      setGender(item);
                      setSuccess(false);
                    }}
                  >
                    {genderLabel(item)}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="edit-profile__grid">

            <label className="edit-profile__field">
              <span>
                {t("editProfile.height")}
              </span>

              <div className="edit-profile__unit">
                <input
                  type="number"
                  min="100"
                  max="250"
                  inputMode="decimal"
                  value={height}
                  onChange={(event) => {
                    setHeight(
                      event.target.value
                    );
                    setSuccess(false);
                  }}
                />

                <b>CM</b>
              </div>
            </label>

            <label className="edit-profile__field">
              <span>
                {t("editProfile.weight")}
              </span>

              <div className="edit-profile__unit">
                <input
                  type="number"
                  min="30"
                  max="300"
                  step="0.1"
                  inputMode="decimal"
                  value={weight}
                  onChange={(event) => {
                    setWeight(
                      event.target.value
                    );
                    setSuccess(false);
                  }}
                />

                <b>KG</b>
              </div>
            </label>

          </div>

          <div className="edit-profile__field">
            <span>
              {t("editProfile.goal")}
            </span>

            <div className="edit-profile__goals">
              {goals.map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    className={
                      goal === item
                        ? "edit-profile__goal edit-profile__goal--active"
                        : "edit-profile__goal"
                    }
                    onClick={() => {
                      setGoal(item);
                      setSuccess(false);
                    }}
                  >
                    {goalLabel(item)}
                  </button>
                )
              )}
            </div>
          </div>

          {error && (
            <div className="edit-profile__message edit-profile__message--error">
              {error}
            </div>
          )}

          {success && (
            <div className="edit-profile__message edit-profile__message--success">
              {t(
                "editProfile.saved"
              )}
            </div>
          )}

          <button
            type="button"
            className="edit-profile__save"
            disabled={saving}
            onClick={() => {
              void saveProfile();
            }}
          >
            <span>
              {saving
                ? t(
                    "editProfile.saving"
                  )
                : t(
                    "editProfile.save"
                  )}
            </span>

            <b>→</b>
          </button>

        </section>
      </div>
    </main>
  );
}
