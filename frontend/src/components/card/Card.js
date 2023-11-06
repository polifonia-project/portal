import React, { useEffect, useState, useContext } from "react";
import classes from "./Card.module.css";
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
  const [textContent, setTextContent] = useState({ "id_1": [], "id_2": [] })
  const [linkContent, setLinkContent] = useState({ "id_5": [], "id_6": [] })
  const [relContent, setRelContent] = useState({ "id_3": [], "id_4": [] })
  const [mediaContent, setMediaContent] = useState({})

  const sameAsUriList = []
  const [sameAsUris, setSameAsUris] = useState(sameAsUriList);

  // Function to collect sameAsUris
  const getSameAsUris = async (uri) => {
    const response = await fetch(
      '/portal/reconciliation?uri=' + encodeURIComponent(uri)
    ).then((response) => response.json())
    setSameAsUris(response);
  };

  useEffect(() => {

    // fetchResults 
    const fetchResults = (uri) => {
      let recUri = '';
      if (Object.keys(sameAsUris).length > 0) {
        console.log(sameAsUris)
        if (sameAsUris.results.bindings.length > 0) {
          let sameUriArray = (sameAsUris.results.bindings).map(val => '<' + val.same_uri.value + '>');
          console.log('SAME URIS', sameUriArray)
          recUri = sameUriArray.join(' ');
        } else { recUri = '<' + uri + '>' }

      } else { recUri = '<' + uri + '>' }

      let endpoint = "";
      let query = "";
      let dataset = "";
      Object.values(currentBlock).forEach((block, i) => {

        if (block.type === 'text') {
          let textResults = []
          let number = "";
          Object.values(block.content).forEach((q, i) => {
            query = q.query;
            dataset = q.dataset;
            number = block.id;
            number = number - 1;
            number = 'id_' + number;
            endpoint = datasets[dataset].sparql_endpoint;
            textResults = [];

            query = query.replaceAll('{}', '{' + recUri + '}');
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
                        singleResult.desc = res.entityLabel.value;
                        singleResult.dataset = q.dataset;
                        textResults.push(singleResult);
                      }
                    }
                    )
                    setTextContent(prev => ({
                      ...prev,
                      [number]: textResults,
                    }))
                  }
                });
            }
            catch (err) {
              console.log('error', err)
            }
            return null

          })
        }
        else if (block.type === 'link') {
          let linkResults = []
          let number = "";
          Object.values(block.content).forEach((q, i) => {
            query = q.query;
            dataset = q.dataset;
            number = block.id;
            number = number - 1;
            number = 'id_' + number;
            endpoint = datasets[dataset].sparql_endpoint;
            linkResults = [];

            query = query.replaceAll('{}', '{' + recUri + '}');
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
                        singleResult.url = res.entity.value;
                        singleResult.label = q.label;
                        singleResult.dataset = q.dataset;
                        linkResults.push(singleResult);
                      }
                    }
                    )
                    setLinkContent(prev => ({
                      ...prev,
                      [number]: linkResults,
                    }))
                  }
                });
            }
            catch (err) {
              console.log('error', err)
            }
            return null
          })
        }
        else if (block.type === 'relation') {
          let relResults = [];
          let number = "";
          Object.values(block.content).map((q, i) => {
            query = q.query;
            dataset = q.dataset;
            number = block.id;
            number = number - 1;
            number = 'id_' + number;
            endpoint = datasets[dataset].sparql_endpoint;
            relResults = [];

            query = query.replaceAll('{}', '{' + recUri + '}');
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
                        singleResult.dataset = q.dataset;
                        relResults.push(singleResult);
                      }
                    }
                    )
                    let sourceLimit = [];
                    sourceLimit.dataset = q.dataset;
                    relResults.push(sourceLimit);
                    setRelContent(prev => ({
                      ...prev,
                      [number]: relResults,
                    }));
                  }
                });
            }
            catch (err) {
              console.log('error', err)
            }
            return null
          })
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
            endpoint = datasets[dataset].sparql_endpoint;

            query = query.replaceAll('{}', '{' + recUri + '}');
            console.log(query)
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
                        singleResult.mediaLink = res.entity.value;
                        singleResult.dataset = q.dataset;
                        mediaResults.push(singleResult);
                      }
                    }
                    )
                    setMediaContent(prev => ({
                      ...prev,
                      [number]: mediaResults
                    }))
                  }
                });
            }
            catch (err) {
              console.log('error', err)
            }
            return null
          })
        }
        return null
      })

    }

    if (cardOpen) {

      // reset
      setResetOn(false);

      // entryway setting
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

    } else {
      setResetOn(true);
      // reset content states
      setTextContent({});
      setLinkContent({});
      setRelContent({});
      setMediaContent({});
    }


  }, [cardOpen, cardBlocksNew, cardContent.hasInput, cardContent.goesBack, cardContent.cat, colorBackground, cardContent.uri, currentBlock, datasets, sameAsUris]);

  // fetch sameAs uris
  useEffect(() => {
    getSameAsUris(cardContent.uri);
  }, [cardContent.uri]);

  // fetch datasets 
  useEffect(() => {
    fetch("/portal/conf_info")
      .then((res) => res.json())
      .then((data) => {
        setDatasets(data.datasets);
      });
  }, []);


  // close card
  const closeCard = () => {
    setCurrentBlock({});
    setCardOpen(false);
    setResetOn(false);
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
    if (fromExternalLink) {
      const params = 'title=' + cardContent.title + '&cat=' + cardContent.cat + '&uri=' + cardContent.uri;
      const encodedParams = encodeURI(params);
      const encodedUrl = window.location + 'card?' + encodedParams
      return encodedUrl
    } else {
      const params = 'title=' + cardContent.title + '&cat=' + cardContent.cat + '&uri=' + cardContent.uri;
      const encodedParams = encodeURI(params);
      const encodedUrl = window.location.origin + window.location.pathname + '?' + encodedParams
      return encodedUrl
    }
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
      </div>
      <div className={classes.contentBlock}>

        {Object.values(currentBlock).map((block, i) => {
          if (block.type === 'text') {
            return <TextBlock key={'textblock-' + i} width={block.size} title={block.title} content={textContent['id_' + i]} reset={resetOn} datasets={datasets}></TextBlock>
          }
          else if (block.type === 'relation') { return <RelationBlock key={'relationblock-' + i} width={block.size} title={block.title} category={block.category} reset={resetOn} content={relContent['id_' + i]} datasets={datasets} isExternal={fromExternalLink}></RelationBlock> }

          else if (block.type === 'link') { return <LinkBlock key={'linkblock-' + i} width={block.size} title={block.title} desc={block.description} reset={resetOn} links={block.content} content={linkContent['id_' + i]}></LinkBlock> }

          else if (block.type === 'media') { return <MediaBlock key={'mediablock-' + i} width={block.size} title={block.title} class={block.class} content={mediaContent['id_' + i]} datasets={datasets}></MediaBlock> }

          else if (block.type === 'none') { return <WarningBlock key={'warningblock-' + i} width={'large'}></WarningBlock> }
          return null
        })}



      </div>
    </div>
  );
}


export default Card;