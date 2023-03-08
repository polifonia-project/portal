import React from "react";
import classes from "./SourcesBarchart.module.css";

function SourcesBarchart() {
  return (
    <div className={classes.barchartContainer}>
      <div className={classes.barchartBox}>
          <span className={classes.barLine} style={{height: '20%'}}/>
          <span className={classes.barLine} style={{height: '10%'}}/>
          <span className={classes.barLine} style={{height: '20%'}}/>
          <span className={classes.barLine} style={{height: '50%'}}/>
          <span className={classes.barLine} style={{height: '80%'}}/>
          <span className={classes.barLine} style={{height: '80%'}}/>
          <span className={classes.barLine} style={{height: '50%'}}/>
          <span className={classes.barLine} style={{height: '20%'}}/>
          <span className={classes.barLine} style={{height: '40%'}}/>
      </div>
    </div>
  );
}

export default SourcesBarchart;
