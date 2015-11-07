import json

config = json.load(open('config.json', 'r'))
print(config['smtp']['login'])
