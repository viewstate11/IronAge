import {
  useLanguage,
} from "../../../context/LanguageContext";

type Props = {
  value: string;
  onChange: (value: string) => void;
  next: () => void;
};

export default function GenderStep({
  value,
  onChange,
  next,
}: Props) {
  const { t } = useLanguage();

  return (
    <section className="onboarding-step">

      <div className="onboarding-step-content">

        <div className="onboarding-eyebrow">
          {t("onboarding.profile")}
        </div>

        <h1 className="onboarding-title">
          {t("onboarding.gender.title1")}
          <strong>{t("onboarding.gender.title2")}</strong>
        </h1>

        <p className="onboarding-description">
          {t("onboarding.gender.description")}
        </p>

        <div className="gender-options">

          <button
            type="button"
            className={`gender-option ${
              value === "MALE" ? "active" : ""
            }`}
            onClick={() => onChange("MALE")}
          >
            <span className="gender-number">01</span>
            <span className="gender-name">{t("onboarding.gender.male")}</span>
            <span className="gender-arrow">→</span>
          </button>

          <button
            type="button"
            className={`gender-option ${
              value === "FEMALE" ? "active" : ""
            }`}
            onClick={() => onChange("FEMALE")}
          >
            <span className="gender-number">02</span>
            <span className="gender-name">{t("onboarding.gender.female")}</span>
            <span className="gender-arrow">→</span>
          </button>

        </div>

      </div>

      <div className="onboarding-step-bottom">

        <button
          type="button"
          className="onboarding-button"
          disabled={!value}
          onClick={next}
        >
          <span>{t("onboarding.continue")}</span>
          <strong>→</strong>
        </button>

        <div className="onboarding-footer">
          {t("onboarding.athleteSystem")}
        </div>

      </div>

    </section>
  );
}