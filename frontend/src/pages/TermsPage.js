import React, { useEffect } from "react";
import classes from "./TermsPage.module.css";
import Footer from "../components/layout/Footer";
import VisibilitySensor from "react-visibility-sensor";

function TermsPage(props) {

  useEffect(() => {
    props.func('Terms');
  });
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
    <div div className={classes.TermsPageContainer}>
      <VisibilitySensor onChange={onChange}>
        <div className={classes.visibilityHook}>X</div>
      </VisibilitySensor>
      <div className={classes.introContainer}>
      </div>
      <div className={classes.textContainer} id="corpus-section">

        <h3>Terms of Use</h3>

        <p>These <strong>Terms of Use</strong> govern your use of the Portal. By accessing or using the Portal, you agree to comply with and be bound by these Terms of Use. If you do not agree to these Terms of Use, please do not use the Portal.</p>

        <h4>1. Acceptance of Terms</h4>

        <p>By accessing or using the Portal, you agree to these Terms of Use and all applicable laws and regulations. If you do not agree with these Terms of Use, you are not permitted to use the Portal.</p>

        <h4>2. User Responsibilities</h4>

        <p>You are responsible for your use of the Portal and for any content you post or submit. You agree not to engage in any activity that:</p>

        <ul>
          <li>Violates any law, regulation, or these Terms of Use.</li>
          <li>Interferes with the proper working of the Portal or affects others' use and enjoyment of the Portal.</li>
          <li>Attempts to gain unauthorized access to any part of the Portal.</li>
          <li>Uploads or transmits viruses or other harmful code.</li>
        </ul>

        <h4>4. Intellectual Property</h4>

        <p>The Portal, including its text, graphics, logos, icons, and images, is the property of Polifonia H2020 or its content suppliers and is protected by international copyright laws. The compilation of all content on this site is the exclusive property of Polifonia H2020 and is protected by international copyright laws.</p>

        <h4>5. Termination</h4>

        <p>We reserve the right to terminate or suspend your account and access to the Portal at our sole discretion, without notice, for conduct that we believe violates these Terms of Use or is harmful to other users of the Portal or us, or for any other reason.</p>

        <h4>6. Changes to Terms</h4>

        <p>We may revise these Terms of Use at any time without notice. By using the Portal, you are agreeing to be bound by the then-current version of these Terms of Use.</p>

        <h4>7. Contact Information</h4>

        <p>If you have any questions or concerns about these Terms of Use, please contact us at <a href="mailto:info@polifonia-project.eu">info@polifonia-project.eu</a>.</p>

        <p>Thank you for using the Polifonia H2020 Portal!</p></div>
      <Footer></Footer>
    </div>
  );
}

export default TermsPage;