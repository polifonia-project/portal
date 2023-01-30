import React from "react";
import { useState, useContext } from "react";
import classes from "./Carousel.module.css";
import { ThemeContext } from "../../context/ThemeContext";
import ItemsCarousel from "react-items-carousel";


function Carousel() {
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const chevronWidth = 90;
    const { soundOn, setSoundOn } = useContext(ThemeContext);

    const handleClickScroll = (id) => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ block: "nearest", behavior: 'smooth' });
      };
      if (!soundOn) { setSoundOn(true)}
    };

    return (
    <div className={classes.carouselContainer}>
        <div className={classes.carousel} >
        <ItemsCarousel
          requestToChangeActive={setActiveItemIndex}
          activeItemIndex={activeItemIndex}
          numberOfCards={2}
          gutter={20}
          slidesToScroll={2}
          leftChevron={<button className={classes.leftChevron}>{" "}</button>}
          rightChevron={<button className={classes.rightChevron}>{" "}</button>}
          
          chevronWidth={chevronWidth}
        >
          <div className={classes.carousel_card + ' ' +  classes.small_card} id={classes.card0} onClick={() => handleClickScroll('clips_container')}><h3>Interact with <br/>MUSIC</h3><p><span className={classes.highlight}>Everyone</span> can play with the infinite music connections of the Polifonia Project.</p><button></button></div>
          <div className={classes.carousel_card + ' ' + classes.long_card} id={classes.card1}><h3>Music Knowledge<br/> is now connected!</h3><p>Discover unexpected connections <br/> with data stories and contents for <span className={classes.highlight}>music experts</span></p></div>
          <div className={classes.carousel_card + ' ' +  classes.small_card} ><h3>Discover the CORPUS</h3><p>Discovere unexpected connections with data stories and contents for music experts</p></div>
          <div className={classes.carousel_card + ' ' +  classes.long_card} ><h3>Play with DATA</h3><p>Discover unexpected connections with data stories and contents for music experts</p></div>
          <div className={classes.carousel_card + ' ' +  classes.small_card} ><h3>Play with DATA</h3><p>Discover unexpected connections with data stories and contents for music experts</p></div>
          <div className={classes.carousel_card + ' ' +  classes.long_card} ><h3>Play with DATA</h3><p>Discover unexpected connections with data stories and contents for music experts</p></div>
          
        </ItemsCarousel>
      </div>
    </div>
     
    );
  };

export default Carousel;
