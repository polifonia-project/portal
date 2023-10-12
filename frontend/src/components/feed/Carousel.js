import React, { useState, useEffect } from "react";
import classes from "./Carousel.module.css";
import ItemsCarousel from "react-items-carousel";
import CarouselCard from "./CarouselCard";


const Carousel = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [content, setContent] = useState([]);
  const chevronWidth = 90;

  useEffect(() => {
    fetch("/conf_info")
      .then(response => response.json())
      .then(data => setContent(data.carousel))

    var els = document.getElementsByClassName("gwZiig");
    Array.prototype.forEach.call(els, function (el) {
      el.style.overflow = "visible";
    });

  }, [])

  return (
    <div className={classes.carouselContainer}>
      <div className={classes.carousel} >
        <ItemsCarousel
          requestToChangeActive={setActiveItemIndex}
          activeItemIndex={activeItemIndex}
          numberOfCards={4}
          gutter={30}
          slidesToScroll={3}
          outsideChevron={true}
          showSlither={true}
          leftChevron={<div className={classes.leftChevronContainer}><button className={classes.leftChevron}>{" "}</button></div>}
          rightChevron={<div className={classes.rightChevronContainer}><button className={classes.rightChevron}>{" "}</button></div>}
          className={classes.carousel}
          chevronWidth={chevronWidth}
        >
          {Object.values(content).map((card, i) => (
            <CarouselCard key={'card-car-' + i} index={i} title={card.title} claim={card.claim} par={card.paragraph} url={card.href} type={card.type} logo={card.logo}></CarouselCard>
          ))}
        </ItemsCarousel>
      </div>
    </div>

  );
};

export default Carousel;
