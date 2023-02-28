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
            activeRelations: [],
            filterOn: false,
            relationOn: false,
            relations: [],
            relationSet: {},
            disabled: {}
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
        if (this.state.relationOn) {
            let thisFilter = 'filter';
            this.combineFilters(currentFilters, thisFilter);
        } else {
            this.applyFilter(currentFilters);
        }

        // set filter on 
        if (currentFilters.length === 0) {
            this.setState({ filterOn: false });
            this.setState(prevState => {
                let disabled = Object.assign({}, prevState.disabled);  
                Object.keys(disabled).forEach(v => disabled[v] = true);                             
                return { disabled };                                 
              })
            
        } else {
            this.setState({ filterOn: true });
            this.setState(prevState => {
                let disabled = Object.assign({}, prevState.disabled);  
                Object.keys(disabled).forEach(v => disabled[v] = false);
                currentFilters.forEach (f => disabled[f] = !disabled[f]);                              
                return { disabled };                                 
              })
        }

    }

    addRelation = (curcat) => {
        // register added or removed filters to list
        let currentFilters = this.state.activeRelations;
        if (this.state.activeRelations.indexOf(curcat) > -1) {
            const newFilters = currentFilters.filter((item) => item !== curcat);
            currentFilters = newFilters;
        } else {
            currentFilters.push(curcat)
        }
        this.setState({ activeRelations: currentFilters });

        // apply filters
        if (this.state.filterOn) {
            let thisRelation = 'relation';
            this.combineFilters(currentFilters, thisRelation);
        } else {
            this.applyFilter(currentFilters);
        }

        // set filter on 
        if (currentFilters.length === 0) {
            this.setState({ relationOn: false });
        } else {
            this.setState({ relationOn: true });
        }

    }

    applyFilter = (currentFilters) => {
        // apply filters thare are inside one list
        const newItem = (this.state.totalResults).filter((newVal) => currentFilters.indexOf(newVal.cat) > -1 || currentFilters.indexOf(newVal.rel) > -1);
        this.setState({ filteredResults: newItem });
    }

    combineFilters = (currentFilters, lastOne) => {
        // apply filters thare are inside both lists
        let otherFilters = [];
        let newItemCombined = [];
        if (lastOne === 'relation') {
            otherFilters = this.state.activeFilters;
        } else if (lastOne === 'filter') {
            otherFilters = this.state.activeRelations;
        }
        const newItem = (this.state.totalResults).filter((newVal) => otherFilters.indexOf(newVal.cat) > -1 || otherFilters.indexOf(newVal.rel) > -1);
        newItemCombined = (newItem).filter((newVal) => currentFilters.indexOf(newVal.cat) > -1 || currentFilters.indexOf(newVal.rel) > -1);
        if (currentFilters.length === 0) {
            newItemCombined = newItem;
        }

        this.setState({ filteredResults: newItemCombined });
    }

    resetFilters = () => {
        this.setState({ filterOn: false });
        this.setState({ relationOn: false });
        this.setState({ activeFilters: [] });
        this.setState({ activeRelations: [] });
        this.setState(prevState => {
            let disabled = Object.assign({}, prevState.disabled);  
            Object.keys(disabled).forEach(v => disabled[v] = true)  ;                             
            return { disabled };                                 
          })
        
    }

    render() {
        let Data = [];
        if (this.state.activeFilters.length > 0 || this.state.activeRelations.length > 0) {
            Data = this.state.filteredResults;
        } else if (this.state.activeFilters.length === 0 && this.state.activeRelations.length === 0) {
            Data = this.state.totalResults;
        }
        return (
            <div>
                <ResultsHeader>
                    <FiltersContainer>
                        <FilterButton isDisabled={this.state.filterOn || this.state.relationOn} resetClass='resetButton' buttonClick={() => this.resetFilters()}>
                            Reset <span className="resetIcon">⟲</span>
                        </FilterButton> <br />
                        <Filters filtersType="Filters" color={this.props.color} selectedOn={this.state.filterOn}>
                            {Object.keys(this.props.filters).map(f => {
                                return (
                                    <FilterButton isDisabled={true} buttonClick={() => this.addFilter(f)} selectedOn={this.state.filterOn}>{f}</FilterButton>
                                )
                            })}
                        </Filters>
                        <Filters filtersType="Relations" color={this.props.color} selectedOn={this.state.relationOn}>
                            {Object.entries(this.state.relationSet).map(set => {
                                return set[1].map(rel => {
                                    return (
                                        <FilterButton isDisabled={this.state.disabled[set[0]]} buttonClick={() => this.addRelation(rel)} selectedOn={this.state.relationOn}>{rel}</FilterButton>
                                    )
                                })
                                
                            })}
                        </Filters>
                    </FiltersContainer>
                </ResultsHeader>
                <div style={{ height: '400px', overflow: 'scroll' }}>
                    {Data.map((res, index) => {
                        return (
                            <ResultLine label={res.label} rel={res.rel} cat={res.cat} number={index + 1} color={this.props.color} input_value={this.props.input_value} ></ResultLine>
                        )
                    })}
                </div>
            </div>
        )
    }

    fetchResults = (uri) => {
        let results = [];
        let relations = [];
        let relationSet = {};
        let disabled = {};
        // get dataset
        fetch('/datasets')
            .then((res) => res.json())
            .then((data) => {
                for (const cat in this.props.filters) {
                    for (const obj of this.props.filters[cat]) {
                        let dataset_id = obj.dataset
                        let iri_base = data[dataset_id].iri_base
                        // check if iri_base and el_iri are part of the same dataset
                        if ((uri).includes(iri_base)) {
                            let query_method = data[dataset_id].query_method
                            let endpoint = data[dataset_id][query_method]
                            let query = obj.query;
                            query = query.replace('<>', '<' + uri + '>');
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

                                            if (!relationSet[singleResult.cat]) {
                                                relationSet[singleResult.cat] = [];
                                                disabled[singleResult.cat] = true;
                                                if (!relationSet[singleResult.cat].includes(res.relIdentityLabel.value)) {
                                                    relationSet[singleResult.cat].push(res.relIdentityLabel.value)
                                                }
                                            } else {
                                                if (!relationSet[singleResult.cat].includes(res.relIdentityLabel.value)) {
                                                    relationSet[singleResult.cat].push(res.relIdentityLabel.value)
                                                }
                                            }
                                            this.setState({ totalResults: results });
                                            this.setState({ relations: relations });
                                            this.setState({ relationSet: relationSet });
                                            this.setState({ disabled: disabled })
                                        }
                                        )
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
            })
    }

    componentDidMount = () => {
        this.fetchResults(this.props.el_iri)
    };

    componentDidUpdate = (prevProps) => {
        if (this.props.el_iri !== prevProps.el_iri) {
            console.log('NEW URI', this.props.el_iri)
            this.fetchResults(this.props.el_iri);
        }
    }
}

export default ResultsTest;