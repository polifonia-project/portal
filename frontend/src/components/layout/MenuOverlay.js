import React from "react";
import { Link } from "react-router-dom";
import classes from "./MenuOverlay.module.css";

function MenuOverlay(props) {
  return (
    <div className={classes.menu}>
      <nav>
        <ul className={classes.menulist}>
          <li>
            <Link onClick={props.toggleMenu} to="/">Homepage</Link>
          </li>
          <li>
            <Link onClick={props.toggleMenu} to="/datastories">Data Stories</Link>
          </li>
          <li>
            <Link onClick={props.toggleMenu} to="/about">Sonar application</Link>
          </li>
          <li>
            <Link onClick={props.toggleMenu} to="/about">Corpus</Link>
          </li>
          <li>
            <Link onClick={props.toggleMenu} to="/about">About Polifonia</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}


export default MenuOverlay;