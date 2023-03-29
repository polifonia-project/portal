import React from "react";
import classes from "./RelationBlock.module.css";


function RelationBlock(props) {

  return (
    <div className={classes.cardBlockContainer} style={{width: 'calc(' + props.width + '% - 25px)'}}>
      <div className={classes.relationBlock}>
        <p className={classes.blockTitle}><span>Influenced by</span></p>
        <div className={classes.cardBlockBox}>
      <p className={classes.relationLi}>————&nbsp;&nbsp;Remy Warner</p>
      <p className={classes.relationLi}>————&nbsp;&nbsp;Jaxton Ponce</p>
      <p className={classes.relationLi}>————&nbsp;&nbsp;Aileen Shepherd</p>
      <p className={classes.relationLi}>————&nbsp;&nbsp;Aileen Shepherd</p>
      <p className={classes.relationLi}>————&nbsp;&nbsp;Warren Castaneda</p>
      
      {props.children}
        </div>
      </div>
      <div className={classes.relationBlock}>
        <p className={classes.blockTitle}><span>Worked with</span></p>
        <div className={classes.cardBlockBox}>
      <p className={classes.relationLi}>————&nbsp;&nbsp;Remy Warner</p>
      <p className={classes.relationLi}>————&nbsp;&nbsp;Jaxton Ponce</p>
      <p className={classes.relationLi}>————&nbsp;&nbsp;Aileen Shepherd</p>
      <p className={classes.relationLi}>————&nbsp;&nbsp;Aileen Shepherd</p>
      <p className={classes.relationLi}>————&nbsp;&nbsp;Warren Castaneda</p>
      
      {props.children}
        </div>
      </div>
    
    </div>
  );
}


export default RelationBlock;