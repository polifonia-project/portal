import React from "react";
import classes from './InfoBox.module.css'

function InfoBox(props) {
  return (
    <div className={classes.InfoBox}>
      <h3>{props.infotitle}</h3>
      <p>{props.infodescription}</p>
    </div>
  );
}

export default InfoBox;