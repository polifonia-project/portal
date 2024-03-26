import React, { useEffect, useState } from "react";
import classes from "./WarningBlockNoData.module.css";

function WarningBlockNoData(props) {

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
        <p className={classes.alertTitle}>Notice</p>
      </div>
      <div className={classes.cardBlockBox}>
        <p className={classes.blockParagraph}>We're sorry, but there are no data available at the moment for this entity. <br></br>Please check back later for updated information.</p>

      </div>
    </div>
  );
}


export default WarningBlockNoData;