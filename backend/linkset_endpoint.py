# builtin libraries
import os

# external libraries
import re
import requests
from flask import request, Response
from urllib.parse import parse_qs, quote
from SPARQLWrapper import SPARQLWrapper, POST
from rdflib import Graph, URIRef, Dataset, ConjunctiveGraph
from rdflib.namespace import SDO, RDFS, OWL
from pymantic import sparql

# internal methods
import reconciliation as rec
import methods

UPDATEMYLINKSET = 'http://localhost:9999/blazegraph/namespace/kb/sparql/update'
LILNKSETGRAPH = 'http://w3id.org/polifonia/linkset/'
LINKSET_FILE = 'linkset.nq'

MYLINKSET = 'http://localhost:9999/bigdata/sparql'


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


def linkset_file_population(entities_dir, datasets, file):
    '''fill the linkset starting from the entities files'''
    ds = Dataset()

    for filename in os.listdir(entities_dir):
        split_name = filename.strip('.json').split('__')
        dat_id = split_name[0]
        cat_id = split_name[1]

        # get the list of uris in the file
        uri_list = methods.read_json(entities_dir+'/'+filename)
        # test graph insertion
        for index, uri in enumerate(uri_list):
            GRAPH_NAME = LILNKSETGRAPH + \
                dat_id + '/' + cat_id + '/' + str(index)
            named_graph = ds.graph(URIRef(GRAPH_NAME))
            named_graph.add((URIRef(uri), SDO.location,
                            URIRef(datasets[dat_id]['iri_base'])))
    # save to file
    ds.serialize(destination=file, format='nquads', encoding='US-ASCII')


def linkset_endpoint_update(entities_dir, datasets, file):
    # populate the file
    linkset_file_population(entities_dir, datasets, file)

    # prepare endpoint
    server = sparql.SPARQLServer(UPDATEMYLINKSET)

    # Loading data to Blazegraph
    server.update(
        'load <file:///home/giuliarenda/web_portal_test/backend/linkset.nq>')  # to do: understand how to generalise
    print('[UPDATE] linkset populated')


def clear_linkset_endpoint():
    '''empty endpoint'''
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
    print('[DELETE] endpoint emptied')


def clear_linkset_file(file):
    '''empty linkset.nt'''
    g = rec.parse_ntriple_linkest(file)
    g.remove((None, None, None))
    rec.write_ntriple_linkset(g, file)
    print('[DELETE] nt emptied')


def clear_linkset(proceed=False, file=''):
    '''apply clearing functions'''
    if proceed:
        clear_linkset_file(file)
        clear_linkset_endpoint()
        print('[DELETE] linkset emptied')
