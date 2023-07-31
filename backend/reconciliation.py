# external libraries
from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import URIRef, Literal, Dataset
from rdflib.namespace import SDO, RDFS, OWL


# internal methods
import linkset_endpoint as endpoint

WHITE_LIST = ['wikidata', 'dbpedia', 'viaf', 'discogs']
WHITE_LIST_PARAM = {
    'wikidata': {
        'endpoint': 'https://query.wikidata.org/sparql',
        'property_path': 'owl:sameAs|skos:exactMatch|schema:sameAs|wdt:P2888|^owl:sameAs|^skos:exactMatch|^schema:sameAs|^wdt:P2888'
    },
    'dbpedia': ['schema:sameAs', 'owl:sameAs', 'skos:exactMatch'],
    'viaf': {
        'endpoint': 'https://query.wikidata.org/sparql',
        'query': 'wdt:P214|^wdt:P214'
    },
    'discogs': {'redirect_to': 'wikidata'}
}


# altro parametro tipo lista con sparqlenpoint
def query_same_as_internal(uri_list):
    values_to_search = ' '.join(uri_list)
    if len(values_to_search) < 1500:
        find_query = '''
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX schema: <https://schema.org/>
        SELECT DISTINCT ?origin_uri ?same_uri
        WHERE {
            VALUES ?origin_uri {'''+values_to_search+'''} .
            ?same_uri owl:sameAs|skos:exactMatch|schema:sameAs|^owl:sameAs|^skos:exactMatch|^schema:sameAs ?origin_uri .
        }
        '''
        return find_query
    else:
        print('[NEED ACTION] values_to_search too long.')


def query_same_as_external(uri_list, property_path):
    values_to_search = ' '.join(uri_list)
    if len(values_to_search) < 1500:
        find_query = '''
        SELECT DISTINCT ?origin_uri ?same_uri
        WHERE {
            VALUES ?origin_uri {'''+values_to_search+'''} .
            ?same_uri '''+property_path+''' ?origin_uri .
        }
        '''
        return find_query
    else:
        print('[NEED ACTION] values_to_search too long.')


def find_matches(query, endpoint):
    sparql = SPARQLWrapper(endpoint)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    results = {result['origin_uri']['value']: result['same_uri']['value']
               for result in results['results']['bindings'] if len(result['same_uri']['value']) > 0}
    # {origin_uri: same_uri}
    return results


def add_quads_to_conj_graph(ds, graph_name, dataset_1, dataset_1_label, uri_1, same_uri, dataset_2, dataset_2_label):
    named_graph = ds.graph(URIRef(graph_name))
    # uri_1
    named_graph.add((URIRef(uri_1), SDO.location, URIRef(dataset_1)))
    named_graph.add((URIRef(uri_1), OWL.sameAs, URIRef(same_uri)))
    named_graph.add((URIRef(dataset_1), RDFS.label,
                    Literal(dataset_1_label, lang="en")))
    # same_uri
    named_graph.add((URIRef(same_uri), SDO.location, URIRef(dataset_2)))
    named_graph.add((URIRef(same_uri), OWL.sameAs, URIRef(uri_1)))
    named_graph.add((URIRef(dataset_2), RDFS.label,
                    Literal(dataset_2_label, lang="en")))
    print(f'[UPDATE] Dataset updated for Graph {graph_name}')
    return ds


def first_level_reconciliation(uris_list, datasets, dataset_id, category_id, linkset_namespace, file):
    uris_to_search = []
    graph_names_dict = {}
    ds = Dataset()
    ds.parse(file)

    for index, uri in enumerate(uris_list):
        # generate unique graphnames for each uri and store in dictionary
        GRAPH_NAME = linkset_namespace + dataset_id + '/' + category_id + \
            '/' + str(index)  # I can work on generlising this
        graph_names_dict[uri] = GRAPH_NAME
        if any((match := substring) in uri for substring in WHITE_LIST):
            print(match, 'try something else')
        else:
            uris_to_search.append('<' + uri + '>')
    print('TO SEARCH', uris_to_search)
    # find matches in all datasets - 1st level of reconciliation
    if len(uris_to_search) > 0:
        for d in datasets:
            sparql_endpoint = datasets[d]['sparql_endpoint']
            query = query_same_as_internal(uris_to_search)
            same_uris_dict = find_matches(query, sparql_endpoint)
            for origin_uri, same_uri in same_uris_dict.items():
                if origin_uri != same_uri:
                    ds_updated = add_quads_to_conj_graph(
                        ds, graph_names_dict[origin_uri], datasets[dataset_id]['iri_base'], datasets[dataset_id]['name'], origin_uri, same_uri, datasets[d]['iri_base'], datasets[d]['name'])
                    ds = ds_updated
        ds.serialize(destination=file, format='nquads', encoding='US-ASCII')
