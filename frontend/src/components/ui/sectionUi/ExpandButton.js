import React, { useContext } from "react";
import classes from "./ExpandButton.module.css";
import expandIcon from '../../../assets/svg/expand.svg';
import { CardContext } from "../../../context/CardContext";


function ExpandButton(props) {

  const { setCardOpen } = useContext(CardContext);
  const { setCardContent } = useContext(CardContext);

  return (
    <button
      className={classes.expandButton}
      style={{ backgroundImage: `url(${expandIcon})` }}
      onMouseEnter={props.mouseEnter}
      onMouseLeave={props.mouseLeave}
      onClick={() => { setCardOpen(true); setCardContent({ title: props.label, cat: props.cat, input: 'no input', uri: props.uri, color: props.color, hasInput: true, goesBack: true }) }}
    >
    </button>
  );
}
export default ExpandButton;
