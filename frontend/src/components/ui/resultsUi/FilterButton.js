import React from "react";
import classes from "./FilterButton.module.css";
import { useEffect } from "react";
import { useState } from "react";

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
  });

return (
    <button onClick={handleClick} className={classes.buttonFilter + ' ' + classes[toggle ? 'buttonChecked' : null] + ' ' + classes[props.resetClass]}>
    {props.children}
    </button>
)

}

export default FilterButton;

// onClick={() => setToggle(!toggle)} 