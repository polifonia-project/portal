import React from "react";
import classes from "./MainContainer.module.css"

function MainContainer(props) {

    return (
        <div className={classes.mainContainer}>  
        {props.children}  
        </div>
    )
}

export default MainContainer;