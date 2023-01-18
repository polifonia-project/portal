import React from "react";
import LoremIpsumContent from "../components/ui/LoremIpsumContent";

function DataStoriesPage(props) {

  props.func('Data');

    return (
        <section>
          <LoremIpsumContent title="Data"/>
        </section>
      );
}

export default DataStoriesPage;