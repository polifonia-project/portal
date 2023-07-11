import React, { useEffect } from "react";
import classes from "./TextBlock.module.css";
import { useState } from "react";


function TextBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);
  const [isPhoto, setPhoto] = useState(false);

  useEffect(() => {
    var current_width = props.width;
  if (current_width === 'small') {
    setNumericWidth(25);
  } else if (current_width === 'medium') {
    setNumericWidth(50);
  } else if (current_width === 'large') {
    setNumericWidth(100);
  } else {
    setNumericWidth(25);
  }
  if (props.title === "") {
    setPhoto(true)
  }
  });

  return (
    <div className={classes.cardBlockContainer} style={{width: 'calc(' + numericWidth + '% - 25px)'}}>
      <p className={classes.blockTitle}><span>{props.title}</span></p>
      <div className={classes.cardBlockBox}>
      {isPhoto ? 
       <span>
       <p>Joy Division <br/><br/>(1980) <br/><br/>
       Peter Hook, Stephen Morris, Ian Curtis, Bernard Sumner<br/><br/>
       This was originally owned by Peter Hook of Joy Division and New Order, and this photograph was taken when he auctioned off his Joy Division archive at Omega Auctions in Newton Le Willows in March 2019. Three Anton Corbijn photographs used as props by Corbijn in his Joy Division 'Atmosphere' video.
       </p>
       <a target="_blank" rel="noopener noreferrer" href="https://www.mdmarchive.co.uk/artefact/20453/JOY_DIVISION_PETER_HOOK_STEPHEN_MORRIS_IAN_CURTIS_BERNARD_SUMNER_PHOTOGRAPH_1980"><button className={classes.linkButton}>Source</button></a>
       </span>
      :
      <p className={classes.blockParagraph}>Manchester Digital Music Archive is an online community archive established in 2003 to celebrate Greater Manchester music and its social history. Its crowd-sourced archive and website is a place for people all over the world to share Manchester music ephemera and memories, be they fans, musicians or involved with the music industry itself.<br/><br/>  The project believes that through crowd-sourcing artefacts they can democratise heritage and provide a platform for multiple versions of history to be shared. There is no hierarchy of 'merit' within the archive. The general public decides what is important and what is 'heritage'. As of 2020 the site has in excess of 3600 members who have uploaded material relating to more than 3680 bands.</p>
     }
      {props.children}
    </div>
    </div>
  );
}


export default TextBlock;