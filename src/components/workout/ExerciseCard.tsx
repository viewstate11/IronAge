import { useState } from "react";


type Props = {
  name: string;
  sets: number;
  reps: number;
};


export default function ExerciseCard({
  name,
  sets,
  reps
}: Props) {


const [completedSets,setCompletedSets] = useState<number[]>([]);



function toggleSet(index:number){


if(completedSets.includes(index)){


setCompletedSets(
completedSets.filter(
(item)=>item !== index
)
);


}else{


setCompletedSets([
...completedSets,
index
]);


}


}



return (

<div className="
bg-slate-800
rounded-2xl
p-5
">


<h2 className="
text-xl
font-bold
">

{name}

</h2>



<p className="text-gray-400 mt-2">

Повтори: {reps}

</p>




<div className="mt-4 space-y-2">


{

Array.from(
{length:sets},
(_,index)=>(


<button

key={index}

onClick={()=>
toggleSet(index)
}

className={

`
w-full
py-3
rounded-xl
font-bold

${
completedSets.includes(index)

?

"bg-green-600"

:

"bg-orange-500 text-black"

}

`

}

>


Підхід {index+1}

{

completedSets.includes(index)

?
" ✅"
:
""

}


</button>


)

)

}


</div>


</div>

);


}