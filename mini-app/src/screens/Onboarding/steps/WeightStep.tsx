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
          BODY METRICS
        </div>

        <h1 className="onboarding-title">
          WHAT IS
          <strong>YOUR WEIGHT?</strong>
        </h1>

        <p className="onboarding-description">
          This helps IRONAGE create a more precise
          training and nutrition system for you.
        </p>

        <div className="height-selector">

          <button
            type="button"
            className="height-control"
            onClick={decrease}
            aria-label="Decrease weight"
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
            aria-label="Increase weight"
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