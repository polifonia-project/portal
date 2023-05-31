import React from "react";
import classes from "./NoMoreResults.module.css";

function NoMoreResults(props) {

  return (
    <div>
        <div className={classes.resultLine}>
        {props.message ? <div><p>You have seen it all!</p></div> : <div></div>}
        </div>
    </div>
  )
}

export default NoMoreResults;
