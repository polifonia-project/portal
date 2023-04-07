import React from "react";
import classes from "./ResultLine.module.css";
import { useState, useContext } from "react";
import { CardContext } from "../../../context/CardContext";
import expandIcon from '../../../assets/svg/expand.svg';
import expandIconWhite from '../../../assets/svg/expandWhite.svg';
import { useEffect } from "react";

function ResultLine(props) {
  const [isHover, setIsHover] = useState(false);
  const [datasetOn, setDatasetOn] = useState(false);
  const { setCardOpen } = useContext(CardContext);
  const { setCardContent } = useContext(CardContext);

  const handleMouseEnter = () => {
     setIsHover(true);
  };
  const handleMouseLeave = () => {
     setIsHover(false);
  };

  useEffect(() => {
   if (props.dataset === props.currentDataset) {
    setDatasetOn(true);
   } else {
    setDatasetOn(false);
   }
  });


  return (
    <div className={classes.resultLine} style={{backgroundColor : props.datasetOn ? datasetOn ? '#e7e2e2' : '#f4edec' : null, borderTop : props.datasetOn ? datasetOn ? '0.5px solid #f4edec' : '0.5px solid #e8e3e3' : null, borderBottom : props.datasetOn ? datasetOn ? '0.5px solid #f4edec' : '0.5px solid #e8e3e3' : null}}>
      <div className={classes.resultNum}>{props.number}</div>
      <div className={classes.scrollResult}>
      <div className={classes.resultCat}><span className={classes.categoryResult}>{props.cat}</span></div>
      <div className={classes.resultLabel}><b>{props.label}</b></div>
      <div className={classes.resultRel} style={{flexDirection: props.isdirect ? 'row-reverse' : 'row', justifyContent:  props.isdirect ? 'flex-end' : 'flex-start',}}><span className={classes.inputResult}>{props.input_value}</span><span>&nbsp;&nbsp;————&nbsp;&nbsp;</span><span className={classes.listOfRelations}>{props.rel}</span><span>&nbsp;&nbsp;————&nbsp;&nbsp;</span><span>{props.label}</span></div>
      </div>
      <div className={classes.resultActions}>
        <button 
          style={{backgroundColor: isHover ? props.color : 'transparent',
                  border: isHover ? 'transparent' : '0.5px solid black',
                  backgroundImage: isHover ? `url(${expandIconWhite})` : `url(${expandIcon})` }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {setCardOpen(true); setCardContent({title: props.label, cat: props.cat, input: props.input_value, uri: 'url', color: props.color, hasInput: false})}}
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
