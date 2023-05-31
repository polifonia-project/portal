import React from "react";
import classes from "./Sections.module.css";
import SectionContainer from "../ui/sectionUi/SectionContainer.js";
import Carousel from "./Carousel";
import SectionIntro from '../ui/sectionUi/SectionIntro.js';
import { CardContext } from "../../context/CardContext";

class Sections extends React.Component {

  static contextType = CardContext;

  constructor() {
    super();
    this.state = {
      clips: [],
      categories: [],
      datasets: []
    };
  }

  componentDidMount = () => {
    fetch("/conf_info")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ datasets: data.datasets });
        this.setState({ clips: data.clips });
        this.setState({ categories: data.categories });
        this.context.setCardBlocksNew(data.cards);
      });
  };

  render() {
    return (
      <div className={classes.sectionscontainer}>
        <Carousel />
        <SectionIntro />
       {this.state.clips.map((clip, index) => (
          <SectionContainer
            key={'section-container' + index}
            id={"section-" + clip.category}
            header={this.state.categories[clip.category].section.title}
            description={this.state.categories[clip.category].section.description}
            color={this.state.categories[clip.category].color}
            filters={this.state.categories[clip.category].filters}
            el_iri={clip.iri}
            category={clip.category}
            catName={this.state.categories[clip.category].name}
            datasets={this.state.datasets}
            placeholder={clip.name} 
            tot_categories={Object.keys(this.state.categories).length} 
            >
          </SectionContainer>
        ))}
      </div>
    );
  }
}

export default Sections;
