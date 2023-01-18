import React from "react";
import { useEffect } from "react";
import LoremIpsumContent from "../components/ui/LoremIpsumContent";

function DataStoriesPage(props) {
  useEffect(() => {
    props.func('Data');
  });

    return (
        <section>
          <LoremIpsumContent title="Data"/>
        </section>
      );
}

export default DataStoriesPage;