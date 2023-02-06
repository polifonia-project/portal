import React from "react";
// import classes from "./ResultsTest.module.css" 

class ResultsTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filtersResults: [],
            filtered: [],
            filterOn: 'False'
        }
    };

    filterItem = (curcat) => {
        const newItem = (this.state.filtersResults).filter((newVal) => newVal.cat === curcat);
        this.setState({ filtered: newItem });
        this.setState({ filterOn: 'True' });
        console.log(this.filtered);
    }

    resetFilters = () => {
        this.setState({ filterOn: 'False' });
    }

    render() {
        let Data = [];
        if (this.state.filterOn === 'True') {
            Data = this.state.filtered;
        } else if (this.state.filterOn === 'False') {
            Data = this.state.filtersResults;
        }
        return (
            <div>
                <div>
                    {Object.keys(this.props.filters).map(f => {
                        return (
                            <button onClick={() => this.filterItem(f)}>{f}</button>
                        )
                    })}
                    <button onClick={() => this.resetFilters()}>
                        Reset
                    </button>
                </div>
                <div>
                    {Data.map(res => {
                        return (
                            <p>{res.label}</p>
                        )
                    })}
                </div>
            </div>
        )
    }

    componentDidMount = () => {
        let results = [];

        for (const cat in this.props.filters) {
            for (const obj of this.props.filters[cat]) {
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
                                singleResult.cat = cat;
                                results.push(singleResult)
                            })
                        });
                }
                catch (err) {
                    console.log(err)
                }
            }
        }
        this.setState({ filtersResults: results });
    };
}

export default ResultsTest;