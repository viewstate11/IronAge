type Props = {
  finish: () => void;
};

export default function FinishStep({
  finish,
}: Props) {
  return (
    <section className="onboarding-step onboarding-finish">

      <div className="onboarding-finish-content">

        <div className="onboarding-eyebrow">
          ATHLETE SYSTEM ACTIVATED
        </div>

        <div className="onboarding-finish-line" />

        <h1 className="onboarding-title">
          YOU'RE
          <strong>READY.</strong>
        </h1>

        <p className="onboarding-description">
          Your IRONAGE journey starts now.
          <br />
          No excuses. No looking back.
        </p>

        <div className="onboarding-manifesto">

          <div>
            <span>01</span>
            <strong>DISCIPLINE</strong>
          </div>

          <div>
            <span>02</span>
            <strong>STRENGTH</strong>
          </div>

          <div>
            <span>03</span>
            <strong>RESULTS</strong>
          </div>

        </div>

      </div>

      <div className="onboarding-step-bottom">

        <button
          type="button"
          className="onboarding-button onboarding-finish-button"
          onClick={finish}
        >
          <span>ENTER IRONAGE</span>
          <strong>→</strong>
        </button>

        <div className="onboarding-footer">
          WELCOME TO THE IRONAGE SYSTEM
        </div>

      </div>

    </section>
  );
}