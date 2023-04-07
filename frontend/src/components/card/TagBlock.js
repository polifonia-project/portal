import React from "react";
import classes from "./TagBlock.module.css";
import { useState, useEffect } from "react";


function TagBlock(props) {

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
      <div className={classes.linksContainer}>
      {props.tags.map(function(tag, i){
          return  <button className={classes.linkButton}># {tag}</button>
        })}
      </div>
    </div>
    </div>
  );
}


export default TagBlock;