import React, {useState} from "react";
import classes from "./SourcesBarchart.module.css";

function SourcesBarchart(props) {

  const [isShown, setIsShown] = useState(false);
  const [caption, setCaption] = useState('');
  const [textValue, setValue] = useState('');
  const [isFiltered, setFiltered] = useState(false);
  const [resultData] = useState({});


  // Function to calculate the percentage of objects with the same value in the "dataset" key
  const calculatePercentage = () => {
    const results = props.results || [];

    // Count the occurrences of each dataset value
    const datasetCounts = results.reduce((acc, result) => {
      const datasetValue = result.dataset;
      acc[datasetValue] = (acc[datasetValue] || 0) + 1;
      return acc;
    }, {});

    // Calculate the total number of objects
    const totalCount = results.length;

    // Calculate the percentage for each dataset value and distribute rounding differences
    const percentageData = {};
    let totalPercentage = 0;
    Object.keys(datasetCounts).forEach((datasetValue) => {
      const count = datasetCounts[datasetValue];
      const rawPercentage = (count / totalCount) * 100;
      const roundedPercentage = Math.round(rawPercentage);
      totalPercentage += roundedPercentage;
      percentageData[datasetValue] = roundedPercentage;
    });

    // Adjust the last item to make the total exactly 100
    const lastKey = Object.keys(percentageData).pop();
    percentageData[lastKey] += 100 - totalPercentage;

    return percentageData;
  };

  // Call the calculatePercentage function
  const percentageData = calculatePercentage();


  const handleHover = (key, value) => {
    if (isFiltered === false) {
      setIsShown(true);
      setCaption(key);
      setValue(value);
    }
  }

  const handleClick = (e, key, value) => {
    /* style */
    if (e.target.parentElement.id === 'barchartBox') {
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
    /* filter */
    props.handleDataset(key);
    setFiltered(true);
    setCaption(key);
    setValue(value);
  }

  const handleReset = () => {
    props.resetDataset(false);
    setFiltered(false);
    Object.keys(resultData).forEach(function (key) {
      let li = document.getElementById('source' + props.cat + key);
      li.style.backgroundColor = 'transparent';
    });
  }

  return (
    <div className={classes.barchartContainer}>
      <div className={classes.barchartFilter} onClick={() => handleReset()}><div className={isFiltered ? classes.filterChecked : classes.filterUnchecked} style={{ display: isFiltered ? 'flex' : isShown ? 'flex' : 'none' }}>Data source: {caption} ({textValue}%) <span style={{ display: isFiltered ? 'flex' : 'none' }}><span className={classes.removeFilter}>+</span></span></div></div>
      <div className={classes.barchartBox} id={'barchartBox'}>
        {Object.entries((percentageData)).map(([key, value, i]) => (
          <div id={'source' + props.cat + key} key={'sources-entry--' + value} className={classes.barLine}
            onMouseEnter={() => handleHover(key, value)}
            onMouseLeave={() => setIsShown(false)}
            onClick={(e) => handleClick(e, key, value)}
          >
            <span className={classes.barLineRight} style={{ height: value + '%' }} />
            <span className={classes.barLineLeft} style={{ height: value + '%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SourcesBarchart;
