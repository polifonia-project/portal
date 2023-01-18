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
                console.log(data.categories)
            }
            )
    }

    render() {
        return (
            <div className={classes.clipscontainer}>
                <p>List of clips:</p>
                <ul>
                    {this.state.clips.map((clip, index) => (
                        
                        <Clip key={index} title={clip.name} color={index.color}></Clip>
                        
                    ))}
                </ul>
            </div>
        )
    }
}

export default Clips;