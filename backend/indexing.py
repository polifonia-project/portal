# external libraries
from SPARQLWrapper import SPARQLWrapper, JSON
from sonicclient import SearchClient, IngestClient, ControlClient

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
    with IngestClient(g["index_host"], g["index_channel"], g["index_pw"]) as ingestcl:
        for iri, label in data.items():
            print(iri, label)
            ingestcl.ping()
            ingestcl.push(collection, bucket, iri, label)


def index_per_category(d, c):
    for cat in c:
        cat_name = c[cat]['name']
        index_dict = {}
        for pattern in c[cat]['search_pattern']:
            pattern_query = pattern['query']
            dataset = pattern['dataset']
            if d[dataset]['query_method'] == 'sparql_endpoint':
                sparql_endpoint = d[dataset]['sparql_endpoint']
                pattern_data = get_sparql_results(
                    pattern_query, sparql_endpoint)
                print("[SUCCESS] got data from endpoint:", sparql_endpoint)
                pattern_data = {result["entity"]["value"]: result["entityLabel"]["value"]
                                for result in pattern_data["results"]["bindings"] if len(result["entityLabel"]["value"]) > 0}
                index_dict.update(pattern_data)
                print('[SUCCESS] ingestion for:', cat_name.lower())
        # ingest
        sonic_ingest(index_dict, cat_name.lower())
