import React from "react";
import classes from "./ResultsHeader.module.css";

function ResultsHeader(props) {
  return (
    <div className={classes.stickyHeader}>
      {props.children}
      <div className={classes.resheader}>
        <div className={classes.headerNum}>#</div>
        <div className={classes.headerLab}>Label</div>
        <div className={classes.headerCat}>Category</div>
        <div className={classes.headerRel}>Relations</div>
        <div className={classes.headerAct}>Expand</div>
      </div>
    </div>
  );
}

export default ResultsHeader;
