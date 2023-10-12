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

  return (
    <div className={classes.menu}>
      <div className={classes.menuImage}>
        <img alt='menuicon' src={menuicon} className={classes.menuIcon}></img>
      </div>
      <div className={classes.menuContainer}>
        <nav>
          <ul className={classes.menulist}>
            <li>
              <Link onClick={() => { props.toggleMenu(); setCardOpen(false) }} to="/">Homepage</Link>
            </li>
            <li>
              <Link onClick={() => { props.toggleMenu(); onChange('isVisible'); }} to="/about">About</Link>
            </li>
            <li>
              <Link onClick={() => { props.toggleMenu(); onChange('isVisible'); }} to="/outputs">Outputs</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}


export default MenuOverlay;