import React, { useEffect, useState } from "react";
import classes from "./Card.module.css";
import { useContext } from "react";
import { CardContext } from "../../context/CardContext";
import isDarkColor from 'is-dark-color';

import TextBlock from "./TextBlock";
import RelationBlock from "./RelationBlock.js";
import MediaBlock from "./MediaBlock";
import LinkBlock from "./LinkBlock";
import WarningBlock from "./WarningBlock";

import ShareModal from "./ShareModal";

function Card(props) {

  const { cardOpen, setCardOpen } = useContext(CardContext);
  const { cardContent } = useContext(CardContext);
  const { cardBlocksNew } = useContext(CardContext);

  const [colorBackground, setColorBackground] = useState('#e2e2e2')
  const [colorIsDark, setColorIsDark] = useState(false)
  const [currentBlock, setCurrentBlock] = useState({})
  const [fromSectionClip, setFromSectionClip] = useState(false)
  const [fromExternalLink, setFromExternalLink] = useState(false)
  const [displayShare, setDisplayShare] = useState(false)
  const [resetOn, setResetOn] = useState(false)

  const [datasets, setDatasets] = useState("")

  // content states
  const [textContent, setTextContent] = useState({"id_1":[], "id_2":[]})
  const [relContent, setRelContent] = useState({"id_3":[], "id_4":[]})
  const [relContentSource, setRelContentSource] = useState({"id_3":[], "id_4":[]})
  const [mediaContent, setMediaContent] = useState({"id_5":[], "id_6":[]})


  useEffect(() => {
    if (cardOpen) {
      //reset 
      setResetOn(false);

      // entryway setting
      setFromSectionClip(cardContent.hasInput);
      setFromExternalLink(cardContent.goesBack);

      // reset content states
      setTextContent({});
      setRelContent({});
      setRelContentSource("");
      setMediaContent({});

      // launch fecth
      fetchResults(cardContent.uri);
      if (cardBlocksNew[cardContent.cat]) {
        setColorBackground(cardBlocksNew[cardContent.cat].color);
        setCurrentBlock(cardBlocksNew[cardContent.cat].blocks);
      } else {
        setColorBackground('#e2e2e2');
        setCurrentBlock({ "01": { "type": "none" }, });
      }

      if (isDarkColor(colorBackground)) {
        setColorIsDark(true);
        setLightHeader();
      } else {
        setColorIsDark(false);
        setDarkHeader();
      }

    }
  }, [cardOpen, cardBlocksNew, cardContent.hasInput, cardContent.goesBack, cardContent.cat, colorBackground]);

 // fetch datasets 
useEffect(() => {
  fetch("/conf_info")
    .then((res) => res.json())
    .then((data) => {
      setDatasets(data.datasets);
    });
}, []);


  // close card
  const closeCard = () => {
    setCardOpen(false);
    setResetOn(false)
    if (isDarkColor([cardContent.color])) {
      setLightHeader();
    } else {
      setDarkHeader();
    }

  }

  const setLightHeader = () => {
    document.getElementById("mainLogo").style.filter = 'brightness(0) invert(1)';
    document.getElementById("sectionName").style.color = 'white';
    document.getElementById("menuOptions").style.filter = 'brightness(0) invert(1)';
    document.getElementById("menuOptions").style.zIndex = '300';
  }

  const setDarkHeader = () => {
    document.getElementById("mainLogo").style.filter = 'none';
    document.getElementById("sectionName").style.color = 'black';
    document.getElementById("menuOptions").style.filter = 'none';
  }

  const encodeShareLink = () => {
    const params = 'title=' + cardContent.title + '&cat=' + cardContent.cat + '&uri=' + cardContent.uri;
    const encodedParams = encodeURI(params);
    const encodedUrl = window.location + 'card?' + encodedParams
    return encodedUrl
  }

  // fetchResults 
  const fetchResults = (uri) => {
    let endpoint = "";
    let query = "";
    let dataset = "";
    

    Object.values(currentBlock).map((block, i) => {
      
      if (block.type === 'text') {
        let textResults = []
        let number = "";
        Object.values(block.content).map((q, i) => {
          query = q.query;
          dataset = q.dataset;
          number = block.id;
          number = number - 1;
          number = 'id_' + number;
          endpoint = datasets[dataset].sparql_endpoint;
          textResults = [];
          return null
        })
        query = query.replaceAll('<>', '<' + uri + '>');
        let url = endpoint + '?query=' + encodeURIComponent(query);
        try {
          fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/sparql-results+json' }
          })
            .then((res) => res.json())
            .then((data) => {
  
              let dataLen = data.results.bindings.length;
              if (dataLen > 0) {
                data.results.bindings.forEach(res => {
                  if (Object.keys(res).length > 0) {
                    let singleResult = []
                    singleResult.desc = res.desc.value;
                    singleResult.dataset = dataset;
                   // let desc = res.desc.value;
                   textResults.push(singleResult); 
                  }
                }
                )
                setTextContent(prev => ({
                  ...prev,
                  [number] : textResults,
                }))
              }
              else {
                // try riconciliation
              }
            });
        }
        catch (err) {
          console.log('error', err)
        }
        return null
      } 
      else if (block.type === 'relation') {
        let relResults = [];
        let relSource = "";
        let number = "";
        Object.values(block.content).map((q, i) => {
          query = q.query;
          dataset = q.dataset;
          number = block.id;
          number = number - 1;
          number = 'id_' + number;
          relResults = [];
          relSource = dataset;
          return null
        })
        query = query.replaceAll('<>', '<' + uri + '>');
        let url = endpoint + '?query=' + encodeURIComponent(query);
        try {
          fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/sparql-results+json' }
          })
            .then((res) => res.json())
            .then((data) => {
  
              let dataLen = data.results.bindings.length;
              if (dataLen > 0) {
                data.results.bindings.forEach(res => {
                  if (Object.keys(res).length > 0) {
                    let singleResult = []
                    singleResult.name = res.entityLabel.value;
                    singleResult.link = res.entity.value;
                    relResults.push(singleResult); 
                  }
                }
                )
                setRelContent(prev => ({
                  ...prev,
                  [number] : relResults,
                }));

                setRelContentSource(prev => ({
                  ...prev,
                  [number] : relSource,
                }));

              }
              else {
                // try riconciliation
              }
            });
        }
        catch (err) {
          console.log('error', err)
        }
        return null
      } 
      else if (block.type === 'media') {
        let mediaResults = []
        let number = "";
        Object.values(block.content).map((q, i) => {
          query = q.query;
          dataset = q.dataset;
          number = block.id;
          number = number - 1;
          number = 'id_' + number;
          mediaResults = [];
          return null
        })
        query = query.replaceAll('<>', '<' + uri + '>');
        let url = endpoint + '?query=' + encodeURIComponent(query);
        try {
          fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/sparql-results+json' }
          })
            .then((res) => res.json())
            .then((data) => {
  
              let dataLen = data.results.bindings.length;
              if (dataLen > 0) {
                data.results.bindings.forEach(res => {
                  if (Object.keys(res).length > 0) {
                    let singleResult = []
                    singleResult.mediaLink = res.media.value;
                    singleResult.dataset = dataset;
                    mediaResults.push(singleResult); 
                  }
                }
                )
                setMediaContent(prev => ({
                  ...prev,
                  [number] : mediaResults,
                }))
              }
              else {
                // try riconciliation
              }
            });
        }
        catch (err) {
          console.log('error', err)
        }
        return null
      } 
    return null
    })
     
  }

  return (
    <div className={classes.cardContainer} style={{ transform: cardOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
      <ShareModal url={encodeShareLink()} display={displayShare} changeDisplay={setDisplayShare} />
      <div className={classes.titleBlock} style={{ backgroundColor: colorBackground }}>
        <div className={classes.titleContainer}>
          <h1 style={{ color: colorIsDark ? 'white' : 'black' }}>{cardContent.title}</h1>
          <p className={classes.categoryResult} style={{ color: colorIsDark ? 'white' : 'black', borderColor: colorIsDark ? 'white' : '#474747' }}>
            <span style={{ borderColor: colorIsDark ? 'white' : '#474747' }}>{cardContent.cat}</span>
            {fromSectionClip ? null
              : <span style={{ borderColor: colorIsDark ? 'white' : '#474747' }}>Related to {cardContent.input}</span>
            }
          </p>
          <p className={classes.cardShareButton} style={{ borderColor: colorIsDark ? 'white' : '#474747' }}>
            <span><button className={classes.shareButton} style={{ color: colorIsDark ? 'white' : 'black' }} onClick={() => setDisplayShare(true)}>Share</button></span>
          </p>
        </div>
        <div>
          {fromExternalLink ? <button className={classes.exitButton} onClick={() => closeCard()} style={{ color: colorIsDark ? 'white' : 'black', borderColor: colorIsDark ? 'white' : '#474747' }}>Back ⇢</button>
            : null
          }
        </div>
      </div>
      <div className={classes.contentBlock}>

        {Object.values(currentBlock).map((block, i) => {
          if (block.type === 'text') {  return <TextBlock key={'textblock-' + i} width={block.size} title={block.title} content={textContent['id_'+i]} reset={resetOn} datasets={datasets}></TextBlock> 
        }
          else if (block.type === 'relation') { return <RelationBlock key={'relationblock-' + i} width={block.size} title={block.title} category={block.category} content={relContent['id_'+i]} source={datasets[relContentSource['id_'+i]]} ></RelationBlock> }

          else if (block.type === 'link') { return <LinkBlock key={'linkblock-' + i} width={block.size} title={block.title} links={block.content}></LinkBlock> }

          else if (block.type === 'media') { return <MediaBlock key={'mediablock-' + i} width={block.size} title={block.title} class={block.class} content={ mediaContent['id_'+ i]} datasets={datasets}></MediaBlock> }

          else if (block.type === 'none') { return <WarningBlock key={'warningblock-' + i} width={'large'}></WarningBlock> }
          return null
        })}



      </div>
    </div>
  );
}


export default Card;