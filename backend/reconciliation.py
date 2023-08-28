# builtin libraries
import os

# external libraries
from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import URIRef, Literal, Dataset
from rdflib.namespace import SDO, RDFS, OWL

# internal methods
import linkset_endpoint as endpoint
import methods

WHITE_LIST = ['wikidata', 'dbpedia', 'viaf', 'discogs']
WHITE_LIST_PARAM = {
    'wikidata': {
        'sparql_endpoint': 'https://query.wikidata.org/sparql',
        'iri_base': 'http://www.wikidata.org/',
        'property_path': 'owl:sameAs|skos:exactMatch|schema:sameAs|wdt:P2888|^owl:sameAs|^skos:exactMatch|^schema:sameAs|^wdt:P2888',
        'query': 'SELECT DISTINCT ?origin_uri ?same_uri WHERE { VALUES ?origin_uri {<http://www.wikidata.org/entity/Q254>} .  { ?same_uri schema:sameAs|owl:sameAs|skos:exactMatch|^schema:sameAs|^owl:sameAs|^skos:exactMatch ?origin_uri . } UNION {?same_uri wdt:P214|^wdt:P214 ?origin_uri} UNION {?same_uri wdt:P1953|wdt:P1954|^wdt:P1953|^wdt:P1954 ?origin_uri }}'
    },
    'dbpedia': {
        'sparql_endpoint': 'https://dbpedia.org/sparql',
        'iri_base': '',
        'property_path': 'schema:sameAs|owl:sameAs|skos:exactMatch|^schema:sameAs|^owl:sameAs|^skos:exactMatch'
    },
    'viaf': {
        'sparql_endpoint': 'https://query.wikidata.org/sparql',
        'iri_base': '',
        'query': 'wdt:P214|^wdt:P214'
    },
    'discogs': {'redirect_to': 'wikidata'}
}


# altro parametro tipo lista con sparqlenpoint
def query_same_as_internal(uri_list):
    values_to_search = ' '.join(uri_list)
    find_query = '''
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX schema: <https://schema.org/>
        SELECT DISTINCT ?origin_uri (GROUP_CONCAT(str(?same_uri); SEPARATOR=", ") AS ?same_uri)
        WHERE {
            VALUES ?origin_uri {'''+values_to_search+'''} .
            ?same_uri owl:sameAs|skos:exactMatch|schema:sameAs|^owl:sameAs|^skos:exactMatch|^schema:sameAs ?origin_uri .
        } GROUP BY ?origin_uri
        '''
    return find_query


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
    user_agent = 'mondoboia/1.0 (https://github.com/mondoboia; mondoboia@example.org)'
    sparql = SPARQLWrapper(endpoint, agent=user_agent)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    results = {result['origin_uri']['value']: result['same_uri']['value']
               for result in results['results']['bindings'] if len(result['same_uri']['value']) > 0}
    # {origin_uri: 'same_uri_1, same_uri_n'}
    return results


def add_quads_to_conj_graph(ds, graph_name, dataset_1, dataset_1_label, uri_1, same_uri_list, dataset_2, dataset_2_label, double_location=False):
    named_graph = ds.graph(URIRef(graph_name))

    named_graph.add((URIRef(uri_1), SDO.location, URIRef(dataset_1)))
    named_graph.add((URIRef(dataset_1), RDFS.label,
                     Literal(dataset_1_label, lang="en")))

    if len(same_uri_list) > 0:
        # in case more than one uri for each origin_uri
        same_uri_list = same_uri_list.split(', ')
        for same_uri in same_uri_list:
            # uri_1
            named_graph.add((URIRef(uri_1), OWL.sameAs, URIRef(same_uri)))

            # same_uri
            named_graph.add(
                (URIRef(same_uri), SDO.location, URIRef(dataset_2)))
            named_graph.add((URIRef(same_uri), OWL.sameAs, URIRef(uri_1)))
            named_graph.add((URIRef(dataset_2), RDFS.label,
                            Literal(dataset_2_label, lang="en")))

    # in case of double location
    if double_location:
        named_graph.add((URIRef(uri_1), SDO.location, URIRef(dataset_2)))

    print(f'[UPDATE] Dataset updated for Graph {graph_name}')
    return ds


def first_level_reconciliation(uris_list, datasets, dataset_id, category_id, linkset_namespace, file_path):
    uris_to_search = []
    graph_names_dict = {}
    # big dictionary to track if origin_uri has at least 1 sameAs uri
    sameAs_track_dictionary = {}

    ds = Dataset()
    # ds.parse(file)

    for index, uri in enumerate(uris_list):
        # generate unique graphnames for each uri and store in dictionary
        GRAPH_NAME = linkset_namespace + dataset_id + '__' + category_id + \
            '__' + str(index)  # I can work on generlising this
        graph_names_dict[uri] = GRAPH_NAME
        uris_to_search.append('<' + uri + '>')

    # find matches in all internal datasets - 1st level of reconciliation
    if len(uris_to_search) > 0:
        for d in datasets:
            sparql_endpoint = datasets[d]['sparql_endpoint']
            # 1500 is the control number to avoid having a VALUE in the QUERY that is too long
            if len(' '.join(uris_to_search)) < 1500:
                query = query_same_as_internal(uris_to_search)
                same_uris_dict = find_matches(query, sparql_endpoint)
                for origin_uri, same_uri_list in same_uris_dict.items():
                    if len(same_uri_list) > 0:
                        sameAs_track_dictionary[origin_uri] = True
                    ds_updated = add_quads_to_conj_graph(
                        ds, graph_names_dict[origin_uri], datasets[dataset_id]['iri_base'], datasets[dataset_id]['name'], origin_uri, same_uri_list, datasets[d]['iri_base'], datasets[d]['name'])
                    ds = ds_updated
            elif len(' '.join(uris_to_search)) >= 1500:
                # if too long we divide the list n times to obtain n chunks
                uris_to_search_chunks = methods.create_chunks(uris_to_search)

                # Generalise the process taking into account that ds cannot be passed into between functions.
                for chunk in uris_to_search_chunks:
                    query = query_same_as_internal(chunk)
                    same_uris_dict = find_matches(query, sparql_endpoint)
                    for origin_uri, same_uri_list in same_uris_dict.items():
                        if len(same_uri_list) > 0:
                            sameAs_track_dictionary[origin_uri] = True
                        ds_updated = add_quads_to_conj_graph(
                            ds, graph_names_dict[origin_uri], datasets[dataset_id]['iri_base'], datasets[dataset_id]['name'], origin_uri, same_uri_list, datasets[d]['iri_base'], datasets[d]['name'])
                        ds = ds_updated
    ds.serialize(destination=file_path, format='nquads', encoding='US-ASCII')
    return sameAs_track_dictionary


def white_list_reconciliation():
    pass


def graph_merging(entity_uri, endpoint):
    query = '''
        SELECT DISTINCT ?g
        WHERE {
            GRAPH ?g { {<'''+entity_uri+'''> ?p ?o .} }
            }
        '''
    sparql = SPARQLWrapper(endpoint)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()

    data = results['results']['bindings']
    # for the uri ask in how many graphs it's in
    graphs_num = len(data)

    graph_list = []
    for result in data:
        graph_list.append('<' + result['g']['value'] + '>')

    values_to_search = ' '.join(graph_list)
    # print('GRAPHS', graph_list)
    # if only 1:
    if graphs_num == 1:
        # I take the ?o and search if they appear in other graphs
        # o_query = '''
        # SELECT DISTINCT ?g
        # WHERE {
        #     <'''+entity_uri+'''> ?p ?o .
        #     GRAPH ?g { {?s ?p ?o } UNION {?o ?p ?s}  FILTER(?o != <'''+entity_uri+'''>)}
        #     }
        # '''
        # sparql = SPARQLWrapper(endpoint)
        # sparql.setQuery(o_query)
        # sparql.setReturnFormat(JSON)
        # o_results = sparql.query().convert()

        # o_data = results['results']['bindings']
        print('only 1')

        # if not:
        # pass
        # if yes:

        # create new name for graph (the merging of the existing ones)
        # insert triples from each graph into the new one and delete the olds
    # if more than 1:
    elif graphs_num > 1:
        dat = ''
        cat = ''
        id = ''
        graph_list = []
        for result in data:
            graph_name_parts = result['g']['value'].split('/')[-1].split('__')
            dat = (dat + '__' + graph_name_parts[0]).strip('__')
            cat = (cat + '__' + graph_name_parts[1]).strip('__')
            id = (id + '__' + graph_name_parts[2]).strip('__')
        new_graph_name = dat + '___' + cat + '___' + id
        print(new_graph_name)
    # create new name for graph (the merging of the existing ones)
    # insert triples from each graph into the new one and delete the olds


def graphs_reconciliation(entities_dir, endpoint):
    for filename in os.listdir(entities_dir):
        entities_content = methods.read_json(entities_dir+'/'+filename)
        for uri, info in entities_content.items():
            if info['sameAs'] == True:
                graph_merging(uri, endpoint)
                # break
        #     for uri in uri_list:

        #         res = ds.query(query)
        #         g_list = []
        #         for row in res:
        #             g_list.append(row.g)
        #         if len(g_list) > 1:
        #             '''query to retrieve triples, delete graph and insert into new'''
        #             print(g_list[0])
