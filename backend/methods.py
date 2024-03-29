# builtin libraries
import json
import os

# external libraries
from SPARQLWrapper import SPARQLWrapper, JSON, SPARQLExceptions
import requests

# internal methods
import conf


def read_json(file_name):
    '''
    Open and read json file.

    Args:
        file_name (str): a string that specifies the name of the json file to read.

    Returns:
        data (dict): a dictionary containing the content of the json file.
    '''
    with open(file_name) as config_form:
        data = json.load(config_form)
        return data


def update_json(file_name, json_read):
    '''
    Update and dump a new json file.

    Args:
            file_name (str): a string that specifies the name of the json file to update.
            json_read (dict): the dictionary that contains data to update the json file.
    '''
    with open(file_name, 'w') as config_update:
        config_update.write(json.dumps(json_read, ensure_ascii=False, indent=4))


def access_conf_info(file_path):
    '''


    Args:


    Returns:

    '''
    # read general conf
    g = read_json(file_path)
    # read feed json
    f = read_json(g['data_sources']['feed'])
    # read dataset json
    d = read_json(g['data_sources']['datasets'])
    # read feed json
    cat = read_json(g['data_sources']['categories'])
    # read carousel json
    car = read_json(g['data_sources']['carousel'])
    # read cards json
    cards = read_json(g['data_sources']['cards'])
    return d, cat, f, car, cards


def get_sparql_results(query, endpoint):
    """
    Parameters
    ----------
    Returns
    -------
    """
    user_agent = conf.sparql_wrapper_user_agent
    sparql = SPARQLWrapper(endpoint, agent=user_agent)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = {}
    try:
        results = sparql.query().convert()
        results = {result['entity']['value']: result['entityLabel']['value']
                for result in results['results']['bindings'] if len(result['entityLabel']['value']) > 0}
        return results
    except Exception as e:
        url = endpoint
        params = {'query': query}
        payload = {}
        headers = {
            'Accept': 'application/json'
        }

        response = requests.get(url, headers=headers, params=params, data=payload)
        results = response.json()
        results = {result['entity']['value']: result['entityLabel']['value']
                for result in results['results']['bindings'] if len(result['entityLabel']['value']) > 0}
        return results



def create_entities_files(categories, datasets):
    '''create a file for each dataset_category to contain a list of their entities'''
    dat_cat_object = {}
    for dat in datasets:
        is_parsed = False if 'status' not in datasets[dat] else True
        if is_parsed == False:
            dat_cat_object[dat] = []

    for cat in categories:
        for pattern in categories[cat]['search_pattern']:
            dataset_id = pattern['dataset']
            if dataset_id in dat_cat_object:
                dataset_list = dat_cat_object[pattern['dataset']]
                dataset_list.append(cat)
                dat_cat_object[pattern['dataset']] = dataset_list
    
    os.makedirs('entities', exist_ok=True)
    for d, cat_list in dat_cat_object.items():
        for cat in cat_list:
            name = d + '__' + cat
            content_object = {}
            with open('entities/' + name + '.json', 'w') as f:
                json.dump(content_object, f)


def collect_entities_uris(categories, cat_id, datasets, d_id):
    # given a category and a dataset retrieve a list of entities based on the specified query
    for pattern in categories[cat_id]['search_pattern']:
        if pattern['dataset'] == d_id:
            pattern_query = pattern['query']
            dataset = d_id
            if datasets[dataset]['query_method'] == 'sparql_endpoint':
                sparql_endpoint = datasets[dataset]['sparql_endpoint']
                pattern_data = get_sparql_results(
                    pattern_query, sparql_endpoint)
                print(
                    f"[SUCCESS] got {categories[cat_id]['name']} data from {sparql_endpoint}.")
    return pattern_data


def fill_entities_files(state, categories, datasets, directory):
    if state == 'ON':
        # create files that will host the entities
        create_entities_files(categories, datasets)

        # iterate over the files in the entities folder
        for filename in os.listdir(directory):
            # set the list that will host entities for a dataset_category
            entities_file = read_json(directory+'/'+filename)
            entities_list = []
            # get dataset and category from filename
            split_name = filename.strip('.json').split('__')
            dat_id = split_name[0]
            cat_id = split_name[1]
            # check if dataset already parsed
            is_parsed = False if 'status' not in datasets[dat_id] else True
            if is_parsed == False:
            # send query for that cat to the dat endpoint and retrieve dict uri:label
                entities_data = collect_entities_uris(categories, cat_id, datasets, dat_id)
                # get list of uris using keys method
                entities_uris = entities_data.keys()
                entities_list.extend(entities_uris)
                for entity in entities_list:
                    entity_info = {
                        'sameAs': False,
                        'label': entities_data[entity]
                    }
                    entities_file[entity] = entity_info

                # put everything in the corresponding json file
                update_json(directory+'/'+filename, entities_file)

        print('[SUCCESS] filled entities files')
    else:
        print('Please turn ON state in fill_entities_files if you want to fill in the entities folder')


def divide_list_in_chunks(l, step):
    '''create a list composed of step-sized chunks from l.'''
    list_in_chunks = [l[i * step:(i + 1) * step]
                      for i in range((len(l) + step - 1) // step)]
    return list_in_chunks


def create_chunks(l):
    '''given a list, divide it n times so that each part is never >= to 1500. return a list of lists'''
    # start dividing the list length in half
    n = 2
    list_in_chunks = divide_list_in_chunks(l, round(len(l)/n))
    while len(' '.join(list_in_chunks[0])) >= 1000:
        n += 1
        list_in_chunks = divide_list_in_chunks(l, round(len(l)/n))
    else:
        return list_in_chunks
