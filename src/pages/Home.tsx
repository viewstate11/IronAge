export default function Home() {

  return (
    <main className="
      min-h-screen
      bg-slate-950
      text-white
      px-5
      py-8
    ">

      <div className="
        max-w-md
        mx-auto
        space-y-6
      ">


        <h1 className="
          text-4xl
          font-black
          text-orange-500
        ">
          IronAge ⚔️
        </h1>


        <div>
          <h2 className="
            text-2xl
            font-bold
          ">
            Hello, Vasya
          </h2>

          <p className="text-gray-400 mt-1">
            Твоя трансформація триває
          </p>
        </div>


        <div className="
          bg-slate-900
          border
          border-slate-800
          rounded-3xl
          p-6
        ">

          <p className="text-gray-400">
            День
          </p>

          <p className="
            text-5xl
            font-black
            text-orange-500
          ">
            1
            <span className="text-white text-2xl">
              /90
            </span>
          </p>

        </div>



        <div className="
          bg-slate-900
          rounded-3xl
          p-6
          space-y-4
        ">

          <h3 className="
            text-xl
            font-bold
          ">
            Прогрес
          </h3>


          <div className="
            h-3
            bg-slate-700
            rounded-full
          ">

            <div className="
              h-3
              w-[1%]
              bg-orange-500
              rounded-full
            " />

          </div>


          <p className="
            text-orange-500
            text-3xl
            font-bold
          ">
            1%
          </p>


        </div>



        <button className="
          w-full
          bg-orange-500
          text-black
          py-4
          rounded-2xl
          font-black
          text-lg
        ">
          Почати тренування 🔥
        </button>



        <div className="
          grid
          grid-cols-3
          gap-3
        ">


          <div className="
            bg-slate-900
            rounded-2xl
            p-4
            text-center
          ">
            <p className="text-gray-400">
              Вага
            </p>
            <b>
              92 кг
            </b>
          </div>


          <div className="
            bg-slate-900
            rounded-2xl
            p-4
            text-center
          ">
            <p className="text-gray-400">
              Віджимання
            </p>
            <b>
              30
            </b>
          </div>


          <div className="
            bg-slate-900
            rounded-2xl
            p-4
            text-center
          ">
            <p className="text-gray-400">
              XP
            </p>
            <b>
              0
            </b>
          </div>


        </div>


      </div>

    </main>
  );
}