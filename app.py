from flask import Flask, jsonify, render_template, request
 
app = Flask(__name__, 
    template_folder="dist",
    static_folder="dist/static")

@app.route("/")
def render_static():
    return render_template("index.html")

@app.route("/api/hit_enter", methods=["POST"])
def hit_enter():
    print(request.get_json())
    print(request.get_data())
    print(request.form)
    return jsonify({"tasks": "Hello"})
 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)