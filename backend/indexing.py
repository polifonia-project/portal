# builtin libraries
import os

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
    user_agent = 'mondoboia/1.0 (https://github.com/mondoboia; mondoboia@example.org)'
    sparql = SPARQLWrapper(endpoint, agent=user_agent)
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


def sonic_flush_index(collection):
    """
    Parameters
    ----------

    Returns
    -------
    """
    with IngestClient(g['index_host'], g['index_channel'], g['index_pw']) as ingestcl:
        print('FLUSHED ', collection)
        ingestcl.flush(collection)


def index_per_category(cat_id, cat_name, entities_dir):
    '''ingest data for each category iterating over the entities files for that category'''
    index_dict = {}

    # iterate over entities file and search for the ones that have cat_id
    for filename in os.listdir(entities_dir):
        split_name = filename.strip('.json').split('__')
        # when true, open file to access info
        if split_name[1] == cat_id:
            entities_file_data = methods.read_json(entities_dir+'/'+filename)
            for entity_uri in entities_file_data:
                index_dict[entity_uri] = entities_file_data[entity_uri]['label']
    # flush
    sonic_flush_index(cat_name)
    print('[DELETE] flushed index for:', cat_name)
    # ingest
    sonic_ingest(index_dict, cat_name)
    print('[SUCCESS] ingestion for:', cat_name)


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

def ingest_generic_index(categories, entities_dir):
    for cat in categories:
        cat_name = categories[cat]['name'].lower()

        is_ingested = False if 'status' not in categories[cat] else True
        # FIRST INGESTION
        if is_ingested == False:
            index_per_category(cat, cat_name, entities_dir)
            #  change status in categories config
            categories[cat]['status'] = 'ingested'
            methods.update_json(g['data_sources']['categories'], categories)
        else:
            print('[UPDATE] data already ingested for', cat_name)

def ingest_reconciled_index():
    pass

def ingest_chosen_index( categories, entities_dir, index_type='GENERIC'):
    '''initilise correct sonic index based on type'''
    if index_type == 'GENERIC':
        ingest_generic_index(categories, entities_dir)
    elif index_type == 'RECONCILED':
        ingest_reconciled_index()
    pass