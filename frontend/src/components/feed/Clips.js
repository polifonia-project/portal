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
                <ul>
                    {this.state.clips.map((clip, index) => (
                        
                        <Clip key={index} title={clip.name} color={this.state.categories[index].color} id={'section-'+index}></Clip>
    
                    ))}

                </ul>
            </div>
        )
    }
}

export default Clips;