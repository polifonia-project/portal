import React from "react";
import classes from "./Footer.module.css";
import VisibilitySensor from "react-visibility-sensor";

function Footer(props) {

  function onChange(isVisible) {
    if (isVisible) {
      document.getElementById("mainHeader").style.backgroundColor = "#f4edec";
      document.getElementById("categoriesNav").style.backgroundColor = "#f4edec";
      document.getElementById("mainLogo").style.filter= 'none';
      document.getElementById("sectionName").style.color = 'black';
      document.getElementById("menuOptions").style.filter = 'none';
      document.getElementById("categoriesNav").style.transform = "translateY(-100px)";
      document.getElementById("mainHeader").style.transform = "translateY(-100px)";
    } else {
      document.getElementById("categoriesNav").style.transform = "translateY(0px)";
      document.getElementById("mainHeader").style.transform = "translateY(0px)";
    }
  }

  return (
    <div className={classes.footerContainer}> 
      <VisibilitySensor onChange={onChange}>
        <div className={classes.visibilityHook}>X</div>
      </VisibilitySensor>
      <div className={classes.footerBottomContainer}>
      </div>
    </div>
  );
}


export default Footer;