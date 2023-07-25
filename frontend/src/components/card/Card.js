import React, { useEffect, useState } from "react";
import classes from "./Card.module.css";
import { useContext } from "react";
import { CardContext } from "../../context/CardContext";
import isDarkColor from 'is-dark-color';

import TextBlock from "./TextBlock";
import RelationBlock from "./RelationBlock.js";
import VisualBlock from "./VisualBlock";
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

  // content states
  const [textContent, setTextContent] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
  const [relContent, setRelContent] = useState([{name: "Lorem Ipsummm", link: "https://www.google.com/"},{name: "Lorem Ipsum", link: "https://www.google.com/"},{name: "Lorem Ipsum", link: "https://www.google.com/"},{name: "Lorem Ipsum", link: "https://www.google.com/"}])
  const [visualContent, setVisualContent] = useState({id_3:'', id_4:''})


  useEffect(() => {
    if (cardOpen) {
      setFromSectionClip(cardContent.hasInput);
      setFromExternalLink(cardContent.goesBack);
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
    let results = []
    let relResults = []
    let query_method = "sparql_endpoint"
    let endpoint = "https://query.wikidata.org/sparql"
    let dataset_id = "";
    let query = "";

    Object.values(currentBlock).map((block, i) => {
      
      if (block.type === 'text') {
        Object.values(block.content).map((q, i) => {
          dataset_id = q.dataset;
          query = q.query;
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
                    let singleResult = {}
                    singleResult.desc = res.desc.value;
                    singleResult.method = query_method;
                    singleResult.dataset = dataset_id;
                    results.push(singleResult);
                    setTextContent(res.desc.value)
                  }
                }
                )
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
        Object.values(block.content).map((q, i) => {
          dataset_id = q.dataset;
          query = q.query;
          return null
        })
        console.log(query)
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
              setRelContent(relResults)
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
      else if (block.type === 'visual') {
        let number = "";
        Object.values(block.content).map((q, i) => {
          dataset_id = q.dataset;
          query = q.query;
          number = block.id;
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
                    number = number - 1;
                    number = 'id_' + number;
                    let pic_link = res.pic.value;
                    console.log(pic_link);
                    setVisualContent(prev => ({
                      ...prev,
                      [number] : pic_link,
                    }))

                  }
                }
                )
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
    console.log(results)
    
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
            return <TextBlock key={'textblock-' + i} width={block.size} title={block.title} content={textContent}></TextBlock>
          }

          else if (block.type === 'relation') { return <RelationBlock key={'relationblock-' + i} width={block.size} title={block.title} content={relContent}></RelationBlock> }

          else if (block.type === 'link') { return <LinkBlock key={'linkblock-' + i} width={block.size} title={block.title} links={block.content}></LinkBlock> }

          else if (block.type === 'visual') { return <VisualBlock key={'visualblock-' + i} width={block.size} title={block.title} content={ visualContent['id_'+ i] }></VisualBlock> }

          else if (block.type === 'none') { return <WarningBlock key={'warningblock-' + i} width={'large'}></WarningBlock> }
          return null
        })}



      </div>
    </div>
  );
}


export default Card;