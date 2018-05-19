from flask import Flask, render_template, request

from entryFeeder import EntryFeeder
NUM_WORD = 10

app = Flask(__name__, template_folder="dist", static_folder="dist/static")
entry_feeder = EntryFeeder(NUM_WORD)

@app.route("/")
def render_static():
    return render_template("index.html")

@app.route("/api/initialize", methods=["POST"])
def api_initialize():
    print(request.get_json())
    return entry_feeder.get_json_arr_point()

@app.route("/api/hit_enter", methods=["POST"])
def hit_enter():
    print(request.get_json())
    cmd = request.get_json()["cmd"]
    entry_feeder.feed()
    return entry_feeder.get_json_arr_point()
 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)