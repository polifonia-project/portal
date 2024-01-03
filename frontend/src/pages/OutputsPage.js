import React, { useEffect } from "react";
import classes from "./OutputsPage.module.css";
import Footer from "../components/layout/Footer";
import VisibilitySensor from "react-visibility-sensor";


function OutputsPage(props) {

  useEffect(() => {
    props.func('Outputs');
  });

  const handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ block: "end", behavior: 'smooth' });
    };
  };

  function onChange(isVisible) {
    if (isVisible) {
      document.getElementById("mainHeader").style.backgroundColor = "transparent";
      document.getElementById("mainLogo").style.filter = 'none';
      document.getElementById("sectionName").style.color = 'black';
      document.getElementById("menuOptions").style.filter = 'none';
      document.getElementById("mainHeader").style.transform = "translateY(0px)";
      document.getElementById("backToClip").style.display = "none";
      document.getElementById("backToTop").style.display = "none";
    }
  }

  return (
    <div div className={classes.OutputsPageContainer}>
      <VisibilitySensor onChange={onChange}>
        <div className={classes.visibilityHook}>X</div>
      </VisibilitySensor>
      <div className={classes.introContainer}>
        <button className={classes.introButton} onClick={(() => handleClickScroll("corpus-section"))}>Corpus</button>
        <button className={classes.introButton} onClick={(() => handleClickScroll("musow-section"))}>Musow</button>
        <button className={classes.introButton} onClick={(() => handleClickScroll("melody-section"))}>Melody</button>
      </div>
      <div className={classes.textContainer} id="corpus-section">
        <h3>Corpus</h3>
        <p>Dive into the world of the Polifonia Textual Corpus, a remarkable linguistic collection spanning Italian, English, French, Spanish, and Dutch, meticulously crafted to celebrate Musical Heritage (MH). Through the artistry of Natural Language Processing (NLP), this corpus comes to life, adorned with automatic morphosyntactic, semantic, and MH-specific annotations. But it doesn't stop there. Tailored APIs have been meticulously designed, providing scholars, domain experts, and music professionals with keys to unlock its vast knowledge.
          <br /><br />These tools elevate your exploration beyond simple keyword searches. Now, you can delve deeper, unveiling a wealth of information by tapping into the nuanced semantic and MH-specific details encoded in every annotation. It’s a doorway to a world of intricate musical knowledge, waiting for curious minds to uncover its secrets.</p>
        <a className={classes.textButton} href="https://polifonia.disi.unibo.it/corpus/" target="_blank" rel="noreferrer">Visit the Corpus</a>
      </div>
      <div className={classes.textContainer} id="musow-section">
        <h3>Musow</h3>
        <p>Introducing musoW, a meticulously curated online catalog of musical resources, purpose-built to empower educators in music, creative professionals, historians, and musicologists in their quest for knowledge.
          <br /><br />Traditionally, scholars and creatives find themselves juggling a multitude of resources, including music scores, audiovisual materials, and data, sourced from digital music libraries and audiovisual archives. The daunting task involves sifting through countless websites, manually seeking valuable information, and drawing connections. For those technologically inclined, the desire to access music data programmatically for innovative projects adds another layer of complexity. musoW simplifies this process, offering a one-stop destination to effortlessly discover, connect, and access music resources, unleashing a world of creative possibilities.</p>
        <a className={classes.textButton} href="https://projects.dharc.unibo.it/musow/" target="_blank" rel="noreferrer">Visit Musow</a>
      </div>
      <div className={classes.textContainer} id="melody-section">
        <h3>Melody</h3>
        <p>Melody: Make Me a Linked Open Data Story introduces a new dashboard that transforms complex musical data into an accessible, intuitive experience. This dashboard is the heart of the Melody platform, offering users a seamless interface to navigate the vast world of music linked through open data. Imagine having a dynamic tool that allows you to visualize intricate musical connections, explore genres, artists, and historical contexts effortlessly.
          <br /><br />With just a few clicks, you can unravel the evolution of musical genres, delve into the biographies of your favorite artists, or trace the global influence of specific melodies. This user-friendly hub not only simplifies intricate data but also fosters creativity, enabling musicians, scholars, and enthusiasts to craft their unique narratives within the rich tapestry of global music history.
        </p>
        <a className={classes.textButton} href="https://projects.dharc.unibo.it/melody/" target="_blank" rel="noreferrer">Visit Melody</a>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default OutputsPage;