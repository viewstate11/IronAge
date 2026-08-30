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
  const handleNext = () => {
    if (!value.trim()) return;
    next();
  };

  return (
    <section className="onboarding-step name-step">
      <div className="onboarding-step-content">

        <div className="onboarding-eyebrow">
          <span />
          LET'S GET STARTED
          <span />
        </div>

        <h1 className="onboarding-title">
          WHAT'S
          <br />
          <strong>YOUR NAME?</strong>
        </h1>

        <p className="onboarding-description">
          Your journey starts with one decision.
          <br />
          Let's make it count.
        </p>

        <div className="onboarding-input-wrapper">
          <label htmlFor="name">
            YOUR NAME
          </label>

          <input
            id="name"
            type="text"
            value={value}
            onChange={(event) =>
              onChange(event.target.value)
            }
            placeholder="Enter your name"
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
          <span>CONTINUE</span>
          <strong>→</strong>
        </button>

        <p className="onboarding-footer">
          IRONAGE ATHLETE SYSTEM
        </p>

      </div>
    </section>
  );
}