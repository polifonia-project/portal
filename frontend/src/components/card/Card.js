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

  // content states
  const [textContent, setTextContent] = useState({"id_1":[], "id_2":[]})
  const [relContent, setRelContent] = useState({"id_3":[], "id_4":[]})
  const [mediaContent, setMediaContent] = useState({"id_5":[], "id_6":[]})

  const [textList] = useState(['Lorem ipsum dolor sit amet','Lorem ipsum dolor sit amet','Lorem ipsum dolor sit amet']);


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

  // fetchResults demo 
  const fetchResults = (uri) => {
    let endpoint = "https://query.wikidata.org/sparql"
    let query = "";
    

    Object.values(currentBlock).map((block, i) => {
      
      if (block.type === 'text') {
        let textResults = []
        let number = "";
        Object.values(block.content).map((q, i) => {
          query = q.query;
          number = block.id;
          number = number - 1;
          number = 'id_' + number;
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
                    let desc = res.desc.value;
                    textResults.push(desc); 
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
        let relResults = []
        let number = "";
        Object.values(block.content).map((q, i) => {
          query = q.query;
          number = block.id;
          number = number - 1;
          number = 'id_' + number;
          relResults = [];
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
      else if (block.type === 'media') {
        let mediaResults = []
        let number = "";
        Object.values(block.content).map((q, i) => {
          query = q.query;
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
                    let media_link = res.media.value;
                    mediaResults.push(media_link); 
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
          if (block.type === 'text') {
            return <TextBlock key={'textblock-' + i} width={block.size} title={block.title} content={textContent['id_'+i]} reset={resetOn}></TextBlock>
          }

          else if (block.type === 'relation') { return <RelationBlock key={'relationblock-' + i} width={block.size} title={block.title} category={block.category} content={relContent['id_'+i]}></RelationBlock> }

          else if (block.type === 'link') { return <LinkBlock key={'linkblock-' + i} width={block.size} title={block.title} links={block.content}></LinkBlock> }

          else if (block.type === 'media') { return <MediaBlock key={'mediablock-' + i} width={block.size} title={block.title} class={block.class} content={ mediaContent['id_'+ i]}></MediaBlock> }

          else if (block.type === 'none') { return <WarningBlock key={'warningblock-' + i} width={'large'}></WarningBlock> }
          return null
        })}



      </div>
    </div>
  );
}


export default Card;