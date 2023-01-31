# external libraries
from flask import Flask, request, jsonify

# internal libraries
import methods
import indexing as i

app = Flask(__name__)

# access all conf files: datasets (d), categories (cat), feed info (f) and carouse (car)
d, cat, f, car = methods.access_conf_info('conf_general.json')
i.ingest_data(d, cat)


@app.route('/feed', methods=['GET'])
def feed():
    f_list = []
    for clip in f.values():
        f_list.append(clip)
    return jsonify({'categories': cat, 'carousel': car, 'clips': f_list})


@app.route('/index', methods=['GET'])
def index():
    cat_id = request.args.get('cat_id')
    word = request.args.get('data')
    if len(word) > 0:
        suggestions = i.suggested_results(d, cat, cat_id, word.lower())
        return jsonify(suggestions)


# print(i.suggested_results(d, c, 'cat_01', 'p'))

if __name__ == '__main__':
    app.run(debug=True)
