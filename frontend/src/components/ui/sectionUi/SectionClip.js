import React from "react";
import classes from "./SectionClip.module.css";
import VisibilitySensor from 'react-visibility-sensor';
import isDarkColor from 'is-dark-color';
import { ThemeContext } from "../../../context/ThemeContext";

class SectionClip extends React.Component {

    static contextType = ThemeContext;

    constructor(props) {
        super(props);
        this.state = {
          clips: [],
          categories: [],
          searchField: "",
          value_list: [],
        };
      };

    componentDidMount = () => {
        fetch("/feed")
          .then((res) => res.json())
          .then((data) => {
            this.setState({ clips: data.clips });
            this.setState({ categories: data.categories });
          });
      };
    
    onSearchChange = (event, category) => {
        // to update state
        this.setState({ searchField: event.target.value });
        let request = "/index?data=" + event.target.value + "&cat_id=" + category;
        fetch(request)
          .then((res) => res.json())
          .then((data) => {
            this.setState({ value_list: Object.values(data) });
          });
      };

    onChange = (isVisible) => {
        if (isVisible) {
            document.getElementById("mainHeader").style.backgroundColor = this.props.color;
            document.getElementById("mainHeader").style.borderImageWidth = '0px  0px 0px 0px';
            document.getElementById("categoriesNav").style.backgroundColor = this.props.color;
            if (isDarkColor(this.props.color)) {
              this.context.setTheme('dark');
              document.getElementById("mainLogo").style.filter= 'brightness(0) invert(1)';
              document.getElementById("sectionName").style.color = 'white';
              document.getElementById("menuOptions").style.filter = 'brightness(0) invert(1)';
            } else {
              this.context.setTheme('default');
              document.getElementById("mainLogo").style.filter= 'none';
              document.getElementById("sectionName").style.color = 'black';
              document.getElementById("menuOptions").style.filter = 'none';
            };
    } 
        
  };

render() {
    return (
        <div className={classes.sectionClipContainer +' '+ classes['sectionclip-' + this.props.category]}>
        <VisibilitySensor onChange={this.onChange}>  
            <div className={classes.sectionClip}>
                <span className={classes.dot} style={{ backgroundColor: this.props.color}}></span>
                <textarea
                    type={'search'}
                    placeholder={this.props.placeholder}
                    onChange={(e) => this.onSearchChange(e, this.props.category )}
                    style={{width: 'calc(1.2ch * '+ this.props.placeholder.length +')'}}
                ></textarea>
                <button>Change</button>
                <span className={classes.end_dot} style={{ backgroundColor: this.props.color}}></span>
            </div>
        </VisibilitySensor>
        <div>
                {this.state.value_list.map((res, index) => (
                  <p key={index}>{res}</p>
                ))}
        </div>
        </div>


    )
}}

export default SectionClip;