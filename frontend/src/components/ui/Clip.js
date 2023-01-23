import React from "react";
import classes from "./Clip.module.css";

function Clip(props) {

    const handleClickScroll = (section) => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ block: "nearest", behavior: 'smooth' });
        }
      };

    return (
        <div className={classes.clipContainer +' '+ classes[props.section]}>       
            <div className={classes.clip}>
                <span className={classes.dot} style={{ backgroundColor: props.color}}></span>
                <p>{props.title}</p>
                <button onClick={() => handleClickScroll(props.section)}>More +</button>
                <span className={classes.end_dot} style={{ backgroundColor: props.color}}></span>
            </div>
        </div>
    )
}

export default Clip;

