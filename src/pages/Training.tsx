import { useState } from "react";
import { workouts } from "../data/workouts";
import ExerciseCard from "../components/workout/ExerciseCard";


export default function Training() {


  const savedDay = Number(
    localStorage.getItem("ironage-day")
  );


  const startDay =
    savedDay >= 1 && savedDay <= 90
      ? savedDay
      : 1;



  const [day, setDay] = useState(startDay);



  const today = workouts.find(
    workout => workout.day === day
  );





  function completeWorkout(){


    const finishedDays = JSON.parse(
      localStorage.getItem("ironage-completed-days") || "[]"
    );



    if(!finishedDays.includes(day)){
      finishedDays.push(day);
    }



    localStorage.setItem(
      "ironage-completed-days",
      JSON.stringify(finishedDays)
    );



    const nextDay = day < 90 ? day + 1 : 90;



    localStorage.setItem(
      "ironage-day",
      String(nextDay)
    );



    setDay(nextDay);

  }





  function resetProgress(){

    localStorage.clear();

    window.location.reload();

  }





  return (

    <div className="min-h-screen bg-slate-950 text-white pb-24">


      <h1 className="text-4xl font-bold text-orange-500 p-6">
        Тренування 🔥
      </h1>



      <p className="px-6 text-xl">
        День {day} із 90
      </p>



      <button

        onClick={resetProgress}

        className="
        bg-red-600
        px-4
        py-3
        rounded-xl
        m-6
        font-bold
        "

      >
        Скинути прогрес
      </button>





      {
        today ? (


          <div className="p-6 space-y-4">


            {
              today.exercises.map(
                (exercise,index)=>(


                  <ExerciseCard

                    key={`${day}-${index}`}

                    name={exercise.name}

                    sets={exercise.sets}

                    reps={exercise.reps}

                  />


                )
              )

            }




            <button

              onClick={completeWorkout}

              className="
              w-full
              bg-orange-500
              text-black
              py-4
              rounded-2xl
              font-bold
              mt-6
              "

            >

              Завершити день 💪

            </button>



          </div>


        )


        :


        (

          <div className="p-6">

            <h2 className="text-2xl font-bold">
              Тренування не знайдено
            </h2>


          </div>

        )


      }



    </div>

  );

}