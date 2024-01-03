import React, { useState, useEffect } from "react";
import classes from "./ExpandButton.module.css";
import expandIcon from '../../../assets/svg/expand.svg';
import { Link } from "react-router-dom";


function ExpandButton(props) {

  const [encodedUrl, setEncodedUrl] = useState(false);

  useEffect(() => {

  // set result link to card 
  const params ="title=" + props.label + "&cat=" + props.cat + "&input= no input &hasinput=true&uri=" + props.uri;
  const encodedParams = encodeURI(params);
  const encodedUrl = "card?" + encodedParams;
  setEncodedUrl(encodedUrl);

  }, [props.label, props.cat, props.uri] )

  return (
    <Link to={encodedUrl} target="_blank" rel="noopener noreferrer">
    <button
      className={classes.expandButton}
      style={{ backgroundImage: `url(${expandIcon})` }}
      onMouseEnter={props.mouseEnter}
      onMouseLeave={props.mouseLeave}
      >
    </button>
    </Link>
  );
}
export default ExpandButton;
