import { useState } from "react";

import { useUser } from "../../../context/UserContext";

import "../Onboarding.css";


interface Props {
  next: () => void;
}


export default function WeightStep({ next }: Props) {

  const { setUser } = useUser();

  const [weight, setWeight] = useState("");


  const handleNext = () => {

    const value = Number(weight);

    if (!value || value < 35 || value > 250) {
      return;
    }


    localStorage.setItem(
      "weight",
      String(value)
    );


    setUser((prev) => ({
      ...prev,
      weight: value,
    }));


    next();

  };


  return (

    <div className="step">

      <h1>
        Скільки ти важиш?
      </h1>


      <p>
        Вкажи свою поточну вагу
      </p>


      <input
        className="input"
        type="number"
        min="35"
        max="250"
        placeholder="Наприклад: 80"
        value={weight}
        onChange={(e) =>
          setWeight(e.target.value)
        }
      />


      <span className="unit">
        кг
      </span>


      <button
        className="button"
        disabled={
          !weight ||
          Number(weight) < 35 ||
          Number(weight) > 250
        }
        onClick={handleNext}
      >
        ДАЛІ
      </button>

    </div>

  );

}