import React, { useEffect } from "react";
import CategoriesNav from "../components/feed/CategoriesNav";
import Clips from "../components/feed/Clips";
import Sections from "../components/feed/Sections.js";
import classes from "./Feed.module.css";
import VisibilitySensor from "react-visibility-sensor";
import backgroundVid from '../assets/video/A-01.mp4';
import MainTitle from "../components/feed/MainTitle";
import FeedFooter from "../components/layout/FeedFooter";


function FeedPage(props) {


  function onChange(isVisible) {
    if (isVisible) {
      document.getElementById("mainHeader").style.backgroundColor = "transparent";
      document.getElementById("categoriesNav").style.backgroundColor = "transparent";
    }
  }

  useEffect(() => {
    props.func('Portal');
  });

  useEffect(() => {
    const urlHash = window.location.hash;
    if (urlHash.length) {
      const element = document.getElementById(urlHash.substring(1));
      if (element) {
        element.scrollIntoView();
        window.history.replaceState("", document.title, window.location.pathname);
      }
    }
  });

  return (
    <div className={classes.feedContainer + ' ' + classes.parallax}>
      <VisibilitySensor onChange={onChange}>
        <div className={classes.visibilityHook} id='topHook'>X</div>
      </VisibilitySensor>

      <div className={classes.carouselContainer + ' ' + classes.parallax__layer + ' ' + classes.parallax__layer__back}>
        <video className='videoTag' autoPlay loop muted>
          <source src={backgroundVid} type='video/mp4' />
        </video>
        <MainTitle />
      </div>
      <div className={classes.mainContainer + ' ' + classes.parallax__layer + ' ' + classes.parallax__layer__base}>
        <CategoriesNav />
        <Clips />
        <Sections />
        <FeedFooter></FeedFooter>
      </div>
    </div>
  );

}

export default FeedPage;
