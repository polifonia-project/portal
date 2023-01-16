# external libraries
from flask import Flask, request, jsonify
from sonicclient import SearchClient, IngestClient, ControlClient

# internal libraries
import methods
import indexing as i

app = Flask(__name__)

# access all conf files: datasets (d), categories (c) and feed info (f)
d, c, f = methods.access_conf_info('conf_general.json')
i.index_per_category(d, c)


@app.route('/feed', methods=['GET'])
def feed():
    c_list = []
    f_list = []
    for cat in c.values():
        c_list.append(cat)
    for clip in f.values():
        f_list.append(clip)
    return jsonify({'categories': c_list, 'clips': f_list})

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
