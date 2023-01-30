import React from 'react';
import classes from "./Clips.module.css";
import Clip from '../ui/clipUi/Clip';

class Clips extends React.Component {
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
            }
            )
    }


    render() {
        return (
            <div className={classes.clipscontainer} id='clips_container'>
                    {this.state.clips.map((clip, index) => (
                        <Clip 
                        key={index} 
                        title={clip.name} 
                        color={this.state.categories[clip.category].color} 
                        category = {clip.category} 
                        section={'section-'+ clip.category} 
                        clip_id={'clip'+ index} 
                        infotitle={clip.textcontext.title} 
                        description={clip.textcontext.description} 
                        highlights={clip.textcontext.highlights}></Clip>
                    ))}

            </div>
        )
    }
}

export default Clips;