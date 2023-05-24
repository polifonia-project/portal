import React, { useEffect, useState } from "react";
import classes from "./Card.module.css";
import { useContext } from "react";
import { CardContext } from "../../context/CardContext";
import isDarkColor from 'is-dark-color';

import TextBlock from "./TextBlock";
import RelationBlock from "./RelationBlock.js";
import VisualBlock from "./VisualBlock";
import LinkBlock from "./LinkBlock";
import WarningBlock from "./WarningBlock";

import TextBlockFake from "./TextBlockFake";
import LinkBlockFake from "./LinkBlockFake";
import RelationBlockFake from "./RelationBlockFake";
import VisualBlockFake from "./VisualBlockFake";

function Card(props) {

  const { cardOpen, setCardOpen } = useContext(CardContext);
  const { cardContent } = useContext(CardContext);
  const { cardBlocksNew } = useContext(CardContext);

  const [colorBackground, setColorBackground] = useState('#e2e2e2')
  const [colorIsDark, setColorIsDark] = useState(false)
  const [isManchester,  setManchester] = useState(false)
  const [currentBlock, setCurrentBlock] = useState({})
  const [fromSectionClip, setFromSectionClip] = useState(false)

  useEffect(() => {
    if (cardOpen) {
      console.log(cardBlocksNew);
      setFromSectionClip(cardContent.hasInput); 
      if (cardBlocksNew[cardContent.cat]) {
        setColorBackground(cardBlocksNew[cardContent.cat].color);
        setCurrentBlock(cardBlocksNew[cardContent.cat].blocks); 
      } else {
        setColorBackground('#e2e2e2');
        setCurrentBlock({"01" : { "type": "none"},}); 
      }
      
      if (isDarkColor(colorBackground)) {
        setColorIsDark(true);
        setLightHeader();
      } else {
        setColorIsDark(false);
        setDarkHeader();
      }

      if (cardContent.title === 'Manchester Digital Music Archive') {
        setManchester(true);
      }

    } 
  });

  const closeCard = () => {
    setCardOpen(false); 
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
      <div className={classes.titleBlock} style={{backgroundColor: colorBackground}}>
        <div className={classes.titleContainer}>
          <h1 style={{color: colorIsDark ? 'white' : 'black'}}>{cardContent.title}</h1>
          <p className={classes.categoryResult} style={{color: colorIsDark ? 'white' : 'black', borderColor: colorIsDark ? 'white' : '#474747'}}>
            <span style={{borderColor: colorIsDark ? 'white' : '#474747'}}>{cardContent.cat}</span>
            {fromSectionClip ? null
            : <span style={{borderColor: colorIsDark ? 'white' : '#474747'}}>Related to {cardContent.input}</span>
            }
          </p>
          <p className={classes.cardShareButton} style={{borderColor: colorIsDark ? 'white' : '#474747'}}>
            <span><button className={classes.shareButton} style={{color: colorIsDark ? 'white' : 'black'}}>Share</button></span>
          </p>
        </div>
        <div>
          <button className={classes.exitButton} onClick={()=> closeCard()} style={{color: colorIsDark ? 'white' : 'black', borderColor: colorIsDark ? 'white' : '#474747'}}>Back ⇢</button>
        </div>
      </div>
      {isManchester ?
      <div className={classes.contentBlock}>
      <TextBlockFake key={'textblock-fake01'} width={"small"} title={"Description"}></TextBlockFake>
      <RelationBlockFake key={'relationblock-fake01'} width={"small"} title={"Collected resources"}></RelationBlockFake>
      <RelationBlockFake key={'relationblock-fake01'} width={"small"} title={"Bands"}></RelationBlockFake>
      <LinkBlockFake key={'linkblock-fake01'} width={"small"} title={"Useful Links"} links={"one"}></LinkBlockFake>
      <VisualBlockFake key={'visualblock-fake01'} width={"medium"} title={"Photograph"}></VisualBlockFake>
      <TextBlockFake key={'textblock-fake01'} width={"small"} title={""}></TextBlockFake>
      
      </div>
       : 
      <div className={classes.contentBlock}>
      {Object.values(currentBlock).map((block, i) => {
        if (block.type === 'text') {
        return <TextBlock key={'textblock-' + i} width={block.size} title={block.title}></TextBlock>} 

        else if (block.type === 'relation')
        { return <RelationBlock key={'relationblock-' + i} width={block.size} title={block.title}></RelationBlock>}

        else if (block.type === 'link')
        { return <LinkBlock key={'linkblock-' + i} width={block.size} title={block.title} links={block.content}></LinkBlock>}

        else if (block.type === 'visual')
        { return <VisualBlock key={'visualblock-' + i} width={block.size} title={block.title}></VisualBlock>}

        else if (block.type === 'none')
        { return <WarningBlock key={'warningblock-' + i} width={'large'}></WarningBlock>}
        return null
      })}
      </div>
      }
    </div>
  );
}


export default Card;