# builtin libraries
import json


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
