import React from "react";
import classes from "./ResultsContainer.module.css";
import Results from "./Results";

function ResultsContainer(props) {
    return (
        <div className={classes.resultContainer}>
            <Results cat={props.cat} filters={props.filters} el_iri={props.el_iri} datasets={props.datasets} color={props.color} input_value={props.input_value} input_category={props.input_category} catCodes={props.catCodes}></Results>
        </div>
    )
}

export default ResultsContainer;