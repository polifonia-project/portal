import React from "react";
import classes from "./SectionIntro.module.css";
import VisibilitySensor from "react-visibility-sensor";

function SectionIntro() {
  function onChange(isVisible) {
    if (isVisible) {
      document.getElementById("mainHeader").style.backgroundColor = "#e2e2e2";
      document.getElementById("categoriesNav").style.backgroundColor = "#e2e2e2";
    }
  }

  return (
    <div className={classes.feedIntro}>
      <VisibilitySensor onChange={onChange}>
        <div className={classes.visibilityHook}>X</div>
      </VisibilitySensor>
      <div className={classes.introContainer}>
        <h3>Start your own search with your subjetcs of interest</h3>
        <p>Sed vitae eros auctor ipsum facilisis pharetra id pretium lacus. Nulla lobortis eu eros ac sagittis. Donec in velit eu risus blandit rhoncus vel sed justo. Praesent consectetur, erat et aliquet lobortis, erat nisi vestibulum massa, vel tempus lacus enim at lectus. Donec blandit magna molestie ullamcorper molestie. Proin eu augue turpis. Quisque tincidunt hendrerit purus, vitae cursus est egestas at. Quisque pretium nulla id diam euismod ultrices. Morbi non bibendum metus. Pellentesque ultrices ex a purus fringilla dignissim.</p>
      </div>
    </div>
  );
}

export default SectionIntro;
