import React from "react";
import classes from "./SectionClip.module.css";
import VisibilitySensor from 'react-visibility-sensor';
import isDarkColor from 'is-dark-color';
import { ThemeContext } from "../../../context/ThemeContext";
import searchicon from '../../../assets/svg/magnglass.svg';
import closeicon from '../../../assets/svg/closesearch.svg';
import blankicon from '../../../assets/svg/blanksearch.svg';
import Remainder from "./Remainder";

class SectionClip extends React.Component {

  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      clips: [],
      categories: [],
      searchField: "",
      value_list: [],
      input: "",
      isFocused: false
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
    this.setState({ input: event.target.value })
    this.setState({ searchField: event.target.value });
    let request = "/index?data=" + event.target.value + "&cat_id=" + category;
    fetch(request)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        this.setState({ value_list: Object.values(data) });
      });
  };

  onVisibilityChange = (isVisible) => {
    if (isVisible) {
      document.getElementById("mainHeader").style.backgroundColor = this.props.color;
      document.getElementById("mainHeader").style.borderImageWidth = '0px  0px 0px 0px';
      document.getElementById("categoriesNav").style.backgroundColor = this.props.color;
      if (isDarkColor(this.props.color)) {
        this.context.setTheme('dark');
        document.getElementById("mainLogo").style.filter = 'brightness(0) invert(1)';
        document.getElementById("sectionName").style.color = 'white';
        document.getElementById("menuOptions").style.filter = 'brightness(0) invert(1)';
      } else {
        this.context.setTheme('default');
        document.getElementById("mainLogo").style.filter = 'none';
        document.getElementById("sectionName").style.color = 'black';
        document.getElementById("menuOptions").style.filter = 'none';
      };
    }

  };

  onFocus = () => { this.setState({ isFocused: true }) };
  onBlur = () => { this.setState({ isFocused: false }) };
  onClickSearch = () => { window.console.log('search start') };
  onClickReset = () => {
    this.setState({ input: '' });
    this.setState({ value_list: [] });
  };
  onOptionClick = e => {
    this.setState({ input: e.currentTarget.innerText });
    this.setState({ value_list: [] });
  };


  render() {
    return (
      <div className={classes.sectionClipContainer + ' ' + classes['sectionclip-' + this.props.category]}>
        <VisibilitySensor onChange={this.onVisibilityChange}>
          <Remainder catName={this.props.catName} focus={this.state.isFocused} color={this.props.color}></Remainder>
        </VisibilitySensor>
        <div className={classes.sectionClip}>
          <input
            type={'search'}
            placeholder={this.props.placeholder}
            onChange={(e) => this.onSearchChange(e, this.props.category)}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            value={this.state.input}
            onKeyDown={this.onKeyDown}
          ></input>
          <button type="reset" className={classes.searchbutton} onClick={this.onClickReset}>
            <img alt='search button' src={this.state.isFocused ? closeicon : blankicon}></img>
          </button>
          <button type="submit" className={classes.searchbutton} onClick={this.onClickSearch}>
            <img alt='search button' src={searchicon}></img>
          </button>
        </div>
        <div className={classes.suggestionsContainer}>
          {this.state.value_list.map((res, index) => (
            <p key={index} onClick={this.onOptionClick} className={classes.suggestionoption}>{res}</p>
          ))}
        </div>
      </div>


    )
  }
}

export default SectionClip;