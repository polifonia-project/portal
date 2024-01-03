import React, { useState, useEffect, useCallback } from "react";
import classes from "./ResultLine.module.css";
import expandIcon from "../../../assets/svg/expand.svg";
import expandIconWhite from "../../../assets/svg/expandWhite.svg";
import isDarkColor from "is-dark-color";
import { Link } from "react-router-dom";

function ResultLine(props) {
  const [isHover, setIsHover] = useState(false);
  const [datasetOn, setDatasetOn] = useState(false);
  const [category] = useState(props.cat);
  const [catCode, setCatCode] = useState(props.cat);
  const [isDark, setIsDark] = useState(false);
  const [encodedUrl, setEncodedUrl] = useState(false);
  const [inputUrl, setInputUrl] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const setCategoriesCode = useCallback(() => {
    const cat = category;
    Object.values(props.catCodes).forEach((ct) => {
      if (ct["name"] === cat) {
        setCatCode(ct["id"]);
      }
    });
  }, [category, props.catCodes]);

  useEffect(() => {
    if (props.dataset === props.currentDataset) {
      setDatasetOn(true);
    } else {
      setDatasetOn(false);
    }

    if (isDarkColor(props.color)) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
    // set result link to card 
    const params ="title=" + props.label + "&cat=" + props.cat + "&input=" + props.input_value + "&hasinput=false&uri=" + props.uri;
    const encodedParams = encodeURI(params);
    const encodedUrl = "card?" + encodedParams;
    setEncodedUrl(encodedUrl);

    // set result link to card 
    const para ="title=" + props.input_value + "&cat=" + props.input_category + "&input= no input &hasinput=true&uri=" + props.input_uri;
    const encodedPara = encodeURI(para);
    const encodedInputUrl = "card?" + encodedPara;
    setInputUrl(encodedInputUrl);

  }, [ props.dataset, props.currentDataset, props.color, props.cat, props.label, props.uri, props.input_category, props.input_uri, props.input_value]);

  useEffect(() => {
    setCategoriesCode();
  }, [setCategoriesCode]);

  const handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  return (
    <div
      className={classes.resultLine}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: props.datasetOn
          ? datasetOn
            ? "#ebe5e4"
            : "#f4edec"
          : null,
        borderTop: props.datasetOn
          ? datasetOn
            ? "0.5px solid #f4edec"
            : "0.5px solid #e8e3e3"
          : null,
        borderBottom: props.datasetOn
          ? datasetOn
            ? "0.5px solid #f4edec"
            : "0.5px solid #e8e3e3"
          : null,
      }}
    >
      <div className={classes.resultNum}>{props.number}</div>
      <div className={classes.scrollResult}>
        <div className={classes.resultCat}>
          <span
            style={{
              borderRadius: isHover ? "50px" : "50px",
              backgroundColor: isHover ? props.color : "transparent",
              borderColor: isHover ? props.color : "black",
              color: isHover ? (isDark ? "white" : "black") : "black",
            }}
            className={classes.categoryResult}
            onClick={() => handleClickScroll("section-" + catCode)}
          >
            {props.cat}
          </span>
        </div>
        <div
          className={classes.resultLabel}
          style={{ textDecoration: isHover ? "underline" : "" }}
        >
          <Link to={encodedUrl} target="_blank" rel="noopener noreferrer">
            <b>{props.label}</b>
          </Link>
        </div>
        <div
          className={classes.resultRel}
          style={{
            flexDirection: props.isdirect ? "row-reverse" : "row",
            justifyContent: props.isdirect ? "flex-end" : "flex-start",
          }}
        >
            <span
              style={{
                backgroundColor: isHover ? props.color : "transparent",
                borderColor: isHover ? props.color : "black",
                cursor: "pointer",
                color: isHover ? (isDark ? "white" : "black") : "black",
              }}
              className={classes.inputResult}
            >
              <Link to={inputUrl} target="_blank" rel="noopener noreferrer">
              {props.input_value}
              </Link>
            </span>
          
          <span>&nbsp;&nbsp;————&nbsp;&nbsp;</span>
          <span className={classes.listOfRelations}>{props.rel}</span>
          <span>&nbsp;&nbsp;————&nbsp;&nbsp;</span>
          <Link to={encodedUrl} target="_blank" rel="noopener noreferrer">
            <span
              style={{
                textDecoration: isHover ? "underline" : "",
                cursor: "pointer",
              }}
            >
              {props.label}
            </span>
          </Link>
        </div>
      </div>
      <div className={classes.resultActions}>
        <Link to={encodedUrl} target="_blank" rel="noopener noreferrer">
          <button
            style={{
              backgroundColor: isHover ? props.color : "transparent",
              border: isHover ? "transparent" : "0.5px solid black",
              backgroundImage: isHover
                ? `url(${expandIconWhite})`
                : `url(${expandIcon})`,
              transform: isHover ? "scale(1.3)" : "scale(1)",
            }}
          ></button>
        </Link>
      </div>
    </div>
  );
}

export default ResultLine;

/*
MULTI RELATION RESULT
<div className={classes.resultRel} style={{flexDirection: isDirect ? 'row-reverse' : 'row', justifyContent:  isDirect ? 'flex-end' : 'flex-start',}}><span>{props.input_value}</span><span>&nbsp;&nbsp;————&nbsp;&nbsp;</span><span className={classes.listOfRelations}>{props.rel}  &nbsp;/&nbsp; {props.rel}  &nbsp;/&nbsp; {props.rel}</span><span>&nbsp;&nbsp;————&nbsp;&nbsp;</span><span>{props.label}</span></div>
*/
