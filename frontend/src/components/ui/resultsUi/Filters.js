import React from "react";
import classes from "./Filters.module.css";

function Filters(props) {
    return(      [
      <div className={classes.filtersType}>{props.filtersType}</div>,
      <div className={classes.filtersList}>{props.children}</div>
      ] )

}

export default Filters;