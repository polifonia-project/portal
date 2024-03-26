import React, { useState, useEffect } from "react";
import classes from "./ExpandButton.module.css";
import expandIcon from '../../../assets/svg/expand.svg';
import { Link } from "react-router-dom";

function ExpandButton(props) {
  const [encodedUrl, setEncodedUrl] = useState(false);

  useEffect(() => {
    // set result link to card 
    const params = "title=" + props.label + "&cat=" + props.cat + "&input= no input &hasinput=true&uri=" + props.uri;
    const encodedParams = encodeURI(params);
    const encodedUrl = "card?" + encodedParams;
    setEncodedUrl(encodedUrl);
  }, [props.label, props.cat, props.uri]);

  const handleClick = () => {
    // Perform your fetch operation here
    fetch('/portal/reconciliation?uri=' + encodeURIComponent(props.uri))
      .then(response => response.json())
      .then(data => {
        let dataLen = data.results.bindings.length;

        if (dataLen > 0) {
          let sameUriArray = (data.results.bindings).map(val => val.same_uri.value);
          const newUri = sameUriArray[0]
          const params = "title=" + props.label + "&cat=" + props.cat + "&input= no input &hasinput=true&uri=" + newUri;
          const encodedParams = encodeURI(params);
          const newEncodedUrl = "card?" + encodedParams;
          setEncodedUrl(newEncodedUrl);
          // Open the new encoded URL in a new tab
          window.open(newEncodedUrl, '_blank');

        }

      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <Link to="#" onClick={handleClick} className={classes.expandLink}>
      <button
        className={classes.expandButton}
        style={{ backgroundImage: `url(${expandIcon})` }}
        onMouseEnter={props.mouseEnter}
        onMouseLeave={props.mouseLeave}
      >
      </button>
    </Link>
  );
}

export default ExpandButton;