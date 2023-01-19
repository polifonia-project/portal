import React from 'react';
import classes from "./Sections.module.css";
import SectionClip from '../ui/sectionUi/SectionClip.js';
import Section from '../ui/sectionUi/Section.js';

class Sections extends React.Component {
    constructor() {
        super();
        this.state = {
            clips: [],
            categories: [],
            searchField: '',
            value_list: []
        }
    }

    componentDidMount = () => {
        fetch('/feed')
            .then((res) => res.json())
            .then((data) => {
                this.setState({ clips: data.clips })
                this.setState({ categories: data.categories })
                console.log(data.clips)
            }
            )
    }

    onSearchChange = (event) => {
        // to update state
        this.setState({ searchField: event.target.value });
        console.log(event.target.value)
        let request = '/index?data=' + event.target.value + '&cat=topics';
        console.log(request);
        fetch(request)
            .then(res => res.json())
            .then(data => {
                this.setState({ value_list: data.result });
            })
    }

    render() {
        return (
            <div className={classes.sectionscontainer}>
                    {this.state.clips.map((clip, index) => (
                    <div>
                    <Section ref={"Section"+index}>
                            <SectionClip key={index} color={this.state.categories[index].color}>
                                <input
                                    type={'search'}
                                    placeholder={clip.name}
                                    onChange={this.onSearchChange}
                                    style={{width: 'calc(1.1ch * '+ clip.name.length +')'}}
                                ></input>
                                
                            </SectionClip>
                            <div>
                                {this.state.value_list.map((res, index) => (
                                    <p key={index}>{res}</p>
                                ))}
                            </div>
                    </Section> 
                    </div>
                    ))}
                
            </div>
        )
    }
}

export default Sections;