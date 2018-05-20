from flask import Flask, render_template, request

from embeddingFeeder import EmbeddingFeeder

app = Flask(__name__, template_folder="dist", static_folder="dist/static")
embedding_feeder = EmbeddingFeeder()

@app.route("/")
def render_static():
    return render_template("index.html")

@app.route("/api/initialize", methods=["POST"])
def api_initialize():
    print(request.get_json())
    return embedding_feeder.get_json_arr_point()

@app.route("/api/hit_enter", methods=["POST"])
def hit_enter():
    print(request.get_json())
    cmd = request.get_json()["cmd"]
    try:
        embedding_feeder.feed(cmd)
        return embedding_feeder.get_json_arr_point()
    except:
        return embedding_feeder.get_json_arr_point()
 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)