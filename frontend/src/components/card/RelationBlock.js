import React from "react";
import classes from "./RelationBlock.module.css";
import { useState, useEffect } from "react";


function RelationBlock(props) {

  const [numericWidth, setNumericWidth] = useState(25);
  const [isLoaded, setIsLoaded] = useState(true);
  const [relList, setRelList] = useState([])
  const [chunkedList, setchunkedList] = useState([])

  useEffect(() => {
  // loading
    if (props.content === undefined) {
      setIsLoaded(false);
    } else {
      setIsLoaded(true);
      setRelList(props.content);
      console.log(props.content);
      
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



  useEffect(() => { // compontentDidUpdate

  // limit 10 results per column
   if (relList.length > 10) {
    const chunkSize = 10;
    for (let i = 0; i < relList.length; i += chunkSize) {
    const chunk = relList.slice(i, i + chunkSize);
    setchunkedList(prevState => [...prevState, chunk])
    }
   } else if (relList.length === 0) { 
    setchunkedList([]);
   } else {
    setchunkedList([relList]);
   }
  }, [isLoaded]);
  

  return (
    isLoaded ? <>
      {chunkedList.map(function(list, idx) {
       return (
       <div key={'rel-'+idx} className={classes.cardBlockContainer} style={{width: 'calc(' + numericWidth + '% - 25px)'}}>
       <div className={classes.relationBlock}>
        {(()=> { if (idx === 0) { return <p className={classes.blockTitle}><span>{props.title}</span></p>} else {return <p className={classes.blockTitleHidden}><span>{props.title}</span></p>}})()}
        
        <div className={classes.cardBlockBox}>
        {list.map(function(data) {
          return ( <> 
                   {(()=> { if (data.name) { return <p key={data.link} className={classes.relationLi}><a href={"http://localhost:3000/card?title=" + data.name + "&cat="+ props.category +"&uri=" + data.link} target="_blank" rel="noopener noreferrer">————&nbsp;&nbsp; {data.name}</a></p>}
                                       else { return <p className={classes.sourceTag}>Source: {props.datasets[data.dataset].name} </p> }} )()}    
                  </>)
         })}  
        </div>
      </div>
      </div>)
      })}  
    </>: null
  );
}


export default RelationBlock;