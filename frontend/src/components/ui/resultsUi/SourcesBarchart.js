import React from "react";
import classes from "./SourcesBarchart.module.css";
import { useState } from "react";

function SourcesBarchart() {

  const a = { 
    'musow': 50,
    'wikidata': 60,
    'choco': 80,
    'sound and vision': 90,
    'polifonia': 40,
  }

  const [isShown, setIsShown] = useState(false);
  const [caption, setCaption] = useState('');
  const [textValue, setValue] = useState('');
  const [isFiltered, setFiltered] = useState(false);
  const handleHover = (key, value) => {
    if (isFiltered === false) {
      setIsShown(true);
      setCaption(key);
      setValue(value);
    }
  }

  const handleClick= (e, key, value) => {
      if( e.target.parentElement.id === 'barchartBox') {
        let ul = e.target.parentElement;
        let childern = ul.childNodes;
          childern.forEach(li => {
          li.style.backgroundColor = 'transparent';
        });
        e.target.style.backgroundColor = '#cccaca';
      } else {
        let box = e.target.parentElement;
        let ul = box.parentElement;
        let childern = ul.childNodes;
          childern.forEach(li => {
          li.style.backgroundColor = 'transparent';
        });
        e.target.parentElement.style.backgroundColor = '#cccaca';
      }
      setFiltered(true);
      setCaption(key);
      setValue(value);
  }

  const handleReset = () => {
    setFiltered(false);
  }

  return (
    <div className={classes.barchartContainer}>
      <div className={classes.barchartFilter} onClick={() => handleReset()}><div  className={ isFiltered ? classes.filterChecked : classes.filterUnchecked} style={{display: isFiltered ? 'flex' : isShown ? 'flex' : 'none'}}>Data source: {caption} ({textValue}%) <span style={{display: isFiltered ? 'flex' : 'none'}}><span className={classes.removeFilter}>+</span></span></div></div>
      <div className={classes.barchartVisual}>
      <div className={classes.barchartBox} id={'barchartBox'}>
        {Object.entries(a).map(([key,value])=> (
            <div id={'source' + key} className={classes.barLine} 
              onMouseEnter={() => handleHover(key, value)}
              onMouseLeave={() => setIsShown(false)}
              onClick={(e) => handleClick(e, key, value)}
            >
            <span className={classes.barLineRight} style={{height: value + '%'}}/>
            <span className={classes.barLineLeft} style={{height: value + '%'}}/>
            </div>
        ))}
      </div> 
      </div>
  </div>
  );
}

export default SourcesBarchart;
