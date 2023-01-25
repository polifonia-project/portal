import React from "react";
import classes from "./Clip.module.css";
import VisibilitySensor from 'react-visibility-sensor';
import isDarkColor from 'is-dark-color';
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";

function Clip(props) {

    const handleClickScroll = (section) => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ block: "nearest", behavior: 'smooth' });
        }
      };

    const { setTheme } = useContext(ThemeContext);

    function onChange (isVisible) {
        if (isVisible) {
                document.getElementById("mainHeader").style.backgroundColor = props.color;
                document.getElementById("mainHeader").style.borderImageWidth = '0px  0px 0px 0px';
                document.getElementById("categoriesNav").style.backgroundColor = props.color;
                if (isDarkColor(props.color)) {
                  setTheme('dark');
                  document.getElementById("mainLogo").style.filter= 'brightness(0) invert(1)';
                  document.getElementById("sectionName").style.color = 'white';
                  document.getElementById("menuOptions").style.filter = 'brightness(0) invert(1)';
                } else {
                  setTheme('default');
                  document.getElementById("mainLogo").style.filter= 'none';
                  document.getElementById("sectionName").style.color = 'black';
                  document.getElementById("menuOptions").style.filter = 'none';
                }
        } 
            
      };

    return (
        

        <div className={classes.clipContainer +' '+ classes[props.section]}> 
        <VisibilitySensor onChange={onChange}>     
            <div className={classes.clip}>
                <span className={classes.dot} style={{ backgroundColor: props.color}}></span>
                <p>{props.title}</p>
                <button onClick={() => handleClickScroll(props.section)}>More +</button>
                <span className={classes.end_dot} style={{ backgroundColor: props.color}}></span>
            </div>
        </VisibilitySensor>
        </div>

        
    )
}

export default Clip;

