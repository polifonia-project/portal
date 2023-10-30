# builtin libraries
import os
import json

# external libraries
from sonicclient import SearchClient, IngestClient, ControlClient
from flask import jsonify
import urllib.parse


# internal libraries
import methods
import reconciliation as rec
import linkset_endpoint as endpoint

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
            try:
                ingestcl.ping()
                ingestcl.push(collection, bucket, urllib.parse.quote(iri), label.lower())
            except Exception as e:
                print(iri, label.lower())
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


def index_per_category(cat_id, cat_name, entities_dir, reconciled_index):
    '''ingest data for each category iterating over the entities files for that category'''
    index_dict = {}
    graphs_labels_set= {}

    # iterate over entities file and search for the ones that have cat_id
    for filename in os.listdir(entities_dir):
        split_name = filename.strip('.json').split('__')
        # when true, open file to access info
        if split_name[1] == cat_id:
            entities_file_data = methods.read_json(entities_dir+'/'+filename)
            if reconciled_index == False:
                # create index with uris
                for entity_uri in entities_file_data:
                    index_dict[entity_uri] = entities_file_data[entity_uri]['label']
            elif reconciled_index == True:
                uri_graph_match = rec.index_reconciliation(entities_file_data.keys(), endpoint.UPDATEMYLINKSET)
                # prepare dictionary with named_graph: set(label1, label2, labeln)
                for uri, graph in uri_graph_match.items():
                    if graph not in graphs_labels_set:
                        labels_set = set()
                        labels_set.add(entities_file_data[uri]['label'])
                        graphs_labels_set[graph] = labels_set
                    elif graph in graphs_labels_set:
                        labels_set = graphs_labels_set[graph]
                        labels_set.add(entities_file_data[uri]['label'])
                        graphs_labels_set[graph] = labels_set

    if reconciled_index == True:        
        for graph, labels_set in graphs_labels_set.items():
            # select the longest label
            index_dict[graph] = max(labels_set, key=len)
        # put everything in file to access labels for suggestion
        labels_dir_path = os.path.dirname(os.path.realpath(__file__))+'/index_labels'
        os.makedirs(labels_dir_path, exist_ok=True)
        
        with open('index_labels/' + cat_id + '.json', 'w') as f:
            json.dump(index_dict, f)
    print('CHECK DICT TO INGEST', index_dict)
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


def suggested_results(d, c, cat_id, word, reconciled_index):
    suggestions = {}
    cat = c[cat_id]['name']
    # search ids for each suggestion
    ids = sonic_query(cat, word)
    unique_ids = set(ids)
    entities_dir = ''
    if reconciled_index == True:
        entities_dir = 'index_labels'
    else:
        entities_dir = 'entities'
    # iterate over entities file and search for the ones that have one of the unique_ids
    for filename in os.listdir(entities_dir):
        # when true, open file to access info
        if cat_id in filename:
            entities_file_data = methods.read_json(entities_dir+'/'+filename)
            # iterate over the uris
            for uri in unique_ids:
                uri = urllib.parse.unquote(uri)
                # if uri in file
                if uri in entities_file_data:
                    if reconciled_index == True:
                        print('LABEL', entities_file_data[uri])
                        # append uri and its label to suggestions dict
                        suggestions[uri] = entities_file_data[uri]                       
                    else:
                        print('LABEL', entities_file_data[uri]['label'])
                        # append uri and its label to suggestions dict
                        suggestions[uri] = entities_file_data[uri]['label']
                    
    print(suggestions)
    return suggestions

def ingest_index(categories, entities_dir, reconciled_index):
    for cat in categories:
        cat_name = categories[cat]['name'].lower()

        is_ingested = False if 'status' not in categories[cat] else True
        # FIRST INGESTION
        if is_ingested == False:
            index_per_category(cat, cat_name, entities_dir, reconciled_index)
            #  change status in categories config
            categories[cat]['status'] = 'ingested'
            methods.update_json(g['data_sources']['categories'], categories)
        else:
            print('[UPDATE] data already ingested for', cat_name)

# def ingest_reconciled_index(categories, entities_dir):
#     for cat in categories:
#         cat_name = categories[cat]['name'].lower()

#         is_ingested = False if 'status' not in categories[cat] else True
#         # FIRST INGESTION
#         if is_ingested == False:
#             index_per_category(cat, cat_name, entities_dir)
#             #  change status in categories config
#             categories[cat]['status'] = 'ingested'
#             methods.update_json(g['data_sources']['categories'], categories)
#         else:
#             print('[UPDATE] data already ingested for', cat_name)

# def ingest_chosen_index(categories, entities_dir, reconciled_index=False):
#     '''initilise correct sonic index based on type'''
#     ingest_generic_index(categories, entities_dir, reconciled_index)
#     elif reconciled_index == True:
#         print('here')
#         ingest_reconciled_index(categories, entities_dir, reconciled_index)
#     pass