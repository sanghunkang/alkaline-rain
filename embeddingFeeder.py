import json,math
from random import randint

from flask import jsonify
import redis

with open("config.json", "r", encoding="utf-8") as fo:
    config = json.load(fo)

r = redis.StrictRedis(**config["redis"])

SIZE_VOCABULARY = 1000
NUM_WORD = 10

arr_word = [
    "collect", "molality", "colour", "reservation", "semiconductor",
    "laptop", "Italia", "beer", "brewary", "bible",
    "comet", "daughter", "young", "apple", "orange"]

def attach_geometry(word, anchor, r_start=300, r_target=400):
    return {
        "id": word,
        "x": 400/2 + math.cos(2*math.pi*anchor/NUM_WORD)*(r_start/2) + 100,
        "y": 400/2 + math.sin(2*math.pi*anchor/NUM_WORD)*(r_start/2),
        "tx": 400/2 + math.cos(2*math.pi*anchor/NUM_WORD)*(r_target/2) + 100,
        "ty": 400/2 + math.sin(2*math.pi*anchor/NUM_WORD)*(r_target/2),
        "status": 1}

def parse_str2arr(str_raw):
    return [float(x) for x in str_raw.split(" ")]

class EmbeddingFeeder():
    def __init__(self, initial_seed=10):
        self.seed = initial_seed
        self.arr_point = [attach_geometry(w, i) for i, w in enumerate(arr_word[:NUM_WORD])]
        # self.some_store for used keys

    def _update_seed(self):
        self.seed += 1

    def _get_random_word(self):
        # Some mechanism to control random seed including
        #   - check repeated inputs
        #   - update level
        seed = randint(0, SIZE_VOCABULARY)
        word = r.get(seed).decode("utf-8")
        return word

    def _get_embedding(self, word):
        str_raw = r.get(word)
        if str_raw == None:
            # See ISSUE 8
            print(word, str_raw)
            raise Exception("A better definition will be implemented")
        else:
            str_raw = str_raw.decode("utf-8")
            embedding = parse_str2arr(str_raw)
            return embedding

    def feed(self, cmd):

        embedding = self._get_embedding(cmd)
        
        self.arr_point.pop(randint(0, NUM_WORD - 1))
        i = self.seed
        
        self.arr_point.append(attach_geometry(cmd, i, 100, 300))
        self._update_seed()

    def get_json_arr_point(self):
        return jsonify({"arrBrick": self.arr_point})