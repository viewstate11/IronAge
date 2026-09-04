import { useEffect } from "react";
import "./Welcome.css";

import vasylPhoto from "../../assets/vasyl-ua.jpg";
import LuxuryButton from "../../components/ui/LuxuryButton";
import { useLanguage } from "../../context/LanguageContext";

type Props = {
  start: () => void;
};

export default function Welcome({ start }: Props) {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="welcome">
      {/* PHOTO */}

      <img
        src={vasylPhoto}
        alt=""
        aria-hidden="true"
        className="welcome-photo"
      />

      {/* BLACK CINEMATIC OVERLAY */}

      <div className="welcome-overlay" />

      <div className="welcome-vignette" />

      {/* CONTENT */}

      <div className="welcome-content">

        {/* TOP */}

        <header className="welcome-header">
          <div className="welcome-logo">
            IRON<span>AGE</span>
          </div>

          <div className="welcome-edition">
            {t("welcome.athleteSystem")}
            <strong>01</strong>
          </div>
        </header>

        {/* HERO */}

        <section className="welcome-hero">

          <div className="welcome-eyebrow">
            <span className="gold-line" />
            {t("welcome.buildYourself")}
            <span className="gold-line" />
          </div>

          <h1 className="welcome-title">
            <span>{t("welcome.become")}</span>
            <strong>{t("welcome.unstoppable")}</strong>
          </h1>

          <p className="welcome-description">
            {t("welcome.disciplineMoment")}
            <br />
            {t("welcome.lifestyle")}
          </p>

        </section>

        {/* BOTTOM */}

        <footer className="welcome-footer">

          <LuxuryButton onClick={start}>
            {t("welcome.enter")}
          </LuxuryButton>

          <div className="welcome-system">
            <span />
            {t("welcome.premiumSystem")}
            <span />
          </div>

        </footer>

      </div>
    </main>
  );
}