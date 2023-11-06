import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/svg/PolifoniaLogo.svg";
import soundon from "../../assets/svg/SoundOn.svg";
import soundoff from "../../assets/svg/SoundOff.svg";
import hamburger from "../../assets/svg/HamburgerIcon.svg";
import backToTop from "../../assets/svg/backToTopp.svg";
import backToClip from "../../assets/svg/backToClip.svg";
import closemenu from "../../assets/svg/CloseMenu.svg";
import classes from "./MainNavigation.module.css";
import MenuOverlay from "./MenuOverlay.js";
import { ThemeContext } from "../../context/ThemeContext";
import { CardContext } from "../../context/CardContext";

function MainNavigation(props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [shownOverlay, setOverlayStatus] = useState(false)
  const { theme } = useContext(ThemeContext);
  const { currentSection } = useContext(ThemeContext);
  const { soundOn, setSoundOn } = useContext(ThemeContext);
  const { backToTopOn, setbackToTopOn } = useContext(ThemeContext);
  const { cardOpen } = useContext(CardContext);


  const toggleMenu = () => {
    setMenuOpen(prev => !prev)
    setOverlayStatus(true)
  }

  const toggleSound = () => {
    setSoundOn(prev => !prev)
  }

  const toggleBackTop = () => {
    setbackToTopOn(prev => !prev);
    handleBackScroll("topHook");
    document.getElementById("backToTop").style.opacity = '0';
    document.getElementById("backToClip").style.opacity = '0';

    setTimeout(() => {
      document.getElementById("backToTop").style.opacity = '1';
      document.getElementById("backToClip").style.opacity = '1';
    }, 3000);

  }


  const toggleBackClip = () => {
    handleBackScroll("clipbox-" + currentSection);
    document.getElementById("backToClip").style.opacity = '0';
    setTimeout(() => {
      document.getElementById("backToClip").style.opacity = '1';
    }, 3000);

  }

  const handleBackScroll = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  if (menuOpen) {
    document.body.style.overflow = "hidden";
    document.getElementById("mainLogo").style.filter = 'none';
    document.getElementById("sectionName").style.color = 'black';
    document.getElementById("menuOptions").style.filter = 'none';
  } else {
    document.body.style.overflow = "scroll";
    if (shownOverlay) {
      if (theme === 'dark') { 
        document.getElementById("mainLogo").style.filter = 'brightness(0) invert(1)';
        document.getElementById("menuOptions").style.filter = 'brightness(0) invert(1)'; 
        document.getElementById("sectionName").style.color = 'white';
      }
    }
  }

  const styleBackHome = () => {
    if (cardOpen) {
    document.body.style.overflow = "hidden";
    document.getElementById("mainLogo").style.filter = 'none';
    document.getElementById("sectionName").style.color = 'black';
    document.getElementById("menuOptions").style.filter = 'none';}
  }

  return (
    <header className={classes.header} id='mainHeader' >
      <span className={classes.title} id='title-logo'>
        <Link onClick={() => { styleBackHome() }} to="/portal/" ><img className={classes.logo} src={logo} alt="Logo" id='mainLogo' /></Link>
        <div className={classes.section} id='sectionName'><span>{props.sectionName}</span></div>
      </span>
      <span className={classes.menu} id='menuOptions' >
        <img onClick={toggleBackClip} id='backToClip' className={classes.backToClip} src={backToClip} alt="Back to top Toggle" title="back to highlight" style={{ display: backToTopOn ? cardOpen ? 'none' : 'block' : 'none' }} />
        <img onClick={toggleBackTop} id='backToTop' className={classes.backToTop} src={backToTop} alt="Back to top Toggle" title="back to top" style={{ display: backToTopOn ? cardOpen ? 'none' : 'block' : 'none' }} />
        <img onClick={toggleSound} className={classes.sound} src={soundOn ? soundon : soundoff} title={soundOn ? "turn sound off" : "turn sound on"} alt="Sound Toggle" />
        <img onClick={toggleMenu} className={classes.hamburger} src={menuOpen ? closemenu : hamburger} title="menu" alt="Hamburger Menu" />
      </span>
      {menuOpen ? <MenuOverlay toggleMenu={toggleMenu} /> : null}
    </header>

  );
}

export default MainNavigation;
