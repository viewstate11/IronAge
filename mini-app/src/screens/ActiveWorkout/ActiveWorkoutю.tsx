import {useState} from "react";

import "./ActiveWorkout.css";


export default function ActiveWorkout(){


const [time,setTime]=useState(30);



return(

<div className="active-workout">


<div className="top">

<button>
←
</button>

<p>
1 / 8
</p>

</div>



<div className="exercise-image">

💪

</div>



<h1>

Віджимання

</h1>


<p className="target">

15 повторень

</p>



<div className="timer">

{time}

<span>
сек
</span>

</div>



<div className="instruction">


<h3>
Техніка
</h3>


<p>
✓ Тримай корпус рівно
</p>

<p>
✓ Контролюй рух
</p>

<p>
✓ Не поспішай
</p>


</div>



<button className="complete">

✓ Виконав

</button>


</div>

)

}