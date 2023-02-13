import React from "react";
import classes from "./Remainder.module.css";

function Remainder(props) {
  return (
    <div className={classes.categoryRemainder}>
      <p style={{ color: props.focus ? props.color : "#666666" }}>
        {props.catName}
      </p>
      <svg className={classes.categoryRemainderIcon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 22.9 21.7"
        style={{
          enableBackground: "new 0 0 22.9 21.7",
        }}
        xmlSpace="preserve"
        {...props}
      >
        <path
          style={{
            fill: "none",
            stroke: props.focus ? props.color : "#666666",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
          d="M1.3 7.7 11.5 18 21.6 7.8"
        />
      </svg>
    </div>
  );
}
export default Remainder;
