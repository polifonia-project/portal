import React from "react";
import classes from "./InfoBox.module.css";
import reactStringReplace from 'react-string-replace';


function InfoBox(props) {
  var title = props.infotitle;
  const highlights = props.highlights;

  highlights.map((highlight, index) => ( 
    title = reactStringReplace(title, highlight, (match, i) => (<i key={'highlight'+ index} style={{ color: props.color}}>{match}</i>))
  ));

  
  return (
    <div className={classes.infoBox + ' ' + classes[props.section] + ' ' + classes[props.section + '0' + props.tot_categories]}>
      <h3>
      {title}
      </h3>
      <p>{props.infodescription}</p>
    </div>
  );
}

export default InfoBox;
