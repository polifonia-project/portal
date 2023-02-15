import React from "react";
import classes from "./ResultLine.module.css";

function ResultLine(props) {
  return (
    <div className={classes.resultLine}>
      <div className={classes.resultNum}>{props.number}</div>
      <div className={classes.resultLabel}>{props.label}</div>
      <div className={classes.resultCat}>{props.cat}</div>
      <div className={classes.resultRel}>{props.rel}</div>
      <div className={classes.resultActions}><button></button></div>
    </div>
  )
}

export default ResultLine;