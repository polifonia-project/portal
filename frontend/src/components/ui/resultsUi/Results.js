import React from "react";
import ResultLine from "./ResultLine";
import Filters from "./Filters";
// import classes from "./Results.module.css" 

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
                <Filters>
                    {Object.keys(this.props.filters).map(f => {
                        return (
                            <button onClick={() => this.filterItem(f)}>{f}</button>
                        )
                    })}
                    <button onClick={() => this.resetFilters()}>
                        Reset
                    </button>
                </Filters>
                <div>
                    {Data.map((res, index) => {
                        return (
                            <ResultLine label = {res.label} number = {index}></ResultLine>
                        )
                    })}
                </div>
            </div>
        )
    }

    componentDidMount = () => {
        let results = [];

        // get datasets
        fetch('/datasets')
            .then((res) => res.json())
            .then((data) => {
                for (const cat in this.props.filters) {
                    for (const obj of this.props.filters[cat]) {
                        let dataset_id = obj.dataset
                        let iri_base = data[dataset_id].iri_base
                        // check if iri_base and el_iri are part of the same dataset
                        if ((this.props.el_iri).includes(iri_base)) {
                            let query_method = data[dataset_id].query_method
                            let endpoint = data[dataset_id][query_method]
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
                        } else {
                            console.log('Different iri base.')
                        }
                    }
                }
                this.setState({ filtersResults: results });
            })
    };
}

export default ResultsTest;