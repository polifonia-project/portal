import React from "react";
import { useState, useContext, useEffect } from "react";
import classes from "./Carousel.module.css";
import { ThemeContext } from "../../context/ThemeContext";
import ItemsCarousel from "react-items-carousel";


const Carousel = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [content, setContent] = useState([]);
  const chevronWidth = 90;
  const { soundOn, setSoundOn } = useContext(ThemeContext);

  useEffect(() => {
    fetch("/conf_info")
      .then(response => response.json())
      .then(data => setContent(data.carousel))
  }, [])

  const handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ block: "nearest", behavior: 'smooth' });
    };
    if (!soundOn) { setSoundOn(true) }
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
          <div className={classes.carousel_card + ' ' + classes.small} id={classes.card0} onClick={() => handleClickScroll('clips_container')}><h3>Interact with <br />MUSIC</h3><p><span className={classes.highlight}>Everyone</span> can play with the infinite music connections of the Polifonia Project.</p><button></button></div>
          <div className={classes.carousel_card + ' ' + classes.long} id={classes.card1}><h3>Music Knowledge<br /> is now connected!</h3><p>Discover unexpected connections <br /> with data stories and contents for <span className={classes.highlight}>music experts</span></p></div>
          {Object.values(content).map((card, i) => (
            <div key={'carousel-card' + i} className={classes.carousel_card + ' ' + classes[card.dimension]} ><h3>{card.title}</h3><p>{card.paragraph}</p></div>
          ))}
        </ItemsCarousel>
      </div>
    </div>

  );
};

export default Carousel;
