import React from "react";
import classes from "./SectionClip.module.css";
import VisibilitySensor from 'react-visibility-sensor';

function SectionClip(props) {

    function onChange (isVisible) {
        if (isVisible) {
                document.getElementById("mainHeader").style.backgroundColor = props.color;
                document.getElementById("mainHeader").style.borderImageWidth = '0px  0px 0px 0px';
                document.getElementById("categoriesNav").style.backgroundColor = props.color;
                
        } 
            
      };

    return (
        <VisibilitySensor onChange={onChange}>  
        <div className={classes.sectionClipContainer}>
            <div className={classes.sectionClip}>
                <span className={classes.dot} style={{ backgroundColor: props.color}}></span>
                {props.children}
                <button>Change</button>
            </div>
        </div>
        </VisibilitySensor>
    )
}

export default SectionClip;