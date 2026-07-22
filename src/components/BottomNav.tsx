import { Link } from "react-router-dom";


export default function BottomNav(){

return (

<div className="
fixed
bottom-0
left-0
right-0
bg-slate-900
text-white
flex
justify-around
p-4
z-50
">

<Link to="/">
⚔️ Головна
</Link>


<Link to="/training">
🔥 Тренування
</Link>


<Link to="/days">
📅 90 днів
</Link>


<Link to="/profile">
👤 Профіль
</Link>


</div>

);

}