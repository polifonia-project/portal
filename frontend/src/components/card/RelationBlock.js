import React, { useState, useEffect } from "react";
import classes from "./RelationBlock.module.css";


function RelationBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);
  const [isLoaded, setIsLoaded] = useState(true);
  const [relList, setRelList] = useState([])
  const [visibleNum, setVisibleNum] = useState(36)
  const [canLoad, setCanLoad] = useState(true);
  const [chunkedList, setchunkedList] = useState([])

  useEffect(() => {
    // loading
    if (props.content === undefined) {
      setIsLoaded(false);
    } else if (Object.keys(props.content).length === 0) {
      setIsLoaded(false)
    } else {
      setIsLoaded(true);
      setRelList(props.content);
    }

      // width
      var current_width = props.width;
      if (props.screen === 4 ){
        if (current_width === 'small') { setNumericWidth(25);} 
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
    }, [props.content, props.width, props.screen]);



  useEffect(() => { // compontentDidUpdate

    var visibleTot = []
    
    // limit tot number of content shown
    if (relList.length > visibleNum) {
      visibleTot = relList.slice(0, visibleNum);
      setCanLoad(true)
    } else {
      visibleTot = relList;
      setCanLoad(false)
    }

    // reset lists
    props.reset ? console.log("not resetted") : setchunkedList([]);


    // limit 10 results per column
    if (visibleTot.length > 9) {
      const chunkSize = 9;
      for (let i = 0; i < visibleTot.length; i += chunkSize) {
        const chunk = visibleTot.slice(i, i + chunkSize);
        setchunkedList(prevState => [...prevState, chunk])
      }
    } else if (visibleTot.length === 0) {
      setchunkedList([]);
    } else {
      setchunkedList([visibleTot]);
    }
  }, [isLoaded, relList, props.reset, visibleNum]);


  return (
    isLoaded ? <>
      {chunkedList.map(function (list, idx) {
        var totalElements = chunkedList.length;
        const lastElement = idx +1;
        return (
          <div  className={classes.cardBlockContainer} style={{ width: 'calc(' + numericWidth + '% - 25px)' }}>
            <div className={classes.relationBlock}>
              {(() => { if (idx === 0) { return <p className={classes.blockTitle}><span>{props.title}</span></p> } else { return <p className={classes.blockTitleHidden}><span>{props.title}</span></p> } })()}

              <div className={classes.cardBlockBox}>
                {list.map(function (data,idx) {
                  return (<>
                    {(() => {
                      if (data.name) { return <span className={classes.relationCouple}><p className={classes.relationLi}>———&nbsp;&nbsp;</p><p className={classes.relationLi}><a href={ props.isExternal ? window.location + "card?title=" + data.name + "&cat=" + props.category + "&uri=" + data.link : window.location.origin + window.location.pathname + "?title=" + data.name + "&cat=" + props.category + "&uri=" + data.link} target="_blank" rel="noopener noreferrer">{data.name}</a></p></span> }
                      else { return <p   className={classes.sourceTag}>Source: {props.datasets[data.dataset].name} </p> }
                    })()}
                  </>)
                })}
               {totalElements === lastElement &&( canLoad? <button className= {classes.loadMoreButton} onClick={() => setVisibleNum(visibleNum + 36)}>Load more +</button> : null )}
              </div>
            </div>
          </div>)
      })}
    </> : null
  );
}


export default RelationBlock;