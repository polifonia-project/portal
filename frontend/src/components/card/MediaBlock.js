import React from "react";
import classes from "./MediaBlock.module.css";
import { useState, useEffect } from "react";


function MediaBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);
  const [isLoaded, setIsLoaded] = useState(true)
  const [isImage, setIsImage] = useState(false)
  const [isVideo, setIsVideo] = useState(false)
  const [isAudio, setIsAudio] = useState(false)
  

  useEffect(() => {
  // loading
  if (props.content === undefined) {
    setIsLoaded(false)
  } else {
    setIsLoaded(true)
  }
  // class 
  if (props.class === "image") {
    setIsImage(true)
  } else if (props.class === "video") {
    setIsVideo(true)
  } else if (props.class === "audio") {
    setIsAudio(true)
  }

  // width
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


  return (
    isLoaded ? 
    <div className={classes.cardBlockContainer} style={{width: 'calc(' + numericWidth + '% - 25px)'}}>
      <p className={classes.blockTitle}><span>{props.title}</span></p>
      <div className={classes.cardBlockBox}>
        <div className={classes.mockVis}>
          {isImage ? <img src={props.content} alt="new"/> : null}
          {isVideo ? <video src="http://commons.wikimedia.org/wiki/Special:FilePath/Couch%20Commander.webm" controls /> : null}
          {isAudio ? <audio src="http://commons.wikimedia.org/wiki/Special:FilePath/JOHN%20MICHEL%20CELLO-BEETHOVEN%20SYMPHONY%207%20Allegretto.ogg" controls /> : null}
        </div>
      </div>
    </div> : null
  
  );
}


export default MediaBlock;