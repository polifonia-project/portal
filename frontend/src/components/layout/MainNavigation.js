import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/svg/PolifoniaLogo.svg";
import soundon from "../../assets/svg/SoundOn.svg";
import soundoff from "../../assets/svg/SoundOff.svg";
import hamburger from "../../assets/svg/HamburgerIcon.svg";
import closemenu from "../../assets/svg/CloseMenu.svg";
import classes from "./MainNavigation.module.css";
import MenuOverlay from "./MenuOverlay.js";

function MainNavigation(props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(prev => !prev)
  }

  const toggleSound = () => {
    setSoundOn(prev => !prev)
  }


  menuOpen ? document.body.style.overflow = "hidden" : document.body.style.overflow = "scroll"

  return (
    <header className={classes.header} id='mainHeader'>
      <span className={classes.title}>
        <Link to="/"><img className={classes.logo} src={logo} alt="Logo"/></Link>
        <div className={classes.section}><span>{props.sectionName}</span></div>
      </span>
      <span  className={classes.menu}>
        <img onClick={toggleSound} className={classes.sound} src={soundOn ? soundoff : soundon} alt="Sound Toggle" />
        <img onClick={toggleMenu} className={classes.hamburger} src={menuOpen ? closemenu : hamburger} alt="Hamburger Menu" />
      </span>
      {menuOpen ? <MenuOverlay toggleMenu={toggleMenu}/> : null}
    </header>
    
  );
}

export default MainNavigation;
