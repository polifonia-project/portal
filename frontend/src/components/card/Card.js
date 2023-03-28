import React from "react";
import classes from "./Card.module.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import CardBlock from "./CardBlock";

function Card(props) {

  const { cardOpen, setCardOpen } = useContext(ThemeContext);
  const { cardContent } = useContext(ThemeContext);

  return (
    <div className={classes.cardContainer} style={{transform: cardOpen? 'translateX(0)' : 'translateX(-100%)'}}>
      <div className={classes.titleBlock} style={{backgroundColor: cardContent.color}}>
        <div className={classes.titleContainer}>
          <h1>{cardContent.title}</h1>
          <p className={classes.categoryResult}>
            <span>{cardContent.cat}</span>
            <span>Related to Wolfgang Amadeus Mozart</span>
            <span><button>Share</button></span>
            <span><button>Source</button></span>
          </p>
        </div>
        <div>
          <button className={classes.exitButton} onClick={()=> setCardOpen(false)}>Return ⇢</button>
        </div>
      </div>
      <div className={classes.contentBlock}>
        <CardBlock width={20}></CardBlock>
        <CardBlock width={25}></CardBlock>
        <CardBlock width={40}></CardBlock>
      </div>
    </div>
  );
}


export default Card;