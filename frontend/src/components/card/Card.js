import React, { useState } from "react";
import classes from "./Card.module.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import CardBlock from "./CardBlock";
import TextBlock from "./TextBlock";
import RelationBlock from "./RelationBlock.js";
import VisualBlock from "./VisualBlock";

function Card(props) {

  const { cardOpen, setCardOpen } = useContext(ThemeContext);
  const { cardContent } = useContext(ThemeContext);
  const { colorSet } = useContext(ThemeContext);
  return (
    <div className={classes.cardContainer} style={{transform: cardOpen? 'translateX(0)' : 'translateX(-100%)'}}>
      <div className={classes.titleBlock} style={{backgroundColor: colorSet[cardContent.cat]}}>
        <div className={classes.titleContainer}>
          <h1>{cardContent.title}</h1>
          <p className={classes.categoryResult}>
            <span>{cardContent.cat}</span>
            <span>Related to Wolfgang Amadeus Mozart</span>
            <span><button className={classes.shareButton}>Share</button></span>
            <span><button className={classes.sourceButton}>Source</button></span>
          </p>
        </div>
        <div>
          <button className={classes.exitButton} onClick={()=> setCardOpen(false)}>Return ⇢</button>
        </div>
      </div>
      <div className={classes.contentBlock}>
        
        <TextBlock width={25}></TextBlock>
        <RelationBlock width={25}></RelationBlock> 
        <RelationBlock width={25}></RelationBlock> 
        <RelationBlock width={25}></RelationBlock> 
        <VisualBlock width={100}></VisualBlock>  

      {/* <CardBlock width={100}></CardBlock> */}

      </div>
    </div>
  );
}


export default Card;