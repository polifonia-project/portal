# external libraries
from SPARQLWrapper import SPARQLWrapper, POST, JSON, DIGEST
from rdflib import Graph, URIRef, Literal
from rdflib.namespace import SDO, RDFS, OWL

UPDATEMYLINKSET = 'http://localhost:9999/blazegraph/namespace/kb/sparql/update'
LILNKSETGRAPH = 'http://w3id.org/polifonia/linkset/'
LINKSET_FILE = 'linkset.nt'

WHITE_LIST = ['wikidata', 'dbpedia', 'viaf', 'discogs']


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
    query = query_same_as_internal(uri_list)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    results = {result['origin_uri']['value']: result['same_uri']['value']
               for result in results['results']['bindings'] if len(result['same_uri']['value']) > 0}
    # {origin_uri: same_uri}
    return results


def linkset_endpoint_update(triples_string):
    sparql = SPARQLWrapper(UPDATEMYLINKSET)
    sparql.setMethod(POST)
    insert_query = '''
        PREFIX schema: <https://schema.org/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>

        INSERT DATA {
            GRAPH <''' + LILNKSETGRAPH + '''> {
            ''' + triples_string + '''
            }
        }
    '''
    sparql.setQuery(insert_query)
    sparql.query()
    print('[UPDATE] new triples in linkset endpoint')


def clear_linkset_endpoint():
    sparql = SPARQLWrapper(UPDATEMYLINKSET)
    sparql.setMethod(POST)
    delete_query = '''
        PREFIX schema: <https://schema.org/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>

        DELETE {?s ?p ?o}
        WHERE {
            GRAPH <''' + LILNKSETGRAPH + '''> {
            ?s ?p ?o
            } 
        }
    '''

    sparql.setQuery(delete_query)
    sparql.query()
    print('[DELETE] linkeset emptied')


def parse_ntriple_linkest(file):
    g = Graph()
    g.parse(file, format='nt')
    return g


def write_ntriple_linkset(g, file):
    g.serialize(destination=file, format='nt', encoding='utf-8')


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
    linkset_graph = parse_ntriple_linkest(LINKSET_FILE)
    uris_to_search = []
    for uri in uri_list:
        if any((match := substring) in uri for substring in WHITE_LIST):
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
                add_triples_to_linkset_file(linkset_graph, datasets[dataset]['sparql_endpoint'], datasets[dataset]['name'],
                                            origin_uri, same_uri, datasets[d]['sparql_endpoint'], datasets[d]['name'])
        write_ntriple_linkset(linkset_graph, LINKSET_FILE)
        print('[SUCCESS] linkest file population complete')


def triples_to_linkset_edpoint(file):
    ntriple = open(file, 'r')
    ntriple_string = ntriple.read()  # add check on lenght and split in case (how)
    linkset_endpoint_update(ntriple_string)
