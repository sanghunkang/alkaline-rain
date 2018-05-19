import math
from random import randint

from flask import jsonify
import redis

HOST = "localhost"
PORT = 6379
DB = 0
r = redis.StrictRedis(host='localhost', port=6379, db=0)


arr_word = [
    "collect", "molality", "colour", "reservation", "semiconductor",
    "laptop", "Italia", "beer", "brewary", "bible",
    "comet", "daughter", "young", "apple", "orange"]

NUM_WORD = 10
def attach_geometry(word, anchor, r_start=300, r_target=400):
    return {
        "id": word,
        "x": 400/2 + math.cos(2*math.pi*anchor/NUM_WORD)*(r_start/2) + 100,
        "y": 400/2 + math.sin(2*math.pi*anchor/NUM_WORD)*(r_start/2),
        "tx": 400/2 + math.cos(2*math.pi*anchor/NUM_WORD)*(r_target/2) + 100,
        "ty": 400/2 + math.sin(2*math.pi*anchor/NUM_WORD)*(r_target/2),
        "status": 1}

class EntryFeeder():
    def __init__(self, initial_seed):
        self.seed = initial_seed
        self.arr_point = [attach_geometry(w, i) for i, w in enumerate(arr_word[:NUM_WORD])]

    def _update_seed(self):
        self.seed += 1

    def feed(self):
        # r.set("a", "bar")
        # r.set("b", "bar")
        # r.set("c", "bar")
        print(r.get("a"))
        print(r.get("b"))
        print(r.get("d"))


        self.arr_point.pop(randint(0, NUM_WORD - 1))
        i = self.seed
        
        self.arr_point.append(attach_geometry(arr_word[i], i, 100, 300))
        self._update_seed()

    def get_json_arr_point(self):
        return jsonify({"arrBrick": self.arr_point})