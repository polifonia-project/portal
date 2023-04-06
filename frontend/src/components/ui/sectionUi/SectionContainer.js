import React, { useState, useEffect } from "react";
import classes from "./SectionContainer.module.css";
import ResultsContainer from "../resultsUi/ResultsContainer";
import SectionClip from "./SectionClip";
import { ThemeContext } from "../../../context/ThemeContext";
import { CardContext } from "../../../context/CardContext";
import { useContext } from "react";

function SectionContainer(props) {
    const [selected_uri, setSelected] = useState(props.el_iri);
    const [selected_value, setValue] = useState(props.placeholder);
    const {setColorSet} = useContext(ThemeContext);
    const {setCardBlocks} = useContext(CardContext);

    useEffect(() => {
     let  color = props.color;
     let  catName = props.catName;
     let  altColorSet = props.alt_colors;
     let  cardBlock = props.card_blocks;
     setColorSet(colorSet => { return {...colorSet, [catName]: color}})
     setColorSet(colorSet => {return {...colorSet, ...altColorSet};});
     setCardBlocks(cardBlocks => { return {...cardBlocks, [catName]: cardBlock}});
    }, []);




    return (
        <div id={props.id} className={classes.sectionContainer + " " + classes['background' + props.tot_categories]}>
            <div className={classes.sectionInfoboxContainer + " " + classes[props.id]}>
                <div className={classes.sectionInfobox}>
                    <div className={classes.sectionMarkerLeft} style={{ backgroundColor: props.color }}></div>
                    <div className={classes.sectionText}>
                        <h3 className={classes.sectionTitle}>{props.header}</h3>
                        <p className={classes.sectionDescription}>{props.description}</p>
                    </div>
                    <div className={classes.sectionMarkerRight} style={{ backgroundColor: props.color }}></div>
                </div>
            </div>
            <SectionClip
                key={props.key}
                color={props.color}
                placeholder={props.placeholder}
                category={props.category}
                catName={props.catName}
                el_iri={selected_uri}
                setInputValue={setValue}
                onQuery={setSelected}
            >
            </SectionClip>
            <ResultsContainer
                cat={props.id.split("-")[1]}
                filters={props.filters}
                el_iri={selected_uri}
                datasets={props.datasets}
                color={props.color}
                input_value={selected_value}
            >
            </ResultsContainer>
        </div>
    );
}

export default SectionContainer;