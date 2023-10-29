import React, { useContext } from "react";
import { Link } from "react-router-dom";
import classes from "./MenuOverlay.module.css";
import { ThemeContext } from "../../context/ThemeContext";
import menuicon from "../../assets/png/logomenu.png";
import { CardContext } from "../../context/CardContext";

function MenuOverlay(props) {

  const { setTheme } = useContext(ThemeContext);
  const { setCardOpen } = useContext(CardContext);

  function onChange(isVisible) {
    if (isVisible) {
      setTheme('default');
      document.getElementById("mainHeader").style.backgroundColor = "green !important";
      document.getElementById("categoriesNav").style.backgroundColor = "transparent";
      document.getElementById("mainLogo").style.filter = 'none';
      document.getElementById("sectionName").style.color = 'black';
      document.getElementById("menuOptions").style.filter = 'none';
    }
  }

  function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
      window.history.replaceState("", document.title, window.location.pathname);
    }
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuContainer}>
        <nav>
              <Link style={{ cursor: 'pointer' }} className={classes.menuLink} onClick={() => { props.toggleMenu(); setCardOpen(false) }} to="/portal/">Homepage</Link>
                 <Link style={{ cursor: 'pointer' }} className={classes.catLink} onClick={() => { props.toggleMenu(); setCardOpen(false); scrollToSection("section-cat_01") }} to="/portal/#section-cat_01">Genres</Link>
                 <Link style={{ cursor: 'pointer' }} className={classes.catLink} onClick={() => { props.toggleMenu(); setCardOpen(false); scrollToSection("section-cat_02") }} to="/portal/#section-cat_02">Artists</Link>
                 <Link style={{ cursor: 'pointer' }} className={classes.catLink} onClick={() => { props.toggleMenu(); setCardOpen(false); scrollToSection("section-cat_03")  }} to="/portal/#section-cat_03">Music</Link>
                 <Link style={{ cursor: 'pointer' }} className={classes.catLink} onClick={() => { props.toggleMenu(); setCardOpen(false); scrollToSection("section-cat_04")  }} to="/portal/#section-cat_04">Places</Link>
                 <Link style={{ cursor: 'pointer' }} className={classes.catLink} onClick={() => { props.toggleMenu(); setCardOpen(false); scrollToSection("section-cat_05")  }} to="/portal/#section-cat_05">Instruments</Link>
              <Link style={{ cursor: 'pointer' }} className={classes.menuLink} onClick={() => { props.toggleMenu(); onChange('isVisible'); }} to="/portal/about">About</Link>
              <Link style={{ cursor: 'pointer' }} className={classes.menuLink} onClick={() => { props.toggleMenu(); onChange('isVisible'); }} to="/portal/terms">Terms</Link>
              <Link style={{ cursor: 'pointer' }} className={classes.menuLink} onClick={() => { props.toggleMenu(); onChange('isVisible'); }} to="/portal/cookies">Cookies</Link>
              <Link style={{ cursor: 'pointer' }} className={classes.menuLink} onClick={() => { props.toggleMenu(); onChange('isVisible'); }} to="/portal/outputs">Outputs</Link>
              
        </nav>
      </div>
      <div className={classes.menuImage}>
        <img alt='menuicon' src={menuicon} className={classes.menuIcon}></img>
      </div>
    </div>
  );
}


export default MenuOverlay;