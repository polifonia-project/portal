import React from "react";
import { useState } from "react";
import classes from "./CarouselCard.module.css";
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
    else if (props.type === 'internal') {
      // style header
      document.getElementById("mainHeader").style.backgroundColor = "#f4edec";
      document.getElementById("categoriesNav").style.backgroundColor = "transparent";
      document.getElementById("mainLogo").style.filter= 'none';
      document.getElementById("sectionName").style.color = 'black';
      document.getElementById("menuOptions").style.filter = 'none';
    }
  };

  return (
    <Link onClick={() => handleClick()} to={pageTo}>
    <div key={'carousel-card' + props.index} id={'carousel-card' + props.index} className={classes.carousel_card}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            >
                <h4 className={classes.cardtitle}>{props.claim} ⬎</h4>
                <p className={classes.cardclaim} style={{display: isHovered ? 'none': 'inline'}}>{props.title}</p>
                <span style={{display: isHovered ? 'inline': 'none'}}>
                 <p className={classes.cardexpand}> {props.par}</p>
                </span>
    </div>
    </Link>
  );
};

export default CarouselCard;
