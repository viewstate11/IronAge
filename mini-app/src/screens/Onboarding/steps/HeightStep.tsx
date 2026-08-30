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
          BODY METRICS
        </div>

        <h1 className="onboarding-title">
          HOW
          <strong>TALL ARE YOU?</strong>
        </h1>

        <p className="onboarding-description">
          Your height helps us calculate your
          ideal training and nutrition targets.
        </p>

        <div className="height-selector">

          <button
            type="button"
            className="height-control"
            onClick={decrease}
            aria-label="Decrease height"
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
            aria-label="Increase height"
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