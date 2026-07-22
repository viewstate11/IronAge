import { useState } from "react";


export default function Days() {


  const currentDay =
    Number(localStorage.getItem("ironage-day")) || 1;



  const [completedDays] = useState<number[]>(

    JSON.parse(
      localStorage.getItem("ironage-completed-days") || "[]"
    )

  );




  const days = Array.from(
    { length: 90 },
    (_, index) => index + 1
  );




  return (

    <div className="
    min-h-screen
    bg-slate-950
    text-white
    pb-24
    ">


      <h1 className="
      text-4xl
      font-bold
      text-orange-500
      p-6
      ">

        Календар 📅

      </h1>



      <p className="px-6 text-xl mb-4">

        Прогрес: День {currentDay} із 90

      </p>





      <div className="
      grid
      grid-cols-5
      gap-3
      p-6
      ">


        {
          days.map(day => (


            <div

              key={day}

              className={`
              aspect-square
              rounded-xl
              flex
              items-center
              justify-center
              font-bold

              ${
                completedDays.includes(day)

                ?

                "bg-green-600"

                :

                day === currentDay

                ?

                "bg-orange-500 text-black"

                :

                "bg-slate-800"

              }

              `}

            >

              {day}


            </div>


          ))

        }


      </div>



    </div>

  );

}