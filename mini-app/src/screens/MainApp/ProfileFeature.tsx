import { useLanguage } from "../../context/LanguageContext";

import "./ProfileFeature.css";

type Props = {
  title: string;
  subtitle?: string;
  onBack: () => void;
};

export default function ProfileFeature({
  title,
  subtitle,
  onBack,
}: Props) {
  const { t } = useLanguage();

  return (
    <main className="profile-feature">
      <div className="profile-feature__shell">
        <header className="profile-feature__header">
          <button
            type="button"
            onClick={onBack}
            aria-label={t("common.back")}
          >
            ←
          </button>

          <div>
            <span>IRONAGE</span>
            <h1>{title}</h1>
          </div>
        </header>

        <section className="profile-feature__card">
          <div className="profile-feature__mark">
            IA
          </div>

          <span className="profile-feature__eyebrow">
            {t("profileFeature.system")}
          </span>

          <h2>{title}</h2>

          <p>
            {subtitle ||
              t("profileFeature.moduleConnecting")}
          </p>

          <div className="profile-feature__status">
            <span>{t("profileFeature.status")}</span>
            <strong>{t("profileFeature.inDevelopment")}</strong>
          </div>

          <button
            type="button"
            className="profile-feature__back"
            onClick={onBack}
          >
            <span>{t("profileFeature.backToProfile")}</span>
            <b>→</b>
          </button>
        </section>
      </div>
    </main>
  );
}
