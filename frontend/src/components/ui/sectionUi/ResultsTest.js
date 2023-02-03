import React from "react";
// import classes from "./ResultsTest.module.css" 

class ResultsTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filtersResults: []
        }
    };

    render() {
        return (
            <div>
                <div>
                    {Object.keys(this.props.filters).map(f => (
                        <button>{f}</button>
                    ))}
                </div>
                <div>
                    {this.state.filtersResults.map(res => (
                        <p>{res.label}</p>
                    ))}
                </div>
            </div>
        )
    }

    componentDidMount = () => {
        let results = [];
        for (const obj of this.props.filters.people) {
            let endpoint = obj.endpoint;
            let query = obj.query;
            query = query.replace('<>', '<' + this.props.el_iri + '>');
            let url = endpoint + '?query=' + encodeURIComponent(query);
            try {
                fetch(url, {
                    method: 'GET',
                    headers: { 'Accept': 'application/sparql-results+json' }
                })
                    .then((res) => res.json())
                    .then((data) => {
                        data.results.bindings.map(res => {
                            let singleResult = {}
                            singleResult.uri = res.entity.value;
                            singleResult.label = res.entityLabel.value;
                            results.push(singleResult)
                        })
                    });
            }
            catch (err) {
                console.log(err)
            }
        }
        this.setState({ filtersResults: results });
    };
}

export default ResultsTest;