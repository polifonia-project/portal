# builtin libraries
import os
import json

# external libraries
from sonicclient import SearchClient, IngestClient, ControlClient
from flask import jsonify
import urllib.parse
import difflib


# internal libraries
import methods
import reconciliation as rec
import linkset_endpoint as endpoint
import conf

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
        print('[DELETE] flushed index for:', collection)


def index_per_category(cat_id, cat_name, entities_dir, reconciled_index):
    '''ingest data for each category iterating over the entities files for that category'''
    index_dict = {}
    graphs_labels_pairs = {}

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
                # prepare dictionary with named_graph: label
                # iterate over options in preferred_labels
                # when possible add the label for the first option, then for the second
                for uri, graph in uri_graph_match.items():
                    hostname = urllib.parse.urlparse(uri).hostname
                    if graph not in graphs_labels_pairs:
                        # create new dict to contain history for label and source uri 
                        labels_dict = {}
                    else:
                        labels_dict = graphs_labels_pairs[graph]
                    # add hostname: label to the labels_dict to later check and retrieve label based on prefferd ones
                    labels_dict[hostname] = entities_file_data[uri]['label']
                    graphs_labels_pairs[graph] = labels_dict

    if reconciled_index == True:    
        for graph, labels_dict in graphs_labels_pairs.items():
            # select the preferred label if it exists
            if hostname not in conf.preferred_iribase_for_labels:
                for label in labels_dict.values():
                    index_dict[graph] = label
                    break
            else:
                for iribase in conf.preferred_iribase_for_labels:
                    if hostname in iribase:
                        index_dict[graph] = labels_dict[hostname]
        # put everything in file to access labels for suggestion
        labels_dir_path = os.path.dirname(os.path.realpath(__file__))+'/index_labels'
        os.makedirs(labels_dir_path, exist_ok=True)
        # check if file for cat already exists, else create it an add/update content
        cat_labels_file_path = labels_dir_path + cat_id + '.json'
        if os.path.exists(cat_labels_file_path):
            cat_labels_file_content = methods.read_json()
            index_dict.update(cat_labels_file_content)
            methods.update_json(cat_labels_file_path, index_dict)
        else:
            with open('index_labels/' + cat_id + '.json', 'w') as f:
                json.dump(index_dict, f)
    print('CHECK DICT TO INGEST', index_dict)
    # ingest
    sonic_ingest(index_dict, cat_name)
    print('[SUCCESS] ingestion for:', cat_name)


def similarity(string1, string2):
    '''calculates the similarity between two string using the difflib library'''
    return difflib.SequenceMatcher(None, string1, string2).ratio()

def order_dict_by_similarity(input_str, input_dict):
    '''order dictionary based on similarity to a given string. return the ordered dict'''
    return dict(sorted(input_dict.items(), key=lambda x: similarity(input_str, x[1]), reverse=True))


def sonic_query(cat, word):
    with SearchClient(g['index_host'], g['index_channel'], g['index_pw']) as querycl:
        print(querycl.ping())
        return querycl.query(cat, 'entities', word, 100)


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
    sorted_suggestions = order_dict_by_similarity(word, suggestions)
    sliced_suggestions = list(sorted_suggestions.items())
    result_suggestions = dict(sliced_suggestions)
    return result_suggestions

def clean_index(cat_name, cat_id):
    # flush
    sonic_flush_index(cat_name)

    # empty cat labels file
    labels_dir_path = os.path.dirname(os.path.realpath(__file__))+'/index_labels'
    cat_labels_file_path = labels_dir_path + cat_id + '.json'
    if os.path.exists(cat_labels_file_path):
        os.remove(cat_labels_file_path)
        print(f"File {cat_labels_file_path} in {labels_dir_path} removed.")
    else:
        print(f"File {cat_labels_file_path} in {labels_dir_path} does not exist.")

def ingest_index(datasets, categories, entities_dir, reconciled_index):
    for cat in categories:
        cat_name = categories[cat]['name'].lower()

        is_ingested = False if 'status' not in categories[cat] else True
        # FIRST INGESTION
        if is_ingested == False:
            # clear first both index and labels file
            clean_index(cat_name, cat)
            index_per_category(cat, cat_name, entities_dir, reconciled_index)
            #  change status in categories config
            categories[cat]['status'] = 'ingested'
            methods.update_json(g['data_sources']['categories'], categories)
        else:
            print('[UPDATE] data already ingested for', cat_name)
    for d in datasets:
        #  change status in datasets config
        datasets[d]['status'] = 'parsed'
    methods.update_json(g['data_sources']['datasets'], datasets)