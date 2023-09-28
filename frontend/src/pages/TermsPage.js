import React from "react";
import { useEffect } from "react";
import classes from "./TermsPage.module.css";
import Footer from "../components/layout/Footer";

function TermsPage(props) {

  useEffect(() => {
    props.func('Terms');
  });

    return (
        <div div className={classes.TermsPageContainer}>
          <div className={classes.introContainer}>
        </div>
        <div className={classes.textContainer} id="corpus-section">
          <h3>Terms</h3>
          <p>Polifonia is a 3M€ project funded by the EU Horizon 2020 Programme that will run from January 2021 until April 2024 to recreate the connections between music, people, places and events from the sixteenth century to the modern day. These findings will be available to everyone as an interconnected global database on the web – a knowledge graph – and will enhance our understanding of European musical heritage.
             The Polifonia consortium is an interdisciplinary team of passionate researchers and music lovers: computer scientists, anthropologists and ethnomusicologists, historians of music, linguists, musical heritage archivists, cataloguers and administrators, and creative professionals.</p>
        </div>
        <Footer></Footer>
        </div>
      );
}

export default TermsPage;