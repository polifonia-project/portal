import React from "react";
import classes from "./Clip.module.css";
import VisibilitySensor from 'react-visibility-sensor';

function Clip(props) {

    const handleClickScroll = (section) => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ block: "nearest", behavior: 'smooth' });
        }
      };

    function onChange (isVisible) {
        if (isVisible) {
                document.getElementById("mainHeader").style.backgroundColor = props.color;
                document.getElementById("mainHeader").style.borderImageWidth = '0px  0px 0px 0px';
                document.getElementById("categoriesNav").style.backgroundColor = props.color;
                
        } 
            
      };

    return (
        

        <div className={classes.clipContainer +' '+ classes[props.section]}> 
        <VisibilitySensor onChange={onChange}>     
            <div className={classes.clip}>
                <span className={classes.dot} style={{ backgroundColor: props.color}}></span>
                <p>{props.title}</p>
                <button onClick={() => handleClickScroll(props.section)}>More +</button>
                <span className={classes.end_dot} style={{ backgroundColor: props.color}}></span>
            </div>
        </VisibilitySensor>
        </div>

        
    )
}

export default Clip;

