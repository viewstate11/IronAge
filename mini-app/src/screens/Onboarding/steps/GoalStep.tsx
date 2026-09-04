import {
  useLanguage,
} from "../../../context/LanguageContext";

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
  const { t } = useLanguage();

  const goals = [
    {
      id: "MUSCLE",
      number: "01",
      title: t("onboarding.goal.muscle"),
      subtitle: t("onboarding.goal.muscleSub"),
    },
    {
      id: "LOSE_WEIGHT",
      number: "02",
      title: t("onboarding.goal.fat"),
      subtitle: t("onboarding.goal.fatSub"),
    },
    {
      id: "STRENGTH",
      number: "03",
      title: t("onboarding.goal.strength"),
      subtitle: t("onboarding.goal.strengthSub"),
    },
    {
      id: "FITNESS",
      number: "04",
      title: t("onboarding.goal.fitness"),
      subtitle: t("onboarding.goal.fitnessSub"),
    },
  ];

  return (
    <section className="onboarding-step">

      <div className="onboarding-step-content">

        <div className="onboarding-eyebrow">
          {t("onboarding.mission")}
        </div>

        <h1 className="onboarding-title">
          {t("onboarding.goal.title1")}
          <strong>{t("onboarding.goal.title2")}</strong>
        </h1>

        <p className="onboarding-description">
          {t("onboarding.goal.description")}
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
          <span>{t("onboarding.continue")}</span>
          <strong>→</strong>
        </button>

        <div className="onboarding-footer">
          {t("onboarding.athleteSystem")}
        </div>

      </div>

    </section>
  );
}