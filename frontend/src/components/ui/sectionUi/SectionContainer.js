import React, { useState } from "react";
import classes from "./SectionContainer.module.css";
import ResultsContainer from "../resultsUi/ResultsContainer";

function SectionContainer(props) {

    // const [selected, setSelected] = useState();
    // setSelected(props.el_iri);

    return (
        <div id={props.id} className={classes.sectionContainer}>
            <div className={classes.sectionInfoboxContainer + ' ' + classes[props.id]}>
                <div className={classes.sectionInfobox}>
                    <div className={classes.sectionMarkerLeft} style={{ backgroundColor: props.color }}></div>
                    <div className={classes.sectionText}>
                        <h3 className={classes.sectionTitle}>{props.header}</h3>
                        <p className={classes.sectionDescription}>{props.description}</p>
                    </div>
                    <div className={classes.sectionMarkerRight} style={{ backgroundColor: props.color }}></div>
                </div>
            </div>
            {props.children}
            <ResultsContainer cat={props.id.split('-')[1]} filters={props.filters} el_iri={props.el_iri} />
        </div>
    )
}

export default SectionContainer;