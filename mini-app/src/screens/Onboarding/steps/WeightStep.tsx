import {
  useLanguage,
} from "../../../context/LanguageContext";

type Props = {
  value: number;
  onChange: (value: number) => void;
  next: () => void;
};

export default function WeightStep({
  value,
  onChange,
  next,
}: Props) {
  const { t } = useLanguage();

  const decrease = () => {
    onChange(Math.max(35, value - 1));
  };

  const increase = () => {
    onChange(Math.min(200, value + 1));
  };

  return (
    <section className="onboarding-step">

      <div className="onboarding-step-content">

        <div className="onboarding-eyebrow">
          {t("onboarding.bodyMetrics")}
        </div>

        <h1 className="onboarding-title">
          {t("onboarding.weight.title1")}
          <strong>{t("onboarding.weight.title2")}</strong>
        </h1>

        <p className="onboarding-description">
          {t("onboarding.weight.description")}
        </p>

        <div className="height-selector">

          <button
            type="button"
            className="height-control"
            onClick={decrease}
            aria-label={t("onboarding.weight.decrease")}
          >
            −
          </button>

          <div className="height-value">
            <strong>{value}</strong>
            <span>KG</span>
          </div>

          <button
            type="button"
            className="height-control"
            onClick={increase}
            aria-label={t("onboarding.weight.increase")}
          >
            +
          </button>

        </div>

        <div className="height-scale">
          <span>35</span>

          <div className="height-scale-line">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>

          <span>200</span>
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