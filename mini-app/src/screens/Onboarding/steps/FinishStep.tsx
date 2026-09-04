import {
  useLanguage,
} from "../../../context/LanguageContext";

type Props = {
  finish: () => void;
};

export default function FinishStep({
  finish,
}: Props) {
  const { t } = useLanguage();

  return (
    <section className="onboarding-step onboarding-finish">

      <div className="onboarding-finish-content">

        <div className="onboarding-eyebrow">
          {t("onboarding.finish.activated")}
        </div>

        <div className="onboarding-finish-line" />

        <h1 className="onboarding-title">
          {t("onboarding.finish.title1")}
          <strong>{t("onboarding.finish.title2")}</strong>
        </h1>

        <p className="onboarding-description">
          {t("onboarding.finish.journey")}
          <br />
          {t("onboarding.finish.noExcuses")}
        </p>

        <div className="onboarding-manifesto">

          <div>
            <span>01</span>
            <strong>{t("onboarding.finish.discipline")}</strong>
          </div>

          <div>
            <span>02</span>
            <strong>{t("onboarding.finish.strength")}</strong>
          </div>

          <div>
            <span>03</span>
            <strong>{t("onboarding.finish.results")}</strong>
          </div>

        </div>

      </div>

      <div className="onboarding-step-bottom">

        <button
          type="button"
          className="onboarding-button onboarding-finish-button"
          onClick={finish}
        >
          <span>{t("onboarding.finish.enter")}</span>
          <strong>→</strong>
        </button>

        <div className="onboarding-footer">
          {t("onboarding.finish.welcome")}
        </div>

      </div>

    </section>
  );
}