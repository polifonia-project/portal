# builtin libraries
import json
import os

# external libraries
from SPARQLWrapper import SPARQLWrapper, JSON


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
        config_update.write(json.dumps(json_read, indent=4))


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
    d = read_json(g['data_sources']['datatsets'])
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
    user_agent = 'mondoboia/1.0 (https://github.com/mondoboia; mondoboia@example.org)'
    sparql = SPARQLWrapper(endpoint, agent=user_agent)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    results = [result['entity']['value']
               for result in results['results']['bindings'] if len(result['entityLabel']['value']) > 0]
    return results


def create_entities_files(categories, datasets):
    '''create a file for each dataset_category to contain a list of their entities'''
    dat_cat_object = {}
    for dat in datasets:
        dat_cat_object[dat] = []

    for cat in categories:
        for pattern in categories[cat]['search_pattern']:
            dataset_list = dat_cat_object[pattern['dataset']]
            dataset_list.append(cat)
            dat_cat_object[pattern['dataset']] = dataset_list

    for d, cat_list in dat_cat_object.items():
        for cat in cat_list:
            name = d + '__' + cat
            entities_object = []
            with open('entities/' + name + '.json', 'w') as f:
                json.dump(entities_object, f)


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


def fill_entities_files(state, categories, datasets):
    if state == 'ON':
        # create files that will host the entities
        create_entities_files(categories, datasets)

        # iterate over the files in the entities folder
        directory = 'entities'

        for filename in os.listdir(directory):
            # set the list that will host entities for a dataset_category
            entities_list = read_json(directory+'/'+filename)
            # get dataset and category from filename
            split_name = filename.strip('.json').split('__')
            dat_id = split_name[0]
            cat_id = split_name[1]

            # sed query for that cat to the dat endpoint and retrieve list of uris
            cat_entities = collect_entities_uris(
                categories, cat_id, datasets, dat_id)
            entities_list = cat_entities

            # put everything in the corresponding json file
            update_json(directory+'/'+filename, entities_list)

            return filename, entities_list
    else:
        print('Please turn ON state in fill_entities_files if you want to fill in the entities folder')
