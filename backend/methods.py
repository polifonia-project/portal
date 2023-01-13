#builtin libraries
import json

#external libraries
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

def access_conf_info(file_path):
    '''
    

    Args:
        

    Returns:
        
    '''
    #read general conf
    g = read_json(file_path)
    #read feed json
    f = read_json(g['data_sources']['feed'])
    #read dataset json
    d = read_json(g['data_sources']['datatsets'])
    #read feed json
    c = read_json(g['data_sources']['categories'])
    return d, c, f

def query_sparql(endpoint, subject):
    """
    Parameters
    ----------
    Returns
    -------
    """

    value = '<'+subject+'>'
    # print('IRI BASE', value)
    QUERY = """SELECT DISTINCT ?s (SAMPLE(?label) AS ?l)
    WHERE { 
        """+value+""" a ?type . 
        ?s a ?type . 
        ?s rdfs:label ?label .
        } GROUP BY ?s"""

    data = get_sparql_results(QUERY, endpoint)
    # print("[SUCCESS] query endpoint:", endpoint)
    data = {result["s"]["value"]: result["l"]["value"]
            for result in data["results"]["bindings"] if len(result["l"]["value"]) > 0}
    return data

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
