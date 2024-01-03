import React, { useEffect } from "react";
import classes from "./NotFoundPage.module.css";
import Footer from "../components/layout/Footer";
import VisibilitySensor from "react-visibility-sensor";
import { Link } from "react-router-dom";

function NotFoundPage(props) {

  useEffect(() => {
    props.func('');
  });
  function onChange(isVisible) {
    if (isVisible) {
      document.getElementById("mainHeader").style.backgroundColor = "transparent";
      document.getElementById("mainLogo").style.filter = 'none';
      document.getElementById("sectionName").style.color = 'black';
      document.getElementById("menuOptions").style.filter = 'none';
      document.getElementById("mainHeader").style.transform = "translateY(0px)";
      document.getElementById("backToClip").style.display = "none";
      document.getElementById("backToTop").style.display = "none";
    }
  }

  return (
    <div div className={classes.TermsPageContainer}>
      <VisibilitySensor onChange={onChange}>
        <div className={classes.visibilityHook}>X</div>
      </VisibilitySensor>
      <div className={classes.introContainer}>
      </div>
      <div className={classes.bodyContainer}>
        <div className={classes.blockTitle}>
        <span className={classes.alertIcon}>!</span>
        <p className={classes.alertTitle}>Oops, You've Strayed off Key!</p>
        </div>
        <div className={classes.cardBlockBox}>
        <p className={classes.blockParagraph}>We're sorry, but it seems you've hit a sour note and wandered into uncharted territory on the Polifonia portal. 
                                             <br/> The page you were looking for may have been harmoniously misplaced, or it could be taking a well-deserved break.</p>
                                             <br/><br/><br/><p className={classes.blockParagraph}>Fear not! Let's get you back in tune: <br></br>Go back to the <Link className={classes.backLink} to="/portal/">Homepage</Link></p>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default NotFoundPage;