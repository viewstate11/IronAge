import "./Welcome.css";


interface Props{

start:()=>void;

}


export default function Welcome({start}:Props){


return (

<div className="welcome">


<div className="logo">

IRONAGE

</div>


<h1>

Стань кращою
<br/>
версією себе

</h1>


<p>

Твій персональний фітнес-додаток

</p>


<button onClick={start}>

ПОЧАТИ

</button>


</div>

)

}