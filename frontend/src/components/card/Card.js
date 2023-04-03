import React, { useEffect, useState } from "react";
import classes from "./Card.module.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import isDarkColor from 'is-dark-color';

import TextBlock from "./TextBlock";
import RelationBlock from "./RelationBlock.js";
import VisualBlock from "./VisualBlock";
import LinkBlock from "./LinkBlock";
import TagBlock from "./TagBlock";

function Card(props) {

  const { cardOpen, setCardOpen } = useContext(ThemeContext);
  const { cardContent } = useContext(ThemeContext);
  const { colorSet } = useContext(ThemeContext);
  const [colorBackground, setColorBackground] = useState('#e2e2e2')
  const [colorIsDark, setColorIsDark] = useState(false)

  useEffect(() => {
    if (cardOpen) {
      if (colorSet[cardContent.cat]) {
        setColorBackground(colorSet[cardContent.cat]);
      } else {
        setColorBackground('#e2e2e2');
      }
      
      if (isDarkColor(colorBackground)) {
        setColorIsDark(true);
        setLightHeader();
      } else {
        setColorIsDark(false);
        setDarkHeader();
      }

    } 
  });

  const closeCard = () => {
    setCardOpen(false); 
    setColorBackground('#e2e2e2');
    if (isDarkColor([cardContent.color])) {
      setLightHeader();
    } else {
      setDarkHeader();
    }

  }

  const setLightHeader = () => {
    document.getElementById("mainLogo").style.filter= 'brightness(0) invert(1)';
    document.getElementById("sectionName").style.color = 'white';
    document.getElementById("menuOptions").style.filter = 'brightness(0) invert(1)';
    document.getElementById("menuOptions").style.zIndex = '300';
   }

  const setDarkHeader = () => {
    document.getElementById("mainLogo").style.filter= 'none';
    document.getElementById("sectionName").style.color = 'black';
    document.getElementById("menuOptions").style.filter = 'none';
   }



  return (
    <div className={classes.cardContainer} style={{transform: cardOpen? 'translateX(0)' : 'translateX(-100%)'}}>
      <div className={classes.titleBlock} style={{backgroundColor: colorSet[cardContent.cat]}}>
        <div className={classes.titleContainer}>
          <h1 style={{color: colorIsDark ? 'white' : 'black'}}>{cardContent.title}</h1>
          <p className={classes.categoryResult} style={{color: colorIsDark ? 'white' : 'black', borderColor: colorIsDark ? 'white' : '#474747'}}>
            <span style={{borderColor: colorIsDark ? 'white' : '#474747'}}>{cardContent.cat}</span>
            <span style={{borderColor: colorIsDark ? 'white' : '#474747'}}>Related to Wolfgang Amadeus Mozart</span>
          </p>
          <p className={classes.cardShareButton} style={{borderColor: colorIsDark ? 'white' : '#474747'}}>
            <span><button className={classes.shareButton} style={{color: colorIsDark ? 'white' : 'black'}}>Share</button></span>
          </p>
        </div>
        <div>
          <button className={classes.exitButton} onClick={()=> closeCard()} style={{color: colorIsDark ? 'white' : 'black', borderColor: colorIsDark ? 'white' : '#474747'}}>Back ⇢</button>
        </div>
      </div>
      <div className={classes.contentBlock}>
        <TextBlock width={25}></TextBlock>
        <RelationBlock width={25}></RelationBlock> 
        <RelationBlock width={25}></RelationBlock> 
        <LinkBlock width={25}></LinkBlock>
        <VisualBlock width={50}></VisualBlock>  
        <TagBlock width={50}></TagBlock> 

      {/* <CardBlock width={100}></CardBlock> */
      /* <LinkBlock width={100}></LinkBlock> */}

      </div>
    </div>
  );
}


export default Card;