import React, { useEffect, useState } from "react";
import classes from "./WarningBlock.module.css";

function WarningBlock(props) {

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
  }, [props.width]);

  return (
    <div className={classes.cardBlockContainer} style={{ width: 'calc(' + numericWidth + '% - 25px)' }}>
      <div className={classes.blockTitle}>
        <span className={classes.alertIcon}>!</span>
        <p className={classes.alertTitle}>Warning</p>
      </div>
      <div className={classes.cardBlockBox}>
        <p className={classes.blockParagraph}>No card has been configured for this category. <br></br>Please update the card configuration file</p>

      </div>
    </div>
  );
}


export default WarningBlock;