import {
  useLanguage,
} from "../../../context/LanguageContext";

type Props = {
  value: number;
  onChange: (value: number) => void;
  next: () => void;
};

export default function AgeStep({
  value,
  onChange,
  next,
}: Props) {
  const { t } = useLanguage();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextValue = Number(event.target.value);

    if (
      nextValue >= 0 &&
      nextValue <= 100
    ) {
      onChange(nextValue);
    }
  };

  const handleNext = () => {
    if (value < 13 || value > 100) return;
    next();
  };

  return (
    <section className="onboarding-step">

      <div className="onboarding-step-content">

        <div className="onboarding-eyebrow">
          {t("onboarding.profile")}
        </div>

        <h1 className="onboarding-title">
          {t("onboarding.age.title1")}
          <strong>{t("onboarding.age.title2")}</strong>
        </h1>

        <p className="onboarding-description">
          {t("onboarding.age.description")}
        </p>

        <div className="onboarding-input-wrapper">

          <label htmlFor="age">
            {t("onboarding.age.label")}
          </label>

          <input
            id="age"
            type="number"
            inputMode="numeric"
            min="13"
            max="100"
            placeholder="30"
            value={value || ""}
            onChange={handleChange}
          />

        </div>

      </div>

      <div className="onboarding-step-bottom">

        <button
          type="button"
          className="onboarding-button"
          disabled={value < 13 || value > 100}
          onClick={handleNext}
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