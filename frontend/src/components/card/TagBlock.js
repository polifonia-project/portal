import React from "react";
import classes from "./TagBlock.module.css";


function TagBlock(props) {

  return (
    <div className={classes.cardBlockContainer} style={{width: 'calc(' + props.width + '% - 25px)'}}>
      <p className={classes.blockTitle}><span>Tags</span></p>
      <div className={classes.cardBlockBox}>
      <div className={classes.linksContainer}>
      <button className={classes.linkButton}># music</button>
      <button className={classes.linkButton}># technology</button>
      <button className={classes.linkButton}># art</button>
      <button className={classes.linkButton}># history</button>
      <button className={classes.linkButton}># songs</button>
      <button className={classes.linkButton}># organ</button>
      <button className={classes.linkButton}># philology</button>
      <button className={classes.linkButton}># musicomposition</button>
      <button className={classes.linkButton}># italian</button>
      </div>
    </div>
    </div>
  );
}


export default TagBlock;