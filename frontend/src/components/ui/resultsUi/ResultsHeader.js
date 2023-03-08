import React from "react";
import classes from "./ResultsHeader.module.css";
import SourcesBarchart from "./SourcesBarchart";

function ResultsHeader(props) {
  return (
    <div className={classes.stickyHeader}>
      {props.children}
      <SourcesBarchart></SourcesBarchart>
      <div className={classes.resheader}>
        <div className={classes.headerNum}>#</div>
        <div className={classes.headerCat}><span className={classes.headerCatBorder}>Category</span></div>
        <div className={classes.headerLab}>Result</div>
        <div className={classes.headerRel}>Explanation</div>
        <div className={classes.headerAct}>Expand</div>
      </div>
    </div>
  );
}

export default ResultsHeader;
