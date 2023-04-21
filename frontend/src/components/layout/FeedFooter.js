import React from "react";
import classes from "./FeedFooter.module.css";
import VisibilitySensor from "react-visibility-sensor";
import logoPolifonia from "../../assets/svg/logo-polifonia-whitecopia.svg"
import logoHorizon from "../../assets/svg/logo-eu-white.svg"

function FeedFooter(props) {

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
      <div className={classes.footerMainBlock}>
        <div className={classes.flexBox}>
        <div className={classes.flexOne}>
            <p><img src={logoPolifonia} alt='polifonia logo'></img></p>
            <p>Polifonia H2020 is licensed under a Creative Commons Attribution 4.0 International License</p>
            <p><img src={logoHorizon} alt='horizon logo'></img></p>
            <p>This project has received funding from the European Union’s Horizon 2020 research<br></br> and innovation programme under grant agreement N. 101004746</p>
          </div>
          <div className={classes.flexOne}>
            <p className={classes.flexTitle}>CONTACT</p>
            <br></br>
            <p>OFFICIAL WEBSITE</p>
            <p>GITHUB</p>
            <p>LINKEDIN</p>
            <p>TWITTER</p>
          </div>
          <div className={classes.flexTwo}>
            <p className={classes.flexTitle}>SITE MAP</p>
            <br></br>
            <p>FEED</p>
            <p>DATA STORIES</p>
            <p>CORPUS</p>
            <p>SONAR</p>
            <p>ABOUT</p>
          </div>
          <div className={classes.flexThree}>
            <p className={classes.flexTitle}>PEOPLE</p>
            <br></br>
            <p>TEAM</p>
            <p>PARTNERS</p>
            <p>STAKEHOLDERS</p>
          </div>
          <div className={classes.flexFour}>
            <p className={classes.flexTitle}>PRIVACY</p>
            <p>COOKIES</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default FeedFooter;