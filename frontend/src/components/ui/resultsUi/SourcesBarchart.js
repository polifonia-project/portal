import React from "react";
import classes from "./SourcesBarchart.module.css";

function SourcesBarchart() {

  const a = { 
    'pilot dataset': 10,
    'pilot data': 20,
    'musow': 50,
    'wikidata': 70,
    'choco': 50,
    'sound and vision': 20,
    'polifonia': 10,
  }

  return (
    <div className={classes.barchartContainer}>
      <div className={classes.barchartBox}>
        {Object.values(a).map(value => (
            <span className={classes.barLine}>
            <span className={classes.barLineRight} style={{height: value + '%'}}/>
            <span className={classes.barLineLeft} style={{height: value + '%'}}/>
            </span>
        ))}
      </div>
    </div>
  );
}

export default SourcesBarchart;
