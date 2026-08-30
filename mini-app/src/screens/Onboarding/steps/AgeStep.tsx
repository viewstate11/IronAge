type Props = {
  value: number;
  onChange: (value: number) => void;
  next: () => void;
};

export default function AgeStep({
  value,
  onChange,
  next,
}: Props) {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextValue = Number(event.target.value);

    if (
      nextValue >= 0 &&
      nextValue <= 100
    ) {
      onChange(nextValue);
    }
  };

  const handleNext = () => {
    if (value < 13 || value > 100) return;
    next();
  };

  return (
    <section className="onboarding-step">

      <div className="onboarding-step-content">

        <div className="onboarding-eyebrow">
          YOUR PROFILE
        </div>

        <h1 className="onboarding-title">
          HOW
          <strong>OLD ARE YOU?</strong>
        </h1>

        <p className="onboarding-description">
          Your age helps IRONAGE build a training
          system designed specifically for you.
        </p>

        <div className="onboarding-input-wrapper">

          <label htmlFor="age">
            AGE
          </label>

          <input
            id="age"
            type="number"
            inputMode="numeric"
            min="13"
            max="100"
            placeholder="30"
            value={value || ""}
            onChange={handleChange}
          />

        </div>

      </div>

      <div className="onboarding-step-bottom">

        <button
          type="button"
          className="onboarding-button"
          disabled={value < 13 || value > 100}
          onClick={handleNext}
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