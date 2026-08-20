import styles from "./Card.module.css";


interface Props {

children:React.ReactNode;

}


export default function Card({

children

}:Props){


return (

<div className={styles.card}>

{children}

</div>

)

}