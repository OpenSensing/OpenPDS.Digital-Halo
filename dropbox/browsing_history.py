import json
from file_io import getAppPath

browsing_history = {}
with open (getAppPath() + 'history.json') as his:
	browsing_history = json.loads(his.read())

