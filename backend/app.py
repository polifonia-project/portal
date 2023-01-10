from flask import Flask
import methods
from SPARQLWrapper import SPARQLWrapper, JSON
from sonicclient import SearchClient, IngestClient

app = Flask(__name__)


@app.route('/feed', methods=['GET'])
def feed():
    clips = []
    # d = methods.read_json('conf_datasets.json')
    f = methods.read_json('conf_feed.json')
    for clip in f:
        clip_info = {}
        print(clip)
        clip_info['name'] = f[clip]['name']
        clip_info['iri'] = f[clip]['iri']
        clips.append(clip_info)
    print(clips)
    return clips


def query_sparql(endpoint, subject):
    """
    Parameters
    ----------
    Returns
    -------
    """

    value = '<'+subject+'>'
    print('IRI BASE', value)
    QUERY = """SELECT DISTINCT ?s (SAMPLE(?label) AS ?l)
    WHERE { 
        """+value+""" a ?type . 
        ?s a ?type . 
        ?s rdfs:label ?label .
        } GROUP BY ?s"""

    data = get_sparql_results(QUERY, endpoint)
    print("[SUCCESS] query endpoint:", endpoint)
    data = {result["s"]["value"]: result["l"]["value"]
            for result in data["results"]["bindings"] if len(result["l"]["value"]) > 0}
    return data


def get_sparql_results(query, endpoint):
    """
    Parameters
    ----------
    Returns
    -------
    """
    sparql = SPARQLWrapper(endpoint)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    return results


# def sonic_ingest(data, collection="polifonia", bucket="entities"):
#     """
#     Parameters
#     ----------
#     Returns
#     -------
#     """
#     with IngestClient('localhost', 5000, 'SecretPassword') as ingestcl:
#         for iri, label in data.items():
#             print(iri, label)
#             ingestcl.ping()
#             ingestcl.push(collection, bucket, iri, label)
#         print(ingestcl)


data = query_sparql(
    'https://projects.dharc.unibo.it/musow/sparql', 'https://w3id.org/musow/1635268063-587743')
print(data)
# sonic_ingest(data)

if __name__ == '__main__':
    app.run(debug=True)
