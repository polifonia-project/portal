import React from 'react';
import classes from "./Clips.module.css";
import Clip from '../ui/Clip';

class Clips extends React.Component {
    constructor() {
        super();
        this.state = {
            clips: [],
            categories: [],
            searchField: '',
            value_list: [],
            color: "green"
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
            <div className={classes.clipscontainer}>
                <div>
                    {this.state.clips.map((clip, index) => (
                        
                        <Clip key={index} title={clip.name} color={this.state.categories[clip.category].color} id={'section-'+index}></Clip>
    
                    ))}

                </div>
            </div>
        )
    }
}

export default Clips;