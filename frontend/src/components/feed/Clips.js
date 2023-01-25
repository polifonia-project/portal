import React from 'react';
import classes from "./Clips.module.css";
import Clip from '../ui/Clip';
import Intro from '../ui/Intro';

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
                    <Intro/>
                    {this.state.clips.map((clip, index) => (
                        <Clip key={index} title={clip.name} color={this.state.categories[clip.category].color} section={'section-'+ clip.category} clip_id={'clip'+index}></Clip>
                    ))}

            </div>
        )
    }
}

export default Clips;