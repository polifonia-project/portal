from flask import Flask, request, jsonify
import methods
from SPARQLWrapper import SPARQLWrapper, JSON
from sonicclient import SearchClient, IngestClient, ControlClient

app = Flask(__name__)

def query_sparql(endpoint, subject):
    """
    Parameters
    ----------
    Returns
    -------
    """

    value = '<'+subject+'>'
    # print('IRI BASE', value)
    QUERY = """SELECT DISTINCT ?s (SAMPLE(?label) AS ?l)
    WHERE { 
        """+value+""" a ?type . 
        ?s a ?type . 
        ?s rdfs:label ?label .
        } GROUP BY ?s"""

    data = get_sparql_results(QUERY, endpoint)
    # print("[SUCCESS] query endpoint:", endpoint)
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

data = query_sparql('https://projects.dharc.unibo.it/musow/sparql', 'https://w3id.org/musow/1635268063-587743')


@app.route('/feed', methods=['GET'])
def feed():
    clips = []
    # d = methods.read_json('conf_datasets.json')
    f = methods.read_json('conf_feed.json')
    with IngestClient("127.0.0.1", 1491, "SecretPassword") as ingestcl:
        print(ingestcl.ping())
        print(ingestcl.protocol)
        print(ingestcl.bufsize)
        for uri, label in data.items():
            ingestcl.push("polifonia", "entities", uri, label)
    for clip in f:
        clip_info = {}
        print(clip)
        clip_info['name'] = f[clip]['name']
        clip_info['iri'] = f[clip]['iri']
        clips.append(clip_info)
    # print(clips)
    return clips

@app.route('/index', methods=['GET'])
def test():
    word = request.args.get('data')
    if len(word) == 0:
        result = []
        for label in data.values():
            result.append(label)
        return jsonify({'result': result})
    else:
        with SearchClient("127.0.0.1", 1491, "SecretPassword") as querycl:
            print(querycl.ping())
            # return(querycl.suggest("polifonia", "entities", word))
            return jsonify({'result': querycl.suggest("polifonia", "entities", word)})




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
# print(data)
# sonic_ingest(data)

# with IngestClient("127.0.0.1", 1491, "SecretPassword") as ingestcl:
#     print(ingestcl.ping())
#     print(ingestcl.protocol)
#     print(ingestcl.bufsize)
#     for uri, label in data.items():
#         ingestcl.push("polifonia", "entities", uri, label)

# with SearchClient("127.0.0.1", 1491, "SecretPassword") as querycl:
#     print(querycl.ping())
#     print('query', querycl.query("polifonia", "entities", "chopin"))
#     print('suggest', querycl.suggest("polifonia", "entities", "chop"))

# with IngestClient("127.0.0.1", 1491, "SecretPassword") as ingestcl:
#     print(ingestcl.ping())
#     print(ingestcl.protocol)
#     print(ingestcl.bufsize)
#     ingestcl.push("wiki", "articles", "article-1", "for the love of god hell")
#     ingestcl.push("wiki", "articles", "article-2", "for the love of satan heaven")
#     ingestcl.push("wiki", "articles", "article-3", "for the love of lorde hello")
#     ingestcl.push("wiki", "articles", "article-4", "for the god of loaf helmet")

# with SearchClient("127.0.0.1", 1491, "SecretPassword") as querycl:
#     print(querycl.ping())
#     print(querycl.query("wiki", "articles", "for"))
#     print(querycl.query("wiki", "articles", "love"))
#     print(querycl.suggest("wiki", "articles", "hell"))

if __name__ == '__main__':
    app.run(debug=True)
