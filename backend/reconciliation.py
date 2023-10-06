# builtin libraries
import os
import re

# external libraries
from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import URIRef, Literal, Dataset, Graph
from rdflib.namespace import SDO, RDFS, OWL
import hydra.tpf

# internal methods
import linkset_endpoint
import methods

WHITE_LIST = ['wikidata', 'dbpedia', 'viaf']
WHITE_LIST_PARAM = {
    'wikidata': {
        'endpoint': 'https://query.wikidata.org/sparql',
        'iri_base': 'http://www.wikidata.org/',
        'query': 'SELECT DISTINCT ?origin_uri (GROUP_CONCAT(str(?same_uri); SEPARATOR=\", \") AS ?same_uri) WHERE { VALUES ?origin_uri {<>} . { ?same_uri schema:sameAs|owl:sameAs|skos:exactMatch|wdt:P2888|^schema:sameAs|^owl:sameAs|^skos:exactMatch|^wdt:P2888 ?origin_uri . } UNION {?other_uri wdt:P214|^wdt:P214 ?origin_uri . BIND(CONCAT(\"https://viaf.org/viaf/\", STR( ?other_uri ))  AS ?same_uri )} UNION {?other_uri wdt:P1953|^wdt:P1953 ?origin_uri . BIND(CONCAT(\"https://www.discogs.com/artist/\", ?other_uri )  AS ?same_uri ) } UNION {?other_uri wdt:P1954|^wdt:P1954 ?origin_uri . BIND(CONCAT(\"https://www.discogs.com/master/\", ?other_uri )  AS ?same_uri )}} GROUP BY ?origin_uri'
    },
    'dbpedia': {
        'endpoint': 'https://dbpedia.org/sparql',
        'iri_base': 'http://dbpedia.org/',
        'query': 'SELECT DISTINCT ?origin_uri (GROUP_CONCAT(str(?same_uri); SEPARATOR=\", \") AS ?same_uri) WHERE { VALUES ?origin_uri {<>} .  { ?same_uri schema:sameAs|owl:sameAs|skos:exactMatch|^schema:sameAs|^owl:sameAs|^skos:exactMatch ?origin_uri . }} GROUP BY ?origin_uri'
    },
    'viaf': {
        'fragments': 'true',
        'endpoint': 'http://data.linkeddatafragments.org/viaf/',
        'iri_base': 'http://viaf.org/viaf/',
        'query': 'SELECT DISTINCT ?origin_uri (GROUP_CONCAT(str(?same_uri); SEPARATOR=", ") AS ?same_uri) WHERE { VALUES ?origin_uri {<>} . <http://schema.org/sameAs>|^<http://schema.org/sameAs> ?origin_uri .} GROUP BY ?origin_uri'
    }
}

def query_lod_fragments(endpoint, query):
    g = Graph('TPFStore')
    g.open(endpoint)
    results = {}
    try:
        results = g.query(query)
        {result['origin_uri']['value']: result['same_uri']['value']
                for result in results['results']['bindings'] if len(result['same_uri']['value']) > 0}
        return results
    # {origin_uri: 'same_uri_1, same_uri_n'}
    except Exception as e:
        print('ERROR query_lod_fragments', e)
        return results

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


def find_matches(query, endpoint):
    user_agent = 'mondoboia/1.0 (https://github.com/mondoboia; mondoboia@example.org)'
    sparql = SPARQLWrapper(endpoint, agent=user_agent)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = {}
    try:
        results = sparql.query().convert()
        # {origin_uri: 'same_uri_1, same_uri_n'}
        results = {result['origin_uri']['value']: result['same_uri']['value']
                for result in results['results']['bindings'] if len(result['same_uri']['value']) > 0}
        return results
    except Exception as e:
        print('ERROR find_matches', e)
        return results


def add_quads_to_conj_graph(ds, graph_name, dataset_1, dataset_1_label, uri_1, same_uri_list, dataset_2, dataset_2_label):
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

    # # in case of double location
    # if double_location:
    #     named_graph.add((URIRef(uri_1), SDO.location, URIRef(dataset_2)))

    print(f'[UPDATE] Dataset updated for Graph {graph_name}')
    return ds


def first_level_reconciliation(uris_list, datasets, dataset_id, category_id, linkset_namespace, file_path):
    # general
    uris_to_search = []
    # for white list action
    uris_to_reconcile = {}
    for el in WHITE_LIST:
        uris_to_reconcile[el] = []
    any_match = False
    # track uri-graph_name pairs
    graph_names_dict = {}
    # big dictionary to track if origin_uri has at least 1 sameAs uri
    sameAs_track_dictionary = {}

    ds = Dataset()

    for index, uri in enumerate(uris_list):
        # generate unique graphnames for each uri and store in dictionary
        GRAPH_NAME = linkset_namespace + dataset_id + '__' + category_id + \
            '__' + str(index)  # I can work on generlising this
        graph_names_dict[uri] = GRAPH_NAME
        uris_to_search.append('<' + uri + '>')
        # check with white list
        if any((match := substring) in uri for substring in WHITE_LIST):
            any_match = True
            match_list = uris_to_reconcile[match]
            match_list.append('<' + uri + '>')
            uris_to_reconcile[match] = match_list
    
    # find matches in all internal datasets - 1st level of reconciliation
    if len(uris_to_search) > 0:
        # every origin_uri is inserted in the dataset for the first time
        for origin_uri in uris_to_search:
            ds_updated = add_quads_to_conj_graph(
                ds, graph_names_dict[origin_uri.strip('<>')], datasets[dataset_id]['iri_base'], datasets[dataset_id]['name'], origin_uri.strip('<>'), [], '', '')
            ds = ds_updated
        for d in datasets:
            sparql_endpoint = datasets[d]['sparql_endpoint']
            # 1500 is the control number to avoid having a VALUE in the QUERY that is too long
            if len(' '.join(uris_to_search)) < 1500:
                query = query_same_as_internal(uris_to_search)
                same_uris_dict = find_matches(query, sparql_endpoint)
                for origin_uri, same_uri_list in same_uris_dict.items():
                    try:
                        ds_updated = add_quads_to_conj_graph(
                            ds, graph_names_dict[origin_uri], datasets[dataset_id]['iri_base'], datasets[dataset_id]['name'], origin_uri, same_uri_list, datasets[d]['iri_base'], datasets[d]['name'])
                        ds = ds_updated
                    except Exception as e:
                        print('ERROR add_quads_to_conj_graph INTERNAL < 1500', e)
                    if len(same_uri_list) > 0:
                        sameAs_track_dictionary[origin_uri] = True
                        # find matches in external datasets - 1st level of reconciliation
                        for uri in same_uri_list.split(', '):
                            if any((match := substring) in uri for substring in WHITE_LIST):
                                any_match = True
                                match_list = uris_to_reconcile[match]
                                match_list.append('<' + uri + '>')
                                uris_to_reconcile[match] = match_list

            elif len(' '.join(uris_to_search)) >= 1500:
                # if too long we divide the list n times to obtain n chunks
                uris_to_search_chunks = methods.create_chunks(uris_to_search)

                # Generalise the process
                for chunk in uris_to_search_chunks:
                    query = query_same_as_internal(chunk)
                    same_uris_dict = find_matches(query, sparql_endpoint)
                    for origin_uri, same_uri_list in same_uris_dict.items():
                        try:
                            ds_updated = add_quads_to_conj_graph(
                                ds, graph_names_dict[origin_uri], datasets[dataset_id]['iri_base'], datasets[dataset_id]['name'], origin_uri, same_uri_list, datasets[d]['iri_base'], datasets[d]['name'])
                            ds = ds_updated
                        except Exception as e:
                            print('ERROR add_quads_to_conj_graph INTERNAL => 1500', e)                        
                        if len(same_uri_list) > 0:
                            sameAs_track_dictionary[origin_uri] = True
                            # find matches in external datasets - 1st level of reconciliation
                            for uri in same_uri_list.split(', '):
                                if any((match := substring) in uri for substring in WHITE_LIST):
                                    any_match = True
                                    match_list = uris_to_reconcile[match]
                                    match_list.append('<' + uri + '>')
                                    uris_to_reconcile[match] = match_list

    # find matches in external datasets - 1st level of reconciliation
    if any_match:
        for match, uri_list in uris_to_reconcile.items():
            if len(uri_list) > 0:
                external_endpoint = WHITE_LIST_PARAM[match]['endpoint']
                external_query = WHITE_LIST_PARAM[match]['query']
                # 1500 is the control number to avoid having a VALUE in the QUERY that is too long
                if len(' '.join(uri_list)) < 1500:
                    values_to_search = ' '.join(uri_list)
                    external_query = external_query.replace('<>', values_to_search)
                    same_uris_dict = {}
                    # check if fragments rec need linked data fragments search
                    if 'fragments' in WHITE_LIST_PARAM[match]:
                        same_uris_dict = query_lod_fragments(external_endpoint, external_query)
                    else:
                        same_uris_dict = find_matches(external_query, external_endpoint)
                    for origin_uri, same_uri_list in same_uris_dict.items():
                        if len(same_uri_list) > 0:
                            sameAs_track_dictionary[origin_uri] = True
                        try:
                            ds_updated = add_quads_to_conj_graph(ds, graph_names_dict[origin_uri], datasets[dataset_id]['iri_base'],
                                                                datasets[dataset_id]['name'], origin_uri, same_uri_list, WHITE_LIST_PARAM[match]['iri_base'], match)
                            ds = ds_updated
                        except Exception as e:
                            print('ERROR add_quads_to_conj_graph WHITE < 1500', e)
                elif len(' '.join(uri_list)) >= 1500:
                    # if too long we divide the list n times to obtain n chunks
                    uris_to_search_chunks = methods.create_chunks(uri_list)

                    for chunk in uris_to_search_chunks:
                        values_to_search = ' '.join(chunk)
                        external_query = external_query.replace('<>', values_to_search)
                        same_uris_dict = {}
                        # check if fragments rec need linked data fragments search
                        if 'fragments' in WHITE_LIST_PARAM[match]:
                            same_uris_dict = query_lod_fragments(external_endpoint, external_query)
                        else:
                            same_uris_dict = find_matches(external_query, external_endpoint)
                        for origin_uri, same_uri_list in same_uris_dict.items():
                            if len(same_uri_list) > 0:
                                sameAs_track_dictionary[origin_uri] = True
                            try:
                                ds_updated = add_quads_to_conj_graph(
                                    ds, graph_names_dict[origin_uri], datasets[dataset_id]['iri_base'], datasets[dataset_id]['name'], origin_uri, same_uri_list, WHITE_LIST_PARAM[match]['iri_base'], match)
                                ds = ds_updated
                            except Exception as e:
                                print('ERROR add_quads_to_conj_graph WHITE => 1500', e)
    ds.serialize(destination=file_path, format='nquads', encoding='US-ASCII')
    return sameAs_track_dictionary


def white_list_reconciliation():
    pass


def generate_mergerd_graph_name(data):
    '''this function creates a new graph name combining existing names.'''
    dat = ''
    cat = ''
    id = ''

    for result in data:
        graph_name_parts = result.strip('<>').split('/')[-1].split('__')
        dat = (dat + '__' + graph_name_parts[0]).strip('__')
        cat = (cat + '__' + graph_name_parts[1]).strip('__')
        id = (id + '__' + graph_name_parts[2]).strip('__')
    new_graph_name = linkset_endpoint.LILNKSETGRAPH + dat + '___' + cat + '___' + id
    return new_graph_name


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

    # keep trace of the named graphs in which the starting entity is
    graph_set = set()
    for result in data:
        graph_set.add('<' + result['g']['value'] + '>')

    # then I take the ?o and search if they appear in other graphs
    o_query = '''
    SELECT DISTINCT ?g
    WHERE {
        <'''+entity_uri+'''> ?p ?o .
        GRAPH ?g { {?s owl:sameAs|^owl:sameAs ?o }  FILTER(?o != <'''+entity_uri+'''>)}
        }
    '''
    sparql = SPARQLWrapper(endpoint)
    sparql.setQuery(o_query)
    sparql.setReturnFormat(JSON)
    o_results = sparql.query().convert()

    o_data = o_results['results']['bindings']
    for result in o_data:
        graph_set.add('<' + result['g']['value'] + '>')

    # if there is more than 1 graph, create new name for graph (the merging of the existing ones)
    if len(set(graph_set)) > 1:
        new_graph_name = generate_mergerd_graph_name(graph_set)
        # insert triples from each graph into the new one and delete the olds
        values_to_search = ' '.join(graph_set)

        delete_insert_graphs_query = '''
        DELETE
        { GRAPH ?g { ?s ?p ?o } }
        INSERT
        { GRAPH <''' + new_graph_name + '''> { ?s ?p ?o }}
        WHERE {
        VALUES ?g {'''+values_to_search+'''} .
        GRAPH ?g { ?s ?p ?o }
        }
        '''

        sparql = SPARQLWrapper(linkset_endpoint.UPDATEMYLINKSET)
        sparql.setQuery(delete_insert_graphs_query)
        sparql.method = 'POST'
        sparql.query()


def graphs_reconciliation(entities_dir, endpoint):
    for filename in os.listdir(entities_dir):
        entities_content = methods.read_json(entities_dir+'/'+filename)
        for uri, info in entities_content.items():
            if info['sameAs'] == True:
                graph_merging(uri, endpoint)
