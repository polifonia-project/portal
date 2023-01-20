# external libraries
from SPARQLWrapper import SPARQLWrapper, JSON
from sonicclient import SearchClient, IngestClient, ControlClient
from flask import jsonify

# internal libraries
import methods

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
            print('[SUCCESS] got data from endpoint:', sparql_endpoint)
            pattern_data = {result['entity']['value']: result['entityLabel']['value']
                            for result in pattern_data['results']['bindings'] if len(result['entityLabel']['value']) > 0}
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
        else:
            print('[UPDATE] data already ingested for', cat_name.lower())


def sonic_suggest(cat, word):
    with SearchClient(g['index_host'], g['index_channel'], g['index_pw']) as querycl:
        print(querycl.ping())
        return {'result': querycl.suggest(cat, 'entities', word, limit=10)}
