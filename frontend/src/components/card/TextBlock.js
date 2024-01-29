import React, { useEffect, useState } from "react";
import classes from "./TextBlock.module.css";
import ItemsCarousel from "react-items-carousel";


function TextBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);
  const [isLoaded, setIsLoaded] = useState(true)
  const [textList, setTextList] = useState([])
  const [singleResult, setSingleResult] = useState(true);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  useEffect(() => {

    // loading
    if (props.content === undefined) {
      setIsLoaded(false)
    } else if (Object.keys(props.content).length === 0) {
      setIsLoaded(false)
    } else {
      setIsLoaded(true)
      setTextList(props.content);
      console.log(props.content)
    }

    // single-result

    if (textList.length === 1) {
      setSingleResult(false)
    } else {
      setSingleResult(true)
    }


    // width
    var current_width = props.width;
    if (props.screen === 4 ){
      if (current_width === 'small') { 
        if (hasLongDescription(props.content)) {setNumericWidth(50)} else {setNumericWidth(25);} }
      else if (current_width === 'medium') {setNumericWidth(50);} 
      else if (current_width === 'large') {setNumericWidth(100);} 
      else {setNumericWidth(100);}
    } else if (props.screen === 3 ) {
      if (current_width === 'small') { setNumericWidth(50);} 
      else if (current_width === 'medium') {setNumericWidth(100);} 
      else if (current_width === 'large') {setNumericWidth(100);} 
      else {setNumericWidth(100);}
    } else if (props.screen === 2 ) {
      if (current_width === 'small') { setNumericWidth(100);} 
      else if (current_width === 'medium') {setNumericWidth(100);} 
      else if (current_width === 'large') {setNumericWidth(100);} 
      else {setNumericWidth(100);}
    } else {
      if (current_width === 'small') { setNumericWidth(100);} 
      else if (current_width === 'medium') {setNumericWidth(100);} 
      else if (current_width === 'large') {setNumericWidth(100);} 
      else {setNumericWidth(100);}
    }
  }, [props.content, props.width, textList.length, props.screen]);

  function hasLongDescription(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const item = obj[key];
            if (item.desc && item.desc.length > 600) {
                return true;
            }
        }
    }
    return false;
}

  return (
    isLoaded ?
      <div className={classes.cardBlockContainer} style={{ width: 'calc(' + numericWidth + '% - 25px)' }}>
        <p className={classes.blockTitle}><span>{props.title}</span></p>
        <div className={classes.cardBlockBox}>
          <ItemsCarousel numberOfCards={1} gutter={30}
            requestToChangeActive={setActiveItemIndex}
            activeItemIndex={activeItemIndex}
            leftChevron={<button className={classes.leftChevron}>{" "}</button>}
            rightChevron={<button className={classes.rightChevron}>{" "}</button>}
            outsideChevron={true}
            chevronWidth={40}
          >
            {textList.map(function (content, indx) {
              return (
                <div className={classes.textResult} key={content.desc}>
                  <p className={classes.blockParagraph}>{content.desc}</p>
                  <p className={classes.sourceTag}>Source: {props.datasets[content.dataset].name}</p>
                  {singleResult ? <p className={classes.sourceTag}> {indx + 1}/{textList.length}</p> : null}
                </div>
              )
            })}
          </ItemsCarousel>
        </div>
      </div> : null
  );
}


export default TextBlock;