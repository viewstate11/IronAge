import { useUser } from "../../../context/UserContext";

import "../Onboarding.css";


interface Props {
  finish: () => void;
}


export default function FinishStep({
  finish,
}: Props) {

  const { user } = useUser();


  const handleFinish = () => {

    localStorage.setItem(
      "onboarding_complete",
      "true"
    );


    finish();

  };


  return (

    <div className="step finish-step">

      <div className="finish-icon">
        ⚔️
      </div>


      <h1>
        Твій профіль готовий
      </h1>


      <p>
        Ласкаво просимо до IRONAGE,
        {` ${user.name}`}.
      </p>


      <div className="profile-summary">

        <div>
          <span>🎂</span>
          <strong>{user.age}</strong>
          <small>років</small>
        </div>


        <div>
          <span>📏</span>
          <strong>{user.height}</strong>
          <small>см</small>
        </div>


        <div>
          <span>⚖️</span>
          <strong>{user.weight}</strong>
          <small>кг</small>
        </div>

      </div>


      <div className="finish-level">

        <span>
          ⚔️
        </span>

        <div>

          <strong>
            IRON LVL 1
          </strong>

          <small>
            Твій шлях починається зараз
          </small>

        </div>

      </div>


      <button
        className="button"
        onClick={handleFinish}
      >
        🔥 ПОЧАТИ IRONAGE
      </button>

    </div>

  );

}