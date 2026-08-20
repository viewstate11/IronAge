import { useState } from "react";

import { useUser } from "../../../context/UserContext";

import "../Onboarding.css";


interface Props {
  next: () => void;
}


export default function GenderStep({ next }: Props) {

  const { setUser } = useUser();

  const [gender, setGender] = useState("");


  const handleNext = () => {

    if (!gender) return;

    localStorage.setItem(
      "gender",
      gender
    );

    setUser((prev) => ({
      ...prev,
      gender,
    }));

    next();
  };


  return (
    <div className="step">

      <h1>
        Обери стать
      </h1>

      <p>
        Це допоможе персоналізувати програму
      </p>


      <div className="gender-options">

        <button
          type="button"
          className={
            gender === "Чоловік"
              ? "gender-option selected"
              : "gender-option"
          }
          onClick={() =>
            setGender("Чоловік")
          }
        >
          👨
          <span>Чоловік</span>
        </button>


        <button
          type="button"
          className={
            gender === "Жінка"
              ? "gender-option selected"
              : "gender-option"
          }
          onClick={() =>
            setGender("Жінка")
          }
        >
          👩
          <span>Жінка</span>
        </button>

      </div>


      <button
        className="button"
        disabled={!gender}
        onClick={handleNext}
      >
        ДАЛІ
      </button>

    </div>
  );
}