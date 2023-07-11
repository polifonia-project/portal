import React from "react";
import classes from "./LinkBlock.module.css";
import { useState, useEffect } from "react";


function LinkBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);

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
  });

  const links = [{
    "linktype" : "static",
    "label" : "musoW",
    "url" : "https://projects.dharc.unibo.it/musow/view-1639035224-1500654"
    },
    {
    "linktype" : "static",
    "label" : "Website",
    "url" : "https://www.mdmarchive.co.uk/"
    },
    {
      "linktype" : "static",
      "label" : "Joy Division",
      "url" : " https://www.mdmarchive.co.uk/tag/570/Joy_Division"
      },
      {
      "linktype" : "static",
      "label" : "Mixcloud",
      "url" : "https://www.mixcloud.com/MDMarchive/"
      }
    ]

  const socials = [{
      "linktype" : "static",
      "label" : "Twitter",
      "url" : " https://twitter.com/MDMArchive"
      },
      {
      "linktype" : "static",
      "label" : "Facebook",
      "url" : "https://www.facebook.com/mdmarchive"
      },
      {
        "linktype" : "static",
        "label" : "You Tube",
        "url" : "https://www.youtube.com/channel/UCSrIsCmWajrdlz_GeXODFLA"
        },
        {
        "linktype" : "static",
        "label" : "Instagram",
        "url" : "https://www.instagram.com/mdmarchive/"
        }
      ]

  return (
    <div className={classes.cardBlockContainer} style={{width: 'calc(' + numericWidth + '% - 25px)'}}>
      <p className={classes.blockTitle}><span>{props.title}</span></p>
      <div className={classes.cardBlockBox}>
      <p className={classes.blockParagraph}>Find out more about the Manchester Digital Music Archive Trust and other related resources</p>
      <div className={classes.linksContainer}>
        {links.map(function(link, i){
          return  <a href={link.url} key={'link-' + i} target="_blank" rel="noopener noreferrer"><button className={classes.linkButton}>{link.label}</button></a>
        })}
      </div>
      <br></br>
      <p className={classes.blockParagraph}>Socials</p>
      <div className={classes.linksContainer}>
        {socials.map(function(link, i){
          return  <a href={link.url} key={'link-' + i} target="_blank" rel="noopener noreferrer"><button className={classes.linkButton}>{link.label}</button></a>
        })}
      </div>

    </div>
    </div>
  );
}


export default LinkBlock;