import React from "react";
import classes from "./ResultLine.module.css";
import { useState } from "react";
import expandIcon from '../../../assets/svg/expand.svg';
import expandIconWhite from '../../../assets/svg/expandWhite.svg';

function ResultLine(props) {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
     setIsHover(true);
  };
  const handleMouseLeave = () => {
     setIsHover(false);
  };


  return (
    <div className={classes.resultLine}>
      <div className={classes.resultNum}>{props.number}</div>
      <div className={classes.resultCat}><span className={classes.categoryResult}>{props.cat}</span></div>
      <div className={classes.resultLabel}><b>{props.label}</b></div>
      <div className={classes.resultRel}>Wolfgang Amadeus Mozart&nbsp;&nbsp;————&nbsp;&nbsp; {props.rel} &nbsp;&nbsp;————&nbsp;&nbsp; {props.label}</div>
      <div className={classes.resultActions}>
        <button 
          style={{backgroundColor: isHover ? props.color : 'transparent',
                  border: isHover ? 'transparent' : '0.5px solid black',
                  backgroundImage: isHover ? `url(${expandIconWhite})` : `url(${expandIcon})` }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        ></button>
      </div>
    </div>
  )
}

export default ResultLine;