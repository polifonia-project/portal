import React from 'react';

class Feed extends React.Component {
    constructor() {
        super();
        this.state = {
            clips: []
        }
    }

    componentDidMount = () => {
        fetch('/feed')
            .then((res) => res.json())
            .then((data) => {
                this.setState({ clips: data })
                console.log(data)
            }
            )
    }

    render() {
        return (
            <div>
                <p>List of clips:</p>
                <ul>
                    {this.state.clips.map((clip, index) => (
                        <li key={index}>{clip.name}</li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default Feed;