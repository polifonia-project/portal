import React from "react";

class Paragraph extends React.Component {
    constructor() {
        super();
        this.state = {
            endpoints: []
        }
    }

    componentDidMount = () => {
        fetch('/data')
            .then((res) => res.json())
            .then((data) => {
                this.setState({ endpoints: data })
            }
            )
    }

    render() {
        return (
            <div>
                <p>This is a list of endpoints:</p>
                <ul>
                    {this.state.endpoints.map((endpoint, index) => (
                        <li key={index}>{endpoint}</li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default Paragraph;