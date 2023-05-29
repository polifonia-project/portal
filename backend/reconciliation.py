# external libraries
from urllib.parse import parse_qs, quote
import re
from flask import request, Response
import requests
from SPARQLWrapper import SPARQLWrapper, POST, JSON, DIGEST

MYLINKSET = 'http://localhost:9999/bigdata/sparql'
UPDATEMYLINKSET = 'http://localhost:9999/blazegraph/namespace/kb/sparql/update'
LILNKSETGRAPH = 'http://w3id.org/polifonia/linkset/'


def __run_query_string(active, query_string,
                       is_post=False, content_type="application/x-www-form-urlencoded"):
    try:
        query_str_decoded = query_string.decode('utf-8')
    except Exception as e:
        query_str_decoded = query_string
    parsed_query = parse_qs(query_str_decoded)

    if query_str_decoded is None or query_str_decoded.strip() == "":
        print('solve 1')
        # return render_template('sparql.html',active=active)

    if re.search("updates?", query_str_decoded, re.IGNORECASE) is None:
        if "query" in parsed_query or "select" in query_str_decoded.lower():
            return __contact_tp(query_string, is_post, content_type)
        else:
            print('solve 2')
            # return render_template('sparql.html',active=active)
    else:
        print('solve 3')
        # return render_template('403.html'), 403


def __contact_tp(data, is_post, content_type):
    accept = request.args.get('HTTP_ACCEPT')
    if accept is None or accept == "*/*" or accept == "":
        accept = "application/sparql-results+json"

    data = data if isinstance(data, bytes) else quote(data)
    if is_post:
        req = requests.post(MYLINKSET, data=data,
                            headers={'content-type': content_type, "accept": accept})
    else:
        req = requests.get("%s?query=%s" % (MYLINKSET, data),
                           headers={'content-type': content_type, "accept": accept})

    if req.status_code == 200:
        response = Response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Content-Type'] = req.headers["content-type"]
        response.mimetype = "application/sparql-results+json"
        return req.json()
    else:
        print('solve 4')
        # return render_template('error.html',
        #                        status_code=str(req.status_code),
        #                        headers={"Content-Type": request.content_type},
        #                        text=req.text)


def query_same_as(uri_list):  # altro parametro tipo lista con sparqlenpoint
    values_to_search = ' '.join(uri_list)
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


def find_matches(uri_list, endpoint):
    sparql = SPARQLWrapper(endpoint)
    query = query_same_as(uri_list)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    results = {result['origin_uri']['value']: result['same_uri']['value']
               for result in results['results']['bindings'] if len(result['same_uri']['value']) > 0}
    # {origin_uri: same_uri}
    return results


def linkset_population(datasets, dataset, uri_list):
    uris_to_search = []
    for uri in uri_list:
        uris_to_search.append('<' + uri + '>')
        # find matches in all other datasets
        for d in datasets:
            if d != dataset:  # da togliere
                sparql_endpoint = datasets[d]['sparql_endpoint']
                same_uris_dict = find_matches(uris_to_search, sparql_endpoint)
                for origin_uri, same_uri in same_uris_dict.items():
                    linkset_update(datasets[dataset]['sparql_endpoint'], datasets[dataset]['name'],
                                   origin_uri, same_uri, datasets[d]['sparql_endpoint'], datasets[d]['name'])
        print('[SUCCESS] linkest populated')


def linkset_update(dataset_1, dataset_1_label, uri_1, same_uri, dataset_2, dataset_2_label):
    sparql = SPARQLWrapper(UPDATEMYLINKSET)
    sparql.setMethod(POST)
    insert_query = '''
        PREFIX schema: <https://schema.org/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>

        INSERT DATA {
            GRAPH <''' + LILNKSETGRAPH + '''> {
            <''' + uri_1 + '''> schema:location <''' + dataset_1 + '''> ;
                                                    owl:sameAs <''' + same_uri + '''> .                                              
            <''' + dataset_1 + '''> rdfs:label "''' + dataset_1_label + '''" .
            <''' + same_uri + '''> schema:location <''' + dataset_2 + '''> ;
                                                        owl:sameAs <''' + uri_1 + '''> .
            <''' + dataset_2 + '''> rdfs:label "''' + dataset_2_label + '''" .
            }
        }
    '''
    sparql.setQuery(insert_query)
    sparql.query()
    print('[UPDATE] new triples in linkset')


def clear_linkset():
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
