import React from "react";
import classes from "./Clip.module.css";
import VisibilitySensor from 'react-visibility-sensor';
import isDarkColor from 'is-dark-color';
import { ThemeContext } from "../../../context/ThemeContext";
import { useContext, useState, useEffect } from "react";
import InfoBox from "./InfoBox";
import C3 from "../../../assets/audio/C3.mp3";
import C4 from "../../../assets/audio/C4.mp3";
import C5 from "../../../assets/audio/C5.mp3";
import C6 from "../../../assets/audio/C6.mp3";
import E3 from "../../../assets/audio/E3.mp3";
import E4 from "../../../assets/audio/E4.mp3";
import E5 from "../../../assets/audio/E5.mp3";
import E6 from "../../../assets/audio/E6.mp3";


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
    const { soundOn } = useContext(ThemeContext);
    

    const musiclibrary = { 
      "cat_01": C3,
      "cat_02": C4,
      "cat_03": C5,
      "cat_04": C6,
      "cat_05": E3,
      "cat_06": E4,
      "cat_07": E5,
      "cat_08": E6,} ;

    const musicnote  = new Audio(musiclibrary[props.category]);

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
                };
                if (soundOn === true) {
                  musicnote.muted = false;
                  musicnote.play();
                } else {
                  musicnote.muted = true;
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

