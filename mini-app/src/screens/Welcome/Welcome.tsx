import { useEffect } from "react";
import "./Welcome.css";

import vasylPhoto from "../../assets/vasyl-ua.jpg";
import LuxuryButton from "../../components/ui/LuxuryButton";

type Props = {
  start: () => void;
};

export default function Welcome({ start }: Props) {
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
            ATHLETE SYSTEM
            <strong>01</strong>
          </div>
        </header>

        {/* HERO */}

        <section className="welcome-hero">

          <div className="welcome-eyebrow">
            <span className="gold-line" />
            BUILD YOURSELF
            <span className="gold-line" />
          </div>

          <h1 className="welcome-title">
            <span>BECOME</span>
            <strong>UNSTOPPABLE.</strong>
          </h1>

          <p className="welcome-description">
            Discipline is not a moment.
            <br />
            It is a lifestyle.
          </p>

        </section>

        {/* BOTTOM */}

        <footer className="welcome-footer">

          <LuxuryButton onClick={start}>
            ENTER IRONAGE
          </LuxuryButton>

          <div className="welcome-system">
            <span />
            PREMIUM FITNESS SYSTEM
            <span />
          </div>

        </footer>

      </div>
    </main>
  );
}