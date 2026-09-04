import {
  useLanguage,
} from "../../../context/LanguageContext";

type Props = {
  value: string;
  onChange: (value: string) => void;
  next: () => void;
};

export default function NameStep({
  value,
  onChange,
  next,
}: Props) {
  const { t } = useLanguage();

  const handleNext = () => {
    if (!value.trim()) return;
    next();
  };

  return (
    <section className="onboarding-step name-step">
      <div className="onboarding-step-content">

        <div className="onboarding-eyebrow">
          <span />
          {t("onboarding.name.eyebrow")}
          <span />
        </div>

        <h1 className="onboarding-title">
          {t("onboarding.name.title1")}
          <br />
          <strong>{t("onboarding.name.title2")}</strong>
        </h1>

        <p className="onboarding-description">
          {t("onboarding.name.desc1")}
          <br />
          {t("onboarding.name.desc2")}
        </p>

        <div className="onboarding-input-wrapper">
          <label htmlFor="name">
            {t("onboarding.name.label")}
          </label>

          <input
            id="name"
            type="text"
            value={value}
            onChange={(event) =>
              onChange(event.target.value)
            }
            placeholder={t("onboarding.name.placeholder")}
            autoComplete="name"
          />
        </div>

      </div>

      <div className="onboarding-step-bottom">

        <button
          type="button"
          className="onboarding-button"
          onClick={handleNext}
          disabled={!value.trim()}
        >
          <span>{t("onboarding.continue")}</span>
          <strong>→</strong>
        </button>

        <p className="onboarding-footer">
          {t("onboarding.athleteSystem")}
        </p>

      </div>
    </section>
  );
}