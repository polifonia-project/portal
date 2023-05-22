import React from "react";
import classes from "./SectionIntro.module.css";
import VisibilitySensor from "react-visibility-sensor";

function SectionIntro() {
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
        <h3>Start your own search with your subjetcs of interest</h3>
        <p>Search among thousands of music resources and enhance the understanding of European Cultural Heritage by using our new search feature. Choose your favourite category, type a word and start looking for connections. You will combine the utility of an advanced search tool with the browsing experience of an archive interface of music related resources. Search, filter and expand your knowledge. </p>
        <button className={classes.introButton}>Start now</button>
      </div>
    </div>
  );
}

export default SectionIntro;
