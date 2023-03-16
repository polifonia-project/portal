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
      <div className={classes.resultRel} style={{flexDirection: props.isdirect ? 'row-reverse' : 'row', justifyContent:  props.isdirect ? 'flex-end' : 'flex-start',}}><span className={classes.inputResult}>{props.input_value}</span><span>&nbsp;&nbsp;————&nbsp;&nbsp;</span><span className={classes.listOfRelations}>{props.rel}</span><span>&nbsp;&nbsp;————&nbsp;&nbsp;</span><span>{props.label}</span></div>
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

/*
MULTI RELATION RESULT
<div className={classes.resultRel} style={{flexDirection: isDirect ? 'row-reverse' : 'row', justifyContent:  isDirect ? 'flex-end' : 'flex-start',}}><span>{props.input_value}</span><span>&nbsp;&nbsp;————&nbsp;&nbsp;</span><span className={classes.listOfRelations}>{props.rel}  &nbsp;/&nbsp; {props.rel}  &nbsp;/&nbsp; {props.rel}</span><span>&nbsp;&nbsp;————&nbsp;&nbsp;</span><span>{props.label}</span></div>
*/
