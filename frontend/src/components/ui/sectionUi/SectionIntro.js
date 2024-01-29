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

  const handleClickScroll = () => {
    // Get all sections
    const sections = document.querySelectorAll("[id^='section-cat_']");

    // Get current scroll position
    const currentScrollPosition = window.pageYOffset;

    // Find the first section below the current scroll position
    const nextSection = Array.from(sections).find(section => {
        const sectionTop = section.getBoundingClientRect().top + currentScrollPosition;
        return sectionTop > currentScrollPosition;
    });

    // Scroll to the next section if it exists
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
};

  return (
    <div className={classes.feedIntro} id="section-intro-search">
      <VisibilitySensor onChange={onChange}>
        <div className={classes.visibilityHook}>X</div>
      </VisibilitySensor>
      <div className={classes.introContainer}>
        <h3>Search for what you care the most</h3>
        <p>Search among music resources and discover the gems of the European Cultural Heritage by using our search & filter feature. Choose your starting point (e.g. a person), type a word and start looking for connections. You will combine the utility of an advanced search tool with the browsing experience of an archive interface of music related resources. So, it’s time to search, filter and expand your knowledge. </p>
        <button className={classes.introButton} onClick={handleClickScroll}>Start now</button>
      </div>
    </div>
  );
}

export default SectionIntro;
