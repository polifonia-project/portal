# external libraries
from flask import Flask, request, jsonify

# builtin libraries
import timeit

# internal libraries
import methods
import indexing as i
import linkset_endpoint as endpoint
import reconciliation as rec
import conf

app = Flask(__name__)

# access all conf files: datasets (d), categories (cat), feed info (f) and carouse (car)
d, cat, f, car, cards = methods.access_conf_info('conf_general.json')


@app.route('/portal/conf_info', methods=['GET'])
def feed():
    f_list = []
    for clip in f.values():
        f_list.append(clip)
    return jsonify({'datasets': d, 'categories': cat, 'carousel': car, 'cards': cards, 'clips': f_list})


@app.route('/portal/sonic_index', methods=['GET'])
def index():
    cat_id = request.args.get('cat_id')
    word = request.args.get('data')
    if len(word) > 0:
        suggestions = i.suggested_results(d, cat, cat_id, word.lower(), conf.reconciled_index)
        print(suggestions)
        return jsonify(suggestions)


@app.route('/portal/reconciliation', methods=['GET'])
def reconciliation(active=None):
    """ SPARQL endpoint GUI and request handler
    Parameters
    ----------
    active: str
            Query string or None
            If None, renders the GUI, else parse the query (__run_query_string)
            If the query string includes an update, return error, else sends
            the query to the endpoint (__contact_tp)
    """
    if request.method == 'GET':
        content_type = request.content_type
        uri = str(request.args.get("uri"))
        q = ''
        if conf.reconciled_index == True:
            q = 'SELECT DISTINCT ?same_uri WHERE {VALUES ?g {<'+uri+'>} GRAPH ?g {?same_uri <https://schema.org/location> ?location .}}'
        else:
            q = 'SELECT DISTINCT ?same_uri WHERE {VALUES ?s {<'+uri+'>} GRAPH ?g {?s owl:sameAs|^owl:sameAs ?same_uri .}}'
        return endpoint.__run_query_string(active, q, content_type)
    else:

        content_type = request.content_type
        cur_data = request.get_data()
        if "application/x-www-form-urlencoded" in content_type:
            return endpoint.__run_query_string(active, cur_data, True, content_type)
        elif "application/sparql-query" in content_type:
            return endpoint.__contact_tp(cur_data, True, content_type)


clear_linkset_result = timeit.timeit(
    stmt='endpoint.clear_linkset(False, endpoint.LINKSET_DIRECTORY, endpoint.ENTITIES_DIRECTORY, endpoint.LABELS_DIRECTORY)', globals=globals(), number=1)
print(f"Execution time for clear_linkset is {clear_linkset_result} seconds")

fill_entities_files_result = timeit.timeit(
    stmt='methods.fill_entities_files("OFF", cat, d, endpoint.ENTITIES_DIRECTORY)', globals=globals(), number=1)
print(
    f"Execution time for fill_entities_files is {fill_entities_files_result} seconds")

ingest_index_result = timeit.timeit(
    stmt='i.ingest_index(cat, endpoint.ENTITIES_DIRECTORY, conf.reconciled_index)', globals=globals(), number=1)
print(f"Execution time for ingest_chosen_index is {ingest_index_result} seconds")

# linkset_endpoint_update_result = timeit.timeit(
#     stmt='endpoint.linkset_endpoint_update(endpoint.ENTITIES_DIRECTORY, d, endpoint.LINKSET_DIRECTORY)', globals=globals(), number=1)
# print(
#     f"Execution time for linkset_endpoint_update is {linkset_endpoint_update_result} seconds")

# graphs_reconciliation_result = timeit.timeit(
#     stmt='rec.graphs_reconciliation(endpoint.ENTITIES_DIRECTORY, endpoint.UPDATEMYLINKSET)', globals=globals(), number=1)
# print(
#     f"Execution time for graphs_reconciliation is {graphs_reconciliation_result} seconds")

if __name__ == '__main__':
    app.run(debug=True)
