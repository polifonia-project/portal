import React from "react";
import classes from "./Intro.module.css";
import VisibilitySensor from "react-visibility-sensor";

function Intro() {

  function onChange(isVisible) {
    if (isVisible) {
      document.getElementById("mainHeader").style.backgroundColor = "#e2e2e2";
      document.getElementById("categoriesNav").style.backgroundColor = "#e2e2e2";
      document.getElementById("mainLogo").style.filter= 'none';
      document.getElementById("sectionName").style.color = 'black';
      document.getElementById("menuOptions").style.filter = 'none';
    }
  }

  const handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ block: "start", behavior: 'smooth' });
    };
  };

  return (
    <div className={classes.feedIntro} id="introduction-Polifonia">
      <VisibilitySensor onChange={onChange}>
        <div className={classes.visibilityHook}>X</div>
      </VisibilitySensor>
      <div className={classes.introContainer}>
        <h3>Polifonia</h3>
        <p>Polifonia Portal is the official access point to all the resources and data of the Polifonia project. The preservation, management, and study of the European musical heritage pursued by the project has produced a vast collection of  music related content that is now ready to be explored.</p>
        <p>From the soundscape of Italian historical bells, to the influence of French operas on traditional Dutch music, European cultural heritage hides a goldmine of unknown encounters, influences and practices that can transport us to experience the past, understand the music we love, and imagine the soundtrack of our future.</p>
        <button className={classes.introButton} onClick={() => handleClickScroll('clips_container')}>How does it work?</button>
        </div>
    </div>
  );
}

export default Intro;
