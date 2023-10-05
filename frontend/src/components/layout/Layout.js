import React from "react";
import classes from "./Layout.module.css";
import MainNavigation from "./MainNavigation";
import CookieConsent from "react-cookie-consent";

function Layout(props) {

  return (
    <div>
      <MainNavigation sectionName={props.title}/>
      <main className={classes.main}>{props.children}</main>
      <CookieConsent
      style={{ padding: "20px", fontFamily: "Helvetica Light", backgroundColor: "#2d3637" }}
      buttonStyle={{ borderRadius: "20px", fontFamily: "Helvetica Light", padding: "8px 15px 8px 15px" }}
      >This website uses technical cookies to ensure you get the best experience on our website.</CookieConsent>
    </div>
  );
}

export default Layout;
