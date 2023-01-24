import React from "react";
import classes from "./SectionResults.module.css"
import ResultsTest from "./ResultsTest";

function SectionResults() {

    return (
        <div className={classes.resultContainer}>
            <ResultsTest></ResultsTest>
        </div>
    )
}

export default SectionResults;