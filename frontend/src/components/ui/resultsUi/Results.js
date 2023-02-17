import React from "react";
import ResultLine from "./ResultLine";
import Filters from "./Filters";
import FiltersContainer from "./FiltersContainer";
import ResultsHeader from "./ResultsHeader";
import FilterButton from "./FilterButton";
// import classes from "./Results.module.css" 

class ResultsTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filtersResults: [],
            filtered: [],
            filterOn: false,
            relationOn: false,
            relations: []
        }
    };

    filterItem = (curcat) => {
        const newItem = (this.state.filtersResults).filter((newVal) => newVal.cat === curcat);
        this.setState({ filtered: newItem });
        this.setState({ filterOn: true });
        console.log(this.filtered);
    }

    resetFilters = () => {
        this.setState({ filterOn: false });
    }

    render() {
        let Data = [];
        if (this.state.filterOn === true) {
            Data = this.state.filtered;
        } else if (this.state.filterOn === false) {
            Data = this.state.filtersResults;
        }
        return (
            <div>
                <ResultsHeader>
                <FiltersContainer>
                    <FilterButton isDisabled={this.state.filterOn} resetClass = 'resetButton' buttonClick={() => this.resetFilters()}>
                      Reset <span className="resetIcon">⟲</span>
                    </FilterButton> <br/>
                    <Filters filtersType="Filters" color= {this.props.color} selectedOn={this.state.filterOn}>
                        {Object.keys(this.props.filters).map(f => {
                            return (
                                <FilterButton isDisabled={true} buttonClick={() => this.filterItem(f)} selectedOn={this.state.filterOn}>{f}</FilterButton>
                            )
                        })}
                    </Filters>
                    <Filters filtersType="Relations" color= {this.props.color} selectedOn={this.state.relationOn}>
                        {this.state.relations.map(rel => {
                            return (
                                <FilterButton isDisabled={true} selectedOn={this.state.relationOn}>{rel}</FilterButton>
                            )
                        })}
                    </Filters>
                </FiltersContainer>
                </ResultsHeader>
                <div style= {{height: '390px', overflow: 'scroll' }}>
                    {Data.map((res, index) => {
                        return (
                            <ResultLine label={res.label} rel={res.rel} cat={res.cat} number={index + 1}></ResultLine>
                        )
                    })}
                </div>
            </div>
        )
    }

    componentDidMount = () => {
        let results = [];

        let relations = [];

        // get dataset
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
                                        data.results.bindings.forEach(res => {
                                            let singleResult = {}
                                            singleResult.uri = res.entity.value;
                                            singleResult.label = res.entityLabel.value;
                                            singleResult.cat = cat;
                                            singleResult.rel = res.relIdentityLabel.value;
                                            results.push(singleResult);
                                            if (!relations.includes(res.relIdentityLabel.value)) {
                                                relations.push(res.relIdentityLabel.value);
                                            }
                                        }
            )});
                            }
                            catch (err) {
                                console.log(err)
                            }
                        } else {
                            console.log('Different iri base.')
                        }
                    }
                }
            })
        console.log(results)
        this.setState({ filtersResults: results });
        this.setState({ relations: relations })
    };
}

export default ResultsTest;