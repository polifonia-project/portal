import React from "react";
import { useEffect } from "react";
import LoremIpsumContent from "../components/ui/LoremIpsumContent";

function AboutPage(props) {

  useEffect(() => {
    props.func('About');
  });

    return (
        <section>
         <LoremIpsumContent title="About"/>
        </section>
      );
}

export default AboutPage;