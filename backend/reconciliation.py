from urllib.parse import parse_qs, quote
import re
from flask import request, Response
import requests

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


# def linkset_population(datasets, dataset, uri_list):
#     for uri in uri_list:
#         creo un dizionario vuoto per tenere tutti gli uri legati all'uri di partenza
#         same_uri_dict = {}
#         devo trovare i match in tutti gli altri dataset, quindi
#         for d in datasets:
#             find_matches() che lancia query_same_as()
#             mi restituisce un dizionario {same_uri:d} che vado a infilare nel dizionario vuoto
#         una volta iterato per tutti i dataset, lancio funzione che fa update del mio linkset
#         linkset_update() che per ogni same_uri (quindi per ogni entri di same_uri_dict) crea le stesse triple
#         e le aggiunge al linkset


# def query_same_as():
# qui scrivo la query per estrarre owl:sameAs|skos:exactMatch con oggetto l'URI .

# def find_matches():
# in questa funzione, per ogni dataset lancio query_same_as() alla ricerca dei valori corrispondenti,
# e li infilo in un dizionario ()

# def linkset_update():
#     scrivo triple necessarie
#     invio con sparql.setMethod(POST) un query con INSERT DATA
#     INSERT DATA {
#         <uri1> schema:location <dataset_uri1> ;
#             owl:sameAs <uri2> .
#         <dataset_uri1> rdfs:label <datset_name1> .
#         <uri2> schema:location <dataset_uri2> ;
#             owl:sameAs <uri1> .
#         <dataset_uri2> rdfs:label <datset_name2> .
#     }
