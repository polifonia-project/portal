import React from "react";
import { useState } from "react";
import classes from "./Carousel.module.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";


const CarouselCard = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pageTo, setPageTo] = useState("/");

  const handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ block: "start", behavior: 'smooth' });
    };
  };

  useEffect(() => {
    if (props.type === 'internal') {
      setPageTo(props.url)
    } else {
      setPageTo("/")
    }
  });

  const handleClick = (e) => {
    if (props.type === 'scroll') {
      handleClickScroll(props.url);
    }
    else if (props.type === 'external') {
      window.open(props.url);
    }
  };

  return (
    <Link onClick={() => handleClick()} to={pageTo}>
    <div key={'carousel-card' + props.index} id={'carousel-card' + props.index} className={classes.carousel_card}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            >
                <h4 className={classes.cardtitle}>{props.claim}</h4>
                <p className={classes.cardclaim}>{props.title}</p>
                <p className={classes.cardexpand} style={{display: isHovered ? 'inline': 'none'}}>{props.par}</p>
    </div>
    </Link>
  );
};

export default CarouselCard;
