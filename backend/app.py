# external libraries
from flask import Flask, request, jsonify

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


@app.route('/index', methods=['GET'])
def index():
    cat = request.args.get('cat')
    # alternativa con cat_id
    # cat = c[request.args.get('cat')]['name']
    word = request.args.get('data')
    if len(word) > 0:
        suggestions = i.sonic_suggest(cat, word)
        return jsonify(suggestions)


if __name__ == '__main__':
    app.run(debug=True)
