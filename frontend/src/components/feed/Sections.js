import React from "react";
import classes from "./Sections.module.css";
import SectionClip from "../ui/sectionUi/SectionClip.js";
import SectionContainer from "../ui/sectionUi/SectionContainer.js";

class Sections extends React.Component {
  constructor() {
    super();
    this.state = {
      clips: [],
      categories: [],
    };
  }

  componentDidMount = () => {
    fetch("/feed")
      .then((res) => res.json())
      .then((data) => {
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
        <button className={classes.backtotop} onClick={() => this.handleBackScroll("topHook")} ></button>
        {this.state.clips.map((clip, index) => (
            <SectionContainer  key={index} id={"section-" + clip.category} header='What about Artists ?' description='Discover all the possible connections and relations with your favorite artist. See all the results and arrenge them as you want.' color={this.state.categories[clip.category].color}>
              <SectionClip key={index} color={this.state.categories[clip.category].color} placeholder={clip.name} category={clip.category} />
            </SectionContainer>
        ))}
      </div>
    );
  }
}

export default Sections;
