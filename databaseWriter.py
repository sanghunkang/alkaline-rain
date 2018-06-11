import json
import redis

with open("config.json", "r", encoding="utf-8") as fo:
    config = json.load(fo)

r = redis.StrictRedis(**config["redis"])

with open(config["fpath_glove_50d"], "r", encoding="utf-8") as fo:
    for i in range(50000): # Later change here by while loop
        row_raw = fo.readline()
        key, value = row_raw.split(" ", 1)
        # print(i, key)
        # print(key, value)
        r.set(key, value)
        r.set("#" + str(i), key)
