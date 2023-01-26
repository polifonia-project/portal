import React from "react";
import { useEffect } from "react";
import Carousel from "../components/feed/Carousel.js";
import CategoriesNav from "../components/feed/CategoriesNav";
import Clips from "../components/feed/Clips";
import Sections from "../components/feed/Sections.js";
import classes from "./Feed.module.css";


function FeedPage(props) {

  useEffect(() => {
    props.func('Portal');
  });

  return (
    <div className={classes.feedContainer + ' ' + classes.parallax }>
      <span id='topHook'></span>
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
