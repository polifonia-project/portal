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

  return (
    <div className={classes.feedIntro}>
      <VisibilitySensor onChange={onChange}>
        <div className={classes.visibilityHook}>X</div>
      </VisibilitySensor>
      <div className={classes.introContainer}>
        <h3>The Portal</h3>
        <p>Polifonia Portal is the official access point to all the resources and data coming from the Polifonia ecosystem. The preservation, management and study of musical heritage pursued by the project has led to the collection of thousands of music related information, that are now ready to be explored.</p>
        <p>From the soundscape of Italian historical bells, to the influence of French operas on traditional Dutch music, European cultural heritage hides a goldmine of unknown encounters, influences and practices that can transport us to experience the past, understand the music we love, and imagine the soundtrack of our future.</p>
        <button className={classes.introButton}>Scroll and play</button>
        </div>
    </div>
  );
}

export default Intro;
