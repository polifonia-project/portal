import React from "react";
import classes from "./Card.module.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import closeicon from '../../assets/svg/closecard.svg';

function Card(props) {

  const { cardOpen, setCardOpen } = useContext(ThemeContext);
  const { cardContent } = useContext(ThemeContext);

  return (
    <div className={classes.cardContainer} style={{transform: cardOpen? 'translateX(0)' : 'translateX(-100%)'}}>
      <div className={classes.titleBlock} style={{backgroundColor: cardContent.color}}>
        <h1>{cardContent.title}</h1>
        <button onClick={()=> setCardOpen(false)} style={{backgroundImage: `url(${closeicon})` }}></button>
      </div>
      <div className={classes.firstBlock}>
        <h2>Description</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat, odio at molestie accumsan, ligula tellus tincidunt lacus, eget sollicitudin ex elit vel nisl. Nunc viverra elementum volutpat. Duis volutpat sed sapien iaculis imperdiet. Nam efficitur eu quam at tempor. Sed dignissim ullamcorper nisl, quis mollis neque tincidunt a. Duis vestibulum elementum mi, at luctus risus pulvinar nec.</p><p> Mauris convallis fringilla ligula quis varius. Integer ut fermentum leo. Nunc nec tellus nec ante volutpat varius non consectetur nunc. Nulla nisi tellus, rhoncus placerat metus quis, ultrices blandit odio. Ut rhoncus nunc nec blandit sodales. Praesent neque est, malesuada vel ornare vel, porta et arcu. Pellentesque et aliquam magna, vel ullamcorper eros.</p>
      </div>
      <div className={classes.secondBlock}>
        <div>
        <h2>Relations</h2>
        <ul>
          <li>Name of Person</li>
          <li>Name of Person</li>
          <li>Name of Instrument</li>
          <li>Name of Tune</li>
          <li>Name of Place</li>
        </ul>
      </div>
      <br></br>
      <div>
        <h2>Insights</h2>
        <p>This card is part of bigger story</p>
        <button className={classes.linkButton}>Link</button>
        <button className={classes.linkButton}>Share card</button>
        <button className={classes.linkButton}>Link to another card</button>
        <br></br><br></br>
        <p>Explore more data about this card</p>
        <button className={classes.linkButton}>External link</button>
      </div>

      </div>
      <div className={classes.thirdBlock}>
      <h2>Data visualization</h2>
      <div className={classes.dataVis}></div>
      </div>
    </div>
  );
}


export default Card;