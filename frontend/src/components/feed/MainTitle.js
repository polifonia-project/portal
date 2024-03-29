import React, { useContext } from "react";
import classes from "./MainTitle.module.css";
import { ThemeContext } from "../../context/ThemeContext";


const MainTitle = () => {

  const { soundOn, setSoundOn } = useContext(ThemeContext);

  const handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ block: "center", behavior: 'smooth' });
    };
    if (!soundOn) { setSoundOn(true) }
  };

  return (
    <div className={classes.mainTitleContainer}>
      <h3>Play the sound <br></br>of Heritage</h3> {/* MUSIC, HISTORY, ... */}
      <button onClick={() => handleClickScroll('introduction-Polifonia')}></button>
    </div>

  );
};

export default MainTitle;
