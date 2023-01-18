import React from "react";
import classes from "./Clip.module.css";

function Clip(props) {
    return (
        <div className={classes.clipContainer}>
            <div className={classes.clip}>
                <p>{props.title}</p>
                <button>More +</button>
            </div>
        </div>
    )
}

export default Clip;