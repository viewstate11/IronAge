import { useState } from "react";

import uaImage from "../../assets/vasyl-ua.jpg";

import "./Onboarding.css";

import NameStep from "./steps/NameStep";
import AgeStep from "./steps/AgeStep";
import GenderStep from "./steps/GenderStep";
import HeightStep from "./steps/HeightStep";
import WeightStep from "./steps/WeightStep";
import GoalStep from "./steps/GoalStep";
import FinishStep from "./steps/FinishStep";


type Props = {
  finish: () => void;
};


export default function Onboarding({
  finish,
}: Props) {

  const [step, setStep] = useState(0);


  return (

    <div
      className="onboarding"

      style={{
        backgroundImage: `
          linear-gradient(
            rgba(5,5,5,0.70),
            rgba(5,5,5,0.92)
          ),
          url(${uaImage})
        `,
      }}
    >

      {/* PROGRESS */}

      <div className="onboarding-progress">

        <span>
          {step + 1} / 7
        </span>

      </div>


      {/* NAME */}

      {step === 0 && (

        <NameStep
          next={() => setStep(1)}
        />

      )}


      {/* AGE */}

      {step === 1 && (

        <AgeStep
          next={() => setStep(2)}
        />

      )}


      {/* GENDER */}

      {step === 2 && (

        <GenderStep
          next={() => setStep(3)}
        />

      )}


      {/* HEIGHT */}

      {step === 3 && (

        <HeightStep
          next={() => setStep(4)}
        />

      )}


      {/* WEIGHT */}

      {step === 4 && (

        <WeightStep
          next={() => setStep(5)}
        />

      )}


      {/* GOAL */}

      {step === 5 && (

        <GoalStep
          next={() => setStep(6)}
        />

      )}


      {/* FINISH */}

      {step === 6 && (

        <FinishStep
          finish={finish}
        />

      )}

    </div>

  );

}