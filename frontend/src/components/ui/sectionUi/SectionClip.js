import React from "react";
import classes from "./SectionClip.module.css";

function SectionClip(props) {

    return (
        <div className={classes.clipContainer}>
            <div className={classes.clip}>
                <span className={classes.dot} style={{ backgroundColor: props.color}}></span>
                {props.children}
                <button>Change</button>
            </div>
        </div>
    )
}

export default SectionClip;