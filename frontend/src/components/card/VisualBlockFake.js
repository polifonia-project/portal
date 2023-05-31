import React from "react";
import classes from "./VisualBlock.module.css";
import { useState, useEffect } from "react";
import photo from "../../assets/png/joydivision.jpeg"


function VisualBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);

  useEffect(() => {
    var current_width = props.width;
  if (current_width === 'small') {
    setNumericWidth(25);
  } else if (current_width === 'medium') {
    setNumericWidth(50);
  } else if (current_width === 'large') {
    setNumericWidth(100);
  } else {
    setNumericWidth(25);
  }
  });


  return (
    <div className={classes.cardBlockContainer} style={{width: 'calc(' + numericWidth + '% - 25px)'}}>
      <p className={classes.blockTitle}><span>{props.title}</span></p>
      <div className={classes.cardBlockBox}>
      <div className={classes.mockVis}>
        <img src={photo} alt="joy division photograph"></img>
      </div>
    </div>
    </div>
  );
}


export default VisualBlock;