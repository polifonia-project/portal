import React from "react";
import classes from "./RelationBlock.module.css";
import { useState, useEffect } from "react";


function RelationBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);
  const [isBands, setBands] = useState(false);

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
  if (props.title === "Bands") {
    setBands(true)
  }
  });

  return (
    <div className={classes.cardBlockContainer} style={{width: 'calc(' + numericWidth + '% - 25px)'}}>
      <div className={classes.relationBlock}>
        <p className={classes.blockTitle}><span>{props.title}</span></p>
        { isBands ?
        <div className={classes.cardBlockBox}>
          <p className={classes.relationLi}>————&nbsp;&nbsp;The Stone Roses</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Oasis</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;New Order</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;The Smiths</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Joy Division</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Magazine</p>
          <br></br>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Take That</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;The Hollies</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;808 State</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;M People</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Herman's Hermits</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;The Fall</p>
        </div>
        :
        <div className={classes.cardBlockBox}>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Documents</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Photographs</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Tapes</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Original Artowrks</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Audio tapes</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Contracts</p>
          <br></br>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Videos</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Records</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Posters</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Biographies</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Setlists</p>
          <p className={classes.relationLi}>————&nbsp;&nbsp;Tickets</p>

        </div>
      }
      </div>

    </div>
  );
}


export default RelationBlock;