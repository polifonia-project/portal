import React from "react";
import { useEffect } from "react";
import Carousel from "../components/feed/Carousel.js";
import CategoriesNav from "../components/feed/CategoriesNav";
import Clips from "../components/feed/Clips";
import Sections from "../components/feed/Sections.js";
import classes from "./Feed.module.css";
import VisibilitySensor from "react-visibility-sensor";


function FeedPage(props) {


function onChange(isVisible) {
  if (isVisible) {
    document.getElementById("mainHeader").style.backgroundColor = "#f4edec";
    document.getElementById("mainHeader").style.borderWidth = "0px  0px 3px 0px";
    document.getElementById("mainHeader").style.borderImageWidth = "0px  0px 3px 0px";
    document.getElementById("categoriesNav").style.backgroundColor = "transparent";
  }
}

  useEffect(() => {
    props.func('Portal');
  });

  return (
    <div className={classes.feedContainer + ' ' + classes.parallax }>
      <VisibilitySensor onChange={onChange}>
          <div className={classes.visibilityHook} id='topHook'>X</div>
        </VisibilitySensor>
      <div className={classes.carouselContainer + ' ' + classes.parallax__layer + ' ' + classes.parallax__layer__back}>
      <Carousel />
      </div>
      <div className={classes.mainContainer + ' ' + classes.parallax__layer + ' ' + classes.parallax__layer__base}> 
        <CategoriesNav />
        <Clips />
        <Sections />
      </div>
    </div>
  );
}

export default FeedPage;
