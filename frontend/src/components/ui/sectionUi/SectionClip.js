import React from "react";
import classes from "./SectionClip.module.css";
import VisibilitySensor from 'react-visibility-sensor';
import isDarkColor from 'is-dark-color';
import { ThemeContext } from "../../../context/ThemeContext";
import searchicon from '../../../assets/svg/magnglass.svg';
import closeicon from '../../../assets/svg/closesearch.svg';
import blankicon from '../../../assets/svg/blanksearch.svg';
import InfiniteScroll from "react-infinite-scroll-component";
import Remainder from "./Remainder";
import ExpandButton from "./ExpandButton";

class SectionClip extends React.Component {

  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      clips: [],
      categories: [],
      searchField: "",
      value_obj: {}, // Initialize with an empty object
      loadedElements: 10, // Initial number of elements to load
      input: "",
      current_input: this.props.placeholder,
      isFocused: false,
      mainClip: this.props.el_iri,
      isHover: false,
      helpT: '',
      helpTMargin: '400px',
      arrowOption: false,
      breakpointSmall: 500,
      width: window.innerWidth,
      isSmallScreen: false,
    };
  };

  fetchMoreData = () => {
    // Increase the count of loaded elements by 10
    this.setState(prevState => ({
      loadedElements: prevState.loadedElements + 10,
    }));
  };

  handleMouseEnterOption = (e) => {
    this.setState({ arrowOption: false });
    let ul = e.target.parentNode;
    let childern = ul.childNodes;
    childern.forEach(li => {
      this.unStyleOption(li)
    });
    this.styleOption(e.target);
  };

  handleMouseLeaveOption = (e) => {
    this.setState({ arrowOption: false });
    let ul = e.target.parentNode;
    let childern = ul.childNodes;
    childern.forEach(li => {
      li.style.backgroundColor = 'transparent';
    });
  };

  styleOption = (option) => {
    option.style.color = 'black';
    option.style.transform = 'scale(1.05)';
    option.style.paddingLeft = '50px';
  };

  unStyleOption = (option) => {
    option.style.color = 'grey';
    option.style.transform = 'scale(1)';
    option.style.paddingLeft = '10px';
  };

  handleMouseEnter = (t, m) => {
    this.setState({ isHover: true });
    this.setState({ helpT: t });
    this.setState({ helpTMargin: m });
  };

  handleMouseLeave = () => {
    this.setState({ isHover: false });
  };

  handleInput = (e) => {
    this.props.onQuery((e.target.getAttribute('el_iri')));
  }

  componentDidMount = () => {
    fetch("/portal/conf_info")
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
    if (event.target.value === '') {
      this.setState({ value_obj: {} });
      this.setState({ loadedElements: 10 });
      this.setState({ arrowOption: false });
    };
    let request = "/portal/sonic_index?data=" + event.target.value + "&cat_id=" + category;
    fetch(request)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ value_obj: data });
      });

  };

  onVisibilityChange = (isVisible) => {
    if (isVisible) {
      document.getElementById("mainHeader").style.backgroundColor = this.props.color;
      document.getElementById("categoriesNav").style.backgroundColor = this.props.color;
      this.context.setbackToTopOn(true);
      this.context.setCurrentSection(this.props.category);
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
  handleOnSubmit = () => { 
    if (Object.keys(this.state.value_obj).length > 0) {
      if (this.state.arrowOption === false) {
        let label = document.getElementById('option0').innerText;
        let iri = document.getElementById('option0').getAttribute('el_iri');
        this.onArrowClick(iri, label);
      } else {
        let label = document.getElementById('option' + this.state.arrowOption).innerText;
        let iri = document.getElementById('option' + this.state.arrowOption).getAttribute('el_iri');
        this.onArrowClick(iri, label);
      }
      let inputRef = document.getElementById('thisinput' + this.props.catName);
      inputRef.blur();
    }
  };

  onClickReset = e => {
    this.setState({ input: '' });
    this.setState({ current_input: this.props.placeholder });
    this.props.setInputValue(this.props.placeholder);
    this.setState({ value_obj: {} });
    this.setState({ loadedElements: 10 });
    this.setState({ arrowOption: false });
    this.props.onQuery(this.state.mainClip);
  };

  onOptionClick = e => {
    this.setState({ input: e.currentTarget.innerText });
    this.setState({ current_input: e.currentTarget.innerText });
    this.props.setInputValue(e.currentTarget.innerText);
    this.setState({ value_obj: {} });
    this.setState({ loadedElements: 10 });
    this.props.onQuery(e.currentTarget.getAttribute('el_iri'));
  };

  onArrowClick = (iri, label) => {
    this.setState({ input: label });
    this.props.setInputValue(label);
    this.setState({ value_obj: {} });
    this.setState({ loadedElements: 10 });
    this.setState({ arrowOption: false });
    this.props.onQuery(iri);
  };

  handleKeyPress = (e) => {
    const suggestionsContainer = document.getElementById('suggContainer');
    if (!suggestionsContainer) {
      return;
    }
    if (e.key === 'Enter') {
      if (Object.keys(this.state.value_obj).length > 0) {
        if (this.state.arrowOption === false) {
          let label = document.getElementById('option0').innerText;
          let iri = document.getElementById('option0').getAttribute('el_iri');
          this.onArrowClick(iri, label);
        } else {
          let label = document.getElementById('option' + this.state.arrowOption).innerText;
          let iri = document.getElementById('option' + this.state.arrowOption).getAttribute('el_iri');
          this.onArrowClick(iri, label);
        }
        let inputRef = document.getElementById('thisinput' + this.props.catName);
        inputRef.blur();
      }
    }

    else if (e.key === 'ArrowDown') {
      if (this.state.arrowOption === false) {
        this.setState({ arrowOption: 0 });
        this.styleOption(document.getElementById('option0'));
      } else if (this.state.arrowOption === Object.keys(this.state.value_obj).length - 1) {
        this.unStyleOption(document.getElementById('option' + this.state.arrowOption));
        let newNumber = Object.keys(this.state.value_obj).length - 1;
        this.styleOption(document.getElementById('option' + newNumber));
        this.setState({ arrowOption: newNumber });
      } else {
        this.unStyleOption(document.getElementById('option' + this.state.arrowOption));
        let newNumber = this.state.arrowOption + 1;
        this.styleOption(document.getElementById('option' + newNumber));
        this.setState({ arrowOption: newNumber });
      }
    
    } else if (e.key === 'ArrowUp') {
      if (this.state.arrowOption === false) {
        this.setState({ arrowOption: 0 });
        this.styleOption(document.getElementById('option0'));
      } else if (this.state.arrowOption === 0) {
        this.unStyleOption(document.getElementById('option' + this.state.arrowOption));
        let newNumber = 0;
        this.styleOption(document.getElementById('option' + newNumber));
        this.setState({ arrowOption: newNumber });
      } else if (this.state.arrowOption > 0) {
        this.unStyleOption(document.getElementById('option' + this.state.arrowOption));
        let newNumber = this.state.arrowOption - 1;
        this.styleOption(document.getElementById('option' + newNumber));
        this.setState({ arrowOption: newNumber });
      }
    }
  };

  render() {
    const { value_obj, loadedElements } = this.state;
    const keysToDisplay = Object.keys(value_obj).slice(0, loadedElements);
    const height = keysToDisplay.length > 8 ? 300 : 'auto';

    return (
      <div className={classes.sectionClipFlex + ' ' + classes['sectionClipFlex' + this.props.category]}>
        <div className={classes.sectionClipContainer + ' ' + classes['sectionclip-' + this.props.category]}>
          <VisibilitySensor onChange={this.onVisibilityChange}>
            <Remainder catName={this.props.catName} focus={this.state.isFocused} color={this.props.color}></Remainder>
          </VisibilitySensor>
          <div className={classes.sectionClip}>
            <input
              id={'thisinput' + this.props.catName}
              type={'search'}
              placeholder={this.props.placeholder}
              el_iri={this.props.el_iri}
              onChange={(e) => this.onSearchChange(e, this.props.category)}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              value={this.state.input}
              onInput={(e) => this.handleInput(e)}
              onKeyDown={this.handleKeyPress}
              autoComplete="off"
              tabIndex={0} 
            ></input>
            <button type="reset" className={classes.resetbutton} onClick={this.onClickReset}
              el_iri={this.props.el_iri} style={{ cursor: this.state.isFocused ? 'pointer' : 'default' }}
              onMouseEnter={this.state.isFocused ? () => this.handleMouseEnter('Reset',this.props.smallScreen ? '420px': '70vw') : null}
              onMouseLeave={this.handleMouseLeave}>
              <img alt='search button' src={this.state.isFocused ? closeicon : blankicon} ></img>
            </button>
            <button type="submit" className={classes.searchbutton} onClick={this.handleOnSubmit}
              onMouseEnter={() => this.handleMouseEnter('Search', this.props.smallScreen ? '448px': '75vw')}
              onMouseLeave={this.handleMouseLeave}>
              <img alt='search button' src={searchicon}></img>
            </button>
          </div>
          <div className={classes.helpText + ' ' + classes[this.state.isHover ? 'helpTextVisible' : 'helpTextHidden']} style={{ marginLeft: this.state.helpTMargin }}><p>{this.state.helpT}</p></div>
          <ExpandButton
            mouseEnter={() => this.handleMouseEnter('Expand', this.props.smallScreen ? '508px': '86vw')}
            mouseLeave={this.handleMouseLeave}
            label={this.state.current_input}
            cat={this.props.catName}
            color={this.props.color}
            uri={this.props.el_iri}
          ></ExpandButton>
          <div id={'suggContainer'} className={classes.suggestionsContainer} style={{ opacity: this.state.isFocused ? '1' : '0' }}>
          <InfiniteScroll
            dataLength={keysToDisplay.length}
            next={this.fetchMoreData}
            hasMore={true}
            height={height}
            scrollThreshold={0.9}
          >
            {keysToDisplay.map((key, index) => (
            <p
            onClick={this.onOptionClick}
            onMouseEnter={e => this.handleMouseEnterOption(e)}
            onMouseLeave={this.handleMouseLeaveOption}
            className={classes.suggestionoption}
            el_iri={key}
            id={'option' + index}
            key={'option--' + index}
            >
            {value_obj[key]}
            </p>
         ))}
      </InfiniteScroll>
          </div>
        </div>
      </div>


    )
  }
}

export default SectionClip;