import React from "react";
import classes from "./RelationBlock.module.css";
import { useState, useEffect } from "react";


function RelationBlock(props) {

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
      <div className={classes.relationBlock}>
        <p className={classes.blockTitle}><span>{props.title}</span></p>
        <div className={classes.cardBlockBox}>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Remy Warner</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Jaxton Ponce</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Aileen Shepherd</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Aileen Shepherd</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Warren Castaneda</p>
          <br></br>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Remy Warner</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Jaxton Ponce</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Aileen Shepherd</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Aileen Shepherd</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Warren Castaneda</p>
        </div>
      </div>
    
    </div>
  );
}


export default RelationBlock;