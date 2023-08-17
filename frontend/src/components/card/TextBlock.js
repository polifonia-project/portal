import React, { useEffect } from "react";
import classes from "./TextBlock.module.css";
import { useState } from "react";


function TextBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);
  const [showAllSources, setShowAllSources] = useState(props.reset);

  const toggleSources = () => {
    setShowAllSources(prev => !prev)
  }

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
      <p className={classes.blockTitle}><span>{props.title}</span></p>
      <div className={classes.cardBlockBox}>
        <p className={classes.blockParagraph}>{props.content}.</p>
       <p className={classes.sourceTag}>Source: Wikidata</p>
      </div>
      {showAllSources ?  
      <span >
      <div className={classes.cardBlockBox}>
        <p className={classes.blockParagraph}>{props.content}.</p>
       <p className={classes.sourceTag}>Source: Wikidata</p>
      </div>
      <div className={classes.cardBlockBox}>
        <p className={classes.blockParagraph}>{props.content}.</p>
       <p className={classes.sourceTag}>Source: Wikidata</p>
      </div>
      </span> : null}

    <p className={classes.sourceCount}>Shown:{showAllSources ? "3/3" : "1/3"}<button onClick={toggleSources}>{showAllSources ? "Hide others" : "Show all"}</button></p>
    </div>
  );
}


export default TextBlock;