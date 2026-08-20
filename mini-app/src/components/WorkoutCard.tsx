type Props={

title:string;

emoji:string;

time:string;

level:string;

exercises:number;

onClick:()=>void;

};


export default function WorkoutCard({

title,

emoji,

time,

level,

exercises,

onClick

}:Props){

return(

<div
className="training-card"
onClick={onClick}
>

<span>

{emoji}

</span>

<div>

<h2>

{title}

</h2>

<p>

{time}

</p>

<p>

{level}

</p>

<p>

{exercises} вправ

</p>

</div>

<button>

▶

</button>

</div>

)

}