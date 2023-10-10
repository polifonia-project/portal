import React from "react";
import classes from "./Footer.module.css";
import logoPolifonia from "../../assets/png/polifonia-logo-white.png"
import logoHorizon from "../../assets/svg/logo-eu-white-caption.svg"
import { Link } from "react-router-dom";

function Footer(props) {

  function onChange() { window.scrollTo(0, 0)}

  return (
    <div className={classes.footerContainer}> 
      <div className={classes.footerMainBlock}>
        <div className={classes.footerTitle}>
            <img src={logoPolifonia} alt='polifonia logo'></img>
        </div>
        <div className={classes.flexBox}>
         <div className={classes.flexZero}>
            <p><img src={logoHorizon} alt='horizon logo'></img></p>
            <p>This project has received funding from the European Union’s Horizon 2020 research<br></br> and innovation programme under grant agreement N. 101004746</p>
         </div>
          <div className={classes.flexOne}>
            <p className={classes.flexTitle}>Contact</p>
            <br></br>
            <a href="https://polifonia-project.eu/" target="_blank" rel="noopener noreferrer">Official website</a>
            <a href="https://github.com/polifonia-project" target="_blank" rel="noopener noreferrer">Github</a>
            <a href="https://www.linkedin.com/company/polifonia-h2020/" target="_blank" rel="noopener noreferrer">Linkedin</a>
            <a href="https://twitter.com/PolifoniaH2020" target="_blank" rel="noopener noreferrer">Twitter</a>
          </div>
          <div className={classes.flexTwo}>
            <p className={classes.flexTitle}>Polifonia</p>
            <br></br>
            <Link onClick={() => {onChange()}}  to="/">Homepage</Link>
            <Link onClick={() => {onChange()}}  to="/about">About</Link>
            <Link onClick={() => {onChange()}}  to="/outputs">Outputs</Link>
          </div>
          <div className={classes.flexThree}>
            <p className={classes.flexTitle}>People</p>
            <br></br>
            <a href="https://polifonia-project.eu/people/" target="_blank" rel="noopener noreferrer" >Team</a>
            <a href="https://polifonia-project.eu/partners/" target="_blank" rel="noopener noreferrer" >Partners</a>
            <a href="https://polifonia-project.eu/stakeholders/" target="_blank" rel="noopener noreferrer" >Stakeholders</a>
          </div>
          <div className={classes.flexFour}>
            <p className={classes.flexTitle}>Privacy</p>
            <br></br>
            <Link onClick={() => {onChange()}}  to="/terms">Terms</Link>
            <Link onClick={() => {onChange()}}  to="/cookies">Cookies</Link>
          </div>
        </div>
        <div className={classes.footerCloser}>
        <p>Polifonia H2020 is licensed under a Creative Commons Attribution 4.0 International License</p>
        </div>
      </div>
    </div>
  );
}


export default Footer;