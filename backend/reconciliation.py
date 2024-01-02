# builtin libraries
import os
import uuid

# external libraries
from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import URIRef, Literal, Dataset, Graph
from rdflib.plugins.sparql import prepareQuery
from rdflib.namespace import SDO, RDFS, OWL, SDO
import requests

# internal methods
import linkset_endpoint
import methods
import conf

g = methods.read_json('conf_general.json')

WHITE_LIST = ['wikidata', 'dbpedia']
WHITE_LIST_PARAM = {
    'wikidata': {
        'endpoint': 'https://query.wikidata.org/sparql',
        'iri_base': 'http://www.wikidata.org/',
        'query': 'SELECT DISTINCT ?origin_uri (GROUP_CONCAT(str(?same_uri); SEPARATOR=\", \") AS ?same_uri) WHERE { VALUES ?origin_uri {<>} . { ?same_uri schema:sameAs|owl:sameAs|skos:exactMatch|wdt:P2888|^schema:sameAs|^owl:sameAs|^skos:exactMatch|^wdt:P2888 ?origin_uri . } UNION {?other_uri wdt:P214|^wdt:P214 ?origin_uri . BIND(CONCAT(\"http://viaf.org/viaf/\", STR( ?other_uri ))  AS ?same_uri )} UNION {?other_uri wdt:P1953|^wdt:P1953 ?origin_uri . BIND(CONCAT(\"https://www.discogs.com/artist/\", ?other_uri )  AS ?same_uri ) } UNION {?other_uri wdt:P1954|^wdt:P1954 ?origin_uri . BIND(CONCAT(\"https://www.discogs.com/master/\", ?other_uri )  AS ?same_uri )}} GROUP BY ?origin_uri'
    },
    'dbpedia': {
        'endpoint': 'https://dbpedia.org/sparql',
        'iri_base': 'http://dbpedia.org/',
        'query': 'SELECT DISTINCT ?origin_uri (GROUP_CONCAT(str(?same); SEPARATOR=\", \") AS ?same_uri) WHERE { VALUES ?origin_uri {<>} {?origin_uri (schema:sameAs|^schema:sameAs) ?same .} UNION {?origin_uri (skos:exactMatch|^skos:exactMatch) ?same .} } GROUP BY ?origin_uri'
    },
    'viaf': {
        'fragments': 'true',
        'endpoint': 'http://data.linkeddatafragments.org/viaf',
        'iri_base': 'http://viaf.org/viaf/',
        'query': 'SELECT DISTINCT ?origin_uri (GROUP_CONCAT(str(?same_uri); SEPARATOR=", ") AS ?same_uri) WHERE { VALUES ?origin_uri {<>} . ?same_uri <http://schema.org/sameAs>|^<http://schema.org/sameAs> ?origin_uri .} GROUP BY ?origin_uri'
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
        print('ERROR query_lod_fragments for ', endpoint, e)
        return results

def query_same_as_internal(uri_list):
    values_to_search = ' '.join(uri_list).replace("'", "%27")
    find_query = '''
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX schema: <https://schema.org/>
        SELECT DISTINCT ?origin_uri (GROUP_CONCAT(str(?same_uri); SEPARATOR=", ") AS ?same_uri)
        WHERE {
            VALUES ?origin_uri {'''+values_to_search+'''} .
            ?same_uri '''+conf.same_as_path+''' ?origin_uri .
        } GROUP BY ?origin_uri
        '''
    return find_query


def find_matches(query, endpoint):
    user_agent = conf.sparql_wrapper_user_agent
    sparql = SPARQLWrapper(endpoint, agent=user_agent)
    sparql.setQuery(query)
    results = {}
    try:
        results = sparql.query().convert()
        # {origin_uri: 'same_uri_1, same_uri_n'}
        results = {result['origin_uri']['value']: result['same_uri']['value']
                for result in results['results']['bindings'] if len(result['same_uri']['value']) > 0}
        return results
    except Exception as e:
        print('ERROR find_matches for ', endpoint, query, e)
        url = endpoint
        params = {'query': query}
        payload = {}
        headers = {
            'Accept': 'application/json'
        }

        response = requests.get(url, headers=headers, params=params, data=payload)
        results = response.json()
        results = {result['origin_uri']['value']: result['same_uri']['value']
                for result in results['results']['bindings'] if len(result['same_uri']['value']) > 0}
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

    # print(f'[UPDATE] Dataset updated for Graph {graph_name}')
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
    # track last id used to create graph names
    last_graph_id = 0
    # big dictionary to track if origin_uri has at least 1 sameAs uri
    sameAs_track_dictionary = {}

    ds = Dataset()

    for index, uri in enumerate(uris_list):
        # generate unique graphnames for each uri and store in dictionary
        GRAPH_NAME = linkset_namespace + dataset_id + '__' + category_id + \
            '__' + str(index)  # I can work on generlising this
        graph_names_dict[uri] = GRAPH_NAME
        uris_to_search.append('<' + uri + '>')
        last_graph_id = index
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
            # 1000 is the control number to avoid having a VALUE in the QUERY that is too long
            if len(' '.join(uris_to_search)) < 1000:
                query = query_same_as_internal(uris_to_search)
                same_uris_dict = find_matches(query, sparql_endpoint)
                for origin_uri, same_uri_list in same_uris_dict.items():
                    try:
                        ds_updated = add_quads_to_conj_graph(
                            ds, graph_names_dict[origin_uri], datasets[dataset_id]['iri_base'], datasets[dataset_id]['name'], origin_uri, same_uri_list, datasets[d]['iri_base'], datasets[d]['name'])
                        ds = ds_updated
                    except Exception as e:
                        print('ERROR add_quads_to_conj_graph INTERNAL < 1000', e)
                    if len(same_uri_list) > 0:
                        sameAs_track_dictionary[origin_uri] = True
                        # find matches in external datasets - 1st level of reconciliation
                        for uri in same_uri_list.split(', '):
                            if any((match := substring) in uri for substring in WHITE_LIST):
                                any_match = True
                                match_list = uris_to_reconcile[match]
                                match_list.append('<' + uri + '>')
                                uris_to_reconcile[match] = match_list

            elif len(' '.join(uris_to_search)) >= 1000:
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
                            print('ERROR add_quads_to_conj_graph INTERNAL => 1000', e)                        
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
                # 1000 is the control number to avoid having a VALUE in the QUERY that is too long
                if len(' '.join(uri_list)) < 1000:
                    values_to_search = ' '.join(uri_list).replace("'", "%27")
                    external_query = WHITE_LIST_PARAM[match]['query']
                    external_query = external_query.replace('<>', values_to_search)
                    same_uris_dict = {}
                    # check if fragments rec need linked data fragments search
                    if 'fragments' in WHITE_LIST_PARAM[match]:
                        print('Solve fragments problem')
                        # same_uris_dict = query_lod_fragments(external_endpoint, external_query)
                    else:
                        same_uris_dict = find_matches(external_query, external_endpoint)
                    for origin_uri, same_uri_list in same_uris_dict.items():
                        if len(same_uri_list) > 0:
                            sameAs_track_dictionary[origin_uri] = True
                        graph_name = ''
                        # check if uri has already a corresponding graph_name
                        if origin_uri in graph_names_dict:
                            graph_name = graph_names_dict[origin_uri]
                        else:
                            # if not, create the graph name with last_graph_id
                            graph_name = linkset_namespace + dataset_id + '__' + category_id + '__' + str(last_graph_id)
                            # raise last_graph_id by 1
                            last_graph_id = last_graph_id + 1
                            # add the pair uri:graph_name to the graph_names_dict dict
                            graph_names_dict[origin_uri] = graph_name
                            try:
                                ds_updated = add_quads_to_conj_graph(ds, graph_name, datasets[dataset_id]['iri_base'],
                                                                    datasets[dataset_id]['name'], origin_uri, same_uri_list, WHITE_LIST_PARAM[match]['iri_base'], match)
                                ds = ds_updated
                            except Exception as e:
                                print('ERROR add_quads_to_conj_graph WHITE < 1000', e)
                elif len(' '.join(uri_list)) >= 1000:
                    # if too long we divide the list n times to obtain n chunks
                    uris_to_search_chunks = methods.create_chunks(uri_list)

                    for chunk in uris_to_search_chunks:
                        values_to_search = ' '.join(chunk).replace("'", "%27")
                        external_query = WHITE_LIST_PARAM[match]['query']
                        external_query = external_query.replace('<>', values_to_search)
                        same_uris_dict = {}
                        # check if fragments rec need linked data fragments search
                        if 'fragments' in WHITE_LIST_PARAM[match]:
                            print('Solve fragments problem')
                            # same_uris_dict = query_lod_fragments(external_endpoint, external_query)
                        else:
                            same_uris_dict = find_matches(external_query, external_endpoint)
                        for origin_uri, same_uri_list in same_uris_dict.items():
                            if len(same_uri_list) > 0:
                                sameAs_track_dictionary[origin_uri] = True
                            graph_name = ''
                            # check if uri has already a corresponding graph_name
                            if origin_uri in graph_names_dict:
                                graph_name = graph_names_dict[origin_uri]
                            else:
                                # if not, create the graph name with last_graph_id
                                graph_name = linkset_namespace + dataset_id + '__' + category_id + '__' + str(last_graph_id)
                                # raise last_graph_id by 1
                                last_graph_id = last_graph_id + 1
                                # add the pair uri:graph_name to the graph_names_dict dict
                                graph_names_dict[origin_uri] = graph_name
                            try:
                                ds_updated = add_quads_to_conj_graph(
                                    ds, graph_name, datasets[dataset_id]['iri_base'], datasets[dataset_id]['name'], origin_uri, same_uri_list, WHITE_LIST_PARAM[match]['iri_base'], match)
                                ds = ds_updated
                            except Exception as e:
                                print('ERROR add_quads_to_conj_graph WHITE => 1000', e)
    ds.serialize(destination=file_path, format='nquads', encoding='US-ASCII')
    return sameAs_track_dictionary


def white_list_reconciliation():
    pass


def generate_merged_graph_name(data):
    '''this function creates a new graph name combining existing names.'''
    dat = ''
    cat = ''
    id = ''

    merged_split = '___'
    simple_split = '__'

    for result in data:
        graph_name_parts = ''
        if merged_split in result:
            graph_name_parts = result.strip('<>').split('/')[-1].split(merged_split)
        else:
            graph_name_parts = result.strip('<>').split('/')[-1].split(simple_split)
        dat_parts = graph_name_parts[0].split(simple_split)
        cat_parts = graph_name_parts[1].split(simple_split)
        # id_parts = graph_name_parts[2].split(simple_split)
        for d in dat_parts:
            if d not in dat:
                dat = (dat + '__' + d).strip('__')
        for c in cat_parts:
            if c not in cat:
                cat = (cat + '__' + c).strip('__')
    # Generate a random UUID for the id
    id = str(uuid.uuid4())
    new_graph_name = linkset_endpoint.LINKSETGRAPH + dat + '___' + cat + '___' + id
    return new_graph_name

def add_missing_same_as_links(graph_name):
    '''this function update the graph with all samAs links'''
    query = '''
    INSERT
        { GRAPH <''' + graph_name + '''> { ?s owl:sameAs ?s1 . }}
    WHERE {
    GRAPH <''' + graph_name + '''> 
        { ?s <https://schema.org/location> ?o .
            ?s1 <https://schema.org/location> ?oo .
        }
    }
    '''
    sparql = SPARQLWrapper(linkset_endpoint.UPDATEMYLINKSET)
    sparql.setQuery(query)
    sparql.method = 'POST'
    try:
        sparql.query()
    except Exception as e:
        print('ERROR add_missing_same_as_links', e)

def graph_merging(entity_uri, endpoint):
    graph_set = set()
    query = '''
        SELECT DISTINCT ?g
        WHERE {
            GRAPH ?g { {<'''+entity_uri+'''> ?p ?o .} }
            }
        '''
    sparql = SPARQLWrapper(endpoint)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    try:
        results = sparql.query().convert()

        data = results['results']['bindings']

        # keep trace of the named graphs in which the starting entity is
        for result in data:
            graph_set.add('<' + result['g']['value'] + '>')

    except Exception as e:
        print('ERROR graph_merging in searching for graphs', e)

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
    try:
        o_results = sparql.query().convert()

        o_data = o_results['results']['bindings']
        for result in o_data:
            graph_set.add('<' + result['g']['value'] + '>')
    except Exception as e:
        print('ERROR graph_merging in searching for other graphs', e)

    # if there is more than 1 graph, create new name for graph (the merging of the existing ones)
    if len(set(graph_set)) > 1:
        new_graph_name = generate_merged_graph_name(graph_set)
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
        try:
            sparql.query()
        except Exception as e:
            print('ERROR graph_merging in updating graph', e)
        
        add_missing_same_as_links(new_graph_name)


def graphs_reconciliation(entities_dir, endpoint, reconciled_index):
    for filename in os.listdir(entities_dir):
        entities_content = methods.read_json(entities_dir+'/'+filename)
        for uri, info in entities_content.items():
            if info['sameAs'] == True:
                graph_merging(uri, endpoint)
    if reconciled_index:
        feed_file_name = g['data_sources']['feed']
        feed_data = methods.read_json(feed_file_name)
        origin_iri = ''

        for clip, info in feed_data.items():
            if 'origin_iri' in info:
                origin_iri = info['origin_iri']
            else:
                origin_iri = info['iri']
            query = '''
                SELECT DISTINCT ?g
                WHERE {
                    GRAPH ?g { <'''+origin_iri+'''> ?p ?o . }
                    }
                '''
            sparql = SPARQLWrapper(endpoint)
            sparql.setQuery(query)
            sparql.setReturnFormat(JSON)
            try:
                results = sparql.query().convert()

                data = results['results']['bindings']
                uri_to_graph = {}
                for result in data:
                    feed_data[clip]['origin_iri'] = origin_iri
                    feed_data[clip]['iri'] = result['g']['value']

            except Exception as e:
                print('ERROR index_reconciliation in searching for uris\' graphs', e)
        
        methods.update_json(feed_file_name, feed_data)
                  

def uri_to_named_graph(values_to_search, endpoint):
    '''search in Blazegraph for named_graphs'''
    query = '''
        SELECT DISTINCT ?s ?g
        WHERE {
            VALUES ?s {'''+values_to_search+'''}
            GRAPH ?g { ?s ?p ?o . }
            }
        '''
    sparql = SPARQLWrapper(endpoint)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    try:
        results = sparql.query().convert()

        data = results['results']['bindings']
        uri_to_graph = {}
        for result in data:
            uri_to_graph[result['s']['value']] = result['g']['value']
        # {uri: named_graph}
        return uri_to_graph

    except Exception as e:
        print('ERROR index_reconciliation in searching for uris\' graphs', e)
        return {}

def index_reconciliation(uris_list, endpoint):
    uris_list_to_search = []
    for uri in uris_list:
        uris_list_to_search.append('<' + uri + '>')
    values_to_search = ' '.join(uris_list_to_search)
    uri_graph_match = {}
    # search in Blazegraph for named_graphs
    if len(values_to_search) < 1000:
        uri_graph_match = uri_to_named_graph(values_to_search, endpoint)
    elif len(values_to_search) >= 1000:
        # if too long we divide the list n times to obtain n chunks
        uris_to_search_chunks = methods.create_chunks(uris_list_to_search)
        for chunk in uris_to_search_chunks:
            chunk_to_search = ' '.join(chunk)
            uri_graph_match.update(uri_to_named_graph(chunk_to_search, endpoint))
    
    return uri_graph_match
