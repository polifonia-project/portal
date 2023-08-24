import React from "react";
import classes from "./MediaBlock.module.css";
import { useState, useEffect } from "react";
import ItemsCarousel from "react-items-carousel";


function MediaBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);
  const [isLoaded, setIsLoaded] = useState(true)
  const [isImage, setIsImage] = useState(false)
  const [isVideo, setIsVideo] = useState(false)
  const [isAudio, setIsAudio] = useState(false)
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const [mediaList, setMediaList] = useState([])


  useEffect(() => {
  // loading
  if (props.content === undefined) {
    setIsLoaded(false)
  } else {
    setIsLoaded(true)
    setMediaList(props.content);
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
      <ItemsCarousel numberOfCards={1} gutter={30}
      requestToChangeActive={setActiveItemIndex}
      activeItemIndex={activeItemIndex}
        leftChevron={<button className={classes.cardChevronLeft}>{'<'}</button>}
        rightChevron={<button className={classes.cardChevronRight}>{'>'}</button>}
        outsideChevron={true}
        chevronWidth={40}
      >
      {mediaList.map(function(content) { return ( 
        <div className={classes.mockVis} key={content}>
          {isImage ? <img src={content} alt="new"/>  : null}
          {isVideo ? <video src={content} controls /> : null}
          {isAudio ? <audio src={content} controls /> : null}
          <p className={classes.sourceTag}>Source: Wikidata</p>
        </div>
      )})}
      </ItemsCarousel>
      </div>
    </div> : null
  
  );
}


export default MediaBlock;