import React from "react";
import classes from "./CategoriesNav.module.css";

class CategoriesNav extends React.Component {
  constructor() {
    super();
    this.state = {
      clips: [],
      categories: []
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

  handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  render() {
    return (
      <div className={classes.categoriesContainer} id='categoriesNav'>
        {Object.values(this.state.categories).map((cat, index) =>
          <div key={'nav'+index}>
            <button onClick={() => this.handleClickScroll("section-"+cat.id)}>
              {cat.name}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default CategoriesNav;
