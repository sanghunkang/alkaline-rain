from flask import Flask, jsonify, render_template, request
from embeddingFeeder import EmbeddingFeeder

NUM_WORD = 40

app = Flask(__name__, template_folder="dist", static_folder="dist/static")
embedding_feeder = EmbeddingFeeder()

@app.route("/")
def render_static():
    return render_template("index.html")

@app.route("/api/initialize", methods=["POST"])
def api_initialize():
    print(request.get_json())
    # Here, only protocol related exception will be handled    
    arr_point = [embedding_feeder.get_point() for i in range(NUM_WORD)]
    return jsonify({"arrBrick": arr_point})

@app.route("/api/feed_object", methods=["POST"])
def api_feed_object():
    print(request.get_json())
    # Here, only protocol related exception will be handled
    point = embedding_feeder.get_point()
    return jsonify({"point": point})

@app.route("/api/enter_cmd", methods=["POST"])
def api_enter_cmd():
    print(request.get_json())
    cmd = request.get_json()["cmd"]
    # Here, only protocol related exception will be handled
    embedding = embedding_feeder.get_embedding(cmd)
    return jsonify({"embedding": embedding})

 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)