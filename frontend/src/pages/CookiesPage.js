import React, { useEffect } from "react";
import classes from "./CookiesPage.module.css";
import Footer from "../components/layout/Footer";
import VisibilitySensor from "react-visibility-sensor";

function CookiesPage(props) {

  useEffect(() => {
    props.func('Cookies');
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
    <div div className={classes.CookiesPageContainer}>
      <VisibilitySensor onChange={onChange}>
        <div className={classes.visibilityHook}>X</div>
      </VisibilitySensor>
      <div className={classes.introContainer}>
      </div>
      <div className={classes.textContainer} id="corpus-section">
        <h3>Cookies</h3>
        <p>At Polifonia Portal, we are committed to safeguarding your privacy online. This Privacy Policy outlines how we use technical cookies on our website to enhance your user experience.</p>
        <h4>1. What Are Technical Cookies?</h4>
        <p>Technical cookies are essential for the proper functioning of our website. They are small text files that are stored on your device when you visit our website. These cookies enable basic functions like page navigation, secure areas of the website, and other essential features. Technical cookies do not collect any personal information.</p>

        <h4>2. How We Use Technical Cookies</h4>
        <p>We use technical cookies to:</p>
        <ul>
          <li><strong>Ensure Site Functionality:</strong> Technical cookies are necessary to provide you with access to secure areas and ensure the website functions as intended.</li>
          <li><strong>Improve Performance:</strong> These cookies help us optimize the performance of our website, ensuring a smooth user experience.</li>
          <li><strong>Remember Your Preferences:</strong> Technical cookies remember your preferences, such as language or region, to enhance your browsing experience.</li>
        </ul>

        <h4>3. Third-Party Cookies</h4>
        <p>We do not use third-party cookies on our website. All cookies used are under our control and are used solely for the purposes stated in this policy.</p>

        <h4>4. Managing Cookies</h4>
        <p>Most web browsers allow you to control cookies through their settings preferences. However, restricting technical cookies may impact the functionality of our website. By continuing to use our website, you consent to the use of these necessary technical cookies.</p>

        <h4>5. Data Security</h4>
        <p>We prioritize the security of your data. Technical cookies do not store sensitive information, ensuring your privacy and security while using our website.</p>

        <h4>6. Updates to This Policy</h4>
        <p>We may update this Privacy Policy to reflect changes in our cookie practices. We encourage you to review this page periodically for the latest information on our use of technical cookies.</p>

        <p>If you have any questions about our use of technical cookies or our privacy practices, please contact us at <a href="mailto:info@polifonia-project.eu">info@polifonia-project.eu</a>.</p>

        <p>Thank you for trusting Polifonia Portal with your privacy.</p>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default CookiesPage;