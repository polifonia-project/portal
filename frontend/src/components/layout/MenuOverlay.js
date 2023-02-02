import React from "react";
import { Link } from "react-router-dom";
import classes from "./MenuOverlay.module.css";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import menuicon from "../../assets/svg/compactlogo.svg";

function MenuOverlay(props) {

  const { setTheme } = useContext(ThemeContext);

  function onChange(isVisible) {
    if (isVisible) {
      setTheme('default');
      document.getElementById("mainHeader").style.backgroundColor = "#f4edec";
      document.getElementById("mainHeader").style.borderWidth = "0px  0px 3px 0px";
      document.getElementById("mainHeader").style.borderImageWidth = "0px  0px 3px 0px";
      document.getElementById("categoriesNav").style.backgroundColor = "transparent";
      document.getElementById("mainLogo").style.filter= 'none';
      document.getElementById("sectionName").style.color = 'black';
      document.getElementById("menuOptions").style.filter = 'none';
    }
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuImage}>
        <img alt='menuicon' src={menuicon} className={classes.menuIcon}></img>
      </div>
      <div className={classes.menuContainer}>
      <nav>
        <ul className={classes.menulist}>
          <li>
            <Link onClick={props.toggleMenu } to="/">Homepage</Link>
          </li>
          <li>
            <Link onClick={() => { props.toggleMenu(); onChange('isVisible'); }} to="/datastories">Data Stories</Link>
          </li>
          <li>
            <Link onClick={() => { props.toggleMenu(); onChange('isVisible'); }} to="/about">Sonar application</Link>
          </li>
          <li>
            <Link onClick={() => { props.toggleMenu(); onChange('isVisible'); }} to="/about">Corpus</Link>
          </li>
          <li>
            <Link onClick={props.toggleMenu} to="/about">About Polifonia</Link>
          </li>
        </ul>
      </nav>
      </div>
    </div>
  );
}


export default MenuOverlay;