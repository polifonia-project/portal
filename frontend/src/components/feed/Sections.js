import React from "react";
import classes from "./Sections.module.css";
import SectionContainer from "../ui/sectionUi/SectionContainer.js";
import backTopButton from '../../assets/svg/backToTop.svg';

class Sections extends React.Component {
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

      });
  };

  handleBackScroll = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  };

  render() {
    return (
      <div className={classes.sectionscontainer}>
        <button className={classes.backtotop} onClick={() => this.handleBackScroll("topHook")} ><img alt='back to top button' src={backTopButton}/></button>
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
            alt_colors={this.state.categories[clip.category].card.altcolors}
            card_blocks={this.state.categories[clip.category].card.blocks}
            >
          </SectionContainer>
        ))}
      </div>
    );
  }
}

export default Sections;
