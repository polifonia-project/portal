import React from "react";
import { useState, useEffect } from "react";
import classes from "./Carousel.module.css";
import ItemsCarousel from "react-items-carousel";


const Carousel = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [content, setContent] = useState([]);
  const chevronWidth = 90;

  useEffect(() => {
    fetch("/conf_info")
      .then(response => response.json())
      .then(data => setContent(data.carousel))
  }, [])

  return (
    <div className={classes.carouselContainer}>
      <div className={classes.carousel} >
        <ItemsCarousel
          requestToChangeActive={setActiveItemIndex}
          activeItemIndex={activeItemIndex}
          numberOfCards={3}
          gutter={20}
          slidesToScroll={2}
          leftChevron={<button className={classes.leftChevron}>{" "}</button>}
          rightChevron={<button className={classes.rightChevron}>{" "}</button>}

          chevronWidth={chevronWidth}
        >
          {Object.values(content).map((card, i) => (
            <div key={'carousel-card' + i} className={classes.carousel_card + ' ' + classes[card.dimension]} ><h3>{card.title}</h3><p>{card.paragraph}</p></div>
          ))}
        </ItemsCarousel>
      </div>
    </div>

  );
};

export default Carousel;
