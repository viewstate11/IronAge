import { useState } from "react";

import { useUser } from "../../../context/UserContext";

import "../Onboarding.css";


interface Props {
  next: () => void;
}


export default function HeightStep({ next }: Props) {

  const { setUser } = useUser();

  const [height, setHeight] = useState("");


  const handleNext = () => {

    const value = Number(height);

    if (!value || value < 120 || value > 230) {
      return;
    }


    localStorage.setItem(
      "height",
      String(value)
    );


    setUser((prev) => ({
      ...prev,
      height: value,
    }));


    next();

  };


  return (

    <div className="step">

      <h1>
        Який у тебе зріст?
      </h1>


      <p>
        Вкажи свій зріст у сантиметрах
      </p>


      <input
        className="input"
        type="number"
        min="120"
        max="230"
        placeholder="Наприклад: 180"
        value={height}
        onChange={(e) =>
          setHeight(e.target.value)
        }
      />


      <span className="unit">
        см
      </span>


      <button
        className="button"
        disabled={
          !height ||
          Number(height) < 120 ||
          Number(height) > 230
        }
        onClick={handleNext}
      >
        ДАЛІ
      </button>

    </div>

  );

}