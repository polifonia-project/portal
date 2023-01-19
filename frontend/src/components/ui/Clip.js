import React from "react";
import classes from "./Clip.module.css";

function Clip(props) {

    const handleClickScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };



    return (
        <div className={classes.clipContainer}>
            <div className={classes.clip}>
                <span className={classes.dot} style={{ backgroundColor: props.color}}></span>
                <p>{props.title}</p>
                <button onClick={() => handleClickScroll(props.id)}>More +</button>
            </div>
        </div>
    )
}

export default Clip;

