import React from "react";
import classes from "./ResultLine.module.css";

function ResultLine(props) {
  return (
    <div className={classes.resultLine}>
      <div className={classes.resultNum}>{props.number}</div>
      <div className={classes.resultCat}><span className={classes.categoryResult}>{props.cat}</span></div>
      <div className={classes.resultLabel}><b>{props.label}</b></div>
      <div className={classes.resultRel}>Wolfgang Amadeus Mozart&nbsp;&nbsp;————&nbsp;&nbsp; {props.rel} &nbsp;&nbsp;————&nbsp;&nbsp; {props.label}</div>
      <div className={classes.resultActions}><button></button></div>
    </div>
  )
}

export default ResultLine;