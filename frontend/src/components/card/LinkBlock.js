import React from "react";
import classes from "./LinkBlock.module.css";
import { useState, useEffect } from "react";


function LinkBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);
  const [isLoaded, setIsLoaded] = useState(true)
  const [linkList, setLinkList] = useState([])

  useEffect(() => {

  // loading
  if (props.content === undefined) { // add or empty
    setIsLoaded(false)
  } else {
    setIsLoaded(true)
    setLinkList(props.content);
  }


  // width
    
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
    isLoaded ? 
    <div className={classes.cardBlockContainer} style={{width: 'calc(' + numericWidth + '% - 25px)'}}>
      <p className={classes.blockTitle}><span>{props.title}</span></p>
      <div className={classes.cardBlockBox}>
      <p className={classes.blockParagraph}>{props.desc}</p>
      <div className={classes.linksContainer}>
        {linkList.map(function(link, i){
          return  <a href={link.url} key={'link-' + i} target="_blank" rel="noopener noreferrer"><button className={classes.linkButton}>{link.label}</button></a>
        })}
      </div>
    </div>
    </div> : null 
  );
}


export default LinkBlock;