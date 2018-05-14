import math
from flask import Flask, jsonify, render_template, request
 
app = Flask(__name__, 
    template_folder="dist",
    static_folder="dist/static")

@app.route("/")
def render_static():
    return render_template("index.html")

paddleHeight = 10
paddleWidth = 75

brickRowCount = 3
brickColumnCount = 5

brickWidth = 75
brickHeight = 20
brickPadding = 10
brickOffsetTop = 30
brickOffsetLeft = 30

NUM_WORD = 10
arr_word = [
    "콜렉션",
    "뮤룩",
    "콜롬비아",
    "방문예약",
    "하이닉스",
    
    "노트북",
    "학습",
    "이탈리아",
    "맥주",
    "성경"]

arr_point = []
for i in range(NUM_WORD):
    arr_point.append({
        "id": arr_word[i],
        "x": 400/2 + math.cos(2*math.pi*i/NUM_WORD)*(300/2) + 100,
        "y": 400/2 + math.sin(2*math.pi*i/NUM_WORD)*(300/2),
        "tx": 400/2 + math.cos(2*math.pi*i/NUM_WORD)*(400/2) + 100,
        "ty": 400/2 + math.sin(2*math.pi*i/NUM_WORD)*(400/2),
        "status": 1})

@app.route("/api/initialize", methods=["POST"])
def api_initialize():
    print(request.get_json())
    return jsonify({"arrBrick": arr_point})

@app.route("/api/hit_enter", methods=["POST"])
def hit_enter():
    # print(request.get_json())
    cmd = request.get_json()["cmd"]
    # x = [point for point in arr_point if point["id"] != cmd]
    arr_point.pop()
    print(arr_point)
    return jsonify({"tasks": arr_point})
 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)