import { useState } from "react";

import { useUser } from "../../../context/UserContext";

import "../Onboarding.css";


interface Props {
  next: () => void;
}


export default function AgeStep({ next }: Props) {

  const { setUser } = useUser();

  const [age, setAge] = useState("");


  const handleNext = () => {

    const value = Number(age);

    if (!value || value < 13 || value > 100) {
      return;
    }

    localStorage.setItem(
      "age",
      String(value)
    );

    setUser((prev) => ({
      ...prev,
      age: value,
    }));

    next();
  };


  return (
    <div className="step">

      <h1>
        Скільки тобі років?
      </h1>

      <p>
        Це допоможе нам підібрати
        правильне навантаження
      </p>

      <input
        className="input"
        type="number"
        min="13"
        max="100"
        placeholder="Твій вік"
        value={age}
        onChange={(e) =>
          setAge(e.target.value)
        }
      />

      <button
        className="button"
        disabled={
          !age ||
          Number(age) < 13 ||
          Number(age) > 100
        }
        onClick={handleNext}
      >
        ДАЛІ
      </button>

    </div>
  );
}