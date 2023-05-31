import React from "react";
import classes from "./NoResultsError.module.css";

function NoResultsError() {

  return (
    <div>
        <div className={classes.resultLine}>
        <div><p>There are no results for this request. Please try again.</p></div>
        </div>
    </div>
  )
}

export default NoResultsError;
