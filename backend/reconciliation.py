# external libraries
from SPARQLWrapper import SPARQLWrapper, POST, JSON, DIGEST
from rdflib import Graph, URIRef, Literal
from rdflib.namespace import SDO, RDFS, OWL


# internal methods
import linkset_endpoint as endpoint

WHITE_LIST = ['wikidata', 'dbpedia', 'viaf', 'discogs']
WHITE_LIST_PARAM = {
    'wikidata': {},
    'dbpedia': {},
    'viaf': {},
    'discogs': {}
}


# altro parametro tipo lista con sparqlenpoint
def query_same_as_internal(uri_list):
    values_to_search = ' '.join(uri_list)
    if len(values_to_search) < 1500:
        find_query = '''
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        SELECT DISTINCT ?origin_uri ?same_uri
        WHERE {
            VALUES ?origin_uri {'''+values_to_search+'''} .
            ?same_uri owl:sameAs|skos:exactMatch|^owl:sameAs|^skos:exactMatch ?origin_uri .
        }
        '''
        return find_query
    else:
        print('[NEED ACTION] values_to_search too long.')


def find_matches(uri_list, endpoint):
    sparql = SPARQLWrapper(endpoint)
    # qui potrei generalizzare, parametro query che cambia??
    query = query_same_as_internal(uri_list)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    results = {result['origin_uri']['value']: result['same_uri']['value']
               for result in results['results']['bindings'] if len(result['same_uri']['value']) > 0}
    # {origin_uri: same_uri}
    return results


def add_triples_to_linkset_file(g, dataset_1, dataset_1_label, uri_1, same_uri, dataset_2, dataset_2_label):
    # uri_1
    g.add((URIRef(uri_1), SDO.location, URIRef(dataset_1)))
    g.add((URIRef(uri_1), OWL.sameAs, URIRef(same_uri)))
    g.add((URIRef(dataset_1), RDFS.label, Literal(dataset_1_label, lang="en")))
    # same_uri
    g.add((URIRef(same_uri), SDO.location, URIRef(dataset_2)))
    g.add((URIRef(same_uri), OWL.sameAs, URIRef(uri_1)))
    g.add((URIRef(dataset_2), RDFS.label, Literal(dataset_2_label, lang="en")))
    print('[UPDATE] linkset file updated')


def linkset_file_population(datasets, dataset, uri_list):
    linkset_graph = parse_ntriple_linkest(endpoint.LINKSET_FILE)
    uris_to_search = []
    for uri in uri_list:
        if any((match := substring) in uri for substring in WHITE_LIST):
            linkset_graph.add((URIRef(uri), SDO.location,
                              URIRef(datasets[dataset]['iri_base'])))
            linkset_graph.add((URIRef(datasets[dataset]['iri_base']), RDFS.label, Literal(
                datasets[dataset]['name'], lang="en")))
            write_ntriple_linkset(linkset_graph, endpoint.LINKSET_FILE)
            print(match, 'try something else')
        else:
            uris_to_search.append('<' + uri + '>')
    print('TO SEARCH', uris_to_search)
    # find matches in all datasets
    if len(uris_to_search) > 0:
        for d in datasets:
            sparql_endpoint = datasets[d]['sparql_endpoint']
            same_uris_dict = find_matches(uris_to_search, sparql_endpoint)
            for origin_uri, same_uri in same_uris_dict.items():
                if origin_uri != same_uri:
                    add_triples_to_linkset_file(linkset_graph, datasets[dataset]['iri_base'], datasets[dataset]['name'],
                                                origin_uri, same_uri, datasets[d]['iri_base'], datasets[d]['name'])
        write_ntriple_linkset(linkset_graph, endpoint.LINKSET_FILE)
        print('[SUCCESS] linkest file population complete')
