import React from "react";
import { useState } from "react";
import classes from "./Carousel.module.css";


const CarouselCard = (props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div key={'carousel-card' + props.index} id={'carousel-card' + props.index} className={classes.carousel_card}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
                <h4 className={classes.cardtitle}>{props.claim}</h4>
                <p className={classes.cardclaim}>{props.title}</p>
                <p className={classes.cardexpand} style={{display: isHovered ? 'inline': 'none'}}>{props.par}</p>
    </div>
  );
};

export default CarouselCard;
