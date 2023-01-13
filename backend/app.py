#external libraries
from flask import Flask, request, jsonify
from sonicclient import SearchClient, IngestClient, ControlClient

#internal libraries
import methods
import indexing as i

app = Flask(__name__)

# data = methods.query_sparql('https://projects.dharc.unibo.it/musow/sparql', 'https://w3id.org/musow/1635268063-587743')

# access all conf files: datasets (d), categories (c) and feed info (f)
d, c, f = methods.access_conf_info('conf_general.json')
print(type(c))

@app.route('/feed', methods=['GET'])
def feed():
    return jsonify({'categories': c, 'clips': f})

# @app.route('/index', methods=['GET'])
# def test():
#     word = request.args.get('data')
#     if len(word) == 0:
#         result = []
#         for label in data.values():
#             result.append(label)
#         return jsonify({'result': result})
#     else:
#         with SearchClient("127.0.0.1", 1491, "SecretPassword") as querycl:
#             print(querycl.ping())
#             return jsonify({'result': querycl.suggest("polifonia", "entities", word)})



if __name__ == '__main__':
    app.run(debug=True)
