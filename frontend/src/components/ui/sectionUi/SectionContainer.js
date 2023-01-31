import React from "react";
import classes from "./SectionContainer.module.css";
import SectionResults from "./SectionResults";

function SectionContainer(props) {

    return (
        <div id = {props.id} className={classes.sectionContainer}>
            <div className={classes.sectionInfoboxContainer + ' ' + classes[props.id]}>
                <div className={classes.sectionInfobox}>
                   <div className={classes.sectionMarkerLeft}  style={{backgroundColor: props.color}}></div>
                   <div className={classes.sectionText}>
                        <h3 className={classes.sectionTitle}>{props.header}</h3>
                        <p className={classes.sectionDescription}>{props.description}</p>
                   </div>
                   <div className={classes.sectionMarkerRight}  style={{backgroundColor: props.color}}></div>
                </div>
            </div>
            {props.children}
            <SectionResults/>
        </div>
    )
}

export default SectionContainer;