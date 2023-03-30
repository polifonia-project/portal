import React from "react";
import classes from "./LinkBlock.module.css";


function LinkBlock(props) {

  return (
    <div className={classes.cardBlockContainer} style={{width: 'calc(' + props.width + '% - 25px)'}}>
      <p className={classes.blockTitle}><span>Useful Links</span></p>
      <div className={classes.cardBlockBox}>
      <p className={classes.blockParagraph}>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
      <div className={classes.linksContainer}>
      <button className={classes.linkButton}>Share</button>
      <button className={classes.linkButton}>Link to website</button>
      <button className={classes.linkButton}>Genius Lyrics</button>
      <button className={classes.linkButton}>Spotify</button>
      <button className={classes.linkButton}>Corpus</button>
      <button className={classes.linkButton}>Corpus</button>
      </div>
    </div>
    </div>
  );
}


export default LinkBlock;