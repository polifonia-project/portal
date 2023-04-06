import React from "react";
import classes from "./ExpandButton.module.css";
import expandIcon from '../../../assets/svg/expand.svg';
import { useContext } from "react";
import { CardContext } from "../../../context/CardContext";


function ExpandButton(props) {

  const { setCardOpen } = useContext(CardContext);

  return (
    <button 
    className={classes.expandButton}
    style={{backgroundImage: `url(${expandIcon})` }}
    onMouseEnter={props.mouseEnter}
    onMouseLeave={props.mouseLeave}
    onClick={() => {setCardOpen(true)}}
    >
    </button>
  );
}
export default ExpandButton;
