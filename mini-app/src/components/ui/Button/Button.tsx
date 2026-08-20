interface Props{

children:React.ReactNode;

}



export default function Button({
children
}:Props){


return(

<button className="primary-btn">

{children}

</button>

)

}