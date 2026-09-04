import {
  useLanguage,
} from "../../../context/LanguageContext";

type Props = {
  value: number;
  onChange: (value: number) => void;
  next: () => void;
};

export default function HeightStep({
  value,
  onChange,
  next,
}: Props) {
  const { t } = useLanguage();

  const decrease = () => {
    onChange(Math.max(120, value - 1));
  };

  const increase = () => {
    onChange(Math.min(230, value + 1));
  };

  return (
    <section className="onboarding-step">

      <div className="onboarding-step-content">

        <div className="onboarding-eyebrow">
          {t("onboarding.bodyMetrics")}
        </div>

        <h1 className="onboarding-title">
          {t("onboarding.height.title1")}
          <strong>{t("onboarding.height.title2")}</strong>
        </h1>

        <p className="onboarding-description">
          {t("onboarding.height.description")}
        </p>

        <div className="height-selector">

          <button
            type="button"
            className="height-control"
            onClick={decrease}
            aria-label={t("onboarding.height.decrease")}
          >
            −
          </button>

          <div className="height-value">
            <strong>{value}</strong>
            <span>CM</span>
          </div>

          <button
            type="button"
            className="height-control"
            onClick={increase}
            aria-label={t("onboarding.height.increase")}
          >
            +
          </button>

        </div>

        <div className="height-scale">
          <span>120</span>

          <div className="height-scale-line">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>

          <span>230</span>
        </div>

      </div>

      <div className="onboarding-step-bottom">

        <button
          type="button"
          className="onboarding-button"
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