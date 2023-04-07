import React from "react";
import classes from "./LinkBlock.module.css";
import { useState, useEffect } from "react";


function LinkBlock(props) {

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
      <p className={classes.blockParagraph}>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
      <div className={classes.linksContainer}>
        {props.links.map(function(link, i){
          return  <a href={link.url} target="_blank" rel="noopener noreferrer"><button className={classes.linkButton}>{link.label}</button></a>
        })}
      </div>
    </div>
    </div>
  );
}


export default LinkBlock;