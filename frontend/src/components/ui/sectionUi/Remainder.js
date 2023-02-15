import React from "react";
import classes from "./Remainder.module.css";

function Remainder(props) {
  return (
    <div className={classes.categoryRemainder}>
      <p style={{ color: props.focus ? props.color : "#666666" }}>
        {props.catName}
      </p>
    </div>
  );
}
export default Remainder;
