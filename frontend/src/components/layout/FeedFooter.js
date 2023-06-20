import React from "react";
import classes from "./FeedFooter.module.css";
import VisibilitySensor from "react-visibility-sensor";
import logoPolifonia from "../../assets/svg/logo-polifonia-whitecopia.svg"
import logoHorizon from "../../assets/svg/logo-eu-white-caption.svg"

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
        <div className={classes.footerTitle}>
            <img src={logoPolifonia} alt='polifonia logo'></img>
        </div>
        <div className={classes.flexBox}>
         <div className={classes.flexZero}>
            <p><img src={logoHorizon} alt='horizon logo'></img></p>
            <p>This project has received funding from the European Union’s Horizon 2020 research<br></br> and innovation programme under grant agreement N. 101004746</p>
         </div>
          <div className={classes.flexOne}>
            <p className={classes.flexTitle}>Contact</p>
            <br></br>
            <p>Official website</p>
            <p>Github</p>
            <p>Linkedin</p>
            <p>Twitter</p>
          </div>
          <div className={classes.flexTwo}>
            <p className={classes.flexTitle}>Site Map</p>
            <br></br>
            <p>Feed</p>
            <p>Data stories</p>
            <p>Corpus</p>
            <p>Sonar</p>
            <p>About</p>
          </div>
          <div className={classes.flexThree}>
            <p className={classes.flexTitle}>People</p>
            <br></br>
            <p>Team</p>
            <p>Partners</p>
            <p>Stakeholders</p>
          </div>
          <div className={classes.flexFour}>
            <p className={classes.flexTitle}>Privacy</p>
            <br></br>
            <p>Cookies</p>
            <p>Terms</p>
          </div>
        </div>
        <div className={classes.footerCloser}>
        <p>Polifonia H2020 is licensed under a Creative Commons Attribution 4.0 International License</p>
        </div>
      </div>
    </div>
  );
}


export default FeedFooter;