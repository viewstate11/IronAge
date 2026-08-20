import { useState } from "react";

import { useUser } from "../../../context/UserContext";


interface Props {
  next: () => void;
}


export default function NameStep({ next }: Props) {

  const [name, setName] = useState("");

  const { setUser } = useUser();


  const handleNext = () => {

    const cleanName = name.trim();

    if (!cleanName) return;


    setUser((prev) => ({
      ...prev,
      name: cleanName,
    }));


    localStorage.setItem(
      "name",
      cleanName
    );


    next();

  };


  return (

    <div className="step">

      <h1>
        Як тебе звати?
      </h1>


      <p>
        Почнемо створення твого профілю
      </p>


      <input
        className="input"
        placeholder="Твоє ім'я"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />


      <button
        className="button"
        disabled={!name.trim()}
        onClick={handleNext}
      >
        ДАЛІ
      </button>

    </div>

  );

}