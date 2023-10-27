import React, { useState } from "react";
import classes from "./FiltersContainer.module.css";

function FiltersContainer(props) {
  
   const [filtersOpen, setFiltersOpen] = useState(false);
    
   const handleClickOpen = (e) => {setFiltersOpen(true)}
   const handleClickClose = (e) => {setFiltersOpen(false)}


    return (
    <div className={classes.filtersContainer}>
      <div className={classes.filtersButtonContainer}>
        {filtersOpen ? 
          [<span onClick={() => handleClickClose()} className={classes.filterButton}>Filters <span className={classes.slider}></span></span>,<span className={classes.closeIcon}>−</span>]
        : [<span onClick={() => handleClickOpen()} className={classes.filterButton}>Filters <span className={classes.slider}></span></span>,<span className={classes.openIcon}>+</span>] }
      </div>
      <div className={classes.filtersTypesContainer}>
      {filtersOpen ? props.children : null }
      </div>
    </div>
    )
}

export default FiltersContainer;