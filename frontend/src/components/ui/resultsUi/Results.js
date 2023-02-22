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
            totalResults: [],
            filteredResults: [],
            activeFilters: [],
            filterOn: false,
            relationOn: false,
            relations: []
        }
    };

    addFilter = (curcat) => {
        // register added or removed filters to list
        let currentFilters = this.state.activeFilters;
        if (this.state.activeFilters.indexOf(curcat) > -1) {
            const newFilters = currentFilters.filter((item) => item !== curcat);
            currentFilters = newFilters;
        } else {
            currentFilters.push(curcat)
        }
        this.setState({ activeFilters: currentFilters });

        // apply filters
        this.applyFilter(currentFilters);

       // set filter on alert
       if (currentFilters.length === 0) {
        this.setState({ filterOn: false });
       } else {
        this.setState({ filterOn: true});
       }

    }

    addRelation = (curcat) => {
        // register added or removed filters to list
        let currentFilters = this.state.activeFilters;
        if (this.state.activeFilters.indexOf(curcat) > -1) {
            const newFilters = currentFilters.filter((item) => item !== curcat);
            currentFilters = newFilters;
        } else {
            currentFilters.push(curcat)
        }
        this.setState({ activeFilters: currentFilters });

        // apply filters
        this.applyFilter(currentFilters);

       // set filter on alert
       if (currentFilters.length === 0) {
        this.setState({ relationOn: false });
       } else {
        this.setState({ relationOn: true});
       }

    }

    applyFilter = (currentFilters) => {
        // apply filters thare are inside list
       const newItem = (this.state.totalResults).filter((newVal) => currentFilters.indexOf(newVal.cat) > -1 || currentFilters.indexOf(newVal.rel) > -1);
       this.setState({ filteredResults: newItem });
    }

    resetFilters = () => {
        this.setState({ filterOn: false });
        this.setState({ relationOn: false });
        this.setState({ activeFilters: [] });
    }

    render() {
        let Data = [];
        if (this.state.activeFilters.length > 0) {
            Data = this.state.filteredResults;
        } else if (this.state.activeFilters.length === 0) {
            Data = this.state.totalResults;
        }
        return (
            <div>
                <ResultsHeader>
                <FiltersContainer>
                    <FilterButton isDisabled={this.state.filterOn || this.state.relationOn} resetClass = 'resetButton' buttonClick={() => this.resetFilters()}>
                      Reset <span className="resetIcon">⟲</span>
                    </FilterButton> <br/>
                    <Filters filtersType="Filters" color= {this.props.color} selectedOn={this.state.filterOn}>
                        {Object.keys(this.props.filters).map(f => {
                            return (
                                <FilterButton isDisabled={true} buttonClick={() => this.addFilter(f)} selectedOn={this.state.filterOn}>{f}</FilterButton>
                            )
                        })}
                    </Filters>
                    <Filters filtersType="Relations" color= {this.props.color} selectedOn={this.state.relationOn}>
                        {this.state.relations.map(rel => {
                            return (
                                <FilterButton isDisabled={true} buttonClick={() => this.addRelation(rel)}  selectedOn={this.state.relationOn}>{rel}</FilterButton>
                            )
                        })}
                    </Filters>
                </FiltersContainer>
                </ResultsHeader>
                <div style= {{height: '400px', overflow: 'scroll' }}>
                    {Data.map((res, index) => {
                        return (
                            <ResultLine label={res.label} rel={res.rel} cat={res.cat} number={index + 1} color= {this.props.color}></ResultLine>
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
        console.log(results);
        this.setState({ totalResults: results });
        this.setState({ relations: relations });
    };
}

export default ResultsTest;