# builtin libraries
import os

# external libraries
import re
import requests
from flask import request, Response
from urllib.parse import parse_qs, quote
from SPARQLWrapper import SPARQLWrapper, POST
from rdflib import Dataset, URIRef
from pymantic import sparql

# internal methods
import reconciliation as rec
import methods
import conf

UPDATEMYLINKSET = conf.url_to_update_linkset
LINKSETGRAPH = conf.linkset_namespace

LINKSET_DIRECTORY = 'linkset_files'
ENTITIES_DIRECTORY = 'entities'
LABELS_DIRECTORY = 'index_labels'

MYLINKSET = conf.linkset_url_enpoint


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


def linkset_file_population(entities_dir, datasets, linkset_directory):
    '''fill the linkset starting from the entities files'''
    os.makedirs(linkset_directory, exist_ok=True)
    for filename in os.listdir(entities_dir):
        split_name = filename.strip('.json').split('__')
        dat_id = split_name[0]
        cat_id = split_name[1]

        # check if dataset already parsed
        is_parsed = False if 'status' not in datasets[dat_id] else True
        if is_parsed == False:
            new_linkset_file_path = linkset_directory + '/' + dat_id + '__' + cat_id + '.nq'
            # get the list of uris in the file
            entities_file = methods.read_json(entities_dir+'/'+filename)
            uri_list = entities_file.keys()
            # activate reconciliation process
            sameAS_track_dictionary = rec.first_level_reconciliation(uri_list, datasets, dat_id, cat_id, LINKSETGRAPH, new_linkset_file_path)

            # update sameAs information for each uri
            for uri, info in sameAS_track_dictionary.items():
                if uri in entities_file:
                    entities_file[uri]['sameAs'] = info

            methods.update_json(entities_dir+'/'+filename, entities_file)


def linkset_endpoint_update(entities_dir, datasets, linkset_directory):
    '''update Blazegraph enpoint with triples in linkset.nq'''
    # populate the files
    linkset_file_population(entities_dir, datasets, linkset_directory)
    # prepare endpoint
    server = sparql.SPARQLServer(UPDATEMYLINKSET)

    # Loading data to Blazegraph
    for filename in os.listdir(linkset_directory):
        split_name = filename.strip('.json').split('__')
        dat_id = split_name[0]

        # check if dataset already parsed
        is_parsed = False if 'status' not in datasets[dat_id] else True
        if is_parsed == False:
            file_path = linkset_directory + '/' + filename
            server.update(
                'load <file:'+ os.path.dirname(os.path.realpath(__file__)) + '/' + file_path + '>')  # to do: understand how to generalise
                # os.path.dirname(os.path.realpath(__file__))
    print('[UPDATE] linkset populated')


def parse_nquads(file):
    ds = Dataset()
    ds.parse(file)
    return ds


def clear_linkset_endpoint():
    '''empty endpoint'''
    sparql = SPARQLWrapper(UPDATEMYLINKSET)
    sparql.setMethod(POST)
    delete_query = '''
        DROP NAMED
    '''

    sparql.setQuery(delete_query)
    sparql.query()
    print('[DELETE] endpoint emptied')


def clear_files(directory):
    '''empty directory'''
    for filename in os.listdir(directory):
        file_path = directory+'/'+filename
        os.remove(file_path)
    print('[DELETE] '+ directory +' emptied')


def clear_linkset(proceed, linkset_directory, entities_directory, labels_directory):
    '''apply clearing functions'''
    if proceed:
        clear_files(linkset_directory)
        clear_linkset_endpoint()
        clear_files(entities_directory)
        clear_files(labels_directory)
        print('[DELETE] linkset emptied')
