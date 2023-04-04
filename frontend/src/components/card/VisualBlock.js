import React from "react";
import classes from "./VisualBlock.module.css";


function VisualBlock(props) {

  return (
    <div className={classes.cardBlockContainer} style={{width: 'calc(' + props.width + '% - 25px)'}}>
      <p className={classes.blockTitle}><span>Data per Year</span></p>
      <div className={classes.cardBlockBox}>
      <div className={classes.mockVis}></div>
    </div>
    </div>
  );
}


export default VisualBlock;