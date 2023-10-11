# builtin libraries
import os

# external libraries
from sonicclient import SearchClient, IngestClient, ControlClient
from flask import jsonify
import urllib.parse

# internal libraries
import methods
import reconciliation as rec

g = methods.read_json('conf_general.json')


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
            try:
                ingestcl.ping()
                ingestcl.push(collection, bucket, iri, label.lower())
            except Exception as e:
                print(e)


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


def suggested_results(d, c, cat_id, word, entities_dir):
    suggestions = {}
    cat = c[cat_id]['name']
    # search ids for each suggestion
    ids = sonic_query(cat, word)
    unique_ids = set(ids)

    # iterate over entities file and search for the ones that have one of the unique_ids
    for filename in os.listdir(entities_dir):
        split_name = filename.strip('.json').split('__')
        # when true, open file to access info
        if split_name[1] == cat_id:
            entities_file_data = methods.read_json(entities_dir+'/'+filename)
            # iterate over the uris
            for uri in unique_ids:
                # if uri in file
                if uri in entities_file_data:
                    print('LABEL', entities_file_data[uri]['label'])
                    # append uri and its label to suggestions dict
                    suggestions[urllib.parse.unquote(uri)] = entities_file_data[uri]['label']
                    
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