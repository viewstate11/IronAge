import { useState } from "react";

import { useUser } from "../../../context/UserContext";

import "../Onboarding.css";


interface Props {
  next: () => void;
}


export default function GoalStep({ next }: Props) {

  const { setUser } = useUser();

  const [goal, setGoal] = useState("");


  const goals = [
    {
      id: "lose_weight",
      emoji: "🔥",
      title: "Схуднути",
      description: "Спалити жир та стати легшим",
    },
    {
      id: "build_muscle",
      emoji: "💪",
      title: "Набрати м'язи",
      description: "Стати сильнішим та масивнішим",
    },
    {
      id: "get_fit",
      emoji: "⚡",
      title: "Бути у формі",
      description: "Покращити фізичну форму",
    },
    {
      id: "strength",
      emoji: "⚔️",
      title: "Стати сильнішим",
      description: "Розвинути силу та витривалість",
    },
  ];


  const handleNext = () => {

    if (!goal) return;


    localStorage.setItem(
      "goal",
      goal
    );


    setUser((prev) => ({
      ...prev,
      goal,
    }));


    next();

  };


  return (

    <div className="step">

      <h1>
        Яка твоя головна ціль?
      </h1>


      <p>
        IRONAGE підбере програму під тебе
      </p>


      <div className="goal-options">

        {goals.map((item) => (

          <button
            key={item.id}
            type="button"
            className={
              goal === item.id
                ? "goal-option selected"
                : "goal-option"
            }
            onClick={() =>
              setGoal(item.id)
            }
          >

            <span className="goal-emoji">
              {item.emoji}
            </span>


            <span className="goal-content">

              <strong>
                {item.title}
              </strong>

              <small>
                {item.description}
              </small>

            </span>

          </button>

        ))}

      </div>


      <button
        className="button"
        disabled={!goal}
        onClick={handleNext}
      >
        ДАЛІ
      </button>

    </div>

  );

}