import React, { useEffect, useState } from "react";
import classes from "./FilterButton.module.css";

function FilterButton(props) {

  const [toggle, setToggle] = useState(false)

  const handleClick = (e) => {
    props.buttonClick(e);
    setToggle(!toggle);
  }


  useEffect(() => {
    if (props.selectedOn === false) {
      setToggle(false);
    }
  }, [props.selectedOn]);

  return (
    <button disabled={!props.isDisabled} onClick={handleClick} className={classes.buttonFilter + ' ' + classes[toggle ? 'buttonChecked' : null] + ' ' + classes[props.resetClass]}>
      {props.children}
    </button>
  )

}

export default FilterButton;

// onClick={() => setToggle(!toggle)} 