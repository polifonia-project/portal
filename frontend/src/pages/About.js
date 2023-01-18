import React from "react";
import LoremIpsumContent from "../components/ui/LoremIpsumContent";

function AboutPage(props) {

  props.func('About');

    return (
        <section>
         <LoremIpsumContent title="About"/>
        </section>
      );
}

export default AboutPage;