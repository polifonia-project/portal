import React from "react";
import classes from "./CardBlock.module.css";


function CardBlock(props) {

  return (
    <div className={classes.cardBlockContainer} style={{width: props.width + '%'}}>
      <p className={classes.blockTitle}>Description</p>
      <div className={classes.cardBlockBox}>
      <p className={classes.blockParagraph}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eget magna a augue venenatis maximus. Maecenas varius venenatis tortor sit amet consectetur. Cras ultricies consequat posuere. Morbi nec molestie nulla. Maecenas placerat nulla vel urna venenatis laoreet. Etiam nunc felis, varius quis dolor non, porttitor finibus lacus. Sed sed ex vitae ex commodo convallis id nec orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus id justo arcu. Proin nisl erat, gravida at orci a, maximus interdum metus. Fusce vitae hendrerit ex. Sed congue, metus sit amet rhoncus sagittis, dolor nulla iaculis nulla, vitae faucibus risus mauris quis risus. Duis pretium non dolor at semper. Curabitur vestibulum augue at tellus pulvinar placerat. Praesent ullam</p>
    </div>
    </div>
  );
}


export default CardBlock;