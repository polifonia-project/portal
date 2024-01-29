import React, { useEffect, useState, useContext } from "react";
import classes from "./Card.module.css";
import { CardContext } from "../../context/CardContext";
import isDarkColor from "is-dark-color";
import { Link } from "react-router-dom";

import TextBlock from "./TextBlock";
import RelationBlock from "./RelationBlock.js";
import MediaBlock from "./MediaBlock";
import LinkBlock from "./LinkBlock";
import WarningBlock from "./WarningBlock";
import WarningBlockNoData from "./WarningBlockNoData";

import ShareModal from "./ShareModal";

function Card(props) {
  const { cardOpen } = useContext(CardContext);
  const { cardContent } = useContext(CardContext);
  const { cardBlocksNew } = useContext(CardContext);

  const [colorBackground, setColorBackground] = useState("#e2e2e2");
  const [colorIsDark, setColorIsDark] = useState(false);
  const [currentBlock, setCurrentBlock] = useState({});
  const [currentCategory, setCurrentCategory] = useState("");
  const [fromSectionClip, setFromSectionClip] = useState(false);
  const [fromExternalLink, setFromExternalLink] = useState(false);
  const [displayShare, setDisplayShare] = useState(false);
  const [resetOn, setResetOn] = useState(false);
  const [fontSize, setFontSize] = useState('2.5rem');

  const [datasets, setDatasets] = useState({});

  // content states
  const [textContent, setTextContent] = useState({});
  const [linkContent, setLinkContent] = useState({});
  const [relContent, setRelContent] = useState({});
  const [mediaContent, setMediaContent] = useState({});

  const sameAsUriList = [];
  const [sameAsUris, setSameAsUris] = useState(sameAsUriList);

  // The width below which the mobile view should be rendered
  const breakpointTablet = 1000;
  const breakpointPhone = 700;
  const breakpointSmall = 500;
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions)

  }, []);

  useEffect(() => {
    if (cardContent.title.length > 300) {
      setFontSize("1rem");
    } else if (cardContent.title.length > 100) {
      setFontSize("1.5rem");
    } else {
      // set default font size
      setFontSize("2.5rem");
    }
  }, [cardContent.title]); 

  // Function to collect sameAsUris
  const getSameAsUris = async (uri) => {
    const response = await fetch(
      "/portal/reconciliation?uri=" + encodeURIComponent(uri)
    ).then((response) => response.json());
    setSameAsUris(response);
  };

  // Handle fetch errors
  const handleFetchError = (err) => {
    if (err.name === 'AbortError') {
      // The fetch was aborted, handle accordingly
      console.log('Fetch aborted');
    } else {
      console.log('Fetch error:', err.message);
    }
  }

  // clear the timeout and handle the fetch response
  const handleFetchResponse = (res, timeoutId, signal) => {
    // Clear the timeout since the fetch started successfully
    clearTimeout(timeoutId);

    // Check if the fetch was aborted
    if (signal.aborted) {
      console.log('Fetch aborted');
      return Promise.reject(new Error('Fetch aborted'));
    }

    // Check if the response is OK
    if (!res.ok) {
      console.log('Fetch failed with status:', res.status);
      return Promise.reject(new Error('Fetch failed'));
    }

    // Parse and return the JSON data
    return res.json();
  };

  useEffect(() => {
    // fetchResults
    const fetchResults = (uri) => {
      let recUri = "";
      if (Object.keys(sameAsUris).length > 0) {
        console.log(sameAsUris);
        if (sameAsUris.results.bindings.length > 0) {
          let sameUriArray = sameAsUris.results.bindings.map(
            (val) => "<" + val.same_uri.value + ">"
          );
          console.log("SAME URIS", sameUriArray);
          recUri = sameUriArray.join(" ");
        } else {
          recUri = "<" + uri + ">";
        }
      } else {
        recUri = "<" + uri + ">";
      }

      let endpoint = "";
      let query = "";
      let dataset = "";
      Object.values(currentBlock).forEach((block, i) => {
        if (block.type === "text") {
          let textResults = []; 
          let number = "";
          Object.values(block.content).forEach((q, i) => {
            query = q.query;
            dataset = q.dataset;
            number = block.id;
            number = number - 1;
            number = "id_" + number;
            if (Object.keys(datasets).length === 0) { window.location.reload(false); }
            endpoint = datasets[dataset].sparql_endpoint;
            textResults = [];

            query = query.replaceAll("{}", "{" + recUri + "}");
            let url = endpoint + "?query=" + encodeURIComponent(query);
            // Create an instance of AbortController
            const controller = new AbortController();
            const signal = controller.signal;
            // Set up a timeout to abort the fetch after 30 seconds
            const timeoutId = setTimeout(() => {
              controller.abort();
              console.log('Fetch aborted due to timeout');
            }, 40000);
            try {
              fetch(url, {
                method: "GET",
                headers: { Accept: "application/sparql-results+json" },
                signal: signal,
              })
                .then((res) => handleFetchResponse(res, timeoutId, signal))
                .then((data) => {
                  let dataLen = data.results.bindings.length;
                  if (dataLen > 0) {
                    data.results.bindings.forEach((res) => {
                      if (Object.keys(res).length > 0) {
                        let singleResult = [];
                        singleResult.desc = res.entityLabel.value;
                        singleResult.dataset = q.dataset;
                        textResults.push(singleResult);
                      }
                    });
                    if (textResults.length > 0) {
                      setTextContent((prev) => ({
                        ...prev,
                        [number]: textResults,
                      }));
                    }
                  }
                });
            } catch (err) {
              handleFetchError(err);
            }
            return null;
          });
        } else if (block.type === "link") {
          let linkResults = [];
          let number = "";
          Object.values(block.content).forEach((q, i) => {
            query = q.query;
            dataset = q.dataset;
            number = block.id;
            number = number - 1;
            number = "id_" + number;
            if (Object.keys(datasets).length === 0) { window.location.reload(false); }
            endpoint = datasets[dataset].sparql_endpoint;
            linkResults = [];

            query = query.replaceAll("{}", "{" + recUri + "}");
            let url = endpoint + "?query=" + encodeURIComponent(query);
            // Create an instance of AbortController
            const controller = new AbortController();
            const signal = controller.signal;
            // Set up a timeout to abort the fetch after 30 seconds
            const timeoutId = setTimeout(() => {
              controller.abort();
              console.log('Fetch aborted due to timeout');
            }, 40000);
            try {
              fetch(url, {
                method: "GET",
                headers: { Accept: "application/sparql-results+json" },
                signal: signal,
              })
                .then((res) => handleFetchResponse(res, timeoutId, signal))
                .then((data) => {
                  let dataLen = data.results.bindings.length;
                  if (dataLen > 0) {
                    data.results.bindings.forEach((res) => {
                      if (Object.keys(res).length > 0) {
                        let singleResult = [];
                        singleResult.url = res.entity.value;
                        singleResult.label = q.label;
                        singleResult.dataset = q.dataset;
                        linkResults.push(singleResult);
                      }
                    });
                    setLinkContent((prev) => ({
                      ...prev,
                      [number]: linkResults,
                    }));
                  }
                });
            } catch (err) {
              handleFetchError(err);
            }
            return null;
          });
        } else if (block.type === "relation") {
          let relResults = [];
          let number = "";
          Object.values(block.content).map((q, i) => {
            query = q.query;
            dataset = q.dataset;
            number = block.id;
            number = number - 1;
            number = "id_" + number;
            if (Object.keys(datasets).length === 0) { window.location.reload(false); }
            endpoint = datasets[dataset].sparql_endpoint;
            relResults = [];

            query = query.replaceAll("{}", "{" + recUri + "}");
            let url = endpoint + "?query=" + encodeURIComponent(query);
            // Create an instance of AbortController
            const controller = new AbortController();
            const signal = controller.signal;
            // Set up a timeout to abort the fetch after 30 seconds
            const timeoutId = setTimeout(() => {
              controller.abort();
              console.log('Fetch aborted due to timeout');
            }, 40000);
            try {
              fetch(url, {
                method: "GET",
                headers: { Accept: "application/sparql-results+json" },
                signal: signal,
              })
                .then((res) => handleFetchResponse(res, timeoutId, signal))
                .then((data) => {
                  let dataLen = data.results.bindings.length;
                  if (dataLen > 0) {
                    data.results.bindings.forEach((res) => {
                      if (Object.keys(res).length > 0) {
                        let singleResult = [];
                        singleResult.name = res.entityLabel.value;
                        singleResult.link = res.entity.value;
                        singleResult.dataset = q.dataset;
                        relResults.push(singleResult);
                      }
                    });
                    let sourceLimit = [];
                    sourceLimit.dataset = q.dataset;
                    relResults.push(sourceLimit);
                    setRelContent((prev) => ({
                      ...prev,
                      [number]: relResults,
                    }));
                  }
                });
            } catch (err) {
              handleFetchError(err);
            }
            return null;
          });
        } else if (block.type === "media") {
          let mediaResults = [];
          let number = "";
          Object.values(block.content).map((q, i) => {
            query = q.query;
            dataset = q.dataset;
            number = block.id;
            number = number - 1;
            number = "id_" + number;
            mediaResults = [];
            if (Object.keys(datasets).length === 0) { window.location.reload(false); }
            endpoint = datasets[dataset].sparql_endpoint;

            query = query.replaceAll("{}", "{" + recUri + "}");
            let url = endpoint + "?query=" + encodeURIComponent(query);
            // Create an instance of AbortController
            const controller = new AbortController();
            const signal = controller.signal;
            // Set up a timeout to abort the fetch after 30 seconds
            const timeoutId = setTimeout(() => {
              controller.abort();
              console.log('Fetch aborted due to timeout');
            }, 40000);
            try {
              fetch(url, {
                method: "GET",
                headers: { Accept: "application/sparql-results+json" },
                signal: signal,
              })
                .then((res) => handleFetchResponse(res, timeoutId, signal))
                .then((data) => {
                  let dataLen = data.results.bindings.length;
                  if (dataLen > 0) {
                    data.results.bindings.forEach((res) => {
                      if (Object.keys(res).length > 0) {
                        let singleResult = [];
                        singleResult.mediaLink = res.entity.value;
                        singleResult.dataset = q.dataset;
                        mediaResults.push(singleResult);
                      }
                    });
                    setMediaContent((prev) => ({
                      ...prev,
                      [number]: mediaResults,
                    }));
                  }
                });
            } catch (err) {
              handleFetchError(err);
            }
            return null;
          });
        }
        return null;
      });
    };

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
        if (cardBlocksNew[cardContent.cat].category === "") {
          setCurrentCategory("/portal/");
        } else {
          setCurrentCategory(
            "/portal/#section-" + cardBlocksNew[cardContent.cat].category
          );
        }
      } else {
        setColorBackground("#e2e2e2");
        setCurrentBlock({ "01": { type: "none" } });
        setCurrentCategory("/portal/");
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
  }, [
    cardOpen,
    cardBlocksNew,
    cardContent.hasInput,
    cardContent.goesBack,
    cardContent.cat,
    colorBackground,
    cardContent.uri,
    currentBlock,
    datasets,
    sameAsUris,
  ]);

  // fetch sameAs uris
  useEffect(() => {
    getSameAsUris(cardContent.uri);
  }, [cardContent.uri]);

  // fetch datasets
  useEffect(() => {
    try {
      fetch("/portal/conf_info")
        .then((res) => res.json())
        .then((data) => {
          setDatasets(data.datasets);
        });
    }
    catch {
      fetch("conf_info")
        .then((res) => res.json())
        .then((data) => {
          setDatasets(data.datasets);
        });
    }
  }, []);

  const setLightHeader = () => {
    document.getElementById("mainLogo").style.filter =
      "brightness(0) invert(1)";
    document.getElementById("sectionName").style.color = "white";
    document.getElementById("menuOptions").style.filter =
      "brightness(0) invert(1)";
    document.getElementById("menuOptions").style.zIndex = "300";
  };

  const setDarkHeader = () => {
    document.getElementById("mainLogo").style.filter = "none";
    document.getElementById("sectionName").style.color = "black";
    document.getElementById("menuOptions").style.filter = "none";
  };

  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0 || Object.values(obj).every(value => !value);
  }

  const encodeShareLink = () => {
    if (fromExternalLink) {
      const params =
        "title=" +
        cardContent.title +
        "&cat=" +
        cardContent.cat +
        "&uri=" +
        cardContent.uri;
      const encodedParams = encodeURI(params);
      const encodedUrl = window.location + "card?" + encodedParams;
      return encodedUrl;
    } else {
      const params =
        "title=" +
        cardContent.title +
        "&cat=" +
        cardContent.cat +
        "&uri=" +
        cardContent.uri;
      const encodedParams = encodeURI(params);
      const encodedUrl =
        window.location.origin + window.location.pathname + "?" + encodedParams;
      return encodedUrl;
    }
  };

  return (
    <div
      className={classes.cardContainer}
      style={{ transform: cardOpen ? "translateX(0)" : "translateX(-100%)" }}
    >
      <ShareModal
        url={encodeShareLink()}
        display={displayShare}
        changeDisplay={setDisplayShare}
      />
      <div
        className={classes.titleBlock}
        style={{ backgroundColor: colorBackground }}
      >
        <div className={classes.titleContainer}>
          <h1 style={{ fontSize: fontSize, color: colorIsDark ? "white" : "black" }}>
            {cardContent.title}
          </h1>
          <p
            className={classes.categoryResult}
            style={{
              color: colorIsDark ? "white" : "black",
              borderColor: colorIsDark ? "white" : "#474747",
            }}
          >
            <span style={{ borderColor: colorIsDark ? "white" : "#474747" }}>
              <Link
                style={{ cursor: "pointer" }}
                className={classes.catLink}
                to={currentCategory}
              >
                {cardContent.cat}
              </Link>
            </span>
            {fromSectionClip ? null : (
              <span style={{ borderColor: colorIsDark ? "white" : "#474747" }}>
                Related to {cardContent.input}
              </span>
            )}
          </p>
          <p
            className={classes.cardShareButton}
            style={{ borderColor: colorIsDark ? "white" : "#474747" }}
          >
            <span>
              <button
                className={classes.shareButton}
                style={{ color: colorIsDark ? "white" : "black" }}
                onClick={() => setDisplayShare(true)}
              >
                Share
              </button>
            </span>
          </p>
        </div>
      </div>
      <div className={classes.contentBlock}>
       {Object.values(currentBlock).sort((a, b) => a.id - b.id).map((block, i) => {
          if (block.type === "text") {
            return (
              <TextBlock
                key={"textblock-" + i.toString()}
                width={block.size}
                title={block.title}
                content={textContent["id_" + i.toString()]}
                reset={resetOn}
                datasets={datasets}
                screen={width < breakpointSmall ? 1 : width < breakpointPhone ? 2 : width < breakpointTablet ? 3 : 4}
              ></TextBlock>
            );
          } else if (block.type === "relation") {
            return (
              <RelationBlock
                key={"relationblock-" + i.toString()}
                width={block.size}
                title={block.title}
                category={block.category}
                reset={resetOn}
                content={relContent["id_" + i.toString()]}
                datasets={datasets}
                isExternal={fromExternalLink}
                screen={width < breakpointSmall ? 1 : width < breakpointPhone ? 2 : width < breakpointTablet ? 3 : 4}
              ></RelationBlock>
            );
          } else if (block.type === "link") {
            return (
              <LinkBlock
                key={"linkblock-" + i.toString()}
                width={block.size}
                title={block.title}
                desc={block.description}
                reset={resetOn}
                links={block.content}
                content={linkContent["id_" + i.toString()]}
                screen={width < breakpointSmall ? 1 : width < breakpointPhone ? 2 : width < breakpointTablet ? 3 : 4}

              ></LinkBlock>
            );
          } else if (block.type === "media") {
            return (
              <MediaBlock
                key={"mediablock-" + i.toString()}
                width={block.size}
                title={block.title}
                mediaclass={block.class}
                content={mediaContent["id_" + i.toString()]}
                datasets={datasets}
                screen={width < breakpointSmall ? 1 : width < breakpointPhone ? 2 : width < breakpointTablet ? 3 : 4}
              ></MediaBlock>
            );
          } else if (block.type === "none") {
            return (
              <WarningBlock
                key={"warningblock-" + i.toString()}
                width={"large"}
                screen={width < breakpointSmall ? 1 : width < breakpointPhone ? 2 : width < breakpointTablet ? 3 : 4}
              ></WarningBlock>
            );
          }
          return null;
        })}
        {isObjectEmpty(textContent) && isObjectEmpty(mediaContent) && isObjectEmpty(relContent) && isObjectEmpty(linkContent) ?
        <WarningBlockNoData
                key={"warningblock"}
                width={"large"}
                screen={width < breakpointSmall ? 1 : width < breakpointPhone ? 2 : width < breakpointTablet ? 3 : 4}
        ></WarningBlockNoData>: null }
      </div>
    </div>
  );
}

export default Card;