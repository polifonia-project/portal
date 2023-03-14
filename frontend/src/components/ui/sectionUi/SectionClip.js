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
      value_obj: {},
      input: "",
      isFocused: false,
      mainClip: this.props.el_iri,
    };
  };


  handleInput = (e) => {
    this.props.onQuery((e.target.getAttribute('el_iri')));
  }

  componentDidMount = () => {
    fetch("/conf_info")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ clips: data.clips });
        this.setState({ categories: data.categories });
      });
  };

  onSearchChange = (event, category) => {
    // to update state
    this.setState({ input: event.target.value });
    this.setState({ searchField: event.target.value });
    let request = "/index?data=" + event.target.value + "&cat_id=" + category;
    fetch(request)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ value_obj: data });
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
  onClickReset = e => {
    this.setState({ input: '' });
    this.props.setInputValue(this.props.placeholder);
    this.setState({ value_obj: {} });
    this.props.onQuery(this.state.mainClip);
  };
  onOptionClick = e => {
    this.setState({ input: e.currentTarget.innerText });
    this.props.setInputValue(e.currentTarget.innerText);
    this.setState({ value_obj: {} });
    this.props.onQuery(e.currentTarget.getAttribute('el_iri'));
    console.log(e.currentTarget.getAttribute('el_iri'));
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
            el_iri={this.props.el_iri}
            onChange={(e) => this.onSearchChange(e, this.props.category)}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            value={this.state.input}
            onKeyDown={this.onKeyDown}
            onInput={(e) => this.handleInput(e)}
          ></input>
          <button type="reset" className={classes.resetbutton} onClick={this.onClickReset} el_iri={this.props.el_iri}>
            <img alt='search button' src={this.state.isFocused ? closeicon : blankicon}></img>
          </button>
          <button type="submit" className={classes.searchbutton} onClick={this.onClickSearch}>
            <img alt='search button' src={searchicon}></img>
          </button>
        </div>
        <div className={classes.suggestionsContainer}>
          {
            Object.keys(this.state.value_obj).map((key) => (
              <p onClick={this.onOptionClick} className={classes.suggestionoption} el_iri={key}>{this.state.value_obj[key]}</p>
            ))
          }
        </div>
      </div>


    )
  }
}

export default SectionClip;