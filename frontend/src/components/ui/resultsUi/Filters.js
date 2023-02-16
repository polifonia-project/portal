import React from "react";
import classes from "./Filters.module.css";
import { useState } from "react";

function Filters(props) {

    const [toggle, setToggle] = useState(false)

    return(      [
      <div className={classes.filtersType + ' ' + classes[toggle ? 'typeOpen' : 'typeClosed']} onClick={() => setToggle(!toggle)}>
        <span>{props.filtersType}</span>
        <span className={classes.slider}></span> 
        {toggle ? <span className={classes.closeIcon}> −</span>: props.selectedOn ?  <span><span className={classes.selectedDot} style={{color: props.color}}>•</span><span className={classes.openIcon}>  +</span></span>  : <span className={classes.openIcon}> +</span>}
        </div>,
      <div className={classes.filtersList + ' ' + classes[toggle ? 'filtersListOpen' : 'filtersListClosed']}>{props.children}</div>
      ] ) 

}

export default Filters; 