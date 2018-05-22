import json
from random import randint

import redis
from flask import jsonify

with open("config.json", "r", encoding="utf-8") as fo:
    config = json.load(fo)

r = redis.StrictRedis(**config["redis"])

SIZE_VOCABULARY = 5000
NUM_WORD = 20

def parse_str2arr(str_raw):
    return [float(x) for x in str_raw.split(" ")]

class EmbeddingFeeder():
    def __init__(self, initial_seed=10):
        self.seed = initial_seed
        self.arr_point = []
        # self.some_store for used keys

        # Initialisation actions
        for i in range(NUM_WORD):
            word = self._get_random_word()
            embedding = self._get_embedding(word)
            self.arr_point.append({"word": word, "embedding": embedding, "status": 1})

    def _update_seed(self):
        self.seed += 1

    def _get_random_word(self):
        # Some mechanism to control random seed including
        #   - check repeated inputs
        #   - update level
        seed = randint(0, SIZE_VOCABULARY)
        word = r.get(seed).decode("utf-8")
        print(word)
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
        
        self.arr_point.append({"word": cmd, "embedding": embedding, "status": 1})
        self._update_seed()

    def get_json_arr_point(self):
        print(self.arr_point)
        return jsonify({"arrBrick": self.arr_point})