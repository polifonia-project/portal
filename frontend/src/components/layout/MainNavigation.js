import React, { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/svg/PolifoniaLogo.svg";
import soundon from "../../assets/svg/SoundOn.svg";
import soundoff from "../../assets/svg/SoundOff.svg";
import hamburger from "../../assets/svg/HamburgerIcon.svg";
import closemenu from "../../assets/svg/CloseMenu.svg";
import classes from "./MainNavigation.module.css";
import MenuOverlay from "./MenuOverlay.js";
import Card from "../card/Card";
import { ThemeContext } from "../../context/ThemeContext";

function MainNavigation(props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [shownOverlay, setOverlayStatus] = useState(false)
  const { theme } = useContext(ThemeContext);
  const { soundOn, setSoundOn } = useContext(ThemeContext);

  const toggleMenu = () => {
      setMenuOpen(prev => !prev)
      setOverlayStatus(true)
    }

  const toggleSound = () => {
    setSoundOn(prev => !prev)
  }

  if (menuOpen) {
    document.body.style.overflow = "hidden";
    document.getElementById("menuOptions").style.filter= 'none';
  } else {
    document.body.style.overflow = "scroll";
    if (shownOverlay) {
      if (theme === 'dark') {document.getElementById("menuOptions").style.filter= 'brightness(0) invert(1)';}
    }
  }

  return (
    <header className={classes.header} id='mainHeader' >
      <span className={classes.title}>
        <Link to="/"><img className={classes.logo} src={logo} alt="Logo" id='mainLogo'/></Link>
        <div className={classes.section} id='sectionName'><span>{props.sectionName}</span></div>
      </span>
      <span  className={classes.menu} id='menuOptions' >
        <img onClick={toggleSound} className={classes.sound} src={soundOn ? soundon : soundoff} alt="Sound Toggle" />
        <img onClick={toggleMenu} className={classes.hamburger} src={menuOpen ? closemenu : hamburger} alt="Hamburger Menu" />
      </span>
      {menuOpen ? <MenuOverlay toggleMenu={toggleMenu}/> : null}
      <Card></Card>
    </header>
    
  );
}

export default MainNavigation;
