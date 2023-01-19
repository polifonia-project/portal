import React from "react";
import { useEffect } from "react";
import Carousel from "../components/feed/Carousel.js";
import CategoriesNav from "../components/feed/CategoriesNav";
import Clips from "../components/feed/Clips";
import Sections from "../components/feed/Sections.js";
import classes from "./Feed.module.css";
import MainContainer from "../components/feed/MainContainer.js";


function FeedPage(props) {

  useEffect(() => {
    props.func('Portal');
  });

  return (
    <div className={classes.feedContainer}>
      <div className={classes.carouselContainer}>
      <Carousel />
      </div>
      <MainContainer>
        <CategoriesNav />
        <Clips />
        <Sections />
      </MainContainer>
    </div>
  );
}

export default FeedPage;
