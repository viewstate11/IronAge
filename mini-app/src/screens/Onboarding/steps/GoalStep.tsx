type Props = {
  value: string;
  onChange: (value: string) => void;
  next: () => void;
};

export default function GoalStep({
  value,
  onChange,
  next,
}: Props) {
  const goals = [
    {
      id: "MUSCLE",
      number: "01",
      title: "BUILD MUSCLE",
      subtitle: "SIZE & PHYSIQUE",
    },
    {
      id: "LOSE_WEIGHT",
      number: "02",
      title: "LOSE FAT",
      subtitle: "LEAN & DEFINED",
    },
    {
      id: "STRENGTH",
      number: "03",
      title: "GET STRONGER",
      subtitle: "POWER & PERFORMANCE",
    },
    {
      id: "FITNESS",
      number: "04",
      title: "STAY FIT",
      subtitle: "HEALTH & CONDITIONING",
    },
  ];

  return (
    <section className="onboarding-step">

      <div className="onboarding-step-content">

        <div className="onboarding-eyebrow">
          YOUR MISSION
        </div>

        <h1 className="onboarding-title">
          WHAT DO YOU
          <strong>WANT TO BUILD?</strong>
        </h1>

        <p className="onboarding-description">
          Choose your primary goal.
          IRONAGE will adapt your system around it.
        </p>

        <div className="goal-options">

          {goals.map((goal) => (

            <button
              key={goal.id}
              type="button"
              className={`goal-option ${
                value === goal.id ? "active" : ""
              }`}
              onClick={() => onChange(goal.id)}
            >
              <span className="goal-number">
                {goal.number}
              </span>

              <span className="goal-content">
                <strong>{goal.title}</strong>
                <small>{goal.subtitle}</small>
              </span>

              <span className="goal-arrow">
                →
              </span>
            </button>

          ))}

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