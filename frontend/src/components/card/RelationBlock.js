import React from "react";
import classes from "./RelationBlock.module.css";
import { useState, useEffect } from "react";


function RelationBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);
  const relList = props.content

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
      <div className={classes.relationBlock}>
        <p className={classes.blockTitle}><span>{props.title}</span></p>
        <div className={classes.cardBlockBox}>
        {relList.map(function(data) {
          return ( <p className={classes.relationLi}><a href={data.link} target="_blank" rel="noopener noreferrer">————&nbsp;&nbsp; {data.name}</a></p>)
         })}  
        </div>
      </div>
    
    </div>
  );
}


export default RelationBlock;