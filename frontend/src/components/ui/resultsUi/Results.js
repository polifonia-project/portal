import React from "react";
import ResultLine from "./ResultLine";
import Filters from "./Filters";
import FiltersContainer from "./FiltersContainer";
import ResultsHeader from "./ResultsHeader";
import FilterButton from "./FilterButton";
import LoaderResultLine from "../loaders/LoaderResultLine";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadMoreResults from "../loaders/LoadMoreResults";
import NoMoreResults from "../loaders/NoMoreResults";
import NoResultsError from "../loaders/NoResultsError";
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
            disabled: {},
            loader: false,
            hasMore: true,
            offsetValue: 0,
            catOffset: {}
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
                currentFilters.forEach(f => disabled[f] = !disabled[f]);
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
            Object.keys(disabled).forEach(v => disabled[v] = true);
            return { disabled };
        })

    }

    fetchMoreData = () => {
        this.fetchResults(this.props.el_iri, false);
        return;
    }

    render() {
        let Data = [];
        if (this.state.activeFilters.length > 0 || this.state.activeRelations.length > 0) {
            Data = this.state.filteredResults;
        } else if (this.state.activeFilters.length === 0 && this.state.activeRelations.length === 0) {
            Data = this.state.totalResults;
        }
        return (
            <>
                <ResultsHeader>
                    <FiltersContainer>
                        <FilterButton isDisabled={this.state.filterOn || this.state.relationOn} resetClass='resetButton' buttonClick={() => this.resetFilters()}>
                            Reset <span className="resetIcon">⟲</span>
                        </FilterButton> <br />
                        <Filters filtersType="Categories" color={this.props.color} selectedOn={this.state.filterOn}>
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
                {this.state.loader
                    ? <NoResultsError />
                    : <div>
                        <div style={{ height: '400px', overflow: 'scroll' }}>
                            <InfiniteScroll
                                dataLength={Data.length}
                                next={this.fetchMoreData}
                                hasMore={this.state.hasMore}
                                loader={<LoadMoreResults />}
                                height={400}
                                endMessage={<NoMoreResults />}
                            >
                                {Data.map((res, index) => {
                                    return (
                                        <ResultLine label={res.label} rel={res.rel} cat={res.cat} number={index + 1} color={this.props.color} input_value={this.props.input_value} isdirect={res.inverse}></ResultLine>
                                    )
                                })}
                            </InfiniteScroll>
                        </div>
                    </div>
                }
            </>
        )
    }

    fetchResults = (uri, newState = true) => {

        let results = [];
        let relations = [];
        let relationSet = {};
        let disabled = {};
        // get offset value
        let queryOffset = 0;
        // get offset switch per category
        let catOffset = {};
        for (const cat in this.props.filters) {
            catOffset[cat] = true;
        }


        if (newState === false) {
            results = this.state.totalResults;
            relations = this.state.relations;
            relationSet = this.state.relationSet;
            disabled = this.state.disabled;
            queryOffset = this.state.offsetValue;
            catOffset = this.state.catOffset;
        }

        this.setState({ loader: true });

        // get dataset
        let datasets = this.props.datasets;
        // define the LIMIT value for each query, that is proportional to the number of filters on a max of 20
        let catNum = Object.keys(this.props.filters).length;
        let queryLimit = Math.round(20 / catNum);
        let queryLimitString = 'LIMIT ' + queryLimit.toString();

        let queryOffsetString = 'OFFSET ' + queryOffset.toString();

        for (const cat in this.props.filters) {
            for (const obj of this.props.filters[cat]) {
                let dataset_id = obj.dataset
                let iri_base = datasets[dataset_id].iri_base
                // check if iri_base and el_iri are part of the same dataset
                if ((uri).includes(iri_base)) {
                    let query_method = datasets[dataset_id].query_method
                    let endpoint = datasets[dataset_id][query_method]
                    let query = obj.query;
                    query = query.replaceAll('<>', '<' + uri + '>');
                    query = query.concat(' ', queryOffsetString).concat(' ', queryLimitString);
                    let url = endpoint + '?query=' + encodeURIComponent(query);
                    try {
                        fetch(url, {
                            method: 'GET',
                            headers: { 'Accept': 'application/sparql-results+json' }
                        })
                            .then((res) => res.json())
                            .then((data) => {

                                let dataLen = data.results.bindings.length;

                                if (dataLen > 0) {
                                    data.results.bindings.forEach(res => {
                                        let singleResult = {}
                                        singleResult.uri = res.entity.value;
                                        singleResult.label = res.entityLabel.value;
                                        singleResult.cat = cat;
                                        singleResult.rel = '';
                                        singleResult.inverse = false;
                                        if (res.inverse_rel) {
                                            if (res.inverse_rel.value.length !== '') {
                                                singleResult.rel = res.inverse_rel.value;
                                                singleResult.inverse = true;
                                            } else {
                                                singleResult.rel = res.rel.value;
                                                singleResult.inverse = false;
                                            }
                                        } else {
                                            singleResult.rel = res.rel.value;
                                            singleResult.inverse = false;
                                        }
                                        results.push(singleResult);
                                        if (!relations.includes(singleResult.rel)) {
                                            relations.push(singleResult.rel);
                                        }

                                        if (!relationSet[singleResult.cat]) {
                                            relationSet[singleResult.cat] = [];
                                            disabled[singleResult.cat] = true;
                                            if (!relationSet[singleResult.cat].includes(singleResult.rel)) {
                                                relationSet[singleResult.cat].push(singleResult.rel)
                                            }
                                        } else {
                                            if (!relationSet[singleResult.cat].includes(singleResult.rel)) {
                                                relationSet[singleResult.cat].push(singleResult.rel)
                                            }
                                        }
                                        this.setState({ totalResults: results });
                                        this.setState({ relations: relations });
                                        this.setState({ relationSet: relationSet });
                                        this.setState({ disabled: disabled });
                                        this.setState({ loader: false })
                                    }
                                    )
                                    if (dataLen < queryLimit) {
                                        catOffset[cat] = false;
                                        this.setState({ catOffset: catOffset })
                                        if (!Object.values(catOffset).includes(true)) {
                                            this.setState({ hasMore: false })
                                        }
                                    } else {
                                        catOffset[cat] = true;
                                        this.setState({ catOffset: catOffset });
                                    }
                                }
                                else {
                                    this.setState({ loader: false })
                                    catOffset[cat] = false;
                                    this.setState({ catOffset: catOffset })
                                    if (!Object.values(catOffset).includes(true)) {
                                        this.setState({ hasMore: false })
                                    }
                                }
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
        this.setState({ offsetValue: queryOffset + queryLimit });

    }

    componentDidMount = () => {
        this.fetchResults(this.props.el_iri)
    };

    componentDidUpdate = (prevProps) => {
        if (this.props.el_iri !== prevProps.el_iri) {
            console.log('NEW URI', this.props.el_iri)
            this.setState({ hasMore: true });
            this.setState({ loader: true });
            this.fetchResults(this.props.el_iri);
        }
    }
}

export default ResultsTest;