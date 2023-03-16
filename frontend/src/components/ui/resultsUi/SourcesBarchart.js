import React from "react";
import classes from "./SourcesBarchart.module.css";
import { useState } from "react";

function SourcesBarchart() {

  const a = { 
    'musow': 50,
    'wikidata': 30,
    'choco': 100,
    'sound and vision': 90,
    'polifonia': 30,
  }

  const [isShown, setIsShown] = useState(false);
  const [caption, setCaption] = useState('');
  const [textValue, setValue] = useState('');

  return (
    <div className={classes.barchartContainer}>
      <div className={classes.barchartBox}>
        {Object.entries(a).map(([key,value])=> (
            <span className={classes.barLine} 
            onMouseEnter={() => {
              setIsShown(true);
              setCaption(key);
              setValue(value);
            }}
              onMouseLeave={() => setIsShown(false)}
            >
            <span className={classes.barLineRight} style={{height: value + '%'}}/>
            <span className={classes.barLineLeft} style={{height: value + '%'}}/>
            </span>
        ))}
      </div>
      <div className={classes.barchartText} style={{display: isShown ? 'block' : 'none'}}><span className={classes.datasource}>Data source - </span> {caption} ({textValue}%)</div>
    </div>
  );
}

export default SourcesBarchart;
