import React, { useState } from "react";
import classes from "./SectionContainer.module.css";
import ResultsContainer from "../resultsUi/ResultsContainer";
import SectionClip from "./SectionClip";

function SectionContainer(props) {
    const [selected_uri, setSelected] = useState(props.el_iri);
    const [selected_value, setValue] = useState(props.placeholder);

    return (
        <div id={props.id} className={classes.sectionContainer + " " + classes['background' + props.tot_categories]}>
            <div className={classes.sectionInfoboxContainer + " " + classes[props.id]}>
                <div className={classes.sectionInfobox}>
                    <div className={classes.sectionMarkerLeft} style={{ backgroundColor: props.color }}></div>
                    <div className={classes.sectionText}>
                        <h3 className={classes.sectionTitle}>{props.header}</h3>
                        <p className={classes.sectionDescription}>{props.description}</p>
                    </div>
                    <div className={classes.sectionMarkerRight} style={{ backgroundColor: props.color }}></div>
                </div>
            </div>
            <SectionClip
                key={props.key}
                color={props.color}
                placeholder={props.placeholder}
                category={props.category}
                catName={props.catName}
                el_iri={selected_uri}
                setInputValue={setValue}
                onQuery={setSelected}
            >
            </SectionClip>
            <ResultsContainer
                cat={props.id.split("-")[1]}
                filters={props.filters}
                el_iri={selected_uri}
                datasets={props.datasets}
                color={props.color}
                input_value={selected_value}
            >
            </ResultsContainer>
        </div>
    );
}

export default SectionContainer;