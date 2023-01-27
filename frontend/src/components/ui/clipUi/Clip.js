import React from "react";
import classes from "./Clip.module.css";
import VisibilitySensor from 'react-visibility-sensor';
import isDarkColor from 'is-dark-color';
import { ThemeContext } from "../../../context/ThemeContext";
import { useContext, useState, useEffect } from "react";
import InfoBox from "./InfoBox";

function Clip(props) {

    const [ellipsisActive, setEllipsisActive] = useState(false);
    const [clipIsExpanded, setClipExpanded] = useState(false);

    useEffect(() => {
      const e = document.getElementById('cliptitle' + props.clip_id);
      if (e.offsetWidth < e.scrollWidth) {
        setEllipsisActive(true)
      }
    });


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
                document.getElementById(props.clip_id).style.transform = 'scale(1)';
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
        } else {
                document.getElementById(props.clip_id).style.transform = 'scale(0.8)';
        }
            
      };
    
    return (
        <div className={classes.clipBox}>
          <InfoBox 
          infotitle={props.infotitle} 
          infodescription={props.description} 
          highlights={props.highlights} 
          color={props.color}
          section={props.section}>
          </InfoBox>
          <div className={classes.clipContainer +' '+ classes[props.section]}> 
            <VisibilitySensor onChange={onChange}>  
              <div className={classes.visibilityHook}>X</div>  
            </VisibilitySensor> 
            <div className={classes.clip + ' ' + classes[clipIsExpanded ? 'clipexpanded' : '']} id={props.clip_id}>
                <span className={classes.dot} style={{ backgroundColor: props.color}}></span>
                <p onClick={ellipsisActive ? () => setClipExpanded(prev => !prev) : null} id={'cliptitle' + props.clip_id} className ={clipIsExpanded ?  classes.expandedcliptitle : classes.cliptitle}>{props.title}</p>
                <button onClick={() => handleClickScroll(props.section)}>More +</button>
                <span className={classes.end_dot} style={{ backgroundColor: props.color}}></span>
            </div>
          <p className={ ellipsisActive ? classes.ellipsisalert : classes.hiddenalert} id={'ellipsisalert' + props.clip_id}>Click on text <br/>{clipIsExpanded ? 'to resize' : 'to see all'}</p>
          </div>
        </div>

        
    )
}

export default Clip;

