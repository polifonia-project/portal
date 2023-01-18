import React from 'react';
import classes from "./Sections.module.css";

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
                <p>List of sections:</p>
                <ul>
                    {this.state.clips.map((clip, index) => (
                        <li key={index}>
                            <p>{clip.name}</p>
                            <input
                                type={'search'}
                                placeholder='change'
                                onChange={this.onSearchChange}
                            ></input>
                        </li>
                    ))}
                </ul>
                <div>
                    {this.state.value_list.map((res, index) => (
                        <p key={index}>{res}</p>
                    )
                    )}
                </div>
            </div>
        )
    }
}

export default Sections;