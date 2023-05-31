# external libraries
from SPARQLWrapper import SPARQLWrapper, JSON
from sonicclient import SearchClient, IngestClient, ControlClient
from flask import jsonify

# internal libraries
import methods
import reconciliation as rec

g = methods.read_json('conf_general.json')


def get_sparql_results(query, endpoint):
    """
    Parameters
    ----------
    Returns
    -------
    """

    sparql = SPARQLWrapper(endpoint)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    results = {result['entity']['value']: result['entityLabel']['value']
               for result in results['results']['bindings'] if len(result['entityLabel']['value']) > 0}
    return results


def sonic_ingest(data, collection, bucket='entities'):
    """
    Parameters
    ----------

    Returns
    -------
    """
    with IngestClient(g['index_host'], g['index_channel'], g['index_pw']) as ingestcl:
        for iri, label in data.items():
            print(iri, label.lower())
            ingestcl.ping()
            ingestcl.push(collection, bucket, iri, label.lower())


def index_per_category(datasets, categories, cat_id):
    cat_name = categories[cat_id]['name']
    index_dict = {}
    for pattern in categories[cat_id]['search_pattern']:
        pattern_query = pattern['query']
        dataset = pattern['dataset']
        if datasets[dataset]['query_method'] == 'sparql_endpoint':
            sparql_endpoint = datasets[dataset]['sparql_endpoint']
            pattern_data = get_sparql_results(pattern_query, sparql_endpoint)
            # qui è dove devo popolare il linkset perché ho gli uri associati al loro dataset
            rec.linkset_file_population(datasets, dataset, pattern_data.keys())
            print('[SUCCESS] got data from endpoint:', sparql_endpoint)
            index_dict.update(pattern_data)
            print('[SUCCESS] ingestion for:', cat_name.lower())
    # ingest
    sonic_ingest(index_dict, cat_name.lower())


def ingest_data(datasets, categories):
    for cat in categories:
        is_ingested = False if 'status' not in categories[cat] else True

        cat_name = categories[cat]['name']
        # FIRST INGESTION
        if is_ingested == False:
            index_per_category(datasets, categories, cat)
            print('[SUCCESS] ingestion for:', cat_name.lower())
            #  change status in categories config
            categories[cat]['status'] = 'ingested'
            methods.update_json(g['data_sources']['categories'], categories)
            rec.triples_to_linkset_edpoint(rec.LINKSET_FILE)
        else:
            print('[UPDATE] data already ingested for', cat_name.lower())


# def sonic_suggest(cat, word):
#     with SearchClient(g['index_host'], g['index_channel'], g['index_pw']) as querycl:
#         print(querycl.ping())
#         return querycl.suggest(cat, 'entities', word)


def sonic_query(cat, word):
    with SearchClient(g['index_host'], g['index_channel'], g['index_pw']) as querycl:
        print(querycl.ping())
        return querycl.query(cat, 'entities', word)


def suggested_results(d, c, cat_id, word):
    suggestions = {}
    cat = c[cat_id]['name']
    # search ids for each suggestion
    ids = sonic_query(cat, word)
    unique_ids = set(ids)

    # associate each id to the correct endpoint
    entries_to_search = {}
    search_patterns = c[cat_id]['search_pattern']
    for pattern in search_patterns:
        entry_id_list = []
        d_id = pattern['dataset']
        iri_base = d[d_id]['iri_base']
        query_method = d[d_id]['query_method']
        endpoint = d[d_id][query_method]
        for id in unique_ids:
            if iri_base in id:
                entry_id_list.append('<' + id + '>')
        entries_to_search[endpoint] = entry_id_list

    # query each endpoint with all the values to have the labels
    for k, v in entries_to_search.items():
        endpoint = k
        values_to_search = ' '.join(v)
        label_query = '''
        SELECT DISTINCT ?entity (SAMPLE(?entityLabel) AS ?entityLabel)
        WHERE {
            VALUES ?entity {'''+values_to_search+'''} .
            ?entity <http://www.w3.org/2000/01/rdf-schema#label>|<http://www.w3.org/2004/02/skos/core#prefLabel> ?entityLabel .
            OPTIONAL { 
                FILTER (langMatches(lang(?entityLabel), "en"))
                BIND (?entityLabel AS ?entityLabel) 
                }
        } GROUP BY ?entity
        '''
        results = get_sparql_results(label_query, endpoint)
        suggestions.update(results)
    print(suggestions)
    return suggestions
