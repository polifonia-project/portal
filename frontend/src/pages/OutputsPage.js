import React from "react";
import { useEffect } from "react";
import classes from "./OutputsPage.module.css";
import Footer from "../components/layout/Footer";


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

    return (
        <div div className={classes.OutputsPageContainer}>
          <div className={classes.introContainer}>
          <button className={classes.introButton} onClick={(() => handleClickScroll("corpus-section"))}>Corpus</button>
          <button className={classes.introButton} onClick={(() => handleClickScroll("musow-section"))}>Musow</button>
          <button className={classes.introButton} onClick={(() => handleClickScroll("melody-section"))}>Melody</button>
        </div>
        <div className={classes.textContainer} id="corpus-section">
          <h3>Corpus</h3>
          <p>Polifonia is a 3M€ project funded by the EU Horizon 2020 Programme that will run from January 2021 until April 2024 to recreate the connections between music, people, places and events from the sixteenth century to the modern day. These findings will be available to everyone as an interconnected global database on the web – a knowledge graph – and will enhance our understanding of European musical heritage.
             The Polifonia consortium is an interdisciplinary team of passionate researchers and music lovers: computer scientists, anthropologists and ethnomusicologists, historians of music, linguists, musical heritage archivists, cataloguers and administrators, and creative professionals.</p>
          <button className={classes.textButton}>How does it work?</button>
        </div>
        <div className={classes.textContainer} id="musow-section">
          <h3>Musow</h3>
          <p>To provoke a paradigm shift in Musical Heritage preservation policies, management practice, research methodologies, interaction means and promotion strategies. Polifonia intends to achieve this goal by developing computing approaches that facilitate access and discovery of European Musical Heritage and enable a creative reuse of musical heritage at-scale..
              The goal is to highlight the implicit knowledge linking Musical Heritage to the wider cultural heritage (including tangible assets), to engage both the general public and music domain experts in a consistent environment.</p>
          <button className={classes.textButton}>How does it work?</button>
        </div>
        <div className={classes.textContainer} id="melody-section">
          <h3>Melody</h3>
          <p>Decentralised: it ensures its scalability and sustainability, hence maximising its probability of success.
             Interdisciplinary: based on the interdependence of computer science with social sciences and humanities it allows us to identify specific scenarios within each area and extract the requirements for routing adoption.
             Open source: it favours the creation of a digital ecosystem for the Musical Heritage community.
             Validation-driven: ten pilots provide the requirements as well as a validation context for the project development</p>
          <button className={classes.textButton}>How does it work?</button>
        </div>
        <Footer></Footer>
        </div>
      );
}

export default OutputsPage;