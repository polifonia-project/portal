# external libraries
from flask import Flask, request, jsonify

# internal libraries
import methods
import indexing as i

app = Flask(__name__)

# access all conf files: datasets (d), categories (cat), feed info (f) and carouse (car)
d, cat, f, car, cards = methods.access_conf_info('conf_general.json')
i.ingest_data(d, cat)


@app.route('/conf_info', methods=['GET'])
def feed():
    f_list = []
    for clip in f.values():
        f_list.append(clip)
    return jsonify({'datasets': d, 'categories': cat, 'carousel': car, 'cards': cards,'clips': f_list})


@app.route('/index', methods=['GET'])
def index():
    cat_id = request.args.get('cat_id')
    word = request.args.get('data')
    if len(word) > 0:
        suggestions = i.suggested_results(d, cat, cat_id, word.lower())
        return jsonify(suggestions)


if __name__ == '__main__':
    app.run(debug=True)
