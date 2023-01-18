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
    <section>
      <div className={classes.carouselContainer}>
      <Carousel />
      </div>
      <div className={classes.mainContainer}>
      <CategoriesNav />
      <Clips />
      <Sections />
      </div>
    </section>
  );
}

export default FeedPage;
