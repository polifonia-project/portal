import React, { useState } from "react";
import classes from "./Filters.module.css";

function Filters(props) {

  const [toggle, setToggle] = useState(false)

  return ([ 
    <div key={'filters-name-' + props.cat} className={classes.filtersType + ' ' + classes[toggle ? 'typeOpen' : 'typeClosed']} onClick={() => setToggle(!toggle)}>
      <span style={{ position: 'relative' }} className={classes.typeName}>{props.filtersType}<span className={classes.slider}></span></span>
      {toggle ? <span className={classes.closeIcon}> −</span> : props.selectedOn ? <span><span className={classes.selectedDot} style={{ color: props.color }}>•</span><span className={classes.openIcon}>  +</span></span> : <span className={classes.openIcon}> +</span>}
    </div>,
    <div key={'filters-list-' + props.cat} className={classes.filtersList + ' ' + classes[toggle ? 'filtersListOpen' : 'filtersListClosed']}>{props.children}</div>
  ])

}

export default Filters; 