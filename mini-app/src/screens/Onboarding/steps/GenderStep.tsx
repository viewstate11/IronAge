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
  return (
    <section className="onboarding-step">

      <div className="onboarding-step-content">

        <div className="onboarding-eyebrow">
          YOUR PROFILE
        </div>

        <h1 className="onboarding-title">
          CHOOSE
          <strong>YOUR PATH.</strong>
        </h1>

        <p className="onboarding-description">
          Select your profile so IRONAGE can
          personalize your training experience.
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
            <span className="gender-name">MALE</span>
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
            <span className="gender-name">FEMALE</span>
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
          <span>CONTINUE</span>
          <strong>→</strong>
        </button>

        <div className="onboarding-footer">
          IRONAGE ATHLETE SYSTEM
        </div>

      </div>

    </section>
  );
}