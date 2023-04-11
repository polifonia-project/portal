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
        fetch('/conf_info')
            .then((res) => res.json())
            .then((data) => {
                this.setState({ clips: data.clips })
                this.setState({ categories: data.categories })
            }
            )
    }


    render() {
        return (
            <div className={classes.clipscontainer + ' ' + classes['background' + Object.keys(this.state.categories).length] } id='clips_container'>
                {this.state.clips.map((clip, index) => (
                    <Clip
                        key={'clip-' + index}
                        title={clip.name}
                        color={this.state.categories[clip.category].color}
                        category={clip.category}
                        section={'section-' + clip.category}
                        clip_id={'clip' + index}
                        infotitle={clip.textcontext.title}
                        description={clip.textcontext.description}
                        highlights={clip.textcontext.highlights}
                        tot_categories={Object.keys(this.state.categories).length} ></Clip>
                ))}

            </div>
        )
    }
}

export default Clips;