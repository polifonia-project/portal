import React from "react";
import classes from "./FiltersContainer.module.css";

function FiltersContainer(props) {
    return (
    <div className={classes.filtersContainer}>
      {props.children}
    </div>
    )
}

export default FiltersContainer;