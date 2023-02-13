import React from "react";
import classes from "./Filters.module.css";

function Filters(props) {
    return (
    <div className={classes.filtersContainer}>
      <div className={classes.filtersType}>Filters +</div> 
      <div className={classes.filtersList}>
      {props.children}
      </div>
      <div className={classes.filtersType}>Categories +</div> 
    </div>
    )
}

export default Filters;