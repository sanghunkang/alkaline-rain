import json
from random import randint

import redis

with open("config.json", "r", encoding="utf-8") as fo:
    config = json.load(fo)

r = redis.StrictRedis(**config["redis"])

SIZE_VOCABULARY = 1000


class EmbeddingFeeder():
    def __init__(self):
        self.seed = randint(0, SIZE_VOCABULARY)
        self.arr_seed_used = []

        # Initialisation actions

    def _set_seed(self):
        seed = randint(0, SIZE_VOCABULARY)
        # Some mechanism to control random seed including
        #   - check repeated inputs
        #   - update level
        if True: # When the seed is good
            self.seed = seed
            self.arr_seed_used.append(seed)

    def _fetch_word(self):
        seed_key = "#" + str(self.seed)
        word = r.get(seed_key).decode("utf-8")
        return word

    def get_embedding(self, word):
        str_raw = r.get(word)
        if str_raw == None:
            # See ISSUE 8
            raise InvalidCommandError("An invalid command", "Thus printing error")
        else:
            str_raw = str_raw.decode("utf-8")
            embedding = [float(x) for x in str_raw.split(" ")]
            return embedding

    def get_point(self):
        word = self._fetch_word()
        print(word)
        point = {   "word": word,
                    "embedding": self.get_embedding(word),
                    "status": 1}
        self._set_seed()
        # The point of not directly returning a dictionary is to ensure seed update
        # is done on successful fetches
        return point