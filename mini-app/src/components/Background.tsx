import "./Background.css";

import uaImage from "../assets/vasyl-ua.jpg";


type Props = {
children: React.ReactNode;
};



export default function Background({children}:Props){


return (

<div

className="app-background"

style={{

backgroundImage:`

linear-gradient(
rgba(5,5,5,0.80),
rgba(5,5,5,0.95)
),

url(${uaImage})

`

}}

>


{children}


</div>

)

}