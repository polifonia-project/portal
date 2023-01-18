import React from "react";
import { useState } from "react";
import classes from "./Carousel.module.css";

import ItemsCarousel from "react-items-carousel";

function Carousel() {
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const chevronWidth = 90;
    return (
    <div className={classes.carouselContainer}>
        <div className={classes.carousel} >
        <ItemsCarousel
          requestToChangeActive={setActiveItemIndex}
          activeItemIndex={activeItemIndex}
          numberOfCards={2}
          gutter={20}
          slidesToScroll={1}
          leftChevron={<button>{"<"}</button>}
          rightChevron={<button>{">"}</button>}
          
          chevronWidth={chevronWidth}
        >
          <div className={classes.carousel_card} style={{ marginLeft: 60, marginRight: -30}}><h3>Music Knowledge<br/> is now connected!</h3><p>Discovere unexpected connections with data stories and contents for music experts</p></div>
          <div className={classes.carousel_card} style={{ marginRight: 80}}><h3>Interact with <br/>MUSIC</h3><p>Everyone can play with the infinite music connections of the Polifonia Project.</p></div>
          <div className={classes.carousel_card} style={{ marginLeft: 80, marginRight: 80}}><h3>Discover the CORPUS</h3><p>Discovere unexpected connections with data stories and contents for music experts</p></div>
          <div className={classes.carousel_card} style={{ marginLeft: 80, marginRight: 80}}><h3>Play with DATA</h3><p>Discovere unexpected connections with data stories and contents for music experts</p></div>
        </ItemsCarousel>
      </div>
    </div>
     
    );
  };

export default Carousel;
