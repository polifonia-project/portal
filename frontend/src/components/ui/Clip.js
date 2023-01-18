import React from "react";
import classes from "./Clip.module.css";

function Clip(props) {

    return (
        <div className={classes.clipContainer}>
            <div className={classes.clip}>
                <span className={classes.dot} style={{ backgroundColor: props.color}}></span>
                <p>{props.title}</p>
                <button>More +</button>
            </div>
        </div>
    )
}

export default Clip;