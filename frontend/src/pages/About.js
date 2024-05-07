import React, { useEffect, useState } from "react";
import classes from "./About.module.css";
import Footer from "../components/layout/Footer";
import VisibilitySensor from "react-visibility-sensor";

function AboutPage(props) {

  const [datasets, setDatasets] = useState({})

  useEffect(() => {
    props.func('About');
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

  // fetch datasets
  useEffect(() => {
    fetch("/portal/conf_info")
      .then((res) => res.json())
      .then((data) => {
        setDatasets(data.datasets);
      });
  }, []);

  return (
    <div div className={classes.aboutPageContainer}>
      <VisibilitySensor onChange={onChange}>
        <div className={classes.visibilityHook}>X</div>
      </VisibilitySensor>
      <div className={classes.introContainer}>
        <button className={classes.introButton} onClick={(() => handleClickScroll("project-section"))}>The Project</button>
        <button className={classes.introButton} onClick={(() => handleClickScroll("mission-section"))}>Mission</button>
        <button className={classes.introButton} onClick={(() => handleClickScroll("approach-section"))}>Approach</button>
        <button className={classes.introButton} onClick={(() => handleClickScroll("portal-section"))}>Portal</button>
        <button className={classes.introButton} onClick={(() => handleClickScroll("datasets-section"))}>Datasets</button>
      </div>
      <div className={classes.textContainer} id="project-section">
        <h3>The Project</h3>
        <p>The Polifonia H2020 project is a groundbreaking initiative that seeks to revolutionize the way we understand and interact with Europe's rich cultural heritage. Supported by the Horizon 2020 program, Polifonia aims to develop innovative methods and technologies for the extraction, integration, and enrichment of musical and cultural data from diverse historical sources. By employing advanced computational techniques such as machine learning, data mining, and natural language processing, Polifonia strives to create a harmonious blend of music, history, and technology.
          <br /><br /> This collaborative effort brings together experts from various fields, including musicology, computer science, and digital humanities, fostering interdisciplinary research and encouraging the preservation and exploration of Europe's diverse musical traditions. Polifonia not only promotes a deeper understanding of our shared cultural legacy but also paves the way for future advancements in the digital humanities, making cultural heritage more accessible and engaging for generations to come.</p>
      </div>
      <div className={classes.textContainer} id="mission-section">
        <h3>Mission</h3>
        <p>The mission of the Polifonia H2020 project is to unlock the hidden treasures of Europe's musical heritage and bring them into the digital age. By leveraging cutting-edge technologies and interdisciplinary collaboration, Polifonia aims to create a seamless integration of diverse musical and cultural data, making it accessible, understandable, and enjoyable for a global audience. The project focuses on developing innovative methods for extracting, enriching, and interlinking musical information from historical documents, manuscripts, and recordings. By doing so, Polifonia not only preserves these invaluable cultural assets but also enables researchers, musicians, educators, and enthusiasts to explore, analyze, and appreciate Europe's rich musical traditions in novel and interactive ways. Through its endeavors, Polifonia fosters a sense of shared heritage, promotes cultural diversity, and contributes significantly to the advancement of digital humanities and musicology.</p>
      </div>
      <div className={classes.textContainer} id="approach-section">
        <h3>Approach</h3>
        <p>The Polifonia H2020 project adopts a multifaceted approach that combines advanced computational techniques with deep expertise in musicology and digital humanities. At its core, Polifonia focuses on the development and integration of state-of-the-art technologies such as machine learning, data mining, semantic web, and natural language processing.
          <br /><br /> These tools are meticulously designed to extract, enrich, and interlink musical data from a wide array of historical sources, ranging from ancient manuscripts to contemporary recordings. Simultaneously, the project places a strong emphasis on interdisciplinary collaboration, bringing together scholars, researchers, and professionals from diverse fields including musicology, computer science, linguistics, and archival studies. This collaborative effort ensures a holistic understanding of Europe's musical heritage and facilitates the creation of innovative methodologies for organizing, preserving, and disseminating this wealth of information.
          <br /><br /> Moreover, Polifonia actively engages with cultural institutions, libraries, and archives to enhance the accessibility and usability of the digitized musical data, making it a valuable resource for both academic research and public enjoyment. Through this comprehensive approach, Polifonia strives to bridge the gap between traditional musicology and cutting-edge technology, creating a lasting impact on the preservation and exploration of cultural heritage.</p>
      </div>
      <div className={classes.textContainer} id="portal-section">
        <h3>Portal</h3>
        <p>The Polifonia H2020 project's web portal stands as a beacon of accessibility and knowledge, representing the culmination of the project's extensive research and technological innovations.
          <br /><br /> Designed with user-friendliness in mind, the portal serves as a gateway to Europe's vast musical heritage. Its intuitive interface allows scholars, musicians, educators, and enthusiasts to explore a diverse range of musical data extracted from historical manuscripts, recordings, and documents. Through meticulously curated collections and interactive features, users can delve into the intricate tapestry of European music, discovering rare compositions, historical contexts, and cultural influences. The portal's advanced search capabilities, coupled with innovative visualization tools, empower users to navigate through centuries of musical evolution effortlessly.
          <br /><br /> Additionally, the portal acts as a hub for collaborative research, enabling scholars to contribute their expertise, share insights, and engage in scholarly discourse. By fostering a sense of community and democratizing access to musical knowledge, the Polifonia web portal stands as a testament to the project's commitment to preserving, promoting, and enriching Europe's musical legacy for generations to come.
          <br /><br /> The web portal is the result of a collaborative effort, with the University of Bologna as the scientific and technical coordinator. Scientific coordination was provided by <a href='https://www.unibo.it/sitoweb/valentina.presutti' target='_blank' className={classes.customLink}>Valentina Presutti</a>, project management by <a href='https://www.unibo.it/sitoweb/marilena.daquino2' target='_blank' className={classes.customLink}>Marilena Daquino</a>, web development and design by <a href='https://www.unibo.it/sitoweb/marco.grasso7' target='_blank' className={classes.customLink}>Marco Grasso</a>, and data management by <a href='https://www.unibo.it/sitoweb/giulia.renda3' target='_blank' className={classes.customLink}>Giulia Renda</a>. Contributions were made by scholars, researchers and developers of The Open University, the National University of Ireland Galway, and King's College London.</p>
      </div>
      <div className={classes.textContainer} id="datasets-section">
        <h3>Datasets</h3>
        <p>The Polifonia H2020 project's web portal stands as a beacon of accessibility and knowledge, representing the culmination of the project's extensive research and technological innovations.
        </p>
        {Object.values(datasets).map(function (dataset, index) {
          const name = dataset.name
          const desc = dataset.description
          return [<h4>{index + 1 + ". " + name}</h4>, <p>{desc}</p>]
        })}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default AboutPage;