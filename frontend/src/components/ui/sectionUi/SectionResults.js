import React from "react";
import classes from "./SectionResults.module.css"
import ResultsTest from "./ResultsTest";

function SectionResults(props) {

    return (
        <div className={classes.resultContainer}>
            <ResultsTest cat={props.cat} filters={props.filters} el_iri={props.el_iri} ></ResultsTest>
        </div>
    )
}

export default SectionResults;