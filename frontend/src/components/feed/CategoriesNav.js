import React from "react";
import classes from "./CategoriesNav.module.css"

function CategoriesNav() {

    const handleClickScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };

    return(
        <div className={classes.categoriesContainer}>
            <div><button onClick={() => handleClickScroll("section-0")}>Topics</button></div>
            <div><button>Tunes</button></div>
            <div><button>Genres</button></div>
            <div><button>Lyrics</button></div>
            <div><button>Scores</button></div>
            <div><button>People</button></div>
            <div><button>Places</button></div>
            <div><button>Instruments</button></div>
        </div>
    )

}

export default CategoriesNav;