import sys
import json
import email_fetch
global config
config = json.load(open('config.json', 'r'))

email_fetch.start()