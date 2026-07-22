import { useState } from "react";


export default function Profile() {


  const [edit, setEdit] = useState(false);


  const [name, setName] = useState(
    localStorage.getItem("ironage-name") || "Vasyl"
  );


  const [age, setAge] = useState(
    localStorage.getItem("ironage-age") || "30"
  );


  const [height, setHeight] = useState(
    localStorage.getItem("ironage-height") || "180"
  );


  const [weight, setWeight] = useState(
    localStorage.getItem("ironage-weight") || "92"
  );




  function saveProfile(){


    localStorage.setItem(
      "ironage-name",
      name
    );


    localStorage.setItem(
      "ironage-age",
      age
    );


    localStorage.setItem(
      "ironage-height",
      height
    );


    localStorage.setItem(
      "ironage-weight",
      weight
    );


    setEdit(false);

  }





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

Профіль 💪

</h1>




<div className="
bg-slate-800
rounded-3xl
mx-6
p-6
space-y-5
">



{
edit ? (

<>


<input

value={name}

onChange={
e=>setName(e.target.value)
}

className="
w-full
bg-slate-700
p-3
rounded-xl
"

/>



<input

value={age}

onChange={
e=>setAge(e.target.value)
}

className="
w-full
bg-slate-700
p-3
rounded-xl
"

/>



<input

value={height}

onChange={
e=>setHeight(e.target.value)
}

className="
w-full
bg-slate-700
p-3
rounded-xl
"

/>



<input

value={weight}

onChange={
e=>setWeight(e.target.value)
}

className="
w-full
bg-slate-700
p-3
rounded-xl
"

/>



<button

onClick={saveProfile}

className="
w-full
bg-green-600
py-4
rounded-2xl
font-bold
"

>

Зберегти ✅

</button>


</>



)

:

(

<>


<h2 className="
text-3xl
font-bold
">

{name}

</h2>


<p className="text-orange-400 text-lg">

Схуднення + сила

</p>




<div className="space-y-3">


<p>
Вік: <b>{age}</b>
</p>


<p>
Зріст: <b>{height} см</b>
</p>


<p>
Вага: <b>{weight} кг</b>
</p>


</div>




<div className="
bg-orange-500
text-black
rounded-xl
p-4
text-center
font-bold
">

🛡️ Iron Warrior

</div>




<button

onClick={()=>{
setEdit(true)
}}

className="
w-full
bg-orange-500
text-black
py-4
rounded-2xl
font-bold
"

>

Редагувати профіль ✏️

</button>


</>

)

}




</div>



</div>

);


}