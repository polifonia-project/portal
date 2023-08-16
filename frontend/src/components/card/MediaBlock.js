import React from "react";
import classes from "./MediaBlock.module.css";
import { useState, useEffect } from "react";


function MediaBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);
  const [isLoaded, setIsLoaded] = useState(true)
  

  useEffect(() => {
  if (props.content === undefined) {
    setIsLoaded(false)
  } else {
    setIsLoaded(true)
  }
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
    isLoaded ? 
    <div className={classes.cardBlockContainer} style={{width: 'calc(' + numericWidth + '% - 25px)'}}>
      <p className={classes.blockTitle}><span>{props.title}</span></p>
      <div className={classes.cardBlockBox}>
      <div className={classes.mockVis}>
      <img 
      src={props.content}
      alt="new"
      />
      </div>
    </div>
    </div> : null
  
  );
}


export default MediaBlock;